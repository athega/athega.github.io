// Swept collision: fast shots must not jump over a thin line of text.
export function rectEntry(x1, y1, x2, y2, rect) {
  let enter = 0;
  let leave = 1;
  for (const [start, delta, min, max] of [
    [x1, x2 - x1, rect.left, rect.right],
    [y1, y2 - y1, rect.top, rect.bottom],
  ]) {
    if (delta === 0) {
      if (start < min || start > max) return null;
      continue;
    }
    const a = (min - start) / delta;
    const b = (max - start) / delta;
    enter = Math.max(enter, Math.min(a, b));
    leave = Math.min(leave, Math.max(a, b));
    if (enter > leave) return null;
  }
  return enter;
}

export function hitsRect(x1, y1, x2, y2, rect) {
  return rectEntry(x1, y1, x2, y2, rect) !== null;
}

export function firstHit(x1, y1, x2, y2, candidates) {
  let nearest = null;
  let distance = Infinity;
  for (const candidate of candidates) {
    const entry = rectEntry(x1, y1, x2, y2, candidate.rect);
    if (entry !== null && entry < distance) { nearest = candidate; distance = entry; }
  }
  return nearest;
}
