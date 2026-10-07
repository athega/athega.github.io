import { targetStrength, damageEdge } from './targets.js?v=10';
import { ROUND_SECONDS, roundWinners, clockLabel } from './round.js?v=9';
import { createArena, cameraFor, WORLD_WIDTH, WORLD_HEIGHT } from './arena.js?v=7';
import { POWERUPS, damageHull, expandedRect, effectSeconds, advanceScroll, shipContact } from './combat.js?v=8';
import { hitsRect } from './physics.js?v=3';
import { createSound } from './sound.js?v=10';
import { internalDestination } from './navigation.js?v=3';
import { createMultiplayer, MAX_PLAYERS, pilotName } from './multiplayer.js?v=10';
import { invitationLink, invitationPeer } from './invitation.js?v=7';
import { hitReward, sectorReward } from './scoring.js?v=3';

export async function openGame(onClose, invitedPeerId = null) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const previousFocus = document.activeElement;
  const originalUrl = location.href;
  const arena = await createArena(originalUrl);
  const arenaDocument = arena.document;
  const arenaWindow = arena.window;
  let camera = cameraFor(innerWidth, innerHeight, { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT * 0.62 });
  let currentUrl = originalUrl;
  let loadingPage = false;
  let pageChanged = false;
  let network = null;
  const ghosts = new Map();
  let networkTime = 0;
  let messageQueue = Promise.resolve();
  let connectionAttempt = 0;
  const pendingHits = new Set();
  const initialScroll = { x: scrollX, y: scrollY };
  const controller = new AbortController();
  const listen = (node, event, handler, options = {}) => node.addEventListener(event, handler, { ...options, signal: controller.signal });
  const sound = createSound();
  const host = document.createElement('div');
  host.id = 'athega-space-game';
  // Keep the overlay out of document flow even while its lazy CSS is loading.
  host.style.cssText = 'position:fixed;inset:0;overflow:hidden;z-index:2147483647';
  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `
    <link rel="stylesheet" href="${new URL('./game.css?v=10', import.meta.url).href}">
    <div role="dialog" aria-modal="true" aria-label="Athega Space – hemligt arkadspel">
      <canvas class="world-canvas" aria-hidden="true"></canvas><div class="offscreen-pilots" aria-hidden="true"></div><div class="radar" hidden><canvas width="128" height="80" aria-label="Radar över piloterna"></canvas><span>RADAR</span></div>
      <div class="hud">
        <div class="scoreboard"><span class="kicker">Athega / Space</span><output class="score" aria-label="Poäng">00000</output><span class="round-clock">2:00</span><span class="kill-count">0 kills · 0 dödsfall</span><span class="pace">×1 · 0.0 s</span><span class="connection-status" aria-live="polite">Soloflygning</span><ul class="pilot-list" aria-label="Piloter"></ul><span class="hull-status" aria-live="polite">Skrov 100</span><span class="gravity-status" role="status" hidden></span><span class="power-status" aria-live="polite">Redo</span></div>
        <div class="actions"><button class="multiplayer">Spela tillsammans</button><button class="menu-toggle" hidden aria-expanded="false">Meny</button><button class="theme" aria-pressed="true" aria-label="Mörkt spelläge">Mörkt</button><button class="sound" aria-pressed="true" aria-label="Ljud på">Ljud på</button><button class="exit">Avsluta ×</button></div>
      </div>
      <div class="play-ui" hidden>
        <p class="hint">← → / A D: rotera · ↑ / W: gas · Mellanslag: skjut · N: navigera · Esc: avsluta</p>
        <div class="bottom"><button class="scroll-toggle" aria-pressed="false">Pausa scroll</button><button class="missions-open">Byt uppdrag</button></div>
        <div class="touch stick" role="group" aria-label="Dra för att styra skeppet"><span>STYR</span></div>
        <button class="touch navigate" aria-label="Håll för navigationsskott">NAV</button>
        <button class="touch fire" aria-label="Håll för att skjuta">ELD</button>
      </div>
      <div class="briefing"><div class="panel">
        <span class="kicker">Hemligt uppdrag / 001</span>
        <h1>Vi gillar att<br>bryta ny mark.</h1>
        <p>Men du får börja med den här sidan. Ta kontroll över skeppet och skjut layouten i småbitar.</p>
        <p class="instructions">Dator: piltangenter eller W A S D + mellanslag.<br>N: navigationsskott – träffa en intern länk.<br>Mobil: styrspak, ELD och NAV.<br>Powerups: 3X trippelskott · RF snabbeld · SK sköld · + reparation · T turbo · G↓ gravitation · S↕ snabbscroll för alla.<br>Täta träffar ger upp till ×5. Rensa sidan snabbt för tidsbonus.<br>Esc eller Avsluta återställer allt.</p>
        <button class="primary launch">Starta motorerna</button>
      </div></div>
      <div class="lobby" hidden><div class="panel">
        <span class="kicker">Besättning / upp till fyra</span><h2>Flyg tillsammans</h2>
        <p class="lobby-intro">Skapa ett rum och bjud in med en länk.</p>
        <label class="name-label">Pilotnamn <span>(valfritt)</span><input class="pilot-name" maxlength="20" autocomplete="off" placeholder="Ditt anropsnamn"></label>
        <section class="crew" hidden aria-label="Besättning"><h3>Besättning <span class="crew-count"></span></h3><ul class="crew-list" aria-live="polite"></ul></section>
        <details class="rules"><summary>Spelregler <span>Värden bestämmer</span></summary>
          <label class="rule"><input class="friendly-fire" type="checkbox"><span>Friendly fire<small>Kompisarnas skott ger skada.</small></span></label>
          <label class="rule"><input class="collisions" type="checkbox"><span>Kollisionsskador<small>Krockar med sidan och andra skepp ger skada.</small></span></label>
          <p>100 skrov. Nytt skepp efter 3 sekunder. G↓ och S↕ påverkar hela rummet i 8 sekunder.</p>
        </details>
        <button class="primary host-game">Skapa rum</button>
        <button class="primary join-game" hidden>Anslut till rummet</button>
        <button class="primary start-room" hidden>Starta spelet</button>
        <div class="invitation" hidden>
          <input class="outgoing-link" readonly aria-label="Din inbjudningslänk">
          <button class="primary copy-link">Kopiera inbjudningslänk</button>
          <p class="local-invite" hidden>Lokal testadress: länken fungerar bara på den här datorn.</p>
        </div>
        <details class="join-manually"><summary>Har du redan en länk?</summary>
          <label>Inbjudningslänk<input class="incoming-link" type="url" spellcheck="false" autocomplete="off" placeholder="Klistra in länken"></label>
          <button class="use-invitation">Öppna inbjudan</button>
        </details>
        <p class="lobby-status" role="status"></p>
        <div class="lobby-actions"><button class="lobby-close">Till spelet</button><button class="disconnect" hidden>Lämna rummet</button></div>
      </div></div>
      <div class="results" hidden><div class="panel">
        <span class="kicker">120 sekunder / rondresultat</span><h2 class="result-title">Ronden är klar</h2>
        <ol class="result-list"></ol>
        <button class="primary rematch">Till lobbyn för ny rond</button>
        <p class="result-wait" hidden>Väntar på värden för nästa rond.</p>
        <button class="result-exit">Avsluta spelet</button>
      </div></div>
      <div class="missions" hidden><div class="panel">
        <span class="kicker">Nästa destination</span><h2>Välj ett nytt uppdrag</h2>
        <p>Du kan alltid resa vidare, även när hela sidan är borta.</p>
        <label>Sida<select class="mission-select"></select></label>
        <button class="primary mission-go">Flyg dit</button><button class="missions-close">Till spelet</button>
      </div></div>
    </div>`;
  let dark = true;
  const themeStyle = document.createElement('style');
  themeStyle.textContent = `
    body[data-space-dark] { --paper: #111b26; --ink: #e5edf5; --muted: #b2c0ce; --line: #344452; --line-strong: #536b80; --neutral: #1b2a39; --on-dark-muted: #c5d3e1; background: radial-gradient(ellipse at 80% 15%, #163a5366, transparent 55%), radial-gradient(ellipse at 10% 80%, #37205255, transparent 60%), #050b14; background-attachment: fixed; color: var(--ink); }
    body[data-space-dark] .site-header { background: #0d1620ed; border-color: #344452; }
    body[data-space-dark] .page-hero { background: transparent; }
    body[data-space-dark] :is(.dark-section, .unified-callout, .article-body pre) { background: #080f17; }
  `;
  arenaDocument.head.append(themeStyle);
  arenaDocument.body.toggleAttribute('data-space-dark', dark);
  const inertStates = [...document.body.children].filter(node => node !== arena.container).map(node => [node, node.inert]);
  inertStates.forEach(([node]) => { node.inert = true; });
  document.body.append(host);
  const find = selector => shadow.querySelector(selector);
  function setText(selector, text) {
    const node = find(selector);
    if (node.textContent !== text) node.textContent = text;
  }
  const nameInput = find('.pilot-name');
  const nameStorageKey = 'athega-space-pilot-name';
  try { nameInput.value = pilotName(localStorage.getItem(nameStorageKey)); } catch { /* Storage may be disabled. */ }
  listen(nameInput, 'input', () => {
    try {
      const name = pilotName(nameInput.value);
      if (name) localStorage.setItem(nameStorageKey, name);
      else localStorage.removeItem(nameStorageKey);
    } catch { /* The game also works without persistent storage. */ }
  });
  const canvas = find('.world-canvas');
  const radar = find('.radar canvas');
  const radarContext = radar.getContext('2d');
  const markers = new Map();
  const context = canvas.getContext('2d');
  const launchButton = find('.launch');
  const scoreOutput = find('.score');
  const colors = ['#ff6600', '#56dfff', '#ee91ff', '#b2ef5e'];
  function playerColor(id = network?.playerId) {
    const index = network?.playerIds.indexOf(id) ?? -1;
    return colors[Math.max(0, index) % colors.length];
  }
  const hint = find('.hint');
  const stick = find('.stick');
  let mobileMenu = arenaDocument.querySelector('.mobile-menu');
  let menuWasOpen = mobileMenu?.open;
  const destroyed = new Map();
  const targetHealth = new Map();
  const damageStyles = new Map();
  const keys = new Set();
  const shots = [];
  let shotSequence = 0;
  const flightShots = new Map();
  const impacts = [];
  let hitFlash = 0;
  const particles = [];
  const rings = [];
  const stars = Array.from({ length: reducedMotion ? 60 : 130 }, () => ({ x: Math.random(), y: Math.random(), depth: 0.3 + Math.random() * 0.7, phase: Math.random() * Math.PI * 2 }));
  const pickups = [];
  const animations = new Set();
  const powers = { triple: 0, rapid: 0, shield: 0, turbo: 0 };
  const rules = { friendlyFire: false, collisions: false };
  let lobbyMode = invitedPeerId ? 'invited' : 'idle';
  let roomStarted = false;
  let roundSerial = 0;
  let roundDeadline = 0;
  let roundEnded = false;
  let roundRemaining = ROUND_SECONDS;
  let lastRoundSecond = -1;
  let deathSequence = 0;
  const roundStats = new Map();
  const pendingDamage = new Map();
  const collisionTimes = new Map();
  let hull = 100;
  let invulnerable = 3;
  let respawn = 0;
  const roomEffects = { gravity: { until: 0, revision: 0 }, scroll: { until: 0, revision: 0 } };
  const effectClaims = new Set();
  let scrollPaused = false;
  let scrollDirection = 1;
  let scrollPosition = arenaWindow.scrollY;
  let lastWrittenScroll = arenaWindow.scrollY;
  let remoteScroll = null;
  let scrollNetworkTime = 0;
  let pageCleared = false;
  let checkMissionClear = true;
  let missionElapsed = 0;
  let gameTime = 0;
  let lastHitTime = -Infinity;
  let combo = 1;
  const labels = [];
  let lastPowerLabel = '';
  const joystick = { active: false, x: 0, y: 0 };
  const ship = { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT * 0.62, vx: 0, vy: 0, angle: -Math.PI / 2 };
  const width = WORLD_WIDTH;
  const height = WORLD_HEIGHT;
  let running = false;
  let closed = false;
  let frame;
  let lastTime = 0;
  let cooldown = 0;
  let score = 0;
  let soundEnabled = true;
  scoreOutput.textContent = String(score).padStart(5, '0');
  let holdingFire = false;
  let holdingNavigation = false;
  let linkRects = [];
  let targetRects = [];
  let targetsDirty = true;

  // Keep the page geometry intact: hide only hit elements, never remove DOM nodes.
  const targetSelector = 'h1, h2, h3, h4, p, li, img, a, summary';
  function collectTargets() {
    return [...arenaDocument.querySelectorAll('header.site-header, main, footer')].flatMap(root => [...root.querySelectorAll(targetSelector)])
    .filter(node => !node.querySelector('h1, h2, h3, h4, p, li, img')
      && !(node.matches('a, summary') && node.closest('p, h1, h2, h3, h4, li'))
      && !node.closest('pre, code, [hidden]'));
  }
  let targets = collectTargets();


  function isDestroyed(node) {
    for (let current = node; current; current = current.parentElement) {
      if (destroyed.has(current)) return true;
    }
    return false;
  }

  function resize() {
    host.style.setProperty('--space-header-bottom', '0px');
    find('.menu-toggle').hidden = !mobileMenu?.checkVisibility();
    const scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * scale;
    canvas.height = height * scale;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    updateCamera();
    ship.x = Math.min(ship.x, width - 20);
    ship.y = Math.min(ship.y, height - 20);
    targetsDirty = true;
  }

  function updateTargets() {
    targetRects = targets.filter(node => !isDestroyed(node) && node.checkVisibility({ visibilityProperty: true, opacityProperty: true })).flatMap(node => {
      // Text ranges follow actual lines, so shots can pass through empty margins.
      const range = arenaDocument.createRange();
      range.selectNodeContents(node);
      let rects = node.tagName === 'IMG' ? [node.getBoundingClientRect()] : [...range.getClientRects()];
      if (targetHealth.has(node)) {
        const bounds = node.getBoundingClientRect();
        const edge = bounds.left + bounds.width * damageEdge(targetHealth.get(node), targetStrength(node.tagName)) / 100;
        rects = rects.map(rect => ({ left: rect.left, right: Math.min(rect.right, edge), top: rect.top, bottom: rect.bottom, width: Math.min(rect.right, edge) - rect.left, height: rect.height }));
      }
      return rects.filter(rect => rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < height)
        .map(rect => ({ node, rect }));
    });
    linkRects = [...arenaDocument.querySelectorAll('header.site-header a[href], main a[href], footer a[href]')]
      .filter(node => !node.hasAttribute('download') && !isDestroyed(node) && node.checkVisibility({ visibilityProperty: true, opacityProperty: true }))
      .flatMap(node => {
        const destination = internalDestination(node.href, currentUrl);
        if (!destination) return [];
        return [...node.getClientRects()].filter(rect => rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < height)
          .map(rect => ({ node, rect, destination }));
      });
    targetsDirty = false;
  }

  function close(reloadPage = true) {
    if (closed) return;
    closed = true;
    cancelAnimationFrame(frame);
    clearInterval(roundTimer);
    controller.abort();
    sound.close();
    themeStyle.remove();
    arena.close();
    animations.forEach(animation => animation.cancel());
    destroyed.forEach((original, node) => {
      if (original.value) node.style.setProperty('visibility', original.value, original.priority);
      else node.style.removeProperty('visibility');
      if (!original.hadStyle && !node.getAttribute('style')) node.removeAttribute('style');
    });
    inertStates.forEach(([node, wasInert]) => { node.inert = wasInert; });
    if (mobileMenu) mobileMenu.open = menuWasOpen;
    host.remove();
    window.scrollTo({ left: initialScroll.x, top: initialScroll.y, behavior: 'instant' });
    previousFocus?.focus({ preventScroll: true });
    network?.close();
    onClose();
    if (pageChanged && reloadPage) location.reload();
  }

  function burst(x, y, rect) {
    const count = reducedMotion ? 8 : 38;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 45 + Math.random() * 240;
      particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 0.4 + Math.random() * 0.45, max: 0.85, size: 2 + Math.random() * 4, color: i % 3 ? '#ff6600' : '#151e27' });
    }
    if (!reducedMotion) rings.push({ x, y, life: 0.4, rect });
    // Bound memory and draw work even when the fire button is held down.
    if (particles.length > 300) particles.splice(0, particles.length - 300);
  }

  function rememberTarget(node) {
    destroyed.set(node, { value: node.style.getPropertyValue('visibility'), priority: node.style.getPropertyPriority('visibility'), hadStyle: node.hasAttribute('style') });
  }

  function applyTargetDamage(node, remaining, x, y, animate = true) {
    const maximum = targetStrength(node.tagName);
    if (!Number.isInteger(remaining) || remaining <= 0 || remaining >= maximum) return;
    if (!damageStyles.has(node)) {
      damageStyles.set(node, ['clip-path', 'opacity'].map(property => [property, node.style.getPropertyValue(property), node.style.getPropertyPriority(property)]));
    }
    targetHealth.set(node, remaining);
    const edge = damageEdge(remaining, maximum);
    node.style.setProperty('clip-path', `polygon(0 0, ${edge}% 0, ${edge - 5}% 18%, ${edge + 1}% 31%, ${edge - 8}% 44%, ${edge}% 60%, ${edge - 4}% 77%, ${edge}% 100%, 0 100%)`);
    node.style.setProperty('opacity', String(0.65 + 0.35 * remaining / maximum));
    pendingHits.delete(node);
    targetsDirty = true;
    if (!animate) return;
    labels.push({ x, y, text: `${remaining}/${maximum}`, life: 0.65 });
    for (let i = 0; i < (reducedMotion ? 3 : 12); i++) {
      particles.push({ x, y, vx: (Math.random() - 0.5) * 220, vy: -50 - Math.random() * 150, life: 0.45, max: 0.45, size: 2 + Math.random() * 3, color: '#ffae77' });
    }
    sound.chip();
  }

  function restoreTargetDamage() {
    for (const [node, styles] of damageStyles) {
      for (const [property, value, priority] of styles) {
        if (value) node.style.setProperty(property, value, priority);
        else node.style.removeProperty(property);
      }
    }
    damageStyles.clear();
    targetHealth.clear();
  }

  function destroy(target, x, y, remote = null) {
    const node = target.node;
    if (destroyed.has(node)) return;
    if (network?.connected && !network.isHost && !remote) {
      if (!pendingHits.has(node)) network.send({ type: 'hit', id: targets.indexOf(node), page: currentUrl });
      pendingHits.add(node);
      return;
    }
    pendingHits.delete(node);
    const remaining = (targetHealth.get(node) ?? targetStrength(node.tagName)) - 1;
    if (!remote && remaining > 0) {
      applyTargetDamage(node, remaining, x, y);
      network?.send({ type: 'target-damage', page: currentUrl, id: targets.indexOf(node), remaining });
      return;
    }
    rememberTarget(node);
    checkMissionClear = true;
    const animation = node.animate(reducedMotion ? [
      { opacity: arenaWindow.getComputedStyle(node).opacity }, { opacity: 0 },
    ] : [
      { opacity: arenaWindow.getComputedStyle(node).opacity, transform: 'translate(0, 0) rotate(0) scale(1)', filter: 'blur(0)' },
      { opacity: 0.8, transform: 'translate(0, -8px) rotate(-2deg) scale(1.025)', offset: 0.2 },
      { opacity: 0, transform: `translate(${(Math.random() - 0.5) * 80}px, 35px) rotate(${(Math.random() - 0.5) * 24}deg) scale(.15)`, filter: 'blur(3px)' },
    ], { duration: reducedMotion ? 120 : 420, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' });
    animations.add(animation);
    animation.finished.then(() => {
      if (!closed) node.style.setProperty('visibility', 'hidden', 'important');
      animation.cancel();
      animations.delete(animation);
    }).catch(() => {});
    const reward = remote || hitReward(node.tagName === 'IMG' ? 250 : 100, lastHitTime, gameTime, combo);
    combo = reward.combo;
    lastHitTime = gameTime;
    score = remote ? remote.score : score + reward.points;
    labels.push({ x, y, text: `+${reward.points}${combo > 1 ? ` ×${combo}` : ''}`, life: 1 });
    scoreOutput.textContent = String(score).padStart(5, '0');
    burst(x, y, target.rect);
    sound.explode();
    targetsDirty = true;
    if (network?.connected && network.isHost) network.send({ type: 'destroy', page: currentUrl, id: targets.indexOf(node), score, points: reward.points, combo });
    if (destroyed.size % 3 === 0) {
      const kinds = Object.keys(POWERUPS);
      const kind = kinds[(destroyed.size / 3 - 1) % kinds.length];
      pickups.push({ x: Math.max(24, Math.min(width - 24, x)), y: Math.max(100, Math.min(height - 100, y)), kind, id: targets.indexOf(node), life: 18 });
      if (pickups.length > 6) pickups.shift();
    }
  }

  async function navigateTo(target, fromPeer = false) {
    const destination = target.destination;
    if (loadingPage) return;
    if (network?.connected && !network.isHost && !fromPeer) {
      network.send({ type: 'navigate', url: destination.href, page: currentUrl });
      return;
    }
    if (destination.pathname === new URL(currentUrl).pathname && destination.search === new URL(currentUrl).search) {
      let anchor;
      try { anchor = arenaDocument.getElementById(decodeURIComponent(destination.hash.slice(1))); } catch { /* Ignore invalid fragments. */ }
      if (anchor) anchor.scrollIntoView({ behavior: 'instant', block: 'start' });
      else if (!destination.hash) arenaWindow.scrollTo({ top: 0, behavior: 'instant' });
      targetsDirty = true;
      return;
    }
    loadingPage = true;
    resetControls();
    hint.textContent = 'Hoppar till nästa uppdrag…';
    try {
      const response = await fetch(destination.href, { signal: controller.signal });
      if (!response.ok || !internalDestination(response.url, currentUrl)) throw new Error('Sidan gick inte att hämta.');
      const nextDocument = new DOMParser().parseFromString(await response.text(), 'text/html');
      if (!nextDocument.querySelector('main')) throw new Error('Den sidan saknar ett spelområde.');
      if (closed) return;
      animations.forEach(animation => animation.cancel());
      animations.clear();
      arenaDocument.body.replaceChildren();
      currentUrl = response.url;
      history.pushState(null, '', currentUrl);
      pageChanged = true;
      const pageNodes = [...nextDocument.body.children].filter(node => !['SCRIPT', 'STYLE'].includes(node.tagName));
      for (const node of pageNodes) {
        const imported = arenaDocument.importNode(node, true);
        imported.querySelectorAll('script').forEach(script => script.remove());
        arenaDocument.body.append(imported);
      }
      arenaDocument.querySelector('base')?.setAttribute('href', currentUrl);
      flightShots.clear();
      targetHealth.clear();
      damageStyles.clear();
      impacts.length = 0;
      destroyed.clear();
      pendingHits.clear();
      shots.length = particles.length = rings.length = pickups.length = labels.length = 0;
      mobileMenu = arenaDocument.querySelector('.mobile-menu');
      menuWasOpen = mobileMenu?.open;
      targets = collectTargets();
      arenaWindow.scrollTo({ top: 0, behavior: 'instant' });
      resize();
      pageCleared = false;
      checkMissionClear = true;
      missionElapsed = 0;
      scrollDirection = 1;
      scrollPosition = lastWrittenScroll = arenaWindow.scrollY;
      remoteScroll = null;
      ship.x = Math.min(width - 24, width / 2 + (network?.connected ? 48 * network.playerIds.indexOf(network.playerId) : 0));
      ship.y = height * 0.62;
      ship.vx = ship.vy = 0;
      invulnerable = 3;
      effectClaims.clear();
      hint.textContent = 'Nytt uppdrag! Fortsätt röja tillsammans.';
      if (!fromPeer) broadcastState();
    } catch (error) {
      if (!closed) hint.textContent = 'Kunde inte öppna sidan. Du kan fortsätta här och prova igen.';
    } finally {
      loadingPage = false;
    }
  }

  function fire(kind = 'destroy') {
    if (respawn > 0 || roundEnded || (network?.connected && !roomStarted)) return;
    const dx = Math.cos(ship.angle);
    const dy = Math.sin(ship.angle);
    const salvo = ++shotSequence;
    const owner = network?.playerId || 'solo';
    const angles = kind === 'destroy' && powers.triple > 0 ? [-0.17, 0, 0.17] : [0];
    for (const [index, offset] of angles.entries()) {
      const angle = ship.angle + offset;
      const id = `${owner}:${salvo}:${index}`;
      flightShots.set(id, { owner, expires: performance.now() + 2000, kind });
      shots.push({ id, kind, x: ship.x + dx * 19, y: ship.y + dy * 19, vx: Math.cos(angle) * 750 + ship.vx, vy: Math.sin(angle) * 750 + ship.vy, life: 1.3 });
    }
    sound.shoot();
    network?.send({ type: 'shot', id: salvo, page: currentUrl, x: ship.x / width, y: ship.y / height, angle: ship.angle, kind, triple: powers.triple > 0 });
    cooldown = kind === 'destroy' && powers.rapid > 0 ? 0.075 : 0.16;
  }

  function resetControls() {
    keys.clear();
    holdingFire = false;
    holdingNavigation = false;
    joystick.active = false;
    stick.style.removeProperty('--stick-x');
    stick.style.removeProperty('--stick-y');
    sound.thrust(false);
  }

  function tick(now) {
    if (closed || !running) return;
    frame = requestAnimationFrame(tick);
    const dt = Math.min((now - lastTime) / 1000 || 0, 0.035);
    lastTime = now;
    for (const [id, flight] of flightShots) if (flight.expires < now) flightShots.delete(id);
    if (!document.hidden) updateCamera();
    for (const effect of Object.values(roomEffects)) {
      if (effect.announced && performance.now() >= effect.until) { effect.announced = false; sound.effectEnded(); }
    }
    if (roundEnded || (roundDeadline > 0 && performance.now() >= roundDeadline) || document.hidden || loadingPage || !find('.lobby').hidden || !find('.missions').hidden) return;
    gameTime += dt;
    missionElapsed += dt;
    updateScroll(dt);
    if (gameTime - lastHitTime > 2) combo = 1;
    find('.pace').textContent = `×${combo} · ${missionElapsed.toFixed(1)} s`;
    if (targetsDirty) updateTargets();
    for (const kind of Object.keys(powers)) powers[kind] = Math.max(0, powers[kind] - dt);
    invulnerable = Math.max(0, invulnerable - dt);
    hitFlash = Math.max(0, hitFlash - dt);
    if (respawn > 0) {
      respawn = Math.max(0, respawn - dt);
      if (!respawn) {
        hull = 100;
        invulnerable = 3;
        ship.x = width / 2;
        ship.y = height * 0.62;
        sound.launch();
      }
    }
    setText('.hull-status', respawn > 0 ? `Nytt skepp om ${Math.ceil(respawn)}s` : `Skrov ${hull}${powers.shield > 0 ? ' · skyddat' : ''}`);
    const gravity = effectTime('gravity');
    find('.gravity-status').hidden = gravity <= 0;
    setText('.gravity-status', `↓ GRAVITATION ${Math.ceil(gravity)}s`);
    const powerLabel = Object.entries(powers).filter(([, time]) => time > 0).map(([kind, time]) => `${POWERUPS[kind].label} ${Math.ceil(time)}s`).join(' · ') || 'Powerups —';
    if (powerLabel !== lastPowerLabel) {
      find('.power-status').textContent = powerLabel;
      lastPowerLabel = powerLabel;
    }
    if (checkMissionClear && !pageCleared && (!network?.connected || network.isHost)) {
      checkMissionClear = false;
      const remaining = targets.filter(node => !node.closest('.site-header') && !isDestroyed(node)
        && node.checkVisibility({ visibilityProperty: true, opacityProperty: true }));
      if (!remaining.length && destroyed.size > 0) {
        pageCleared = true;
        const bonus = sectorReward(destroyed.size, missionElapsed);
        score += bonus;
        scoreOutput.textContent = String(score).padStart(5, '0');
        hint.textContent = `SIDAN RENSAD +${bonus} · Välj nästa uppdrag!`;
        sound.launch();
        broadcastState();
        showMissions();
      }
    }
    let thrust = keys.has('ArrowUp') || keys.has('KeyW');
    if (joystick.active) {
      const amount = Math.hypot(joystick.x, joystick.y);
      if (amount > 8) ship.angle = Math.atan2(joystick.y, joystick.x);
      thrust = amount > 12;
    } else {
      const turn = Number(keys.has('ArrowRight') || keys.has('KeyD')) - Number(keys.has('ArrowLeft') || keys.has('KeyA'));
      ship.angle += turn * 4.2 * dt;
    }
    if (respawn > 0) thrust = false;
    if (thrust) {
      const acceleration = powers.turbo > 0 ? 650 : 380;
      ship.vx += Math.cos(ship.angle) * acceleration * dt;
      ship.vy += Math.sin(ship.angle) * acceleration * dt;
      if (!reducedMotion) particles.push({ x: ship.x - Math.cos(ship.angle) * 12, y: ship.y - Math.sin(ship.angle) * 12, vx: -Math.cos(ship.angle) * 90 + (Math.random() - 0.5) * 40, vy: -Math.sin(ship.angle) * 90 + (Math.random() - 0.5) * 40, life: 0.23, max: 0.23, size: 3, color: '#ff6600' });
    }
    sound.thrust(thrust);
    const brake = keys.has('ArrowDown') || keys.has('KeyS');
    const friction = Math.exp(-(brake ? 5 : 0.7) * dt);
    ship.vx *= friction;
    ship.vy *= friction;
    if (gravity > 0 && respawn <= 0) ship.vy += 260 * dt;
    const speed = Math.hypot(ship.vx, ship.vy);
    const maxSpeed = powers.turbo > 0 ? 550 : 360;
    if (speed > maxSpeed) { ship.vx *= maxSpeed / speed; ship.vy *= maxSpeed / speed; }
    const oldX = ship.x;
    const oldY = ship.y;
    ship.x = (ship.x + ship.vx * dt + width) % width;
    ship.y = (ship.y + ship.vy * dt + height) % height;
    if (rules.collisions && respawn <= 0 && invulnerable <= 0) {
      const wrapped = Math.abs(ship.x - oldX) > width / 2 || Math.abs(ship.y - oldY) > height / 2;
      const obstacle = targetRects.find(({ node, rect }) => !isDestroyed(node)
        && hitsRect(wrapped ? ship.x : oldX, wrapped ? ship.y : oldY, ship.x, ship.y, expandedRect(rect, 10)));
      if (obstacle) {
        takeDamage(25);
        ship.x = oldX;
        ship.y = oldY;
        ship.vx *= -0.65;
        ship.vy *= -0.65;
        invulnerable = Math.max(invulnerable, 0.8);
      }
    }
    if (rules.collisions && respawn <= 0) {
      for (const [id, other] of ghosts) {
        if (other.hull === 0) continue;
        const contact = shipContact(ship, { x: other.targetX, y: other.targetY }, network.playerId < id ? -1 : 1);
        if (!contact) continue;
        ship.x = Math.max(16, Math.min(width - 16, ship.x + contact.nx * (contact.overlap + 2)));
        ship.y = Math.max(16, Math.min(height - 16, ship.y + contact.ny * (contact.overlap + 2)));
        const approaching = ship.vx * contact.nx + ship.vy * contact.ny;
        if (approaching < 80) {
          ship.vx += contact.nx * (100 - approaching);
          ship.vy += contact.ny * (100 - approaching);
        }
        if (network.isHost) routeCollision(network.playerId, id);
        else network.send({ type: 'collision-request', page: currentUrl, other: id, round: roundSerial });
      }
    }
    updateCamera();
    cooldown -= dt;
    if (cooldown <= 0 && respawn <= 0) {
      if (keys.has('KeyN') || holdingNavigation) fire('navigate');
      else if (keys.has('Space') || holdingFire) fire();
    }
    context.clearRect(0, 0, width, height);
    if (dark) {
      for (const star of stars) {
        if (!reducedMotion) {
          star.x = (star.x - ship.vx * dt * star.depth / width * 0.025 + 1) % 1;
          star.y = (star.y - ship.vy * dt * star.depth / height * 0.025 + 1) % 1;
        }
        context.globalAlpha = reducedMotion ? 0.4 : 0.25 + (Math.sin(now / 1800 + star.phase) + 1) * 0.15;
        context.fillStyle = '#cbe8ff';
        context.fillRect(star.x * width, star.y * height, star.depth * 1.8, star.depth * 1.8);
      }
      context.globalAlpha = 1;
    }
    for (let i = shots.length - 1; i >= 0; i--) {
      const shot = shots[i];
      const x = shot.x + shot.vx * dt;
      const y = shot.y + shot.vy * dt;
      const candidates = shot.kind === 'navigate' ? (shot.remote ? [] : linkRects) : targetRects;
      if (!shot.remote && shot.kind === 'destroy' && rules.friendlyFire && network?.connected) {
        const pilot = [...ghosts.entries()].find(([, craft]) => craft.hull !== 0
          && hitsRect(shot.x, shot.y, x, y, { left: craft.targetX - 13, right: craft.targetX + 13, top: craft.targetY - 13, bottom: craft.targetY + 13 }));
        if (pilot) {
          if (network.isHost) routePilotHit(pilot[0], shot.id, network.playerId);
          else network.send({ type: 'pilot-hit', page: currentUrl, target: pilot[0], shotId: shot.id });
          shots.splice(i, 1);
          continue;
        }
      }
      const hit = candidates.find(target => !isDestroyed(target.node) && hitsRect(shot.x, shot.y, x, y, target.rect));
      shot.life -= dt;
      if (hit) {
        if (shot.remote) { shots.splice(i, 1); continue; }
        if (shot.kind === 'navigate') {
          shots.splice(i, 1);
          navigateTo(hit);
          if (loadingPage) return;
          continue;
        }
        destroy(hit, Math.max(hit.rect.left, Math.min(x, hit.rect.right)), Math.max(hit.rect.top, Math.min(y, hit.rect.bottom)));
        shots.splice(i, 1);
        continue;
      }
      if (shot.life <= 0 || x < 0 || x > width || y < 0 || y > height) { shots.splice(i, 1); continue; }
      context.beginPath();
      context.moveTo(shot.x, shot.y);
      context.lineTo(x, y);
      context.strokeStyle = shot.kind === 'navigate' ? '#00b7dd' : shot.color || playerColor();
      context.lineWidth = shot.kind === 'navigate' ? 5 : 3;
      context.shadowColor = shot.kind === 'navigate' ? '#00d4ff' : '#ff6600';
      context.shadowBlur = reducedMotion ? 0 : 10;
      context.stroke();
      context.shadowBlur = 0;
      shot.x = x;
      shot.y = y;
    }
    for (let i = impacts.length - 1; i >= 0; i--) {
      const impact = impacts[i];
      impact.life -= dt;
      if (impact.life <= 0) { impacts.splice(i, 1); continue; }
      context.save();
      context.translate(impact.x, impact.y);
      context.strokeStyle = impact.blocked ? '#64e9ce' : '#ffdf8e';
      context.globalAlpha = Math.min(1, impact.life * 3);
      context.lineWidth = 3;
      context.beginPath();
      const radius = reducedMotion ? 24 : 18 + (0.45 - impact.life) * 65;
      context.arc(0, 0, radius, 0, Math.PI * 2);
      context.stroke();
      for (let ray = 0; ray < 6; ray++) {
        const angle = ray * Math.PI / 3;
        context.beginPath();
        context.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        context.lineTo(Math.cos(angle) * (radius + 10), Math.sin(angle) * (radius + 10));
        context.stroke();
      }
      context.restore();
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      particle.life -= dt;
      if (particle.life <= 0) { particles.splice(i, 1); continue; }
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += 70 * dt;
      context.globalAlpha = Math.min(1, particle.life / particle.max);
      context.fillStyle = particle.color;
      context.fillRect(particle.x, particle.y, particle.size, particle.size);
    }
    context.globalAlpha = 1;
    for (let i = rings.length - 1; i >= 0; i--) {
      const ring = rings[i];
      ring.life -= dt;
      if (ring.life <= 0) { rings.splice(i, 1); continue; }
      context.strokeStyle = `rgba(255,102,0,${ring.life / 0.4})`;
      context.lineWidth = 1;
      context.beginPath();
      context.arc(ring.x, ring.y, (0.4 - ring.life) * 130, 0, Math.PI * 2);
      context.stroke();
      context.strokeRect(ring.rect.left, ring.rect.top, ring.rect.width, ring.rect.height);
    }
    if (keys.has('KeyN') || holdingNavigation) {
      context.strokeStyle = '#007b9b';
      context.lineWidth = 1;
      context.setLineDash([4, 4]);
      linkRects.forEach(({ rect }) => context.strokeRect(rect.left, rect.top, rect.width, rect.height));
      context.setLineDash([]);
    }
    for (let i = pickups.length - 1; i >= 0; i--) {
      const pickup = pickups[i];
      pickup.life -= dt;
      const dx = ship.x - pickup.x;
      const dy = ship.y - pickup.y;
      const distance = Math.hypot(dx, dy);
      if (respawn <= 0 && distance < 130) { pickup.x += dx * dt * 2.8; pickup.y += dy * dt * 2.8; }
      if (respawn <= 0 && distance < 28) {
        collectPowerup(pickup);
        pickups.splice(i, 1);
        continue;
      }
      if (pickup.life <= 0) { pickups.splice(i, 1); continue; }
      context.save();
      context.translate(pickup.x, pickup.y);
      context.rotate(reducedMotion ? Math.PI / 4 : Math.PI / 4 + Math.sin(now / 400) * 0.1);
      context.fillStyle = '#122934';
      context.strokeStyle = '#64e9ce';
      context.lineWidth = 2;
      context.shadowColor = '#64e9ce';
      context.shadowBlur = reducedMotion ? 0 : 14;
      context.fillRect(-16, -16, 32, 32);
      context.strokeRect(-16, -16, 32, 32);
      context.restore();
      context.fillStyle = '#fff';
      context.font = 'bold 12px monospace';
      context.textAlign = 'center';
      context.fillText(POWERUPS[pickup.kind].label, pickup.x, pickup.y + 4);
    }
    for (let i = labels.length - 1; i >= 0; i--) {
      const label = labels[i];
      label.life -= dt;
      if (label.life <= 0) { labels.splice(i, 1); continue; }
      if (!reducedMotion) label.y -= 26 * dt;
      context.globalAlpha = Math.min(1, label.life * 2);
      context.font = 'bold 15px monospace';
      context.textAlign = 'center';
      const textWidth = context.measureText(label.text).width;
      context.fillStyle = '#101820';
      context.fillRect(label.x - textWidth / 2 - 8, label.y - 18, textWidth + 16, 26);
      context.fillStyle = '#91efd4';
      context.fillText(label.text, label.x, label.y);
    }
    context.globalAlpha = 1;
    networkTime += dt;
    if (networkTime >= 0.05 && network?.connected) {
      networkTime = 0;
      network.send({ type: 'position', page: currentUrl, x: ship.x / width, y: ship.y / height, angle: ship.angle, thrust, hull, hit: hitFlash > 0, shield: powers.shield > 0 || invulnerable > 0 });
    }
    for (const [id, ghost] of ghosts) {
      ghost.x += (ghost.targetX - ghost.x) * Math.min(1, dt * 14);
      ghost.y += (ghost.targetY - ghost.y) * Math.min(1, dt * 14);
      if (ghost.hull === 0) continue;
      drawShip(ghost.thrust, now, ghost, playerColor(id));
      drawPilotName(network.playerName(id), ghost, playerColor(id));
    }
    if (respawn <= 0) drawShip(thrust, now, { ...ship, hitFlash, shield: powers.shield > 0 || invulnerable > 0 }, playerColor());
    if (network?.connected && respawn <= 0) drawPilotName(network.playerName(network.playerId), ship, playerColor());
  }

  function updateCamera() {
    camera = cameraFor(innerWidth, innerHeight, ship);
    arena.position(camera);
    canvas.style.width = `${width * camera.scale}px`;
    canvas.style.height = `${height * camera.scale}px`;
    canvas.style.left = `${camera.left}px`;
    canvas.style.top = `${camera.top}px`;
    find('.radar').hidden = !running;
    radarContext.clearRect(0, 0, 128, 80);
    radarContext.strokeStyle = '#6e879b';
    radarContext.strokeRect(camera.x / 10, camera.y / 10, camera.visibleWidth / 10, camera.visibleHeight / 10);
    const pilots = [[network?.playerId, ship], ...ghosts.entries()];
    for (const [id, craft] of pilots) {
      if (craft.hull === 0) continue;
      radarContext.fillStyle = playerColor(id);
      radarContext.beginPath();
      radarContext.arc(craft.x / 10, craft.y / 10, 2.5, 0, Math.PI * 2);
      radarContext.fill();
    }
    for (const [id, marker] of markers) {
      if (!ghosts.has(id)) { marker.remove(); markers.delete(id); }
    }
    for (const [id, ghost] of ghosts) {
      let marker = markers.get(id);
      if (!marker) {
        marker = document.createElement('span');
        marker.className = 'offscreen-pilot';
        find('.offscreen-pilots').append(marker);
        markers.set(id, marker);
      }
      const x = ghost.x * camera.scale + camera.left;
      const y = ghost.y * camera.scale + camera.top;
      marker.hidden = ghost.hull === 0 || (x >= 15 && x <= innerWidth - 15 && y >= 15 && y <= innerHeight - 15);
      marker.style.left = `${Math.max(55, Math.min(innerWidth - 55, x))}px`;
      marker.style.top = `${Math.max(55, Math.min(innerHeight - 145, y))}px`;
      marker.style.color = playerColor(id);
      const arrow = x < 15 ? '←' : x > innerWidth - 15 ? '→' : y < 15 ? '↑' : '↓';
      marker.textContent = `${arrow} ${network.playerName(id)}`;
    }
  }

  function drawPilotName(name, craft, color) {
    context.save();
    context.font = '12px ui-monospace, monospace';
    context.textAlign = 'center';
    const textWidth = context.measureText(name).width;
    context.fillStyle = '#08121de0';
    context.fillRect(craft.x - textWidth / 2 - 5, craft.y + 20, textWidth + 10, 19);
    context.fillStyle = color;
    context.fillText(name, craft.x, craft.y + 33);
    context.restore();
  }

  function drawShip(thrust, now, craft = ship, color = '#ff6600') {
    context.save();
    context.translate(craft.x, craft.y);
    if (craft.hitFlash > 0 || craft.flashUntil > performance.now()) color = '#fff0ce';
    if (craft.shield) {
      context.beginPath();
      context.arc(0, 0, 26, 0, Math.PI * 2);
      context.strokeStyle = '#64e9ce';
      context.lineWidth = 2;
      context.stroke();
    }
    context.rotate(craft.angle);
    context.shadowColor = color;
    context.shadowBlur = reducedMotion ? 0 : 12;
    if (thrust) {
      const flame = reducedMotion ? 19 : 18 + Math.sin(now * 0.035) * 6;
      context.beginPath();
      context.moveTo(-10, -5);
      context.lineTo(-flame - 8, 0);
      context.lineTo(-10, 5);
      context.fillStyle = color;
      context.fill();
    }
    context.beginPath();
    context.moveTo(19, 0);
    context.lineTo(-12, -12);
    context.lineTo(-6, 0);
    context.lineTo(-12, 12);
    context.closePath();
    context.fillStyle = '#111820';
    context.fill();
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
    context.shadowBlur = 0;
    context.fillStyle = '#d8f4ff';
    context.fillRect(0, -2, 6, 4);
    context.restore();
  }

  function start() {
    if (running) return;
    find('.briefing').hidden = true;
    find('.play-ui').hidden = false;
    if (matchMedia('(pointer: coarse)').matches || innerWidth <= 640) hint.textContent = 'ELD: förstör · NAV: träffa en länk för att resa';
    running = true;
    lastTime = performance.now();
    find('.exit').focus({ preventScroll: true });
    frame = requestAnimationFrame(tick);
  }
  listen(launchButton, 'click', () => {
    sound.init();
    sound.launch();
    beginRound();
    start();
  });
  listen(find('.exit'), 'click', () => close());
  function updateSoundButton() {
    const button = find('.sound');
    button.textContent = soundEnabled ? 'Ljud på' : 'Ljud av';
    button.setAttribute('aria-pressed', String(soundEnabled));
    button.setAttribute('aria-label', button.textContent);
  }
  if (!soundEnabled) sound.toggle();
  updateSoundButton();
  listen(find('.sound'), 'click', () => {
    sound.init();
    soundEnabled = sound.toggle();
    updateSoundButton();
  });
  function updateThemeButton() {
    find('.theme').textContent = dark ? 'Mörkt' : 'Ljust';
    find('.theme').setAttribute('aria-pressed', String(dark));
  }
  updateThemeButton();
  listen(find('.theme'), 'click', () => {
    dark = !dark;
    arenaDocument.body.toggleAttribute('data-space-dark', dark);
    updateThemeButton();
  });
  listen(find('.menu-toggle'), 'click', event => {
    mobileMenu.open = !mobileMenu.open;
    event.currentTarget.setAttribute('aria-expanded', String(mobileMenu.open));
    targetsDirty = true;
  });
  function updateScrollButton() {
    const button = find('.scroll-toggle');
    const guest = network?.connected && !network.isHost;
    button.disabled = guest;
    button.setAttribute('aria-pressed', String(scrollPaused));
    let label = scrollPaused ? 'Fortsätt scroll' : 'Pausa scroll';
    if (guest) label = scrollPaused ? 'Scroll pausad' : 'Värden styr scroll';
    if (effectTime('scroll') > 0) label += ` · S↕ ${Math.ceil(effectTime('scroll'))}s`;
    setText('.scroll-toggle', label);
  }

  function updateScroll(dt) {
    updateScrollButton();
    const maximum = Math.max(0, arenaDocument.documentElement.scrollHeight - height);
    if (network?.connected && !network.isHost) {
      if (remoteScroll !== null) {
        scrollPosition += (remoteScroll * maximum - scrollPosition) * Math.min(1, dt * 18);
        arenaWindow.scrollTo({ top: scrollPosition, behavior: 'instant' });
        targetsDirty = true;
      }
      return;
    }
    if (Math.abs(arenaWindow.scrollY - lastWrittenScroll) > 1) scrollPosition = arenaWindow.scrollY;
    if (!scrollPaused) {
      const next = advanceScroll(scrollPosition, scrollDirection, dt * (effectTime('scroll') > 0 ? 72 : 18), maximum);
      scrollPosition = next.position;
      scrollDirection = next.direction;
      arenaWindow.scrollTo({ top: scrollPosition, behavior: 'instant' });
      lastWrittenScroll = arenaWindow.scrollY;
      targetsDirty = true;
    }
    scrollNetworkTime += dt;
    if (scrollNetworkTime >= 0.1 && network?.connected) {
      scrollNetworkTime = 0;
      network.send({ type: 'scroll', page: currentUrl, scroll: maximum ? arenaWindow.scrollY / maximum : 0, paused: scrollPaused });
    }
  }
  listen(find('.scroll-toggle'), 'click', () => {
    if (network?.connected && !network.isHost) return;
    scrollPaused = !scrollPaused;
    updateScrollButton();
    broadcastState();
  });
  const movementKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space', 'KeyN'];
  listen(window, 'keydown', event => {
    if (event.code === 'Escape') { event.preventDefault(); close(); return; }
    if (roundEnded || !find('.lobby').hidden || !find('.missions').hidden) return;
    if (!running || event.ctrlKey || event.metaKey || event.altKey) return;
    // Space still activates a focused control when navigating the HUD with Tab.
    if (event.code === 'Space' && keyboardFocus) return;
    if (movementKeys.includes(event.code) && event.code !== 'Space') keyboardFocus = false;
    if (movementKeys.includes(event.code)) { event.preventDefault(); sound.init(); keys.add(event.code); }
  });
  listen(window, 'keyup', event => keys.delete(event.code));
  let keyboardFocus = false;
  listen(shadow, 'keydown', event => {
    if (event.key !== 'Tab') return;
    keyboardFocus = true;
    const scope = find('.results:not([hidden])') || find('.lobby:not([hidden])') || find('.missions:not([hidden])') || shadow;
    const buttons = [...scope.querySelectorAll('button, input, select, summary')].filter(button => !button.disabled && button.checkVisibility());
    const index = buttons.indexOf(shadow.activeElement);
    const next = event.shiftKey ? (index - 1 + buttons.length) % buttons.length : (index + 1) % buttons.length;
    event.preventDefault();
    buttons[next].focus({ preventScroll: true });
  });
  listen(canvas, 'pointerdown', () => { keyboardFocus = false; });
  listen(window, 'blur', resetControls);
  listen(document, 'visibilitychange', resetControls);
  listen(window, 'pagehide', () => close(false));
  listen(window, 'popstate', () => { close(false); location.reload(); });
  listen(window, 'resize', resize);
  listen(arenaWindow, 'scroll', () => { targetsDirty = true; }, { passive: true });
  listen(arenaDocument, 'load', () => { targetsDirty = true; }, { capture: true });
  listen(stick, 'pointerdown', event => {
    sound.init();
    joystick.active = true;
    stick.setPointerCapture(event.pointerId);
    steer(event);
  });
  function steer(event) {
    if (!joystick.active) return;
    const rect = stick.getBoundingClientRect();
    joystick.x = event.clientX - rect.left - rect.width / 2;
    joystick.y = event.clientY - rect.top - rect.height / 2;
    const length = Math.max(1, Math.hypot(joystick.x, joystick.y) / 30);
    stick.style.setProperty('--stick-x', `${joystick.x / length}px`);
    stick.style.setProperty('--stick-y', `${joystick.y / length}px`);
  }
  listen(stick, 'pointermove', steer);
  listen(stick, 'lostpointercapture', () => {
    joystick.active = false;
    stick.style.removeProperty('--stick-x');
    stick.style.removeProperty('--stick-y');
  });
  listen(find('.fire'), 'pointerdown', event => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    holdingFire = true;
    sound.init();
  });
  listen(find('.fire'), 'lostpointercapture', () => { holdingFire = false; });
  listen(find('.fire'), 'click', event => {
    if (event.detail === 0 && cooldown <= 0) fire();
  });
  listen(find('.navigate'), 'pointerdown', event => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    holdingNavigation = true;
    sound.init();
  });
  listen(find('.navigate'), 'lostpointercapture', () => { holdingNavigation = false; });
  listen(find('.navigate'), 'click', event => {
    if (event.detail === 0 && cooldown <= 0) fire('navigate');
  });

  const missionLinks = new Map([['/', 'Startsidan']]);
  for (const link of arenaDocument.querySelectorAll('.nav a[href], .service-card[href]')) {
    const url = internalDestination(link.href, currentUrl);
    if (url) missionLinks.set(url.pathname, link.querySelector('h2')?.textContent.trim() || link.textContent.trim());
  }
  function showMissions() {
    resetControls();
    const select = find('.mission-select');
    select.replaceChildren();
    for (const [href, label] of missionLinks) {
      if (new URL(currentUrl).pathname === href) continue;
      const option = document.createElement('option');
      option.value = href;
      option.textContent = label;
      select.append(option);
    }
    find('.missions').hidden = false;
    select.focus({ preventScroll: true });
  }
  listen(find('.missions-open'), 'click', showMissions);
  listen(find('.missions-close'), 'click', () => { find('.missions').hidden = true; });
  listen(find('.mission-go'), 'click', () => {
    const destination = internalDestination(find('.mission-select').value, currentUrl);
    find('.missions').hidden = true;
    if (destination) navigateTo({ destination });
  });

  function targetSignature() {
    let hash = 2166136261;
    for (const node of targets) {
      for (const char of node.tagName + node.textContent + (node.getAttribute('src') || '')) {
        hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
      }
    }
    return hash >>> 0;
  }

  function takeDamage(amount) {
    const next = damageHull(hull, amount, invulnerable > 0 || powers.shield > 0 || respawn > 0);
    if (next === hull) return;
    hull = next;
    hitFlash = 0.25;
    invulnerable = 0.9;
    sound.damage();
    labels.push({ x: ship.x, y: ship.y - 24, text: `−${amount} SKROV`, life: 1 });
    if (hull === 0) {
      burst(ship.x, ship.y, { left: ship.x - 15, top: ship.y - 15, width: 30, height: 30 });
      sound.crash();
      deathSequence++;
      const death = { type: 'pilot-death', page: currentUrl, round: roundSerial, sequence: deathSequence, x: ship.x / width, y: ship.y / height };
      if (!network?.connected || network.isHost) recordDeath(death, ownPilotId());
      network?.send(death);
      respawn = 3;
      ship.vx = ship.vy = 0;
      for (const kind of Object.keys(powers)) powers[kind] = 0;
      resetControls();
    }
  }

  function ownPilotId() { return network?.playerId || 'solo'; }

  function ensurePilot(id) {
    if (!roundStats.has(id)) roundStats.set(id, { id, name: network?.playerName(id) || pilotName(nameInput.value) || 'Pilot', kills: 0, deaths: 0 });
    return roundStats.get(id);
  }

  function roundSnapshot() {
    return { serial: roundSerial, remaining: roundRemaining, ended: roundEnded, players: [...roundStats.values()] };
  }

  function publishRound() {
    if (network?.isHost) network.send({ type: 'round', data: roundSnapshot() });
  }

  function renderRound() {
    setText('.round-clock', clockLabel(roundRemaining));
    const me = roundStats.get(ownPilotId());
    setText('.kill-count', `${me?.kills || 0} ${me?.kills === 1 ? 'kill' : 'kills'} · ${me?.deaths || 0} dödsfall`);
    if (!roundEnded) return;
    resetControls();
    const players = [...roundStats.values()].sort((a, b) => b.kills - a.kills);
    const winners = roundWinners(players);
    const names = players.filter(player => winners.includes(player.id)).map(player => player.name);
    setText('.result-title', players.length === 1 ? 'Ronden är klar' : winners.length === 1 ? `${names[0]} vinner!` : 'Delad seger!');
    const list = find('.result-list');
    list.replaceChildren();
    for (const player of players) {
      const item = document.createElement('li');
      item.textContent = `${player.name} · ${player.kills} ${player.kills === 1 ? 'kill' : 'kills'} · ${player.deaths} dödsfall`;
      if (winners.includes(player.id)) item.className = 'winner';
      list.append(item);
    }
    find('.lobby').hidden = find('.missions').hidden = true;
    find('.results').hidden = false;
    const guest = network?.connected && !network.isHost;
    find('.rematch').hidden = Boolean(guest);
    find('.result-wait').hidden = !guest;
  }

  function resetRound() {
    roundDeadline = 0;
    roundEnded = false;
    roundRemaining = ROUND_SECONDS;
    lastRoundSecond = -1;
    deathSequence = 0;
    roundStats.clear();
    pendingDamage.clear();
    collisionTimes.clear();
    animations.forEach(animation => animation.cancel());
    animations.clear();
    for (const [node, original] of destroyed) {
      if (original.value) node.style.setProperty('visibility', original.value, original.priority);
      else node.style.removeProperty('visibility');
    }
    restoreTargetDamage();
    destroyed.clear();
    pendingHits.clear();
    flightShots.clear();
    shots.length = pickups.length = particles.length = rings.length = labels.length = impacts.length = 0;
    score = 0;
    scoreOutput.textContent = '00000';
    hull = 100;
    respawn = 0;
    invulnerable = 3;
    hitFlash = 0;
    combo = 1;
    lastHitTime = -Infinity;
    missionElapsed = gameTime = 0;
    pageCleared = false;
    checkMissionClear = targetsDirty = true;
    for (const kind of Object.keys(powers)) powers[kind] = 0;
    for (const effect of Object.values(roomEffects)) { effect.until = 0; effect.revision = 0; effect.announced = false; }
    effectClaims.clear();
    scrollPaused = false;
    scrollDirection = 1;
    scrollPosition = lastWrittenScroll = 0;
    remoteScroll = null;
    arenaWindow.scrollTo({ top: 0, behavior: 'instant' });
    ship.x = width / 2 + (network?.connected ? 48 * network.playerIds.indexOf(ownPilotId()) : 0);
    ship.y = height * 0.62;
    ship.vx = ship.vy = 0;
    find('.results').hidden = true;
    resetControls();
    renderRound();
  }

  function beginRound() {
    roundDeadline = performance.now() + ROUND_SECONDS * 1000;
    roundRemaining = ROUND_SECONDS;
    roundStats.clear();
    const players = network?.playerIds || [];
    for (const id of players.length ? players : [ownPilotId()]) ensurePilot(id);
    renderRound();
  }

  function receiveRound(data) {
    if (!data || !Number.isSafeInteger(data.serial) || data.serial < roundSerial || !Number.isFinite(data.remaining)
      || data.remaining < 0 || data.remaining > ROUND_SECONDS || !Array.isArray(data.players) || data.players.length > 100) return;
    if (data.serial > roundSerial) { resetRound(); roundSerial = data.serial; }
    roundRemaining = data.remaining;
    if (data.ended === true && !roundEnded) sound.roundEnd();
    roundEnded = data.ended === true;
    if (roomStarted) roundDeadline = performance.now() + data.remaining * 1000;
    roundStats.clear();
    for (const player of data.players) {
      if (typeof player.id !== 'string' || !Number.isSafeInteger(player.kills) || player.kills < 0 || !Number.isSafeInteger(player.deaths) || player.deaths < 0) continue;
      roundStats.set(player.id, { id: player.id, name: pilotName(player.name) || 'Pilot', kills: player.kills, deaths: player.deaths });
    }
    renderRound();
  }

  function updateRound() {
    if (closed || !roundDeadline || roundEnded) return;
    roundRemaining = Math.max(0, (roundDeadline - performance.now()) / 1000);
    const second = Math.ceil(roundRemaining);
    if (roundRemaining === 0 && (!network?.connected || network.isHost)) {
      roundEnded = true;
      sound.roundEnd();
      renderRound();
      publishRound();
    } else if (second !== lastRoundSecond) {
      lastRoundSecond = second;
      renderRound();
      if (!network?.connected || network.isHost) publishRound();
    }
    for (const [id, damage] of pendingDamage) if (damage.expires < performance.now()) pendingDamage.delete(id);
  }
  const roundTimer = setInterval(updateRound, 100);

  function recordDeath(message, pilot) {
    if (roundEnded || message.round !== roundSerial || !Number.isInteger(message.sequence)) return;
    const entry = ensurePilot(pilot);
    if (message.sequence !== entry.deaths + 1) return;
    entry.deaths++;
    renderRound();
    publishRound();
  }

  function recordKill(message, victim) {
    const damage = pendingDamage.get(message.shotId);
    if (!damage || damage.victim !== victim || damage.expires < performance.now()) return;
    pendingDamage.delete(message.shotId);
    if (roundEnded || message.round !== roundSerial || message.killed !== true || message.damage <= 0) return;
    ensurePilot(damage.shooter).kills++;
    renderRound();
    publishRound();
  }

  function routeCollision(pilot, other) {
    if (!rules.collisions || !network.playerIds.includes(other) || pilot === other) return;
    const pair = [pilot, other].sort().join(':');
    if (performance.now() - (collisionTimes.get(pair) ?? -Infinity) < 1000) return;
    collisionTimes.set(pair, performance.now());
    const packet = { type: 'collision-damage', page: currentUrl, round: roundSerial, pilots: [pilot, other] };
    network.send(packet);
    if (packet.pilots.includes(ownPilotId())) takeDamage(25);
  }

  listen(find('.result-exit'), 'click', () => close());
  listen(find('.rematch'), 'click', () => {
    if (network?.connected && !network.isHost) return;
    if (network && !network.connected && !network.isHost) { network.close(); network = null; }
    resetRound();
    roundSerial++;
    roomStarted = false;
    showLobby();
    broadcastState();
    if (!network) { find('.lobby').hidden = true; find('.briefing').hidden = false; running = false; cancelAnimationFrame(frame); }
  });

  function routePilotHit(target, shotId, sender) {
    const flight = flightShots.get(shotId);
    if (!rules.friendlyFire || !flight || flight.owner !== sender || flight.kind !== 'destroy'
      || flight.expires < performance.now() || target === sender || !network.playerIds.includes(target)) return;
    flightShots.delete(shotId);
    pendingDamage.set(shotId, { shooter: sender, victim: target, expires: performance.now() + 3000 });
    const packet = { type: 'pilot-damage', page: currentUrl, target, shotId };
    network.send(packet);
    if (target === network.playerId) resolvePilotHit(packet);
  }

  function resolvePilotHit(message) {
    const before = hull;
    takeDamage(20);
    const impact = { type: 'impact', page: currentUrl, shotId: message.shotId, x: ship.x / width, y: ship.y / height, damage: before - hull, killed: before > 0 && hull === 0, round: roundSerial };
    if (network.isHost) recordKill(impact, network.playerId);
    showImpact(impact, network.playerId);
    network.send(impact);
  }

  function showImpact(message, pilot) {
    if (!Number.isFinite(message.x) || !Number.isFinite(message.y) || message.x < 0 || message.x > 1 || message.y < 0 || message.y > 1
      || !Number.isInteger(message.damage) || message.damage < 0 || message.damage > 20 || typeof message.shotId !== 'string') return;
    for (let i = shots.length - 1; i >= 0; i--) if (shots[i].id === message.shotId) shots.splice(i, 1);
    const x = message.x * width;
    const y = message.y * height;
    impacts.push({ x, y, life: 0.45, blocked: message.damage === 0 });
    if (impacts.length > 24) impacts.shift();
    if (ghosts.has(pilot)) ghosts.get(pilot).flashUntil = performance.now() + 250;
    if (pilot !== network.playerId || message.damage === 0) {
      labels.push({ x, y: y - 25, text: message.damage ? `TRÄFF −${message.damage}` : 'SKYDD', life: 0.8 });
      sound.damage();
    }
  }

  function effectTime(kind) {
    return effectSeconds(roomEffects[kind].until, performance.now());
  }

  function setRoomEffect(kind, seconds, revision) {
    if (!Object.hasOwn(roomEffects, kind) || !Number.isFinite(seconds) || seconds < 0 || seconds > 8 || !Number.isSafeInteger(revision)) return;
    const effect = roomEffects[kind];
    if (revision < effect.revision) return;
    const fresh = revision > effect.revision;
    effect.revision = revision;
    effect.until = performance.now() + seconds * 1000;
    if (seconds > 0 && fresh) { sound.roomEffect(kind); effect.announced = true; }
  }

  function activateRoomEffect(kind, id) {
    if (!Object.hasOwn(roomEffects, kind) || !Number.isInteger(id) || !targets[id] || !destroyed.has(targets[id])) return;
    const claim = `${kind}:${id}`;
    if (effectClaims.has(claim)) return;
    effectClaims.add(claim);
    setRoomEffect(kind, POWERUPS[kind].duration, roomEffects[kind].revision + 1);
    network?.send({ type: 'effect', kind, page: currentUrl, seconds: POWERUPS[kind].duration, revision: roomEffects[kind].revision });
  }

  function collectPowerup(pickup) {
    const power = POWERUPS[pickup.kind];
    if (pickup.kind === 'repair') hull = Math.min(100, hull + 40);
    else if (Object.hasOwn(roomEffects, pickup.kind)) {
      if (network?.connected && !network.isHost) network.send({ type: 'effect-request', kind: pickup.kind, page: currentUrl, id: pickup.id });
      else activateRoomEffect(pickup.kind, pickup.id);
    } else powers[pickup.kind] = power.duration;
    sound.powerup();
    hint.textContent = `${power.name.toUpperCase()}${power.duration ? ` · ${power.duration} sekunder` : ''}`;
  }

  function updateRules() {
    find('.friendly-fire').checked = rules.friendlyFire;
    find('.collisions').checked = rules.collisions;
    const guest = lobbyMode === 'guest' || lobbyMode === 'invited';
    find('.friendly-fire').disabled = find('.collisions').disabled = guest;
  }
  for (const [selector, key] of [['.friendly-fire', 'friendlyFire'], ['.collisions', 'collisions']]) {
    listen(find(selector), 'change', event => {
      if (network?.connected && !network.isHost) { updateRules(); return; }
      rules[key] = event.target.checked;
      invulnerable = 3;
      broadcastState();
    });
  }

  function broadcastState() {
    if (!network?.connected || !network.isHost) return;
    network.send({ type: 'state', damage: [...targetHealth].filter(([node]) => !destroyed.has(node)).map(([node, remaining]) => [targets.indexOf(node), remaining]), round: roundSnapshot(), roomStarted, rules: { ...rules }, effects: Object.fromEntries(Object.entries(roomEffects).map(([kind, effect]) => [kind, { seconds: effectTime(kind), revision: effect.revision }])), scrollPaused, page: currentUrl, targetCount: targets.length, signature: targetSignature(), destroyed: [...destroyed.keys()].map(node => targets.indexOf(node)), score, scroll: arenaWindow.scrollY / Math.max(1, arenaDocument.documentElement.scrollHeight - height) });
  }

  function validPoint(message) {
    return Number.isFinite(message.x) && message.x >= 0 && message.x <= 1
      && Number.isFinite(message.y) && message.y >= 0 && message.y <= 1
      && Number.isFinite(message.angle) && Math.abs(message.angle) < 1e9;
  }

  async function receive(message, sender) {
    if (closed) return;
    if (message.type === 'round' && !network.isHost) { receiveRound(message.data); return; }
    if (message.type === 'state' && !network.isHost) {
      const destination = internalDestination(message.page, currentUrl);
      if (!destination || !Array.isArray(message.destroyed) || message.destroyed.length > 5000
        || !Number.isSafeInteger(message.score) || message.score < 0
        || !Number.isFinite(message.scroll) || message.scroll < 0 || message.scroll > 1) return;
      if (destination.href !== currentUrl) await navigateTo({ destination }, true);
      if (closed) return;
      if (message.targetCount !== targets.length || message.signature !== targetSignature()) { find('.connection-status').textContent = 'Olika sidversioner – ladda om båda sidorna.'; return; }
      if (message.round?.serial > roundSerial) { resetRound(); roundSerial = message.round.serial; }
      if (Array.isArray(message.damage) && message.damage.length <= 5000) {
        for (const entry of message.damage) {
          if (!Array.isArray(entry)) continue;
          const [id, remaining] = entry;
          if (Number.isInteger(id) && targets[id]) applyTargetDamage(targets[id], remaining, 0, 0, false);
        }
      }
      for (const id of message.destroyed) {
        if (!Number.isInteger(id) || !targets[id] || destroyed.has(targets[id])) continue;
        rememberTarget(targets[id]);
        targets[id].style.setProperty('visibility', 'hidden', 'important');
      }
      if (typeof message.rules?.friendlyFire === 'boolean' && typeof message.rules?.collisions === 'boolean') {
        if (rules.collisions !== message.rules.collisions) invulnerable = 3;
        Object.assign(rules, { friendlyFire: message.rules.friendlyFire, collisions: message.rules.collisions });
        updateRules();
      }
      for (const kind of Object.keys(roomEffects)) {
        const effect = message.effects?.[kind];
        if (effect) setRoomEffect(kind, effect.seconds, effect.revision);
      }
      scrollPaused = message.scrollPaused === true;
      remoteScroll = message.scroll;
      scrollPosition = message.scroll * Math.max(0, arenaDocument.documentElement.scrollHeight - height);
      score = message.score;
      scoreOutput.textContent = String(score).padStart(5, '0');
      arenaWindow.scrollTo({ top: message.scroll * Math.max(0, arenaDocument.documentElement.scrollHeight - height), behavior: 'instant' });
      targetsDirty = true;
      const wasStarted = roomStarted;
      roomStarted = message.roomStarted === true;
      if (message.round) receiveRound(message.round);
      updateLobby();
      if (roomStarted && !wasStarted && !roundEnded) {
        find('.lobby').hidden = true;
        sound.launch();
        start();
      } else if (!roomStarted) find('.lobby').hidden = false;
      return;
    }
    if (roundEnded || (roundDeadline && performance.now() >= roundDeadline) || (network?.connected && !roomStarted)) return;
    if (message.page !== currentUrl || loadingPage) return;
    if (message.type === 'target-damage' && !network.isHost && Number.isInteger(message.id) && targets[message.id] && !destroyed.has(targets[message.id])) {
      const node = targets[message.id];
      const rect = node.getBoundingClientRect();
      applyTargetDamage(node, message.remaining, rect.left + rect.width / 2, rect.top + rect.height / 2);
      return;
    }
    if (message.type === 'pilot-death' && message.round === roundSerial && Number.isFinite(message.x) && Number.isFinite(message.y)) {
      if (network.isHost) recordDeath(message, sender);
      const x = message.x * width, y = message.y * height;
      burst(x, y, { left: x - 15, top: y - 15, width: 30, height: 30 });
      sound.crash();
      if (ghosts.has(sender)) ghosts.get(sender).hull = 0;
      return;
    }
    if (message.type === 'collision-request' && network.isHost && message.round === roundSerial) { routeCollision(sender, message.other); return; }
    if (message.type === 'collision-damage' && !network.isHost && message.round === roundSerial && Array.isArray(message.pilots)) {
      if (message.pilots.includes(ownPilotId())) takeDamage(25);
      return;
    }
    if (message.type === 'pilot-hit' && network.isHost) { routePilotHit(message.target, message.shotId, sender); return; }
    if (message.type === 'pilot-damage' && !network.isHost) {
      for (let i = shots.length - 1; i >= 0; i--) if (shots[i].id === message.shotId) shots.splice(i, 1);
      if (message.target === network.playerId) resolvePilotHit(message);
      return;
    }
    if (message.type === 'impact') { if (network.isHost) recordKill(message, sender); showImpact(message, sender); return; }
    if (message.type === 'scroll' && !network.isHost && Number.isFinite(message.scroll) && message.scroll >= 0 && message.scroll <= 1) {
      remoteScroll = message.scroll;
      scrollPaused = message.paused === true;
      return;
    }
    if (message.type === 'effect-request' && network.isHost) { activateRoomEffect(message.kind, message.id); return; }
    if (message.type === 'effect' && !network.isHost) { setRoomEffect(message.kind, message.seconds, message.revision); return; }
    if (message.type === 'hit' && network.isHost && Number.isInteger(message.id) && targets[message.id]) {
      const node = targets[message.id];
      const rect = node.getBoundingClientRect();
      destroy({ node, rect }, rect.left + rect.width / 2, rect.top + rect.height / 2);
    } else if (message.type === 'destroy' && !network.isHost && Number.isInteger(message.id) && targets[message.id]
      && Number.isSafeInteger(message.score) && message.score >= 0 && Number.isSafeInteger(message.points) && message.points > 0
      && Number.isInteger(message.combo) && message.combo >= 1 && message.combo <= 5) {
      const node = targets[message.id];
      const rect = node.getBoundingClientRect();
      destroy({ node, rect }, rect.left + rect.width / 2, rect.top + rect.height / 2, message);
    } else if (message.type === 'shot' && validPoint(message) && Number.isSafeInteger(message.id) && message.id > 0 && ['destroy', 'navigate'].includes(message.kind)) {
      const offsets = message.triple && message.kind === 'destroy' ? [-0.17, 0, 0.17] : [0];
      for (const [index, offset] of offsets.entries()) {
        const id = `${sender}:${message.id}:${index}`;
        flightShots.set(id, { owner: sender, expires: performance.now() + 2000, kind: message.kind });
        if (shots.length >= 200) shots.shift();
        shots.push({ id, remote: true, color: playerColor(sender), kind: message.kind, x: message.x * width, y: message.y * height, vx: Math.cos(message.angle + offset) * 750, vy: Math.sin(message.angle + offset) * 750, life: 1.3 });
      }
    } else if (message.type === 'navigate' && network.isHost) {
      const destination = internalDestination(message.url, currentUrl);
      if (destination) await navigateTo({ destination });
    }
  }

  function makeNetwork() {
    network?.close();
    roomStarted = false;
    resetRound();
    roundSerial = 1;
    for (const effect of Object.values(roomEffects)) { effect.until = 0; effect.revision = 0; effect.announced = false; }
    effectClaims.clear();
    ghosts.clear();
    shots.length = 0;
    flightShots.clear();
    network = createMultiplayer({
      onMessage(message, sender) {
        if (message.type === 'position') {
          if (message.page !== currentUrl || !validPoint(message)) return;
          let ghost = ghosts.get(sender);
          if (!ghost) { ghost = { x: message.x * width, y: message.y * height }; ghosts.set(sender, ghost); }
          Object.assign(ghost, { targetX: message.x * width, targetY: message.y * height, angle: message.angle, thrust: Boolean(message.thrust), hull: Number.isFinite(message.hull) ? message.hull : 100, shield: Boolean(message.shield), flashUntil: message.hit ? performance.now() + 100 : 0 });
          return;
        }
        messageQueue = messageQueue.then(() => receive(message, sender)).catch(() => { hint.textContent = 'Ett spelmeddelande kunde inte läsas.'; });
      },
      onConnected() {
        if (!network.isHost) ship.x = Math.min(width - 24, width / 2 + 48 * network.playerIds.indexOf(network.playerId));
        lobbyMode = network.isHost ? 'hosting' : 'guest';
        updateLobby();
        if (!roomStarted) find('.lobby').hidden = false;
        invulnerable = 3;
        broadcastState();
      },
      onPlayers(players) {
        if (network.isHost && !roundEnded) for (const id of players) ensurePilot(id);
        for (const id of ghosts.keys()) if (!players.includes(id)) ghosts.delete(id);
        for (const selector of ['.pilot-list', '.crew-list']) {
          const list = find(selector);
          list.replaceChildren();
          for (const [index, id] of players.entries()) {
            const item = document.createElement('li');
            item.style.color = playerColor(id);
            item.textContent = network.playerName(id) + (id === network.playerId ? ' (du)' : '') + (index === 0 && selector === '.crew-list' && (network.connected || network.isHost) ? ' · värd' : '');
            list.append(item);
          }
        }
        find('.crew').hidden = false;
        find('.crew-count').textContent = `${players.length} / ${MAX_PLAYERS}`;
      },
      onStatus(status) {
        if (closed) return;
        find('.lobby-status').textContent = status;
        find('.connection-status').textContent = network?.connected ? `${network.playerIds.length} / ${MAX_PLAYERS} piloter` : status;
        if (!network?.connected) {
          ghosts.clear(); pendingHits.clear();
          if (lobbyMode === 'guest') {
            lobbyMode = 'idle';
            roomStarted = false;
            updateLobby();
            if (roundEnded) renderRound();
          }
        }
      },
    });
    return network;
  }

  function updateLobby() {
    const invited = lobbyMode === 'invited';
    const connected = lobbyMode === 'hosting' || lobbyMode === 'guest';
    find('.host-game').hidden = lobbyMode !== 'idle';
    find('.join-game').hidden = !invited;
    find('.start-room').hidden = lobbyMode !== 'hosting' || roomStarted;
    find('.lobby-close').hidden = connected && !roomStarted;
    find('.join-manually').hidden = lobbyMode !== 'idle';
    find('.invitation').hidden = lobbyMode !== 'hosting';
    find('.disconnect').hidden = lobbyMode === 'idle';
    find('.disconnect').textContent = invited ? 'Avbryt inbjudan' : 'Lämna rummet';
    find('.pilot-name').disabled = connected;
    let intro = 'Skapa ett rum och bjud in med en länk.';
    if (invited) intro = 'Du är inbjuden. Välj namn och anslut.';
    else if (connected && roomStarted) intro = 'Rummet är öppet. Flyg tillsammans!';
    else if (lobbyMode === 'hosting') intro = 'Starta när besättningen är redo.';
    else if (lobbyMode === 'guest') intro = 'Väntar på att värden startar spelet.';
    find('.lobby-intro').textContent = intro;
    updateRules();
  }
  function showLobby(peerId = null) {
    resetControls();
    find('.lobby').hidden = false;
    if (peerId && !network?.connected) {
      lobbyMode = 'invited';
      find('.incoming-link').value = invitationLink(peerId, currentUrl);
      find('.lobby-status').textContent = '';
    }
    updateLobby();
    const focus = find('.pilot-name').disabled ? (find('.start-room').hidden ? find('.disconnect') : find('.start-room')) : find('.pilot-name');
    focus.focus({ preventScroll: true });
  }
  listen(find('.use-invitation'), 'click', () => {
    const id = invitationPeer(find('.incoming-link').value, currentUrl);
    if (id) showLobby(id);
    else find('.lobby-status').textContent = 'Klistra in en giltig inbjudningslänk.';
  });
  listen(find('.multiplayer'), 'click', () => showLobby());
  listen(window, 'athega-space-invite', event => showLobby(event.detail));
  listen(find('.lobby-close'), 'click', () => {
    if ((lobbyMode === 'hosting' || lobbyMode === 'guest') && !roomStarted) return;
    find('.lobby').hidden = true;
  });
  listen(find('.start-room'), 'click', () => {
    if (!network?.isHost || roomStarted) return;
    roomStarted = true;
    beginRound();
    updateLobby();
    find('.lobby').hidden = true;
    sound.init();
    sound.launch();
    start();
    broadcastState();
  });
  async function connectionAction(action) {
    const attempt = ++connectionAttempt;
    const status = find('.lobby-status');
    find('.host-game').disabled = find('.join-game').disabled = true;
    find('.invitation').hidden = true;
    try {
      await action();
    } catch (error) {
      if (!closed && attempt === connectionAttempt) status.textContent = error.message || 'Anslutningen gick inte att skapa.';
    } finally {
      if (!closed && attempt === connectionAttempt) find('.host-game').disabled = find('.join-game').disabled = false;
    }
  }
  listen(find('.host-game'), 'click', () => connectionAction(async () => {
    sound.init();
    const id = await makeNetwork().host(find('.pilot-name').value);
    if (closed) return;
    find('.outgoing-link').value = invitationLink(id, currentUrl);
    lobbyMode = 'hosting';
    updateLobby();
    find('.local-invite').hidden = !['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
    find('.lobby-status').textContent = 'Skicka länken till kompisen och låt spelet vara öppet. Ni kopplas ihop när kompisen väljer Anslut.';
  }));
  listen(find('.join-game'), 'click', () => {
    sound.init();
    const id = invitationPeer(find('.incoming-link').value, currentUrl);
    if (!id) { find('.lobby-status').textContent = 'Klistra in en giltig inbjudningslänk från den här sajten.'; return; }
    connectionAction(() => makeNetwork().join(id, find('.pilot-name').value));
  });
  listen(find('.copy-link'), 'click', async () => {
    try { await navigator.clipboard.writeText(find('.outgoing-link').value); find('.lobby-status').textContent = 'Länken är kopierad. Skicka den till kompisen och vänta kvar här.'; }
    catch { find('.outgoing-link').select(); find('.lobby-status').textContent = 'Markeringen är klar. Kopiera länken manuellt.'; }
  });
  listen(find('.disconnect'), 'click', () => {
    connectionAttempt++;
    network?.close();
    network = null;
    ghosts.clear();
    pendingHits.clear();
    find('.incoming-link').value = find('.outgoing-link').value = '';
    find('.host-game').disabled = find('.join-game').disabled = false;
    lobbyMode = 'idle';
    updateLobby();
    find('.lobby-status').textContent = 'Skapa ett nytt spel eller anslut med en inbjudningslänk.';
    find('.connection-status').textContent = 'Soloflygning';
    find('.pilot-list').replaceChildren();
    find('.crew-list').replaceChildren();
    find('.crew').hidden = true;
  });
  resize();
  launchButton.focus({ preventScroll: true });
  if (invitedPeerId) showLobby(invitedPeerId);
}
