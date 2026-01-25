---
title: "WASI Reactor i Zig och Go"
date: 2025-03-10
description: "Ett litet exempel på hur en WASI Reactor skriven i Zig kan integreras och exekveras i Go med hjälp av Wazero."
tags:
  - blogg
  - wasm
  - zig
  - go
last_updated_by: peter
image_url: /assets/blog/2025-03-10-wasi-reactor-i-zig-och-go/2025-wasi-reactor.png
---

![Abstrakt representation av en mekanisk dator med kugghjul i bakgrunden]({{image_url}})

> {{description}}

## Bakgrund

I början av februari släpptes [Go 1.24](https://go.dev/doc/go1.24).
Bland mycket annat fick vi flera förbättringar när det gäller stödet för [WebAssembly](https://webassembly.org/)
_(och [WASI](https://wasi.dev/))_.
Man publicerade även bloggposten [Extensible Wasm Applications with Go](https://go.dev/blog/wasmexport),
där en liten reaktorbinär kompileras via `GOOS=wasip1 GOARCH=wasm go build -buildmode=c-shared -o reactor.wasm`

Detta fick mig att fundera på hur smidigt det skulle vara att istället använda [Zig](https://ziglang.org/)
för en sådan binär och sedan använda den från Go (via [Wazero](https://wazero.io/)). _Väldigt smidigt visade det sig._

## Reaktor skriven i Zig ⚡

#### [reactor.zig](/assets/blog/2025-03-10-wasi-reactor-i-zig-och-go/reactor.zig)

Vi börjar med att implementera en minimal binär i Zig,
bestående av två exporterade funktioner.

```zig
const std = @import("std");

var s: i32 = undefined;

export fn _initialize() void {
    s = 20;

    std.debug.print("s = {d}\n", .{s});
}

export fn inc(n: i32) i32 {
    s += n;

    return s;
}
```

> **Notera**
>
> `std.debug.print` kräver att `.wasm`-binären får tillgång till [Stderr](https://en.wikipedia.org/wiki/Standard_streams#Standard_error_(stderr)) av sin WebAssembly-körmiljö.

#### [build.zig](/assets/blog/2025-03-10-wasi-reactor-i-zig-och-go/build.zig)

Vi använder oss sedan av det
[inbyggda byggsystemet](https://ziglang.org/documentation/master/#Zig-Build-System)
i Zig för att deklarera hur vi vill att vår binär ska byggas;

- **Mål** `.{ .cpu_arch = .wasm32, .os_tag = .wasi }`
- **Optimeringsnivå** `.ReleaseSmall`

```zig
const std = @import("std");

pub fn build(b: *std.Build) void {
    const exe = b.addExecutable(.{
        .name = "reactor",
        .root_source_file = b.path("reactor.zig"),
        .target = b.resolveTargetQuery(.{
            .cpu_arch = .wasm32,
            .os_tag = .wasi,
        }),
        .optimize = .ReleaseSmall,
    });

    exe.rdynamic = true;
    exe.wasi_exec_model = .reactor;

    b.installArtifact(exe);
}
```

> **Notera**
>
> `exe.wasi_exec_model = .reactor` används för att byta exekveringsmodell.

`zig build` bör resultera i en `.wasm`-binär (`zig-out/bin/reactor.wasm`), redo att laddas i en WebAssembly-körmiljö.


> **Tips**
>
> Om du har installerat [The WebAssembly Binary Toolkit](https://github.com/WebAssembly/wabt)
> så kan du inspektera binären som [text](https://webassembly.github.io/spec/core/text/)
> med hjälp av `wasm2wat -f zig-out/bin/reactor.wasm`

## Exekvering av `.wasm`-binären i Go (via [Wazero](https://wazero.io/))

Nu är det dags att skriva ett litet program i Go som agerar WebAssembly-körmiljö för den `.wasm`-binär vi skrev i Zig.

Praktiskt nog så kan vi importera modulen [Wazero](https://wazero.io/) för att göra precis detta.

Wazero hämtas enklast till din Go-modul genom:
```console
$ go get github.com/tetratelabs/wazero@latest
```

#### [main.go](/assets/blog/2025-03-10-wasi-reactor-i-zig-och-go/main.go)

```go
package main

import (
	"context"
	"fmt"
	"io"
	"os"
	"os/signal"
	"syscall"

	_ "embed"

	"github.com/tetratelabs/wazero"
	"github.com/tetratelabs/wazero/api"
	"github.com/tetratelabs/wazero/imports/wasi_snapshot_preview1"
)

//go:generate zig build

//go:embed zig-out/bin/reactor.wasm
var source []byte

func main() {
	ctx, stop := signal.NotifyContext(context.Background(),
		os.Interrupt,
		syscall.SIGTERM,
	)
	defer stop()

	if err := run(ctx, os.Stdout); err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
}

func run(ctx context.Context, w io.Writer) error {
	r := wazero.NewRuntime(ctx)
	defer r.Close(ctx)

	wasi_snapshot_preview1.MustInstantiate(ctx, r)

	// Calls _initialize, if exported
	mod, err := r.InstantiateWithConfig(ctx, source, wazero.
		NewModuleConfig().
		WithStartFunctions("_initialize").
		WithStderr(os.Stderr),
	)
	if err != nil {
		return err
	}

	inc := func(ctx context.Context) func(n int32) (int32, error) {
		// Handle to the exported function `inc`
		fn := mod.ExportedFunction("inc")

		return func(n int32) (int32, error) {
			res, err := fn.Call(ctx, api.EncodeI32(n))
			if err != nil {
				return -1, err
			}

			return api.DecodeI32(res[0]), nil
		}
	}(ctx)

	var a int32 = 1

	// Call the function.

	b, err := inc(a)
	if err != nil {
		return err
	}

	fmt.Fprintf(w, "inc(%d) = %d\n", a, b)

	// The instance is still alive.
	//
	// We can call the function again.

	c, err := inc(b)
	if err != nil {
		return err
	}

	fmt.Fprintf(w, "inc(%d) = %d\n", b, c)

	return nil
}
```

> **Notera**
>
> `//go:generate zig build` låter oss använda `go generate` för att bygga reaktorn med `zig build`
>
> `//go:embed zig-out/bin/reactor.wasm` bäddar in `.wasm`-filen i den binär som Go-kompilatorn producerar.

## Slutresultat

Vi bör nu få detta resultat när vi kör `go generate && go run .`

```sh
s = 20
inc(1) = 21
inc(21) = 42
```

/ [Peter](/peter)

_När denna artikel skrevs var de aktuella versionerna för Go `1.24.1` och Zig `0.14.0`_

