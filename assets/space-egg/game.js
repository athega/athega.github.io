import { hitsRect } from './physics.js';
import { createSound } from './sound.js';

export function openGame(onClose) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const previousFocus = document.activeElement;
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
    <link rel="stylesheet" href="${new URL('./game.css?v=1', import.meta.url).href}">
    <div role="dialog" aria-modal="true" aria-label="Athega Space – hemligt arkadspel">
      <canvas aria-hidden="true"></canvas>
      <div class="hud">
        <div class="scoreboard"><span class="kicker">Athega / Space</span><output class="score" aria-label="Poäng">00000</output></div>
        <div class="actions"><button class="sound" aria-pressed="true" aria-label="Ljud på">Ljud på</button><button class="exit">Avsluta ×</button></div>
      </div>
      <div class="play-ui" hidden>
        <p class="hint">← → / A D: rotera · ↑ / W: gas · Mellanslag: skjut · Esc: avsluta</p>
        <div class="bottom"><button class="sector">Nästa sektor ↓</button></div>
        <div class="touch stick" role="group" aria-label="Dra för att styra skeppet"><span>STYR</span></div>
        <button class="touch fire" aria-label="Håll för att skjuta">ELD</button>
      </div>
      <div class="briefing"><div class="panel">
        <span class="kicker">Hemligt uppdrag / 001</span>
        <h1>Vi gillar att<br>bryta ny mark.</h1>
        <p>Men du får börja med den här sidan. Ta kontroll över skeppet och skjut layouten i småbitar.</p>
        <p class="instructions">Dator: piltangenter eller W A S D + mellanslag.<br>Mobil: styrspak och ELD.<br>Esc eller Avsluta återställer allt.</p>
        <button class="primary launch">Starta motorerna</button>
      </div></div>
    </div>`;
  const inertStates = [...document.body.children].map(node => [node, node.inert]);
  inertStates.forEach(([node]) => { node.inert = true; });
  document.body.append(host);
  const find = selector => shadow.querySelector(selector);
  const canvas = find('canvas');
  const context = canvas.getContext('2d');
  const launchButton = find('.launch');
  const scoreOutput = find('.score');
  const hint = find('.hint');
  const stick = find('.stick');
  const destroyed = new Map();
  const keys = new Set();
  const shots = [];
  const particles = [];
  const rings = [];
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
  let holdingFire = false;
  let targetRects = [];
  let targetsDirty = true;
  let sector = 1;

  // Keep the page geometry intact: hide only hit elements, never remove DOM nodes.
  const targetSelector = 'h1, h2, h3, h4, p, li, img, a.text-link';
  const targets = [...document.querySelectorAll('main, footer')].flatMap(root => [...root.querySelectorAll(targetSelector)])
    .filter(node => !node.querySelector(targetSelector) && !node.closest('pre, code, [hidden]'));

  function resize() {
    width = innerWidth;
    height = innerHeight;
    const scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * scale;
    canvas.height = height * scale;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    ship.x = Math.min(ship.x, width - 20);
    ship.y = Math.min(ship.y, height - 20);
    targetsDirty = true;
  }

  function updateTargets() {
    targetRects = targets.filter(node => !destroyed.has(node) && node.checkVisibility({ visibilityProperty: true, opacityProperty: true })).flatMap(node => {
      // Text ranges follow actual lines, so shots can pass through empty margins.
      const range = document.createRange();
      range.selectNodeContents(node);
      const rects = node.tagName === 'IMG' ? [node.getBoundingClientRect()] : [...range.getClientRects()];
      return rects.filter(rect => rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < height)
        .map(rect => ({ node, rect }));
    });
    targetsDirty = false;
  }

  function close() {
    if (closed) return;
    closed = true;
    cancelAnimationFrame(frame);
    controller.abort();
    sound.close();
    destroyed.forEach((original, node) => {
      if (original.value) node.style.setProperty('visibility', original.value, original.priority);
      else node.style.removeProperty('visibility');
      if (!original.hadStyle && !node.getAttribute('style')) node.removeAttribute('style');
    });
    inertStates.forEach(([node, wasInert]) => { node.inert = wasInert; });
    host.remove();
    window.scrollTo({ left: initialScroll.x, top: initialScroll.y, behavior: 'instant' });
    previousFocus?.focus({ preventScroll: true });
    onClose();
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

  function destroy(target, x, y) {
    const node = target.node;
    destroyed.set(node, { value: node.style.getPropertyValue('visibility'), priority: node.style.getPropertyPriority('visibility'), hadStyle: node.hasAttribute('style') });
    node.style.setProperty('visibility', 'hidden', 'important');
    score += node.tagName === 'IMG' ? 250 : 100;
    scoreOutput.textContent = String(score).padStart(5, '0');
    burst(x, y, target.rect);
    sound.explode();
    targetsDirty = true;
    if (destroyed.size === targets.length) hint.textContent = 'Sidan är röjd. Snyggt flugit! Avsluta för att återställa.';
  }

  function fire() {
    const dx = Math.cos(ship.angle);
    const dy = Math.sin(ship.angle);
    shots.push({ x: ship.x + dx * 19, y: ship.y + dy * 19, vx: dx * 750 + ship.vx, vy: dy * 750 + ship.vy, life: 1.3 });
    sound.shoot();
    cooldown = 0.16;
  }

  function resetControls() {
    keys.clear();
    holdingFire = false;
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
    if (document.hidden) return;
    if (targetsDirty) updateTargets();
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
    if ((keys.has('Space') || holdingFire) && cooldown <= 0) fire();
    context.clearRect(0, 0, width, height);
    for (let i = shots.length - 1; i >= 0; i--) {
      const shot = shots[i];
      const x = shot.x + shot.vx * dt;
      const y = shot.y + shot.vy * dt;
      const hit = targetRects.find(target => !destroyed.has(target.node) && hitsRect(shot.x, shot.y, x, y, target.rect));
      shot.life -= dt;
      if (hit) {
        destroy(hit, Math.max(hit.rect.left, Math.min(x, hit.rect.right)), Math.max(hit.rect.top, Math.min(y, hit.rect.bottom)));
        shots.splice(i, 1);
        continue;
      }
      if (shot.life <= 0 || x < 0 || x > width || y < 0 || y > height) { shots.splice(i, 1); continue; }
      context.beginPath();
      context.moveTo(shot.x, shot.y);
      context.lineTo(x, y);
      context.strokeStyle = '#ff6600';
      context.lineWidth = 3;
      context.shadowColor = '#ff6600';
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
    drawShip(thrust, now);
  }

  function drawShip(thrust, now) {
    context.save();
    context.translate(ship.x, ship.y);
    context.rotate(ship.angle);
    context.shadowColor = '#ff6600';
    context.shadowBlur = reducedMotion ? 0 : 12;
    if (thrust) {
      const flame = reducedMotion ? 19 : 18 + Math.sin(now * 0.035) * 6;
      context.beginPath();
      context.moveTo(-10, -5);
      context.lineTo(-flame - 8, 0);
      context.lineTo(-10, 5);
      context.fillStyle = '#ff6600';
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
    context.strokeStyle = '#ff6600';
    context.lineWidth = 2;
    context.stroke();
    context.shadowBlur = 0;
    context.fillStyle = '#d8f4ff';
    context.fillRect(0, -2, 6, 4);
    context.restore();
  }

  listen(launchButton, 'click', () => {
    sound.init();
    sound.launch();
    find('.briefing').hidden = true;
    find('.play-ui').hidden = false;
    if (matchMedia('(pointer: coarse)').matches || width <= 640) hint.textContent = 'Dra för att styra · Håll ELD för att skjuta';
    running = true;
    lastTime = performance.now();
    find('.exit').focus({ preventScroll: true });
    frame = requestAnimationFrame(tick);
  });
  listen(find('.exit'), 'click', close);
  listen(find('.sound'), 'click', event => {
    const enabled = sound.toggle();
    event.currentTarget.textContent = enabled ? 'Ljud på' : 'Ljud av';
    event.currentTarget.setAttribute('aria-pressed', String(enabled));
    event.currentTarget.setAttribute('aria-label', enabled ? 'Ljud på' : 'Ljud av');
  });
  listen(find('.sector'), 'click', () => {
    const atBottom = scrollY + height >= document.documentElement.scrollHeight - 4;
    window.scrollTo({ top: atBottom ? 0 : scrollY + height * 0.7, behavior: 'instant' });
    sector = atBottom ? 1 : sector + 1;
    hint.textContent = `Sektor ${String(sector).padStart(2, '0')} · Fortsätt röja!`;
    targetsDirty = true;
  });
  const movementKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'];
  listen(window, 'keydown', event => {
    if (event.code === 'Escape') { event.preventDefault(); close(); return; }
    if (!running || event.ctrlKey || event.metaKey || event.altKey) return;
    // Space still activates a focused control when navigating the HUD with Tab.
    if (event.code === 'Space' && keyboardFocus) return;
    if (movementKeys.includes(event.code) && event.code !== 'Space') keyboardFocus = false;
    if (movementKeys.includes(event.code)) { event.preventDefault(); keys.add(event.code); }
  });
  listen(window, 'keyup', event => keys.delete(event.code));
  let keyboardFocus = false;
  listen(shadow, 'keydown', event => {
    if (event.key !== 'Tab') return;
    keyboardFocus = true;
    const buttons = [...shadow.querySelectorAll('button')].filter(button => button.getClientRects().length);
    const index = buttons.indexOf(shadow.activeElement);
    const next = event.shiftKey ? (index - 1 + buttons.length) % buttons.length : (index + 1) % buttons.length;
    event.preventDefault();
    buttons[next].focus({ preventScroll: true });
  });
  listen(canvas, 'pointerdown', () => { keyboardFocus = false; });
  listen(window, 'blur', resetControls);
  listen(document, 'visibilitychange', resetControls);
  listen(window, 'pagehide', close);
  listen(window, 'resize', resize);
  listen(window, 'scroll', () => { targetsDirty = true; }, { passive: true });
  listen(document, 'load', () => { targetsDirty = true; }, { capture: true });
  listen(stick, 'pointerdown', event => {
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
  resize();
  launchButton.focus({ preventScroll: true });
  window.scrollTo({ left: initialScroll.x, top: initialScroll.y, behavior: 'instant' });
}
