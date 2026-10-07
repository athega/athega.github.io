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
