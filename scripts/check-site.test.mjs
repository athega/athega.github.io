import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { checkSite } from "./check-site.mjs";

function check(t, files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "site-check-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const [name, html] of Object.entries(files)) {
    const file = path.join(root, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
  }
  return checkSite(root, "https://athega.se").problems;
}
const page = (content = "") => `<html><body><h1>Page</h1>${content}</body></html>`;
const redirect = (to, canonical = to) => `<html><head><meta content='0; url=${to}' http-equiv='refresh'><link href='${canonical}' rel='canonical'></head><body><a href='${to}'>Continue</a></body></html>`;

test("query strings, relative links and encoded fragments resolve as browser URLs", (t) => {
  assert.deepEqual(check(t, {
    "index.html": page(`<a href='/blogg/?utm_source=review&amp;mode=all#r%C3%A4tt'>Blogg</a><a href='https://athega.se/blogg/?x=1'>Absolute</a><a href='//athega.se/blogg/'>Protocol relative</a><a href='https://athega.se.example/missing/'>External</a><a href='mailto:reception@athega.se'>Mail</a>`),
    "blogg/index.html": page(`<h2 id='rätt'>Anchor</h2><a href='../?x=1'>Home</a><img src='../image.png?size=2' alt=''>`),
    "image.png": "test-image",
  }), []);
});

test("missing files and fragments still fail when query strings are present", (t) => {
  const errors = check(t, { "index.html": page(`<a href='/missing/?x=1'>Missing</a><a href='/?x=1#missing'>Fragment</a>`) });
  assert.equal(errors.length, 2);
  assert.match(errors.join("\n"), /leder ingenstans/);
  assert.match(errors.join("\n"), /fragmentet/);
});

test("a valid immediate redirect needs no h1 and validates its destination", (t) => {
  assert.deepEqual(check(t, { "old/index.html": redirect("/new/", "https://athega.se/new/"), "new/index.html": page() }), []);
});

test("broken redirect targets fail even without a fallback link", (t) => {
  const html = redirect("/missing/").replace(/<a.*?<\/a>/, "");
  assert.match(check(t, { "old/index.html": html }).join("\n"), /omdirigeringen leder ingenstans/);
});

test("redirect canonical must match the refresh destination", (t) => {
  assert.match(check(t, { "old/index.html": redirect("/new/", "/wrong/"), "new/index.html": page() }).join("\n"), /canonical stämmer inte/);
});

test("redirect chains are reported even when the final destination exists", (t) => {
  assert.match(check(t, { "old/index.html": redirect("/middle/"), "middle/index.html": redirect("/new/"), "new/index.html": page() }).join("\n"), /omdirigeringskedja/);
});

test("redirect loops terminate with an error", (t) => {
  assert.match(check(t, { "a/index.html": redirect("/b/"), "b/index.html": redirect("/a/") }).join("\n"), /omdirigeringsloop/);
});

test("malformed refresh and missing canonical cannot bypass checks", (t) => {
  const errors = check(t, { "bad/index.html": `<html><head><meta http-equiv="refresh" content="later"></head><body></body></html>`, "old/index.html": redirect("/new/").replace(/<link[^>]*>/, ""), "new/index.html": page() });
  assert.match(errors.join("\n"), /0 sekunders/);
  assert.match(errors.join("\n"), /canonical stämmer inte/);
});

test("redirect target fragments and fallback links are checked", (t) => {
  const errors = check(t, { "old/index.html": redirect("/new/#missing").replace("href='/new/#missing'>Continue", "href='/broken/'>Continue"), "new/index.html": page() });
  assert.match(errors.join("\n"), /fragmentet #missing/);
  assert.match(errors.join("\n"), /länken \/broken\/ leder ingenstans/);
});

test("external refresh targets cannot silently leave the static site", (t) => {
  assert.match(check(t, { "old/index.html": redirect("https://example.com/new/") }).join("\n"), /lokalt mål/);
});
