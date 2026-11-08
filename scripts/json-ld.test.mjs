import test from "node:test";
import assert from "node:assert/strict";
import { jsonLd } from "./json-ld.mjs";

test("JSON-LD preserves text and cannot close its script element", () => {
  const data = {
    name: 'Athega & "kollegor" — svenska tecken: åäö',
    description: '</ScRiPt><script>alert("test")</script><!--',
    address: { streetAddress: "En väg\nNästa rad" },
  };
  const serialized = jsonLd(data);
  assert.equal(serialized.includes("<"), false);
  assert.deepEqual(JSON.parse(serialized), data);
});
