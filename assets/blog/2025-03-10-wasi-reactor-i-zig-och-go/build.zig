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
