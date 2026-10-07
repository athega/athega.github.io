import test from 'node:test';
import assert from 'node:assert/strict';
import { hitReward, pageReward } from '../assets/space-egg/scoring.js';
import { internalDestination } from '../assets/space-egg/navigation.js';

test('quick hits build a combo up to five and a pause resets it', () => {
  assert.deepEqual(hitReward(100, -Infinity, 1, 1), { combo: 1, points: 100 });
  assert.deepEqual(hitReward(100, 1, 2, 1), { combo: 2, points: 200 });
  assert.deepEqual(hitReward(250, 1, 3, 5), { combo: 5, points: 1250 });
  assert.deepEqual(hitReward(100, 1, 3.01, 5), { combo: 1, points: 100 });
});
test('clearing an equal page faster gives more points, never negative', () => {
  assert.ok(pageReward(5, 5) > pageReward(5, 10));
  assert.equal(pageReward(5, 100), 0);
});
test('navigation shots only follow local site pages', () => {
  const current = 'https://athega.se/systemutveckling/';
  assert.equal(internalDestination('/om-oss/', current).pathname, '/om-oss/');
  assert.equal(internalDestination('#kontakt', current).hash, '#kontakt');
  for (const href of ['https://github.com/athega/', 'mailto:reception@athega.se', 'javascript:alert(1)', '/assets/blog/demo.html', '/rapport.pdf']) {
    assert.equal(internalDestination(href, current), null);
  }
});
