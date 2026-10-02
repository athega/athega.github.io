import { hitsRect } from './physics.js?v=3';
import { createSound } from './sound.js?v=3';
import { internalDestination } from './navigation.js?v=3';
import { createMultiplayer, decodeSignal } from './multiplayer.js?v=3';
import { hitReward, sectorReward } from './scoring.js?v=3';

export function openGame(onClose) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const previousFocus = document.activeElement;
  const originalUrl = location.href;
  let currentUrl = originalUrl;
  let loadingPage = false;
  let pageChanged = false;
  let network = null;
  let ghost = null;
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
  host.style.cssText = 'position:fixed;inset:0;z-index:2147483647';
  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `
    <link rel="stylesheet" href="${new URL('./game.css?v=3', import.meta.url).href}">
    <div role="dialog" aria-modal="true" aria-label="Athega Space – hemligt arkadspel">
      <canvas aria-hidden="true"></canvas>
      <div class="hud">
        <div class="scoreboard"><span class="kicker">Athega / Space</span><output class="score" aria-label="Poäng">00000</output><span class="pace">×1 · 0.0 s</span><span class="connection-status" aria-live="polite">Soloflygning</span><span class="power-status" aria-live="polite">Sektor 01</span></div>
        <div class="actions"><button class="multiplayer">Två spelare</button><button class="menu-toggle" hidden aria-expanded="false">Meny</button><button class="theme" aria-pressed="true" aria-label="Mörkt spelläge">Mörkt</button><button class="sound" aria-pressed="true" aria-label="Ljud på">Ljud på</button><button class="exit">Avsluta ×</button></div>
      </div>
      <div class="play-ui" hidden>
        <p class="hint">← → / A D: rotera · ↑ / W: gas · Mellanslag: skjut · N: navigera · Esc: avsluta</p>
        <div class="bottom"><button class="sector">Nästa sektor ↓</button><button class="missions-open">Byt uppdrag</button></div>
        <div class="touch stick" role="group" aria-label="Dra för att styra skeppet"><span>STYR</span></div>
        <button class="touch navigate" aria-label="Håll för navigationsskott">NAV</button>
        <button class="touch fire" aria-label="Håll för att skjuta">ELD</button>
      </div>
      <div class="briefing"><div class="panel">
        <span class="kicker">Hemligt uppdrag / 001</span>
        <h1>Vi gillar att<br>bryta ny mark.</h1>
        <p>Men du får börja med den här sidan. Ta kontroll över skeppet och skjut layouten i småbitar.</p>
        <p class="instructions">Dator: piltangenter eller W A S D + mellanslag.<br>N: navigationsskott – träffa en intern länk.<br>Mobil: styrspak, ELD och NAV.<br>Plocka upp 3X och RF för trippelskott och snabbeld.<br>Täta träffar ger upp till ×5. Rensa snabbt för tidsbonus.<br>Esc eller Avsluta återställer allt.</p>
        <button class="primary launch">Starta motorerna</button>
      </div></div>
      <div class="lobby" hidden><div class="panel">
        <span class="kicker">Två piloter / ett uppdrag</span><h2>Flyg tillsammans</h2>
        <p>Värden skickar en inbjudningskod. Kompisen svarar med en svarskod. Värden klistrar in svaret.</p>
        <div class="lobby-actions"><button class="host-game">Skapa spel</button></div>
        <p class="lobby-status" role="status">Värd? Skapa spel. Fått en kod? Klistra in den nedan och välj Svara på inbjudan.</p>
        <label>Inkommande kod<textarea class="incoming-code" spellcheck="false" rows="3" maxlength="32000" placeholder="Klistra in inbjudan eller svar här"></textarea></label>
        <p class="incoming-type" role="status"></p>
        <button class="join-game">Svara på inbjudan</button>
        <button class="accept-answer" hidden>Anslut med svarskoden</button>
        <label><span class="code-label">Din kod att skicka</span><textarea class="outgoing-code" readonly rows="3" aria-label="Din kod att skicka"></textarea></label>
        <button class="copy-code" disabled>Kopiera kod</button>
        <div class="lobby-actions"><button class="disconnect">Nollställ anslutning</button><button class="lobby-close">Till spelet</button></div>
      </div></div>
      <div class="missions" hidden><div class="panel">
        <span class="kicker">Nästa destination</span><h2>Välj ett nytt uppdrag</h2>
        <p>Du kan alltid resa vidare, även när hela sidan är borta.</p>
        <label>Sida<select class="mission-select"></select></label>
        <button class="primary mission-go">Flyg dit</button><button class="missions-close">Till spelet</button>
      </div></div>
    </div>`;
  let dark = true;
  const previousTheme = document.body.getAttribute('data-space-dark');
  const themeStyle = document.createElement('style');
  themeStyle.textContent = `
    body[data-space-dark] { --paper: #111b26; --ink: #e5edf5; --muted: #b2c0ce; --line: #344452; --line-strong: #536b80; --neutral: #1b2a39; --on-dark-muted: #c5d3e1; background: radial-gradient(ellipse at 80% 15%, #163a5366, transparent 55%), radial-gradient(ellipse at 10% 80%, #37205255, transparent 60%), #050b14; background-attachment: fixed; color: var(--ink); }
    body[data-space-dark] .site-header { background: #0d1620ed; border-color: #344452; }
    body[data-space-dark] .page-hero { background: transparent; }
    body[data-space-dark] :is(.dark-section, .unified-callout, .article-body pre) { background: #080f17; }
  `;
  document.head.append(themeStyle);
  document.body.toggleAttribute('data-space-dark', dark);
  let inertStates = [...document.body.children].map(node => [node, node.inert]);
  inertStates.forEach(([node]) => { node.inert = true; });
  document.body.append(host);
  const find = selector => shadow.querySelector(selector);
  const canvas = find('canvas');
  const context = canvas.getContext('2d');
  const launchButton = find('.launch');
  const scoreOutput = find('.score');
  const hint = find('.hint');
  const stick = find('.stick');
  let mobileMenu = document.querySelector('.mobile-menu');
  let menuWasOpen = mobileMenu?.open;
  const destroyed = new Map();
  const keys = new Set();
  const shots = [];
  const particles = [];
  const rings = [];
  const stars = Array.from({ length: reducedMotion ? 60 : 130 }, () => ({ x: Math.random(), y: Math.random(), depth: 0.3 + Math.random() * 0.7, phase: Math.random() * Math.PI * 2 }));
  const pickups = [];
  const animations = new Set();
  const powers = { triple: 0, rapid: 0 };
  let sectorTargets = new Set();
  let sectorDirty = true;
  let sectorClearTime = 0;
  let sectorElapsed = 0;
  let gameTime = 0;
  let lastHitTime = -Infinity;
  let combo = 1;
  const labels = [];
  let lastPowerLabel = '';
  const joystick = { active: false, x: 0, y: 0 };
  const ship = { x: innerWidth / 2, y: innerHeight * 0.62, vx: 0, vy: 0, angle: -Math.PI / 2 };
  let width = innerWidth;
  let height = innerHeight;
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
  let sector = 1;

  // Keep the page geometry intact: hide only hit elements, never remove DOM nodes.
  const targetSelector = 'h1, h2, h3, h4, p, li, img, a, summary';
  function collectTargets() {
    return [...document.querySelectorAll('header.site-header, main, footer')].flatMap(root => [...root.querySelectorAll(targetSelector)])
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
    const headerBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0;
    host.style.setProperty('--space-header-bottom', `${Math.max(0, headerBottom)}px`);
    find('.menu-toggle').hidden = !mobileMenu?.checkVisibility();
    width = innerWidth;
    height = innerHeight;
    const scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * scale;
    canvas.height = height * scale;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    ship.x = Math.min(ship.x, width - 20);
    ship.y = Math.min(ship.y, height - 20);
    targetsDirty = true;
    sectorDirty = true;
  }

  function updateTargets() {
    targetRects = targets.filter(node => !isDestroyed(node) && node.checkVisibility({ visibilityProperty: true, opacityProperty: true })).flatMap(node => {
      // Text ranges follow actual lines, so shots can pass through empty margins.
      const range = document.createRange();
      range.selectNodeContents(node);
      const rects = node.tagName === 'IMG' ? [node.getBoundingClientRect()] : [...range.getClientRects()];
      return rects.filter(rect => rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < height)
        .map(rect => ({ node, rect }));
    });
    linkRects = [...document.querySelectorAll('header.site-header a[href], main a[href], footer a[href]')]
      .filter(node => !node.hasAttribute('download') && !isDestroyed(node) && node.checkVisibility({ visibilityProperty: true, opacityProperty: true }))
      .flatMap(node => {
        const destination = internalDestination(node.href, currentUrl);
        if (!destination) return [];
        return [...node.getClientRects()].filter(rect => rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < height)
          .map(rect => ({ node, rect, destination }));
      });
    if (sectorDirty) {
      sectorTargets = new Set(targetRects.filter(({ node }) => !node.closest('.site-header')).map(({ node }) => node));
      sectorClearTime = 0;
      sectorElapsed = 0;
      sectorDirty = false;
    }
    targetsDirty = false;
  }

  function close(reloadPage = true) {
    if (closed) return;
    closed = true;
    cancelAnimationFrame(frame);
    controller.abort();
    sound.close();
    themeStyle.remove();
    if (previousTheme === null) document.body.removeAttribute('data-space-dark');
    else document.body.setAttribute('data-space-dark', previousTheme);
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

  function destroy(target, x, y, remote = null) {
    const node = target.node;
    if (destroyed.has(node)) return;
    if (network?.connected && !network.isHost && !remote) {
      if (!pendingHits.has(node)) network.send({ type: 'hit', id: targets.indexOf(node), page: currentUrl });
      pendingHits.add(node);
      return;
    }
    pendingHits.delete(node);
    rememberTarget(node);
    const animation = node.animate(reducedMotion ? [
      { opacity: getComputedStyle(node).opacity }, { opacity: 0 },
    ] : [
      { opacity: getComputedStyle(node).opacity, transform: 'translate(0, 0) rotate(0) scale(1)', filter: 'blur(0)' },
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
      const kind = destroyed.size % 6 === 0 ? 'rapid' : 'triple';
      pickups.push({ x: Math.max(24, Math.min(width - 24, x)), y: Math.max(100, Math.min(height - 100, y)), kind, life: 14 });
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
      try { anchor = document.getElementById(decodeURIComponent(destination.hash.slice(1))); } catch { /* Ignore invalid fragments. */ }
      if (anchor) anchor.scrollIntoView({ behavior: 'instant', block: 'start' });
      else if (!destination.hash) window.scrollTo({ top: 0, behavior: 'instant' });
      targetsDirty = sectorDirty = true;
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
      for (const [node] of inertStates) node.remove();
      currentUrl = response.url;
      history.pushState(null, '', currentUrl);
      pageChanged = true;
      const pageNodes = [...nextDocument.body.children].filter(node => !['SCRIPT', 'STYLE'].includes(node.tagName));
      inertStates = pageNodes.map(node => {
        const imported = document.importNode(node, true);
        // Page demos may contain scripts; game navigation only imports static content.
        imported.querySelectorAll('script').forEach(script => script.remove());
        const wasInert = imported.inert;
        imported.inert = true;
        document.body.insertBefore(imported, host);
        return [imported, wasInert];
      });
      destroyed.clear();
      pendingHits.clear();
      shots.length = particles.length = rings.length = pickups.length = labels.length = 0;
      mobileMenu = document.querySelector('.mobile-menu');
      menuWasOpen = mobileMenu?.open;
      targets = collectTargets();
      window.scrollTo({ top: 0, behavior: 'instant' });
      resize();
      sector++;
      ship.x = width / 2 + (network?.connected && !network.isHost ? 48 : 0);
      ship.y = height * 0.62;
      ship.vx = ship.vy = 0;
      hint.textContent = 'Nytt uppdrag! Fortsätt röja tillsammans.';
      if (!fromPeer) broadcastState();
    } catch (error) {
      if (!closed) hint.textContent = 'Kunde inte öppna sidan. Du kan fortsätta här och prova igen.';
    } finally {
      loadingPage = false;
    }
  }

  function fire(kind = 'destroy') {
    const dx = Math.cos(ship.angle);
    const dy = Math.sin(ship.angle);
    const angles = kind === 'destroy' && powers.triple > 0 ? [-0.17, 0, 0.17] : [0];
    for (const offset of angles) {
      const angle = ship.angle + offset;
      shots.push({ kind, x: ship.x + dx * 19, y: ship.y + dy * 19, vx: Math.cos(angle) * 750 + ship.vx, vy: Math.sin(angle) * 750 + ship.vy, life: 1.3 });
    }
    sound.shoot();
    network?.send({ type: 'shot', page: currentUrl, x: ship.x / width, y: ship.y / height, angle: ship.angle, kind, triple: powers.triple > 0 });
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
    if (document.hidden || loadingPage || !find('.lobby').hidden || !find('.missions').hidden) return;
    gameTime += dt;
    sectorElapsed += dt;
    if (gameTime - lastHitTime > 2) combo = 1;
    find('.pace').textContent = `×${combo} · ${sectorElapsed.toFixed(1)} s`;
    if (targetsDirty) updateTargets();
    powers.triple = Math.max(0, powers.triple - dt);
    powers.rapid = Math.max(0, powers.rapid - dt);
    const powerLabel = [powers.triple > 0 ? `3X ${Math.ceil(powers.triple)}s` : '', powers.rapid > 0 ? `RF ${Math.ceil(powers.rapid)}s` : ''].filter(Boolean).join(' · ') || `Sektor ${String(sector).padStart(2, '0')}`;
    if (powerLabel !== lastPowerLabel) {
      find('.power-status').textContent = powerLabel;
      lastPowerLabel = powerLabel;
    }
    if (sectorTargets.size > 0 && [...sectorTargets].every(node => destroyed.has(node))) {
      sectorClearTime += dt;
      hint.textContent = 'Sektor rensad! Gör klart för nästa…';
      if (sectorClearTime > 1.4 && (!network?.connected || network.isHost)) {
        const bonus = sectorReward(sectorTargets.size, Math.max(0, sectorElapsed - sectorClearTime));
        score += bonus;
        scoreOutput.textContent = String(score).padStart(5, '0');
        labels.push({ x: width / 2, y: height / 2, text: `SEKTOR KLAR +${bonus}`, life: 2 });
        nextSector(true);
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
    if (thrust) {
      ship.vx += Math.cos(ship.angle) * 380 * dt;
      ship.vy += Math.sin(ship.angle) * 380 * dt;
      if (!reducedMotion) particles.push({ x: ship.x - Math.cos(ship.angle) * 12, y: ship.y - Math.sin(ship.angle) * 12, vx: -Math.cos(ship.angle) * 90 + (Math.random() - 0.5) * 40, vy: -Math.sin(ship.angle) * 90 + (Math.random() - 0.5) * 40, life: 0.23, max: 0.23, size: 3, color: '#ff6600' });
    }
    sound.thrust(thrust);
    const brake = keys.has('ArrowDown') || keys.has('KeyS');
    const friction = Math.exp(-(brake ? 5 : 0.7) * dt);
    ship.vx *= friction;
    ship.vy *= friction;
    const speed = Math.hypot(ship.vx, ship.vy);
    if (speed > 360) { ship.vx *= 360 / speed; ship.vy *= 360 / speed; }
    ship.x = (ship.x + ship.vx * dt + width) % width;
    ship.y = (ship.y + ship.vy * dt + height) % height;
    cooldown -= dt;
    if (cooldown <= 0) {
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
      const candidates = shot.remote ? [] : shot.kind === 'navigate' ? linkRects : targetRects;
      const hit = candidates.find(target => !isDestroyed(target.node) && hitsRect(shot.x, shot.y, x, y, target.rect));
      shot.life -= dt;
      if (hit) {
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
      context.strokeStyle = shot.kind === 'navigate' || shot.remote ? '#00b7dd' : '#ff6600';
      context.lineWidth = shot.kind === 'navigate' ? 5 : 3;
      context.shadowColor = shot.kind === 'navigate' ? '#00d4ff' : '#ff6600';
      context.shadowBlur = reducedMotion ? 0 : 10;
      context.stroke();
      context.shadowBlur = 0;
      shot.x = x;
      shot.y = y;
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
      if (distance < 130) { pickup.x += dx * dt * 2.8; pickup.y += dy * dt * 2.8; }
      if (distance < 28) {
        powers[pickup.kind] = 12;
        sound.powerup();
        hint.textContent = pickup.kind === 'triple' ? 'TRIPPELSKOTT · Tre skott åt gången i 12 sekunder!' : 'SNABBELD · Dubbelt eldhastighet i 12 sekunder!';
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
      context.fillText(pickup.kind === 'triple' ? '3X' : 'RF', pickup.x, pickup.y + 4);
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
      network.send({ type: 'position', page: currentUrl, x: ship.x / width, y: ship.y / height, angle: ship.angle, thrust });
    }
    if (ghost) {
      ghost.x += (ghost.targetX - ghost.x) * Math.min(1, dt * 14);
      ghost.y += (ghost.targetY - ghost.y) * Math.min(1, dt * 14);
      drawShip(ghost.thrust, now, ghost, '#56dfff');
    }
    drawShip(thrust, now);
  }

  function drawShip(thrust, now, craft = ship, color = '#ff6600') {
    context.save();
    context.translate(craft.x, craft.y);
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
    if (matchMedia('(pointer: coarse)').matches || width <= 640) hint.textContent = 'ELD: förstör · NAV: träffa en länk för att resa';
    running = true;
    lastTime = performance.now();
    find('.exit').focus({ preventScroll: true });
    frame = requestAnimationFrame(tick);
  }
  listen(launchButton, 'click', () => {
    sound.init();
    sound.launch();
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
    document.body.toggleAttribute('data-space-dark', dark);
    updateThemeButton();
  });
  listen(find('.menu-toggle'), 'click', event => {
    mobileMenu.open = !mobileMenu.open;
    event.currentTarget.setAttribute('aria-expanded', String(mobileMenu.open));
    targetsDirty = true;
  });
  function nextSector(automatic = false) {
    if (network?.connected && !network.isHost) { network.send({ type: 'sector', page: currentUrl }); return; }
    const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0;
    const remaining = targets.filter(node => !isDestroyed(node) && !node.closest('.site-header')
      && node.checkVisibility({ visibilityProperty: true, opacityProperty: true }));
    if (!remaining.length && automatic) {
      sectorTargets.clear();
      hint.textContent = 'Sidan är rensad! Navigationsskjut en menylänk för nästa uppdrag.';
      sound.launch();
      showMissions();
      return;
    }
    const forward = remaining.find(node => node.getBoundingClientRect().top > headerHeight + 80);
    const next = forward || remaining[0];
    const top = next ? scrollY + next.getBoundingClientRect().top - headerHeight - 90 : 0;
    window.scrollTo({ top: Math.max(0, top), behavior: 'instant' });
    sector++;
    sectorClearTime = 0;
    sectorDirty = true;
    targetsDirty = true;
    shots.length = 0;
    pickups.length = 0;
    ship.vx = ship.vy = 0;
    hint.textContent = `Sektor ${String(sector).padStart(2, '0')} · Fortsätt röja!`;
    if (automatic) sound.launch();
    broadcastState();
  }
  listen(find('.sector'), 'click', () => nextSector());
  const movementKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space', 'KeyN'];
  listen(window, 'keydown', event => {
    if (event.code === 'Escape') { event.preventDefault(); close(); return; }
    if (!find('.lobby').hidden || !find('.missions').hidden) return;
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
    const buttons = [...shadow.querySelectorAll('button, textarea, select')].filter(button => button.getClientRects().length);
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
  listen(window, 'scroll', () => { targetsDirty = true; sectorDirty = true; }, { passive: true });
  listen(document, 'load', () => { targetsDirty = true; }, { capture: true });
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
  for (const link of document.querySelectorAll('.nav a[href], .service-card[href]')) {
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

  function broadcastState() {
    if (!network?.connected || !network.isHost) return;
    network.send({ type: 'state', page: currentUrl, targetCount: targets.length, signature: targetSignature(), destroyed: [...destroyed.keys()].map(node => targets.indexOf(node)), score, sector, scroll: scrollY / Math.max(1, document.documentElement.scrollHeight - height) });
  }

  function validPoint(message) {
    return Number.isFinite(message.x) && message.x >= 0 && message.x <= 1
      && Number.isFinite(message.y) && message.y >= 0 && message.y <= 1
      && Number.isFinite(message.angle) && Math.abs(message.angle) < 1e9;
  }

  async function receive(message) {
    if (closed) return;
    if (message.type === 'state' && !network.isHost) {
      const destination = internalDestination(message.page, currentUrl);
      if (!destination || !Array.isArray(message.destroyed) || message.destroyed.length > 5000
        || !Number.isSafeInteger(message.score) || message.score < 0 || !Number.isSafeInteger(message.sector)
        || !Number.isFinite(message.scroll) || message.scroll < 0 || message.scroll > 1) return;
      if (destination.href !== currentUrl) await navigateTo({ destination }, true);
      if (closed) return;
      if (message.targetCount !== targets.length || message.signature !== targetSignature()) { find('.connection-status').textContent = 'Olika sidversioner – ladda om båda sidorna.'; return; }
      for (const id of message.destroyed) {
        if (!Number.isInteger(id) || !targets[id] || destroyed.has(targets[id])) continue;
        rememberTarget(targets[id]);
        targets[id].style.setProperty('visibility', 'hidden', 'important');
      }
      score = message.score;
      sector = message.sector;
      scoreOutput.textContent = String(score).padStart(5, '0');
      window.scrollTo({ top: message.scroll * Math.max(0, document.documentElement.scrollHeight - height), behavior: 'instant' });
      targetsDirty = sectorDirty = true;
      return;
    }
    if (message.page !== currentUrl || loadingPage) return;
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
    } else if (message.type === 'shot' && validPoint(message) && ['destroy', 'navigate'].includes(message.kind)) {
      for (const offset of message.triple && message.kind === 'destroy' ? [-0.17, 0, 0.17] : [0]) {
        shots.push({ remote: true, kind: message.kind, x: message.x * width, y: message.y * height, vx: Math.cos(message.angle + offset) * 750, vy: Math.sin(message.angle + offset) * 750, life: 1.3 });
      }
    } else if (message.type === 'navigate' && network.isHost) {
      const destination = internalDestination(message.url, currentUrl);
      if (destination) await navigateTo({ destination });
    } else if (message.type === 'sector' && network.isHost) nextSector();
  }

  function makeNetwork() {
    network?.close();
    network = createMultiplayer({
      onMessage(message) {
        if (message.type === 'position') {
          if (message.page !== currentUrl || !validPoint(message)) return;
          if (!ghost) ghost = { x: message.x * width, y: message.y * height };
          Object.assign(ghost, { targetX: message.x * width, targetY: message.y * height, angle: message.angle, thrust: Boolean(message.thrust) });
          return;
        }
        messageQueue = messageQueue.then(() => receive(message)).catch(() => { hint.textContent = 'Ett spelmeddelande kunde inte läsas.'; });
      },
      onConnected() {
        if (!network.isHost) ship.x = Math.min(width - 24, width / 2 + 48);
        find('.lobby').hidden = true;
        start();
        broadcastState();
      },
      onStatus(status) {
        if (closed) return;
        find('.lobby-status').textContent = status;
        find('.connection-status').textContent = network?.connected ? 'Två piloter' : status;
        if (!network?.connected) { ghost = null; pendingHits.clear(); }
      },
    });
    return network;
  }

  listen(find('.multiplayer'), 'click', () => {
    resetControls();
    find('.lobby').hidden = false;
    find('.host-game').focus({ preventScroll: true });
  });
  listen(find('.lobby-close'), 'click', () => { find('.lobby').hidden = true; });
  async function connectionAction(action) {
    const attempt = ++connectionAttempt;
    const status = find('.lobby-status');
    status.textContent = 'Förbereder anslutningen…';
    find('.host-game').disabled = find('.join-game').disabled = true;
    try {
      const code = await action();
      if (closed || attempt !== connectionAttempt) return;
      if (code) {
        find('.outgoing-code').value = code;
        find('.copy-code').disabled = false;
        find('.code-label').textContent = network.isHost ? 'Inbjudningskod – skicka till kompisen' : 'Svarskod – skicka tillbaka till värden';
        status.textContent = network.isHost ? 'Skicka din inbjudningskod. Kompisen ska klistra in den och klicka Svara på inbjudan. Klistra sedan in kompisens NYA svarskod här och klicka Anslut med svarskoden.' : 'Nästan klart! Kopiera din NYA svarskod nedan och skicka tillbaka den. Värden ska klistra in den och klicka Anslut med svarskoden. Vänta kvar här.';
      } else status.textContent = 'Kopplar ihop skeppen…';
    } catch (error) {
      if (!closed && attempt === connectionAttempt) status.textContent = error.message || 'Anslutningen gick inte att skapa.';
    }
  }
  listen(find('.incoming-code'), 'input', () => {
    const value = find('.incoming-code').value;
    const label = find('.incoming-type');
    if (!value.trim()) { label.textContent = ''; return; }
    try {
      const { type } = decodeSignal(value);
      label.textContent = type === 'offer'
        ? 'INBJUDAN: klicka Svara på inbjudan för att skapa en NY kod att skicka tillbaka.'
        : 'SVARSKOD: värden ska klicka Anslut med svarskoden.';
      if (network?.isHost && type === 'offer') label.textContent = 'Det här är en inbjudan. Du är värd och behöver kompisens NYA svarskod (ATHEGA-SVAR).';
    } catch (error) { label.textContent = error.message; }
  });
  listen(find('.host-game'), 'click', () => connectionAction(async () => {
    const code = await makeNetwork().offer();
    find('.accept-answer').hidden = false;
    find('.join-game').hidden = true;
    return code;
  }));
  listen(find('.join-game'), 'click', () => connectionAction(() => makeNetwork().answer(find('.incoming-code').value)));
  listen(find('.accept-answer'), 'click', () => connectionAction(() => network.accept(find('.incoming-code').value)));
  listen(find('.copy-code'), 'click', async () => {
    try { await navigator.clipboard.writeText(find('.outgoing-code').value); find('.lobby-status').textContent = 'Koden är kopierad.'; }
    catch { find('.outgoing-code').select(); find('.lobby-status').textContent = 'Markeringen är klar. Kopiera koden manuellt.'; }
  });
  listen(find('.disconnect'), 'click', () => {
    connectionAttempt++;
    network?.close();
    network = null;
    ghost = null;
    pendingHits.clear();
    find('.incoming-code').value = find('.outgoing-code').value = '';
    find('.incoming-type').textContent = '';
    find('.host-game').disabled = find('.join-game').disabled = false;
    find('.accept-answer').hidden = true;
    find('.join-game').hidden = false;
    find('.code-label').textContent = 'Din kod att skicka';
    find('.copy-code').disabled = true;
    find('.lobby-status').textContent = 'Skapa ett nytt spel eller svara på en inbjudan.';
    find('.connection-status').textContent = 'Soloflygning';
  });
  resize();
  launchButton.focus({ preventScroll: true });
  window.scrollTo({ left: initialScroll.x, top: initialScroll.y, behavior: 'instant' });
}
