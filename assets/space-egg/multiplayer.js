export function encodeSignal(description) {
  const prefix = description.type === 'offer' ? 'ATHEGA-INBJUDAN:' : 'ATHEGA-SVAR:';
  return prefix + btoa(JSON.stringify({ version: 1, type: description.type, sdp: description.sdp }));
}

export function decodeSignal(value, expected) {
  if (typeof value !== 'string' || value.length > 32000) throw new Error('Koden är för lång eller saknas.');
  const compact = value.replace(/\s/g, '');
  const encoded = compact.replace(/^ATHEGA-(INBJUDAN|SVAR):/i, '');
  let description;
  try { description = JSON.parse(atob(encoded)); } catch { throw new Error('Koden gick inte att läsa. Kopiera hela koden med knappen Kopiera kod.'); }
  if (!description || description.version !== 1 || !['offer', 'answer'].includes(description.type) || typeof description.sdp !== 'string') {
    throw new Error('Det här är inte en giltig spelkod. Skapa en ny kod.');
  }
  if (expected && description.type !== expected) {
    throw new Error(expected === 'answer'
      ? 'Det här är en INBJUDAN, inte ett svar. Kompisen måste klicka Svara på inbjudan och skicka tillbaka den nya koden märkt ATHEGA-SVAR.'
      : 'Det här är en SVARSKOD. Den ska tillbaka till värden, som väljer Anslut med svarskoden.');
  }
  return { type: description.type, sdp: description.sdp };
}

// Manual WebRTC signaling: the users exchange the offer and answer themselves.
export function createMultiplayer({ onMessage, onConnected, onStatus }) {
  let peer;
  let channel;
  let host = false;
  let timer;
  let closed = false;
  const controller = new AbortController();

  function attach(dataChannel) {
    channel = dataChannel;
    channel.onopen = () => { clearTimeout(timer); onStatus('Två piloter anslutna'); onConnected(); };
    channel.onclose = () => { if (!closed) onStatus('Kompisen kopplade från. Du kan fortsätta själv.'); };
    channel.onerror = () => { if (!closed) onStatus('Anslutningen avbröts. Prova nya koder.'); };
    channel.onmessage = event => {
      if (typeof event.data !== 'string' || event.data.length > 48000) return;
      try { const message = JSON.parse(event.data); if (message && typeof message.type === 'string') onMessage(message); } catch { /* Ignore malformed peer messages. */ }
    };
  }

  function create(isHost) {
    if (peer) throw new Error('Koppla från innan du skapar en ny anslutning.');
    host = isHost;
    peer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.cloudflare.com:3478' }] });
    peer.ondatachannel = event => attach(event.channel);
    peer.onconnectionstatechange = () => {
      if (peer.connectionState === 'failed') onStatus('Ingen kontakt. Nätverket kan kräva en reläserver. Prova ett annat nätverk.');
      if (peer.connectionState === 'disconnected') onStatus('Kontakten bröts. Försöker återansluta…');
      if (peer.connectionState === 'connected') onStatus('Två piloter anslutna');
    };
    if (host) attach(peer.createDataChannel('athega-space', { ordered: true }));
  }

  async function code() {
    if (peer.iceGatheringState !== 'complete') {
      await new Promise((resolve, reject) => {
        let wait;
        const finish = () => { clearTimeout(wait); peer.removeEventListener('icegatheringstatechange', change); controller.signal.removeEventListener('abort', abort); resolve(); };
        const change = () => { if (peer.iceGatheringState === 'complete') finish(); };
        const abort = () => { finish(); reject(new Error('Anslutningen stängdes.')); };
        wait = setTimeout(finish, 10000);
        peer.addEventListener('icegatheringstatechange', change);
        controller.signal.addEventListener('abort', abort, { once: true });
      });
    }
    if (closed) throw new Error('Anslutningen stängdes.');
    return encodeSignal(peer.localDescription);
  }


  function waitForConnection() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (!channel?.readyState || channel.readyState !== 'open') onStatus('Ingen kontakt ännu. Kontrollera svarskoden eller prova ett annat nätverk.');
    }, 25000);
  }

  return {
    get connected() { return channel?.readyState === 'open'; },
    get isHost() { return host; },
    async offer() { create(true); await peer.setLocalDescription(await peer.createOffer()); return code(); },
    async answer(value) {
      const offer = decodeSignal(value, 'offer');
      create(false);
      await peer.setRemoteDescription(offer);
      await peer.setLocalDescription(await peer.createAnswer());
      return code();
    },
    async accept(value) { await peer.setRemoteDescription(decodeSignal(value, 'answer')); waitForConnection(); },
    send(message) {
      if (channel?.readyState !== 'open' || channel.bufferedAmount > 65536) return;
      channel.send(JSON.stringify(message));
    },
    close() { closed = true; clearTimeout(timer); controller.abort(); channel?.close(); peer?.close(); },
  };
}
