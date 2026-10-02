import test from 'node:test';
import assert from 'node:assert/strict';
import { encodeSignal, decodeSignal } from '../assets/space-egg/multiplayer.js';

test('invitation and reply have visibly distinct prefixes and round-trip', () => {
  for (const [type, prefix] of [['offer', 'ATHEGA-INBJUDAN:'], ['answer', 'ATHEGA-SVAR:']]) {
    const description = { type, sdp: 'v=0\r\ns=test\r\n' };
    const code = encodeSignal(description);
    assert.ok(code.startsWith(prefix));
    assert.deepEqual(decodeSignal(code, type), description);
    assert.deepEqual(decodeSignal('  ' + code.slice(0, 30) + '\n' + code.slice(30), type), description);
  }
});
test('returning the original invitation explains the missing answer step', () => {
  assert.throws(() => decodeSignal(encodeSignal({ type: 'offer', sdp: 'v=0' }), 'answer'), /INBJUDAN.*Svara på inbjudan.*ATHEGA-SVAR/);
});
test('old unprefixed codes still work and invalid codes are rejected clearly', () => {
  assert.equal(decodeSignal(btoa(JSON.stringify({ version: 1, type: 'answer', sdp: 'v=0' })), 'answer').type, 'answer');
  assert.throws(() => decodeSignal('inte en kod'), /gick inte att läsa/);
  assert.throws(() => decodeSignal(btoa('null')), /giltig spelkod/);
});
