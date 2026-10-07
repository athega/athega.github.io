import test from 'node:test';
import assert from 'node:assert/strict';
import { cameraFor, WORLD_WIDTH, WORLD_HEIGHT } from '../assets/space-egg/arena.js';

test('desktop sees the shared world with centered margins', () => {
  const camera = cameraFor(1440, 1000, { x: 640, y: 400 });
  assert.equal(camera.x, 0);
  assert.equal(camera.y, 0);
  assert.equal(camera.left, 80);
  assert.equal(camera.top, 100);
  assert.equal(camera.visibleWidth, WORLD_WIDTH);
  assert.equal(camera.visibleHeight, WORLD_HEIGHT);
});
test('portrait camera follows the pilot and stops at world edges', () => {
  const middle = cameraFor(390, 844, { x: 640, y: 400 });
  assert.equal(middle.x, 445);
  assert.equal(640 * middle.scale + middle.left, 195);
  assert.equal(cameraFor(390, 844, { x: 0, y: 0 }).x, 0);
  assert.equal(cameraFor(390, 844, { x: 1280, y: 800 }).x, 890);
});
test('landscape camera crops vertically without changing world dimensions', () => {
  const camera = cameraFor(844, 390, { x: 640, y: 400 });
  assert.equal(camera.visibleWidth, WORLD_WIDTH);
  assert.ok(camera.visibleHeight < WORLD_HEIGHT);
  assert.ok(Math.abs(400 * camera.scale + camera.top - 195) < 0.01);
});
