import test from "node:test";
import assert from "node:assert/strict";
import { groupPostsByYear, archiveRedirects } from "./blog-archives.mjs";

const post = (date) => ({ date: new Date(date) });

test("archives group posts newest first by UTC year without changing the input", () => {
  const posts = [post("2009-02-01Z"), post("2010-01-01Z"), post("2009-08-01Z")];
  const archives = groupPostsByYear(posts);
  assert.deepEqual(archives.map(({ year, url }) => ({ year, url })), [{ year: "2010", url: "/blogg/2010/" }, { year: "2009", url: "/blogg/2009/" }]);
  assert.equal(archives[1].posts[0], posts[2]);
  assert.equal(posts[0].date.getUTCMonth(), 1);
  assert.deepEqual(groupPostsByYear([]), []);
  assert.equal(groupPostsByYear([post("2027-01-01T00:30:00+01:00")])[0].year, "2026");
});

test("populated archives replace fallbacks and receive historical monthly links", () => {
  const redirects = [
    { from: "/blogg/2009/", to: "/blogg/" },
    { from: "/blogg/2027/", to: "/blogg/" },
    { from: "/2009/03/", to: "/blogg/" },
    { from: "/arkiv/2009/3/", to: "/blogg/" },
    { from: "/arkiv/2008/3/", to: "/blogg/" },
    { from: "/2009/03/03/article/", to: "/blogg/2009/03/03/article/" },
  ];
  const result = archiveRedirects(redirects, groupPostsByYear([post("2009-03-03Z")]));
  assert.equal(result.length, 5);
  assert.equal(result[0].to, "/blogg/");
  assert.equal(result[1].to, "/blogg/2009/");
  assert.equal(result[2].to, "/blogg/2009/");
  assert.equal(result[3].to, "/blogg/");
  assert.deepEqual(result[4], redirects[5]);
  assert.equal(redirects[2].to, "/blogg/");
  const future = archiveRedirects(redirects, groupPostsByYear([post("2027-03-03Z")]));
  assert.ok(!future.some((redirect) => redirect.from === "/blogg/2027/"));
});
