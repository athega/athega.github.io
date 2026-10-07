export function targetStrength(tagName) {
  if (tagName === 'IMG' || tagName === 'H1') return 4;
  if (tagName === 'H2') return 3;
  if (['H3', 'H4', 'P', 'LI'].includes(tagName)) return 2;
  return 1;
}

export function damageEdge(remaining, maximum) {
  return 100 - (1 - remaining / maximum) * 36;
}
