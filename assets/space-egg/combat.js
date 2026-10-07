export const POWERUPS = {
  triple: { label: '3X', name: 'Trippelskott', duration: 12 },
  mine: { label: 'MIN', name: 'Mina · placera med M', duration: 0 },
  shield: { label: 'SK', name: 'Sköld', duration: 10 },
  bomb: { label: 'BOM', name: 'Bomb · släpp med B', duration: 0 },
  rapid: { label: 'RF', name: 'Snabbeld', duration: 12 },
  repair: { label: '+', name: 'Reparation +40', duration: 0 },
  turbo: { label: 'T', name: 'Turbo', duration: 10 },
  scroll: { label: 'S↕', name: 'Snabbscroll för alla', duration: 8 },
  gravity: { label: 'G↓', name: 'Gravitation för alla', duration: 8 },
};

export function damageHull(hull, amount, protectedShip) {
  if (protectedShip || hull <= 0) return hull;
  return Math.max(0, hull - amount);
}

export function expandedRect(rect, radius) {
  return { left: rect.left - radius, right: rect.right + radius, top: rect.top - radius, bottom: rect.bottom + radius };
}

export function effectSeconds(deadline, now) {
  return Math.max(0, Math.min(POWERUPS.gravity.duration, (deadline - now) / 1000));
}

// Reflect at the document edges; keep fractional pixels between animation frames.
export function advanceScroll(position, direction, distance, maximum) {
  if (maximum <= 0) return { position: 0, direction: 1 };
  let next = Math.max(0, Math.min(maximum, position)) + direction * distance;
  while (next < 0 || next > maximum) {
    if (next > maximum) { next = maximum * 2 - next; direction = -1; }
    if (next < 0) { next = -next; direction = 1; }
  }
  return { position: next, direction };
}

export function shipContact(ship, other, fallbackSide = 1) {
  const dx = ship.x - other.x;
  const dy = ship.y - other.y;
  const distance = Math.hypot(dx, dy);
  const separation = 30;
  if (distance >= separation) return null;
  return { nx: distance ? dx / distance : fallbackSide, ny: distance ? dy / distance : 0, overlap: separation - distance };
}
