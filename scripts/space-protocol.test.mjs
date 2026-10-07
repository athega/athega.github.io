import test from 'node:test';
import assert from 'node:assert/strict';
import { acceptsMessage, matchesWorld, replaceableMessage } from '../assets/space-egg/protocol.js';

test('only the host can publish authoritative state and damage', () => {
  for (const type of ['state', 'round', 'destroy', 'pilot-damage', 'ordnance-state', 'ordnance-blast']) {
    assert.equal(acceptsMessage(type, true, false), false);
    assert.equal(acceptsMessage(type, false, false), false);
    assert.equal(acceptsMessage(type, false, true), true);
  }
  assert.equal(acceptsMessage('hit', true, false), true);
  assert.equal(acceptsMessage('hit', false, false), false);
  assert.equal(acceptsMessage('position', false, false), true);
  assert.equal(acceptsMessage('unknown', true, false), false);
});

test('delayed messages cannot cross rounds or repeat visits to the same page', () => {
  const message = { round: 2, revision: 3, page: 'https://athega.se/' };
  assert.equal(matchesWorld(message, 2, 3, message.page), true);
  assert.equal(matchesWorld(message, 3, 3, message.page), false);
  assert.equal(matchesWorld(message, 2, 4, message.page), false);
  assert.equal(matchesWorld(message, 2, 3, 'https://athega.se/blogg/'), false);
});

test('congestion can discard positions but not gameplay transitions', () => {
  assert.equal(replaceableMessage('position'), true);
  assert.equal(replaceableMessage('scroll'), true);
  for (const type of ['shot', 'hit', 'state', 'round', 'impact', 'ordnance-blast']) assert.equal(replaceableMessage(type), false);
});
