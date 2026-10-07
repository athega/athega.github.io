// The transport authenticates the sender; the game checks round/page revisions.
const pilotMessages = new Set(['position', 'shot', 'impact', 'pilot-death']);
const requests = new Set(['hit', 'navigate', 'pilot-hit', 'collision-request', 'effect-request', 'ordnance-pickup', 'ordnance-deploy']);
const hostMessages = new Set(['state', 'round', 'target-damage', 'destroy', 'pilot-damage', 'collision-damage', 'scroll', 'effect', 'ordnance-state', 'ordnance-blast']);

export function acceptsMessage(type, receivingHost, senderIsHost) {
  if (receivingHost) return pilotMessages.has(type) || requests.has(type);
  return pilotMessages.has(type) || (senderIsHost && hostMessages.has(type));
}

export function relayMessage(type) { return pilotMessages.has(type); }
export function replaceableMessage(type) { return type === 'position' || type === 'scroll'; }

export function matchesWorld(message, round, revision, page) {
  return message.round === round && message.revision === revision && message.page === page;
}
