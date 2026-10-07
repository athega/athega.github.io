import { isPeerId } from './invitation.js?v=7';

let libraryPromise;

function loadPeerLibrary() {
  if (libraryPromise) return libraryPromise;
  libraryPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = new URL('./vendor/peerjs-1.5.5.min.js', import.meta.url).href;
    const timer = setTimeout(() => fail(), 15000);
    function fail() {
      clearTimeout(timer);
      script.remove();
      reject(new Error('Kunde inte ladda multiplayer. Prova igen.'));
    }
    script.onload = () => {
      clearTimeout(timer);
      const Peer = window.peerjs?.Peer || window.Peer;
      if (Peer) resolve(Peer);
      else fail();
    };
    script.onerror = fail;
    document.head.append(script);
  }).catch(error => {
    libraryPromise = null;
    throw error;
  });
  return libraryPromise;
}

export const MAX_PLAYERS = 4;

export function pilotName(value) {
  if (typeof value !== 'string') return '';
  return Array.from(value.replace(/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, '').replace(/\s+/g, ' ').trim()).slice(0, 20).join('');
}
const protocol = 7;

// Star topology: the host owns scoring and relays guests' visual updates.
export function createMultiplayer({ onMessage, onConnected, onStatus, onPlayers = () => {}, loadPeer = loadPeerLibrary }) {
  let peer;
  let host = false;
  let ready = false;
  let closed = false;
  let timer;
  let pendingResolve;
  let pendingReject;
  let roster = [];
  let name = '';
  const names = new Map();
  const connections = new Map();
  const admitted = new Set();
  const rejectedConnections = new Set();

  function settle(error, value) {
    clearTimeout(timer);
    const resolve = pendingResolve;
    const reject = pendingReject;
    pendingResolve = pendingReject = null;
    if (error) reject?.(error);
    else resolve?.(value);
  }

  function close() {
    if (closed) return;
    closed = true;
    ready = false;
    settle(new Error('Anslutningen stängdes.'));
    for (const connection of [...connections.values(), ...rejectedConnections]) connection.close();
    connections.clear();
    admitted.clear();
    rejectedConnections.clear();
    peer?.destroy();
  }

  function fail(message) {
    if (closed) return;
    settle(new Error(message));
    close();
    onStatus(message);
  }

  function write(connection, value) {
    if (!connection.open || connection.dataChannel?.bufferedAmount > 65536) return;
    const encoded = JSON.stringify(value);
    if (encoded.length <= 50000) connection.send(encoded);
  }

  function broadcast(value, exceptId = null) {
    for (const [id, connection] of connections) {
      if (admitted.has(id) && id !== exceptId) write(connection, value);
    }
  }

  function updateRoster(players, receivedNames = {}) {
    roster = players;
    for (const id of players) names.set(id, pilotName(receivedNames[id]) || names.get(id) || `Pilot ${players.indexOf(id) + 1}`);
    onPlayers([...roster]);
    onStatus(roster.length > 1 ? `${roster.length} piloter anslutna` : 'Väntar på fler piloter. Du kan fortsätta spela själv.');
  }

  function rosterNames(players) {
    return Object.fromEntries(players.map(id => [id, names.get(id)]));
  }

  function publishRoster() {
    updateRoster([peer.id, ...admitted]);
    broadcast({ control: 'roster', players: roster, names: rosterNames(roster) });
  }

  function validRoster(players) {
    return Array.isArray(players) && players.length >= 2 && players.length <= MAX_PLAYERS
      && players.every(isPeerId) && new Set(players).size === players.length && players.includes(peer.id);
  }

  function attach(connection) {
    connections.set(connection.peer, connection);
    connection.on('open', () => {
      if (closed) { connection.close(); return; }
      if (host) {
        admitted.add(connection.peer);
        ready = true;
        const players = [peer.id, ...admitted];
        write(connection, { control: 'welcome', protocol, players, names: rosterNames(players) });
        publishRoster();
        onConnected();
      }
    });
    connection.on('data', value => {
      if (closed || typeof value !== 'string' || value.length > 50000) return;
      let packet;
      try { packet = JSON.parse(value); } catch { return; }
      if (!packet || typeof packet !== 'object') return;
      if (!host && packet.control === 'incompatible') { fail('Ni har olika spelversioner. Ladda om båda sidorna och skapa en ny inbjudan.'); return; }
      if (!host && packet.control === 'full') { fail(`Spelet är fullt (${MAX_PLAYERS} spelare). Be om en ny inbjudan.`); return; }
      if (!host && packet.control === 'welcome' && packet.protocol === protocol && validRoster(packet.players)) {
        ready = true;
        admitted.add(connection.peer);
        settle(null);
        updateRoster(packet.players, packet.names || {});
        onConnected();
        return;
      }
      if (!host && packet.control === 'roster' && ready && validRoster(packet.players)) { updateRoster(packet.players, packet.names || {}); return; }
      const message = packet.message;
      if (!ready || !admitted.has(connection.peer) || !message || typeof message.type !== 'string') return;
      const sender = host ? connection.peer : packet.sender;
      if (!roster.includes(sender) || sender === peer.id) return;
      onMessage(message, sender);
      if (host && ['position', 'shot', 'impact', 'pilot-death'].includes(message.type)) broadcast({ sender, message }, sender);
    });
    connection.on('close', () => {
      if (closed || connections.get(connection.peer) !== connection) return;
      connections.delete(connection.peer);
      admitted.delete(connection.peer);
      if (host) {
        ready = admitted.size > 0;
        publishRoster();
      } else {
        ready = false;
        const message = 'Värden lämnade spelet. Du kan fortsätta själv.';
        settle(new Error(message));
        updateRoster([peer.id]);
        onStatus(message);
      }
    });
    connection.on('error', () => {
      if (host) connection.close();
      else fail('Kunde inte koppla ihop skeppen. Prova igen eller byt nätverk.');
    });
  }

  async function createPeer() {
    if (peer || closed) throw new Error('Skapa en ny anslutning för att försöka igen.');
    const Peer = await loadPeer();
    if (closed) throw new Error('Anslutningen stängdes.');
    return new Promise((resolve, reject) => {
      pendingResolve = resolve;
      pendingReject = reject;
      timer = setTimeout(() => fail('Anslutningstjänsten svarar inte. Du kan fortsätta spela själv och prova igen senare.'), 15000);
      peer = new Peer(`athega-space-${crypto.randomUUID()}`, {
        secure: true,
        config: { iceServers: [{ urls: 'stun:stun.cloudflare.com:3478' }] },
      });
      peer.on('open', id => { if (!closed) { roster = [id]; names.set(id, name || 'Pilot 1'); if (host) updateRoster([id]); settle(null, id); } });
      peer.on('error', error => {
        if (error.type === 'peer-unavailable') fail('Inbjudan har gått ut eller värden har lämnat. Be om en ny länk.');
        else if (!ready) fail('Kunde inte nå multiplayer. Kontrollera anslutningen och prova igen.');
        else onStatus('Kontakten med inbjudningstjänsten bröts. Det pågående spelet kan fortsätta.');
      });
      peer.on('disconnected', () => {
        if (!closed) onStatus(ready ? 'Spelet fortsätter, men nya inbjudningar är tillfälligt otillgängliga.' : 'Kontakten med inbjudningstjänsten bröts. Skapa en ny anslutning.');
      });
      peer.on('connection', connection => {
        if (closed || !host || connection.metadata?.app !== 'athega-space') { connection.close(); return; }
        const incompatible = connection.metadata?.protocol !== protocol;
        if (incompatible || connections.size >= MAX_PLAYERS - 1 || connections.has(connection.peer)) {
          rejectedConnections.add(connection);
          connection.on('open', () => write(connection, { control: incompatible ? 'incompatible' : 'full' }));
          connection.on('close', () => rejectedConnections.delete(connection));
          connection.on('error', () => { rejectedConnections.delete(connection); connection.close(); });
          return;
        }
        names.set(connection.peer, pilotName(connection.metadata.name) || `Pilot ${connections.size + 2}`);
        attach(connection);
      });
    });
  }

  return {
    get connected() { return ready && admitted.size > 0; },
    get isHost() { return host; },
    get playerId() { return peer?.id; },
    get playerIds() { return [...roster]; },
    playerName(id) { return names.get(id) || 'Pilot'; },
    async host(displayName = '') {
      name = pilotName(displayName);
      host = true;
      onStatus('Skapar en inbjudan…');
      return createPeer();
    },
    async join(id, displayName = '') {
      name = pilotName(displayName);
      if (!isPeerId(id)) throw new Error('Klistra in en giltig inbjudningslänk.');
      host = false;
      onStatus('Ansluter till spelet…');
      await createPeer();
      if (closed) throw new Error('Anslutningen stängdes.');
      return new Promise((resolve, reject) => {
        pendingResolve = resolve;
        pendingReject = reject;
        timer = setTimeout(() => fail('Ingen kontakt med värden. Värden behöver ha spelet öppet. Prova igen eller byt nätverk.'), 25000);
        attach(peer.connect(id, { label: 'athega-space', serialization: 'raw', reliable: true, metadata: { app: 'athega-space', protocol, name } }));
      });
    },
    send(message) {
      if (!ready) return;
      const packet = { sender: peer.id, message };
      if (host) broadcast(packet);
      else for (const connection of connections.values()) write(connection, packet);
    },
    close,
  };
}
