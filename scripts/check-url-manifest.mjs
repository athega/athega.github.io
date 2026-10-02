// Guards against a branch silently dropping a URL that main already published:
// builds the site as it looked at the point this branch diverged from main (the
// merge base, not main's current tip, so a branch isn't blamed for pages main
// added later) and fails if any of those pages are missing from _site/ now.
//
// Run with `npm run check:urls` after `npm run build`. On main itself, or when
// origin/main can't be resolved (no network, shallow clone), it prints a notice
// and exits 0 rather than failing the build for an unrelated reason.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const root = "_site";
const skipDirs = ["assets/blog", "assets/legacy"];

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

function pageUrls(siteRoot) {
  const urls = [];
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (skipDirs.some((skip) => file.startsWith(path.join(siteRoot, skip)))) continue;
      if (entry.isDirectory()) walk(file);
      else if (entry.name.endsWith(".html")) {
        urls.push("/" + path.relative(siteRoot, file).replace(/index\.html$/, ""));
      }
    }
  })(siteRoot);
  return urls;
}

let mergeBase;
try {
  try {
    git(["fetch", "--quiet", "origin", "main"]);
  } catch {
    // No network or no "origin" remote (e.g. a local clone): fall back to
    // whatever local ref is available below.
  }
  const baseRef = (() => {
    try {
      return git(["rev-parse", "--verify", "origin/main"]);
    } catch {
      return git(["rev-parse", "--verify", "main"]);
    }
  })();
  mergeBase = git(["merge-base", "HEAD", baseRef]);
} catch (error) {
  console.log(`Kan inte hitta main för jämförelse (${error.message.split("\n")[0]}); hoppar över.`);
  process.exit(0);
}

if (mergeBase === git(["rev-parse", "HEAD"])) {
  console.log("Den här commiten är själv på main (eller är dess bas); inget att jämföra mot.");
  process.exit(0);
}

// process.exit() skips any pending `finally`, so the exit code is collected
// here and the process only exits after the worktree below is cleaned up.
let exitCode = 0;
const worktree = fs.mkdtempSync(path.join(os.tmpdir(), "url-manifest-"));
try {
  git(["worktree", "add", "--quiet", "--detach", worktree, mergeBase]);
  fs.symlinkSync(path.resolve("node_modules"), path.join(worktree, "node_modules"));
  execFileSync("npm", ["run", "build"], { cwd: worktree, stdio: "pipe" });

  const baseline = pageUrls(path.join(worktree, root));
  const current = new Set(pageUrls(root));
  const missing = baseline.filter((url) => !current.has(url));

  if (missing.length) {
    console.error(
      `${missing.length} sida(or) som finns på main saknas i det här bygget:\n` +
        missing.map((url) => `  ${url}`).join("\n") +
        "\n\nOm sidan medvetet är borttagen, lägg en omdirigering eller ta bort den från kontrollen med en kommentar om varför."
    );
    exitCode = 1;
  } else {
    console.log(`${baseline.length} sidor från main (vid ${mergeBase.slice(0, 8)}) finns kvar i det här bygget.`);
  }
} finally {
  try {
    git(["worktree", "remove", "--force", worktree]);
  } catch {
    fs.rmSync(worktree, { recursive: true, force: true });
    git(["worktree", "prune"]);
  }
}
process.exit(exitCode);
