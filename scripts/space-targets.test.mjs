import test from 'node:test';
import assert from 'node:assert/strict';
import { targetStrength, damageEdge } from '../assets/space-egg/targets.js';

test('links are light targets while headlines and images take more hits', () => {
  assert.equal(targetStrength('A'), 1);
  assert.equal(targetStrength('P'), 2);
  assert.equal(targetStrength('H2'), 3);
  assert.equal(targetStrength('IMG'), 4);
  assert.equal(targetStrength('H1'), 4);
});
test('progressive damage removes more of the object while keeping a hittable remainder', () => {
  assert.ok(damageEdge(3, 4) > damageEdge(2, 4));
  assert.ok(damageEdge(2, 4) > damageEdge(1, 4));
  assert.ok(damageEdge(1, 4) > 60);
});
