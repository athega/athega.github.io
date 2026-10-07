import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { createMultiplayer } from '../assets/space-egg/multiplayer.js';

// Exercise the actual admission/relay/close code without the public signal server.
function fakePeerLibrary() {
  const peers = new Map();
  class Connection extends EventEmitter {
    constructor(peer, metadata) { super(); this.peer = peer; this.metadata = metadata; this.open = false; this.dataChannel = { bufferedAmount: 0 }; }
    send(value) { queueMicrotask(() => { if (this.other.open) this.other.emit('data', value); }); }
    close() {
      if (this.closed) return;
      this.closed = true; this.open = false; this.emit('close'); this.other.close();
    }
  }
  return class Peer extends EventEmitter {
    constructor(id) { super(); this.id = id; this.links = []; peers.set(id, this); queueMicrotask(() => this.emit('open', id)); }
    connect(id, options) {
      const destination = peers.get(id);
      const outgoing = new Connection(id, options.metadata);
      const incoming = new Connection(this.id, options.metadata);
      outgoing.other = incoming; incoming.other = outgoing;
      this.links.push(outgoing); destination.links.push(incoming);
      queueMicrotask(() => {
        destination.emit('connection', incoming);
        outgoing.open = incoming.open = true;
        incoming.emit('open'); outgoing.emit('open');
      });
      return outgoing;
    }
    destroy() { this.links.forEach(link => link.close()); peers.delete(this.id); }
    static peers = peers;
  };
}
const flush = () => new Promise(resolve => setImmediate(resolve));

test('host admits four pilots, relays authenticated senders and rejects guest authority', async t => {
  const Peer = fakePeerLibrary();
  const received = [[], [], [], [], []];
  const clients = received.map(messages => createMultiplayer({ loadPeer: async () => Peer,
    onMessage: (message, sender) => messages.push({ message, sender }), onConnected() {}, onStatus() {} }));
  t.after(() => clients.forEach(client => client.close()));
  const id = await clients[0].host('Host');
  for (let i = 1; i < 4; i++) await clients[i].join(id, `Guest ${i}`);
  await flush();
  for (let i = 0; i < 4; i++) assert.equal(clients[i].playerIds.length, 4);
  clients[1].send({ type: 'position', x: 0.5 });
  clients[1].send({ type: 'state', score: 100000 });
  await flush();
  assert.equal(received[0].length, 1);
  assert.equal(received[2].length, 1);
  assert.equal(received[2][0].sender, clients[1].playerId);
  await assert.rejects(clients[4].join(id), /fullt/);
  clients[3].close(); await flush();
  assert.equal(clients[0].playerIds.length, 3);
});

test('critical updates survive congestion; excessive backlog disconnects cleanly', async t => {
  const Peer = fakePeerLibrary();
  const received = [];
  const host = createMultiplayer({ loadPeer: async () => Peer, onMessage: message => received.push(message), onConnected() {}, onStatus() {} });
  const guest = createMultiplayer({ loadPeer: async () => Peer, onMessage() {}, onConnected() {}, onStatus() {} });
  t.after(() => { host.close(); guest.close(); });
  await guest.join(await host.host());
  const connection = Peer.peers.get(guest.playerId).links[0];
  connection.dataChannel.bufferedAmount = 100000;
  guest.send({ type: 'position' }); guest.send({ type: 'hit' });
  await flush(); assert.deepEqual(received, [{ type: 'hit' }]);
  connection.dataChannel.bufferedAmount = 1000001;
  guest.send({ type: 'hit' }); await flush();
  assert.equal(host.connected, false); assert.equal(guest.connected, false);
});
