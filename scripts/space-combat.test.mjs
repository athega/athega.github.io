import test from 'node:test';
import assert from 'node:assert/strict';
import { damageHull, expandedRect, effectSeconds, POWERUPS, advanceScroll } from '../assets/space-egg/combat.js';
import { hitsRect } from '../assets/space-egg/physics.js';

test('damage respects protection and never leaves hull below zero', () => {
  assert.equal(damageHull(100, 25, false), 75);
  assert.equal(damageHull(10, 20, false), 0);
  assert.equal(damageHull(100, 25, true), 100);
  assert.equal(damageHull(0, 25, false), 0);
});
test('ship radius collides with thin text even at high speed', () => {
  const rect = expandedRect({ left: 100, right: 150, top: 50, bottom: 52 }, 10);
  assert.equal(hitsRect(90, 0, 90, 100, rect), true);
  assert.equal(hitsRect(89, 0, 89, 100, rect), false);
});
test('gravity expires in real time and duration stays bounded for joining players', () => {
  assert.equal(effectSeconds(9000, 1000), 8);
  assert.equal(effectSeconds(9000, 8500), 0.5);
  assert.equal(effectSeconds(9000, 10000), 0);
  assert.equal(effectSeconds(100000, 0), POWERUPS.gravity.duration);
});

test('continuous scroll reflects at both ends without losing fractional motion', () => {
  assert.deepEqual(advanceScroll(99, 1, 4, 100), { position: 97, direction: -1 });
  assert.deepEqual(advanceScroll(1, -1, 4, 100), { position: 3, direction: 1 });
  assert.deepEqual(advanceScroll(0, 1, 0.3, 100), { position: 0.3, direction: 1 });
  assert.deepEqual(advanceScroll(10, 1, 10, 0), { position: 0, direction: 1 });
});
