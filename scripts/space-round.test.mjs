import test from 'node:test';
import assert from 'node:assert/strict';
import { ROUND_SECONDS, roundWinners, clockLabel } from '../assets/space-egg/round.js';

test('rounds last two minutes and the clock never shows negative time', () => {
  assert.equal(ROUND_SECONDS, 120);
  assert.equal(clockLabel(120), '2:00');
  assert.equal(clockLabel(59.1), '1:00');
  assert.equal(clockLabel(-0.1), '0:00');
});
test('most kills wins and ties include every tied pilot', () => {
  assert.deepEqual(roundWinners([{ id: 'a', kills: 2 }, { id: 'b', kills: 1 }]), ['a']);
  assert.deepEqual(roundWinners([{ id: 'a', kills: 2 }, { id: 'b', kills: 2 }, { id: 'c', kills: 0 }]), ['a', 'b']);
  assert.deepEqual(roundWinners([]), []);
});

test('malformed round snapshots are rejected before they can change game state', async () => {
  const { validRoundSnapshot } = await import('../assets/space-egg/round.js');
  const state = { serial: 1, started: false, ended: false, remaining: 120, players: [{ id: 'a', kills: 0, deaths: 0 }] };
  assert.equal(validRoundSnapshot(state), true);
  for (const invalid of [null, { ...state, players: [null] }, { ...state, remaining: Infinity }, { ...state, serial: -1 }, { ...state, players: [{ id: 'a', kills: -1, deaths: 0 }] }]) {
    assert.equal(validRoundSnapshot(invalid), false);
  }
});
