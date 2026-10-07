import test from 'node:test';
import assert from 'node:assert/strict';
import { createOrdnance, mineTriggered, blastVictims, blastTouches } from '../assets/space-egg/ordnance.js';

const pilots = [{ id: 'host', x: 100, y: 100, alive: true }, { id: 'guest', x: 120, y: 100, alive: true }];

test('mines arm after a delay and never trigger on their owner', () => {
  const mine = { owner: 'host', x: 100, y: 100, armedAt: 600 };
  assert.equal(mineTriggered(mine, pilots, 599), false);
  assert.equal(mineTriggered(mine, pilots.slice(0, 1), 700), false);
  assert.equal(mineTriggered(mine, pilots, 600), true);
  assert.equal(mineTriggered(mine, [{ ...pilots[1], x: 160 }], 600), true);
  assert.equal(mineTriggered(mine, [{ ...pilots[1], x: 161 }], 600), false);
  assert.equal(mineTriggered(mine, [pilots[0], { ...pilots[1], alive: false }], 700), false);
});

test('friendly fire protects others; mines protect owners but bombs can hurt them', () => {
  const blast = { owner: 'host', kind: 'mine', x: 100, y: 100 };
  assert.deepEqual(blastVictims(blast, pilots, false), []);
  assert.deepEqual(blastVictims(blast, pilots, true), [{ id: 'guest', damage: 60 }]);
  assert.deepEqual(blastVictims({ ...blast, kind: 'bomb' }, pilots, false), [{ id: 'host', damage: 80 }]);
  assert.equal(blastTouches({ left: 190, right: 300, top: 100, bottom: 110 }, blast), true);
  assert.equal(blastTouches({ left: 196, right: 300, top: 100, bottom: 110 }, blast), false);
});

function setup() {
  let clock = 0;
  const sent = [], blasts = [];
  const ordnance = createOrdnance({ ownId: () => 'host', authoritative: () => true,
    now: () => clock, send: message => sent.push(message), onChange() {},
    onBlast: (...args) => blasts.push(args) });
  const grant = (kind, id) => { ordnance.recordDrop(id, kind); ordnance.collect(kind, id); };
  return { ordnance, sent, blasts, grant, time: value => { clock = value; } };
}

test('ammunition validates pickups, rejects duplicates, caps stock and is consumed', () => {
  const { ordnance: o, grant } = setup();
  o.collect('mine', 99);
  assert.equal(o.ammo.mine, 0);
  grant('mine', 1); o.collect('mine', 1);
  assert.equal(o.ammo.mine, 1);
  for (let id = 2; id < 6; id++) grant('mine', id);
  assert.equal(o.ammo.mine, 3);
  o.deploy('mine', -1, 100); assert.equal(o.ammo.mine, 3);
  for (let i = 0; i < 4; i++) o.deploy('mine', 100, 100);
  assert.equal(o.hazards.length, 3); assert.equal(o.ammo.mine, 0);
  grant('mine', 6); o.deploy('mine', 100, 100);
  assert.equal(o.hazards.length, 3); assert.equal(o.ammo.mine, 1);
  o.clearAmmo('host'); assert.equal(o.ammo.mine, 0);
  o.clearField(); assert.equal(o.hazards.length, 0);
});

test('bombs detonate once at one second and guests never run their own fuse', () => {
  const { ordnance: o, grant, time, blasts } = setup();
  grant('bomb', 1); o.deploy('bomb', 100, 100);
  let guestBlasts = 0;
  const guest = createOrdnance({ ownId: () => 'guest', authoritative: () => false,
    now: () => 10000, send() {}, onChange() {}, onBlast() { guestBlasts++; } });
  guest.restore(o.snapshot()); guest.tick(pilots, true);
  assert.equal(guestBlasts, 0);
  time(999); o.tick(pilots, true); assert.equal(blasts.length, 0);
  time(1000); o.tick(pilots, true); assert.equal(blasts.length, 1);
  o.tick(pilots, true); assert.equal(blasts.length, 1);
  assert.equal(o.hazards.length, 0);
});

test('blast arrives before a death callback replaces guest hazard state', () => {
  let clock = 0, guestBlasts = 0;
  const guest = createOrdnance({ ownId: () => 'guest', authoritative: () => false,
    now: () => clock, send() {}, onChange() {}, onBlast() { guestBlasts++; } });
  const host = createOrdnance({ ownId: () => 'host', authoritative: () => true,
    now: () => clock, send: message => guest.handle(message, 'host'), onChange() {},
    onBlast() { host.clearAmmo('host'); } });
  host.recordDrop(1, 'bomb'); host.collect('bomb', 1); host.deploy('bomb', 100, 100);
  clock = 1000; host.tick(pilots, true);
  assert.equal(guestBlasts, 1); assert.equal(guest.hazards.length, 0);
});
