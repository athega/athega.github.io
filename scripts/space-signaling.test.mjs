import test from 'node:test';
import assert from 'node:assert/strict';
import { createPeerId, invitationLink, invitationPeer, isPeerId } from '../assets/space-egg/invitation.js';
import { pilotName } from '../assets/space-egg/multiplayer.js';

const id = 'athega-space-12345678-1234-4123-8123-123456789abc';
const page = 'https://athega.se/systemutveckling/';

test('an invitation always opens the root lobby and carries its room in the fragment', () => {
  const link = invitationLink(id, page + '?preview=1#kontakt');
  assert.equal(new URL(link).pathname, '/');
  assert.equal(new URL(link).search, '');
  assert.equal(new URL(link).hash, '#space=' + id);
  assert.equal(invitationPeer(link, page), id);
});
test('foreign origins, malformed ids and old manual codes cannot join a room', () => {
  for (const value of ['https://evil.example/#space=' + id, page + '#space=short', 'ATHEGA-INBJUDAN:abc', 'javascript:alert(1)', '']) {
    assert.equal(invitationPeer(value, page), null);
  }
  assert.equal(isPeerId(id), true);
  assert.equal(isPeerId(null), false);
});
test('pilot names stay short and readable without control characters', () => {
  assert.equal(pilotName('  Mats   & Chrille  '), 'Mats & Chrille');
  assert.equal(pilotName('Pilot\u202e\u0000'), 'Pilot');
  assert.equal(pilotName({ name: 'no' }), '');
  assert.equal(Array.from(pilotName('🚀'.repeat(30))).length, 20);
});

test('room IDs work without randomUUID and remain valid invitations', () => {
  const original = crypto.randomUUID;
  crypto.randomUUID = undefined;
  try {
    const ids = Array.from({ length: 100 }, () => createPeerId());
    assert.equal(new Set(ids).size, ids.length);
    for (const id of ids) {
      assert.match(id, /^athega-space-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
      assert.equal(invitationPeer(invitationLink(id, page), page), id);
    }
  } finally {
    crypto.randomUUID = original;
  }
});
