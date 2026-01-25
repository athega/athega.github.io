import { spawn } from "node:child_process";

const useShell = process.platform === "win32";
const children = [];
let shuttingDown = false;

function run(command, args, label) {
  const child = spawn(command, args, { stdio: "inherit", shell: useShell });
  child.on("error", (error) => {
    console.error(`[dev] Failed to start ${label}: ${error.message}`);
  });
  child.on("exit", (code, signal) => {
    if (shuttingDown) {
      return;
    }
    const exitCode = code ?? (signal ? 1 : 0);
    shutdown(exitCode);
  });
  children.push(child);
  return child;
}

function shutdown(code = 0) {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGINT");
    }
  }
  process.exit(code);
}

run("npx", ["@11ty/eleventy", "--serve"], "eleventy");
run("npm", ["run", "sass:watch"], "sass");

process.on("SIGINT", () => shutdown(130));
process.on("SIGTERM", () => shutdown(143));
