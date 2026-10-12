// Check generated pages, local links, images, fragments and static redirects.
// Run with `npm run check` after `npm run build`.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const knownLegacy = [
  /^\/phaser-games\//, // Hosted outside this repository.
  /^\/comments\/1$/, // Rails example code in the 2009 RailsConf post.
];
const skipDirs = ["assets/blog", "assets/legacy"];

// Attribute values in our generated HTML can contain escaped query strings.
function decodeHtml(value) {
  const named = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">" };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (entity, code) => {
    if (!code.startsWith("#")) return named[code.toLowerCase()];
    const point = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : Number(code.slice(1));
    return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : entity;
  });
}

function attributes(tag) {
  const values = {};
  for (const [, name, double, single, bare] of tag.matchAll(/([^\s=<>/]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    values[name.toLowerCase()] = decodeHtml(double ?? single ?? bare);
  }
  return values;
}

export function checkSite(root, siteUrl) {
  const origin = new URL(siteUrl).origin;
  const pages = [];
  const problems = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (skipDirs.some((skip) => file === path.join(root, skip))) continue;
      if (entry.isDirectory()) walk(file);
      else if (entry.name.endsWith(".html")) pages.push(file);
    }
  }
  walk(root);

  const cache = new Map();
  function read(file) {
    if (!cache.has(file)) cache.set(file, fs.readFileSync(file, "utf8"));
    return cache.get(file);
  }
  function pageUrl(file) {
    return new URL("/" + path.relative(root, file).replace(/index\.html$/, ""), origin);
  }
  function parseUrl(raw, base) {
    try {
      return new URL(raw, base);
    } catch {
      problems.push(`${base.pathname}: ogiltig URL ${raw}`);
      return null;
    }
  }
  function resolve(url) {
    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      return null;
    }
    const target = path.resolve(root, "." + pathname);
    if (!target.startsWith(path.resolve(root) + path.sep) && target !== path.resolve(root)) return null;
    if (fs.existsSync(target) && fs.statSync(target).isFile()) return target;
    const index = path.join(target, "index.html");
    return fs.existsSync(index) && fs.statSync(index).isFile() ? index : null;
  }
  function checkFragment(url, file) {
    if (!url.hash || !file.endsWith(".html")) return;
    let id;
    try { id = decodeURIComponent(url.hash.slice(1)); } catch { id = url.hash.slice(1); }
    const found = [...read(file).matchAll(/<[a-z][^>]*>/gi)].some(([tag]) => {
      const attrs = attributes(tag);
      return attrs.id === id || (/^<a\b/i.test(tag) && attrs.name === id);
    });
    if (!found) problems.push(`${url.pathname}: fragmentet ${url.hash} finns inte`);
  }

  // Keep even malformed redirects in the map: they must not bypass validation.
  const redirects = new Map();
  for (const file of pages) {
    const html = read(file);
    const refresh = [...html.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => attributes(tag))
      .find((attrs) => attrs["http-equiv"]?.toLowerCase() === "refresh");
    if (!refresh) continue;
    const base = pageUrl(file);
    const match = refresh.content?.match(/^\s*0\s*;\s*url\s*=\s*(.+?)\s*$/i);
    const target = match ? parseUrl(match[1].replace(/^(['"])(.*)\1$/, "$2"), base) : null;
    redirects.set(path.resolve(file), target);
    if (!target || target.origin !== origin) {
      problems.push(`${base.pathname}: omdirigeringen ska ha ett lokalt mål och 0 sekunders fördröjning`);
      continue;
    }
    const canonical = [...html.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => attributes(tag))
      .find((attrs) => attrs.rel?.toLowerCase().split(/\s+/).includes("canonical"));
    const canonicalUrl = canonical?.href ? parseUrl(canonical.href, base) : null;
    if (canonicalUrl?.href !== target.href) {
      problems.push(`${base.pathname}: canonical stämmer inte med omdirigeringens mål ${target.href}`);
    }
  }

  function followRedirect(file, source) {
    const visited = new Set();
    let url;
    while (redirects.has(file)) {
      if (visited.has(file)) {
        problems.push(`${source}: omdirigeringsloop`);
        return;
      }
      visited.add(file);
      url = redirects.get(file);
      if (!url || url.origin !== origin) return;
      file = resolve(url);
      if (!file) {
        problems.push(`${source}: omdirigeringen leder ingenstans (${url.pathname})`);
        return;
      }
    }
    if (visited.size > 1) problems.push(`${source}: omdirigeringskedja; länka direkt till ${url.pathname}`);
    if (url) checkFragment(url, file);
  }

  for (const file of pages) {
    const base = pageUrl(file);
    const html = read(file);
    const isRedirect = redirects.has(path.resolve(file));
    if (isRedirect) followRedirect(path.resolve(file), base.pathname);
    // The typefaces are hosted by us (assets/fonts/): a font link to Google would make every visitor's browser contact it.
    for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
      const href = attributes(tag).href;
      if (href && /^(?:https?:)?\/\/fonts\.(?:googleapis|gstatic)\.com(?:[/?#]|$)/i.test(href)) {
        problems.push(`${base.pathname}: typsnittet hämtas från Google (${href.slice(0, 60)}); hosta det själv i assets/fonts/`);
      }
    }
    const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "";
    for (const [tag] of body.matchAll(/<[a-z][^>]*>/gi)) {
      const attrs = attributes(tag);
      for (const raw of [attrs.href, attrs.src]) {
        if (!raw) continue;
        const url = parseUrl(raw, base);
        if (!url || url.origin !== origin) continue;
        if (knownLegacy.some((pattern) => pattern.test(url.pathname))) continue;
        const target = resolve(url);
        if (!target) problems.push(`${base.pathname}: länken ${raw} leder ingenstans`);
        else checkFragment(url, target);
      }
      if (/^<img\b/i.test(tag) && !/\salt(?:\s|=|\/?>)/i.test(tag)) {
        problems.push(`${base.pathname}: bild utan alt-text: ${tag.slice(0, 90)}`);
      }
    }
    const h1 = (body.match(/<h1\b/gi) ?? []).length;
    if (!isRedirect && h1 !== 1) problems.push(`${base.pathname}: ${h1} <h1> (ska vara 1)`);
  }
  return { pages: pages.length, problems };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const siteUrl = JSON.parse(fs.readFileSync("_data/site.json", "utf8")).url;
  const result = checkSite(path.resolve("_site"), siteUrl);
  if (result.problems.length) {
    console.error(result.problems.join("\n") + `\n\n${result.problems.length} problem hittades.`);
    process.exitCode = 1;
  } else {
    console.log(`${result.pages} sidor kontrollerade, inga problem.`);
  }
}
