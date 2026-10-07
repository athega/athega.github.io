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
