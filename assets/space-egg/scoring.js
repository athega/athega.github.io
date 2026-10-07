export function hitReward(base, previousHit, now, previousCombo) {
  const combo = now - previousHit <= 2 ? Math.min(5, previousCombo + 1) : 1;
  return { combo, points: base * combo };
}

export function pageReward(targetCount, seconds) {
  return Math.max(0, Math.round(targetCount * 75 - seconds * 15));
}
