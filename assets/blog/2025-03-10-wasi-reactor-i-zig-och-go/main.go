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
