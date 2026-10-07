console.info('We’re hiring. Nyfiken på vad som finns under huven? Det gillar vi. https://athega.se/jobba/');
console.info('Psst … rymden väntar. Fem snabba klick på loggan på startsidan, eller ↑ ↑ ↓ ↓ ← → ← → B A.');

const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let entered = [];
let lastKeyTime = 0;
let clicks = [];
let active = false;

async function reveal(invitedPeerId = null) {
  if (active) return;
  active = true;
  entered = [];
  clicks = [];
  const controller = new AbortController();
  const cancel = event => { if (event.key === 'Escape') controller.abort(); };
  window.addEventListener('keydown', cancel);
  try {
    const { openGame } = await import('./game.js?v=14');
    controller.signal.throwIfAborted();
    await openGame(() => { active = false; }, invitedPeerId, controller.signal);
  } catch (error) {
    active = false;
    if (!controller.signal.aborted) console.warn('Rymdskeppet kunde inte starta.', error);
  } finally {
    window.removeEventListener('keydown', cancel);
  }
}

document.addEventListener('keydown', event => {
  if (active || event.repeat || event.ctrlKey || event.metaKey || event.altKey
    || event.target.closest('input, textarea, select, [contenteditable]')) return;
  const now = performance.now();
  if (now - lastKeyTime > 2000) entered = [];
  lastKeyTime = now;
  entered.push(event.code);
  while (!entered.every((code, index) => code === sequence[index])) entered.shift();
  // Once ↑ ↑ is followed by the next code key, keep the page still.
  if (entered.length >= 3) event.preventDefault();
  if (entered.join(',') === sequence.join(',')) {
    event.preventDefault();
    reveal();
  }
});

document.querySelector('.brand')?.addEventListener('click', event => {
  // A normal logo click still takes visitors home from other pages.
  if (location.pathname !== '/' || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  // Preserve the normal homepage-logo action while counting secret clicks.
  window.scrollTo({ top: 0, behavior: 'instant' });
  const now = performance.now();
  clicks = clicks.filter(time => now - time < 2200);
  clicks.push(now);
  if (clicks.length >= 5) reveal();
});

// Reading a link is cheap; the game and PeerJS are still loaded on demand.
function invitationFromHash() {
  const id = new URLSearchParams(location.hash.slice(1)).get('space');
  if (!/^athega-space-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id || '')) return;
  if (!active && location.pathname !== '/') {
    location.replace('/' + location.hash);
    return;
  }
  history.replaceState(history.state, '', location.pathname + location.search);
  if (active) window.dispatchEvent(new CustomEvent('athega-space-invite', { detail: id }));
  else reveal(id);
}
window.addEventListener('hashchange', invitationFromHash);
invitationFromHash();
