export const ROUND_SECONDS = 120;

export function roundWinners(players) {
  if (!players.length) return [];
  const best = Math.max(...players.map(player => player.kills));
  return players.filter(player => player.kills === best).map(player => player.id);
}

export function clockLabel(seconds) {
  const whole = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

export function validRoundSnapshot(data) {
  return Boolean(data && Number.isSafeInteger(data.serial) && data.serial >= 0
    && Number.isFinite(data.remaining) && data.remaining >= 0 && data.remaining <= ROUND_SECONDS
    && typeof data.started === 'boolean' && typeof data.ended === 'boolean'
    && Array.isArray(data.players) && data.players.length <= 100
    && data.players.every(player => player && typeof player.id === 'string'
      && Number.isSafeInteger(player.kills) && player.kills >= 0
      && Number.isSafeInteger(player.deaths) && player.deaths >= 0));
}
