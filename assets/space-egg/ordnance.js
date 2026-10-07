export const ORDNANCE = {
  mine: { label: 'MIN', radius: 95, damage: 60, objectHits: 2 },
  bomb: { label: 'BOM', radius: 150, damage: 80, objectHits: 3 },
};
const capacity = 3;

export function mineTriggered(mine, pilots, now) {
  return now >= mine.armedAt && pilots.some(pilot => pilot.id !== mine.owner && pilot.alive
    && Math.hypot(pilot.x - mine.x, pilot.y - mine.y) <= 60);
}

export function blastTouches(rect, blast) {
  const x = Math.max(rect.left, Math.min(blast.x, rect.right));
  const y = Math.max(rect.top, Math.min(blast.y, rect.bottom));
  return Math.hypot(x - blast.x, y - blast.y) <= ORDNANCE[blast.kind].radius;
}

export function blastVictims(blast, pilots, friendlyFire) {
  return pilots.filter(pilot => pilot.alive
    && (pilot.id === blast.owner ? blast.kind === 'bomb' : friendlyFire)
    && Math.hypot(pilot.x - blast.x, pilot.y - blast.y) <= ORDNANCE[blast.kind].radius)
    .map(pilot => ({ id: pilot.id, damage: ORDNANCE[blast.kind].damage }));
}

// Authority owns ammunition and fuses. Guests request actions and only draw them.
export function createOrdnance({ ownId, authoritative, send, onBlast, onChange, now = () => performance.now() }) {
  const ammunition = new Map();
  const drops = new Map();
  const claimed = new Set();
  const hazards = new Map();
  let sequence = 0;
  function stock(id) {
    if (!ammunition.has(id)) ammunition.set(id, { mine: 0, bomb: 0 });
    return ammunition.get(id);
  }
  function snapshot() {
    return {
      ammo: [...ammunition].map(([id, value]) => ({ id, ...value })),
      hazards: [...hazards.values()].map(hazard => ({ ...hazard, fuse: Math.max(0, hazard.detonatesAt - now()), arm: Math.max(0, hazard.armedAt - now()) })),
    };
  }
  function publish() { onChange(stock(ownId())); send({ type: 'ordnance-state', data: snapshot() }); }
  function collectFor(pilot, kind, target) {
    if (!Object.hasOwn(ORDNANCE, kind) || drops.get(target) !== kind) return;
    const key = `${pilot}:${target}`;
    if (claimed.has(key)) return;
    claimed.add(key);
    stock(pilot)[kind] = Math.min(capacity, stock(pilot)[kind] + 1);
    publish();
  }
  function deployFor(pilot, kind, x, y) {
    if (!Object.hasOwn(ORDNANCE, kind) || !Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > 1280 || y < 0 || y > 800 || stock(pilot)[kind] <= 0) return;
    if ([...hazards.values()].filter(hazard => hazard.owner === pilot && hazard.kind === kind).length >= capacity) return;
    stock(pilot)[kind]--;
    const hazard = { id: `${pilot}:${++sequence}`, kind, owner: pilot, x, y, detonatesAt: now() + 1000, armedAt: now() + 600 };
    hazards.set(hazard.id, hazard);
    publish();
  }
  function restore(data) {
    if (!data || !Array.isArray(data.ammo) || !Array.isArray(data.hazards) || data.ammo.length > 100 || data.hazards.length > 100) return;
    ammunition.clear();
    for (const item of data.ammo) {
      if (item && typeof item.id === 'string' && [item.mine, item.bomb].every(value => Number.isInteger(value) && value >= 0 && value <= capacity)) ammunition.set(item.id, { mine: item.mine, bomb: item.bomb });
    }
    hazards.clear();
    for (const hazard of data.hazards) {
      if (hazard && Object.hasOwn(ORDNANCE, hazard.kind) && typeof hazard.id === 'string' && typeof hazard.owner === 'string'
        && [hazard.x, hazard.y, hazard.fuse, hazard.arm].every(Number.isFinite)
        && hazard.x >= 0 && hazard.x <= 1280 && hazard.y >= 0 && hazard.y <= 800 && hazard.fuse >= 0 && hazard.fuse <= 1000 && hazard.arm >= 0 && hazard.arm <= 600) {
        hazards.set(hazard.id, { ...hazard, detonatesAt: now() + hazard.fuse, armedAt: now() + hazard.arm });
      }
    }
    onChange(stock(ownId()));
  }
  return {
    snapshot, restore,
    get hazards() { return [...hazards.values()]; },
    get ammo() { return { ...stock(ownId()) }; },
    recordDrop(target, kind) { if (Object.hasOwn(ORDNANCE, kind)) drops.set(target, kind); },
    collect(kind, target) {
      if (authoritative()) collectFor(ownId(), kind, target);
      else send({ type: 'ordnance-pickup', kind, target });
    },
    deploy(kind, x, y) {
      if (authoritative()) deployFor(ownId(), kind, x, y);
      else send({ type: 'ordnance-deploy', kind, x, y });
    },
    handle(message, sender) {
      if (authoritative()) {
        if (message.type === 'ordnance-pickup') collectFor(sender, message.kind, message.target);
        if (message.type === 'ordnance-deploy') deployFor(sender, message.kind, message.x, message.y);
      } else if (message.type === 'ordnance-state') restore(message.data);
      else if (message.type === 'ordnance-blast') {
        const hazard = hazards.get(message.id);
        if (!hazard || !Array.isArray(message.victims) || message.victims.length > 4) return;
        hazards.delete(message.id);
        onBlast(hazard, message.victims.filter(victim => victim && typeof victim.id === 'string' && victim.damage === ORDNANCE[hazard.kind].damage), false);
      }
    },
    tick(pilots, friendlyFire) {
      if (!authoritative()) return;
      for (const hazard of [...hazards.values()]) {
        const triggered = hazard.kind === 'bomb' ? now() >= hazard.detonatesAt : mineTriggered(hazard, pilots, now());
        if (!triggered) continue;
        hazards.delete(hazard.id);
        const victims = blastVictims(hazard, pilots, friendlyFire);
        // Deliver the explosion before damage callbacks publish respawn/ammo state.
        send({ type: 'ordnance-blast', id: hazard.id, victims });
        onBlast(hazard, victims, true);
      }
    },
    clearAmmo(pilot) { ammunition.set(pilot, { mine: 0, bomb: 0 }); if (authoritative()) publish(); },
    clearField() { hazards.clear(); drops.clear(); claimed.clear(); },
    reset() { ammunition.clear(); hazards.clear(); drops.clear(); claimed.clear(); onChange({ mine: 0, bomb: 0 }); },
  };
}
