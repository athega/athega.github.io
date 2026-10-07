import test from 'node:test';
import assert from 'node:assert/strict';
import { hitsRect } from '../assets/space-egg/physics.js';

const rect = { left: 10, right: 40, top: 20, bottom: 24 };
test('fast shots hit thin text even when both endpoints are outside it', () => {
  assert.equal(hitsRect(25, 0, 25, 50, rect), true);
  assert.equal(hitsRect(25, 50, 25, 0, rect), true);
});
test('near misses and a target behind the shot do not collide', () => {
  assert.equal(hitsRect(5, 0, 5, 50, rect), false);
  assert.equal(hitsRect(25, 30, 25, 50, rect), false);
  assert.equal(hitsRect(0, 0, 11, 20, rect), true);
  assert.equal(hitsRect(0, 0, 11, 30, rect), false);
});
test('shots starting inside a target and stationary points are handled', () => {
  assert.equal(hitsRect(20, 22, 50, 50, rect), true);
  assert.equal(hitsRect(20, 22, 20, 22, rect), true);
  assert.equal(hitsRect(0, 0, 0, 0, rect), false);
});

test('the nearest obstacle wins regardless of DOM order and can shield a pilot', async () => {
  const { firstHit } = await import('../assets/space-egg/physics.js');
  const near = { node: 'wall', rect: { left: 10, right: 15, top: 0, bottom: 10 } };
  const far = { pilot: 'pilot', rect: { left: 20, right: 25, top: 0, bottom: 10 } };
  assert.equal(firstHit(0, 5, 30, 5, [far, near]), near);
  assert.equal(firstHit(30, 5, 0, 5, [near, far]), far);
  assert.equal(firstHit(0, 15, 30, 15, [near, far]), null);
});
