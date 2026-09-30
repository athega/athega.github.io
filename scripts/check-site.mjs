// Checks the generated site in _site/: internal links and images that lead nowhere
// (including fragments and links written as full https://athega.se/... addresses),
// images without alt text, and pages without exactly one <h1>.
// Run with `npm run check` after `npm run build`. Exits with 1 if anything is found.
import fs from "node:fs";
import path from "node:path";

const root = "_site";
const siteUrl = JSON.parse(fs.readFileSync("_data/site.json", "utf8")).url; // e.g. https://athega.se

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

const resolve = (url) => {
  const target = path.join(root, decodeURI(url));
  if (fs.existsSync(target) && fs.statSync(target).isFile()) return target;
  const indexFile = path.join(target, "index.html");
  return fs.existsSync(indexFile) ? indexFile : null;
};

const htmlCache = new Map();
const readHtml = (file) => {
  if (!htmlCache.has(file)) htmlCache.set(file, fs.readFileSync(file, "utf8"));
  return htmlCache.get(file);
};
const hasId = (html, id) => new RegExp(`\\sid="${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`).test(html);

const problems = [];
for (const file of pages) {
  const html = readHtml(file);
  if (/http-equiv="refresh"/i.test(html)) continue;
  const page = "/" + path.relative(root, file).replace(/index\.html$/, "");
  const body = html.split("<body")[1] ?? "";

  for (const [, raw] of body.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!raw || /^(mailto:|tel:|data:|\/\/)/.test(raw)) continue;
    let url = raw;
    if (url.startsWith(siteUrl)) url = url.slice(siteUrl.length) || "/"; // written as a full address to our own site
    else if (/^https?:\/\//.test(url)) continue; // another site: not ours to check
    else if (!url.startsWith("/") && !url.startsWith("#")) continue; // relative path: not used in this codebase

    const [urlPath, hash] = url.split("#");
    let targetFile = file;
    if (urlPath) {
      if (knownLegacy.some((pattern) => pattern.test(urlPath))) continue;
      targetFile = resolve(urlPath);
      if (!targetFile) {
        problems.push(`${page}: länken ${raw} leder ingenstans`);
        continue;
      }
    }
    if (hash && !hasId(readHtml(targetFile), hash)) {
      problems.push(`${page}: länken ${raw} pekar på ett fragment som inte finns`);
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
