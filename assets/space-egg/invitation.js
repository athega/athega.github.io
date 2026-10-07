// getRandomValues also works when testing over HTTP on a local network.
export function createPeerId() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  return `athega-space-${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const peerIdPattern = /^athega-space-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export function isPeerId(value) {
  return typeof value === 'string' && peerIdPattern.test(value);
}

export function invitationLink(peerId, pageUrl) {
  if (!isPeerId(peerId)) throw new Error('Ogiltig spelinbjudan.');
  const url = new URL('/', pageUrl);
  url.hash = new URLSearchParams({ space: peerId }).toString();
  return url.href;
}

export function invitationPeer(value, pageUrl) {
  try {
    const url = new URL(value.trim(), pageUrl);
    if (url.origin !== new URL(pageUrl).origin) return null;
    const id = new URLSearchParams(url.hash.slice(1)).get('space');
    return isPeerId(id) ? id : null;
  } catch {
    return null;
  }
}
