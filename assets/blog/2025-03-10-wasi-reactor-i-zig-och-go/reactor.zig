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
