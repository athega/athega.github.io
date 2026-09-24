// Checks the generated site in _site/: internal links and images that lead nowhere,
// images without alt text, and pages without exactly one <h1>.
// Run with `npm run check` after `npm run build`. Exits with 1 if anything is found.
import fs from "node:fs";
import path from "node:path";

const root = "_site";

// Old blog posts link to pages from earlier versions of the site that no longer exist.
// Only add an entry here when the link is part of historic content that can't be fixed.
const knownLegacy = [
  /^\/phaser-games\//, // demo games from the 2020 Phaser post, hosted outside this repo
  /^\/comments\/1$/, // Rails example code in the 2009 RailsConf post
];

// Demos and legacy uploads are published as they are; only real pages are checked.
const skipDirs = ["assets/blog", "assets/legacy"];

const pages = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (skipDirs.some((skip) => file.startsWith(path.join(root, skip)))) continue;
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith(".html")) pages.push(file);
  }
})(root);

const exists = (url) => {
  const target = path.join(root, decodeURI(url.split(/[?#]/)[0]));
  if (!fs.existsSync(target)) return false;
  return fs.statSync(target).isFile() || fs.existsSync(path.join(target, "index.html"));
};

const problems = [];
for (const file of pages) {
  const html = fs.readFileSync(file, "utf8");
  if (/http-equiv="refresh"/i.test(html)) continue;
  const page = "/" + path.relative(root, file).replace(/index\.html$/, "");
  const body = html.split("<body")[1] ?? "";

  for (const [, url] of body.matchAll(/(?:href|src)="(\/[^"/][^"]*)"/g)) {
    if (!knownLegacy.some((pattern) => pattern.test(url)) && !exists(url)) {
      problems.push(`${page}: länken ${url} leder ingenstans`);
    }
  }
  for (const [tag] of body.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt\s*=/.test(tag)) problems.push(`${page}: bild utan alt-text: ${tag.slice(0, 90)}`);
  }
  const h1 = (body.match(/<h1\b/g) ?? []).length;
  if (h1 !== 1) problems.push(`${page}: ${h1} <h1> (ska vara 1)`);
}

if (problems.length) {
  console.error(problems.join("\n") + `\n\n${problems.length} problem hittades.`);
  process.exit(1);
}
console.log(`${pages.length} sidor kontrollerade, inga problem.`);
