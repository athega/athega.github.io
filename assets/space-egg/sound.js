export function createSound() {
  let context;
  let master;
  let engine;
  let engineGain;
  let noise;
  let enabled = true;

  function init() {
    if (context) {
      context.resume().catch(() => {});
      return;
    }
    try {
      context = new AudioContext();
      master = context.createGain();
      master.gain.value = enabled ? 0.22 : 0;
      master.connect(context.destination);
      engine = context.createOscillator();
      engine.type = 'triangle';
      engine.frequency.value = 65;
      engineGain = context.createGain();
      engineGain.gain.value = 0;
      engine.connect(engineGain).connect(master);
      engine.start();
      noise = context.createBuffer(1, context.sampleRate * 0.3, context.sampleRate);
      const samples = noise.getChannelData(0);
      for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
      context.resume().catch(() => {});
    } catch {
      // The game remains playable when audio is unavailable.
      context?.close().catch(() => {});
      context = null;
    }
  }

  function tone(from, to, duration, type = 'sine', delay = 0) {
    if (!context || !enabled) return;
    const time = context.currentTime + delay;
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, time);
    osc.frequency.exponentialRampToValueAtTime(to, time + duration);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.28, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    osc.connect(gain).connect(master);
    osc.start(time);
    osc.stop(time + duration);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); };
  }

  return {
    init,
    launch() {
      [220, 330, 440, 660].forEach((note, i) => tone(note, note * 1.01, 0.22, 'triangle', i * 0.09));
    },
    powerup() { [440, 660, 880].forEach((note, i) => tone(note, note * 1.1, 0.18, 'sine', i * 0.07)); },
    chip() { tone(260, 90, 0.08, 'triangle'); },
    damage() { tone(160, 55, 0.18, 'sawtooth'); },
    roomEffect(kind) {
      if (kind === 'gravity') {
        tone(520, 45, 0.8, 'sine');
        tone(180, 55, 0.6, 'triangle', 0.12);
      } else {
        tone(180, 1100, 0.5, 'triangle');
        tone(350, 1600, 0.35, 'sine', 0.1);
      }
    },
    crash() { this.explode(); tone(80, 24, 0.7, 'sawtooth'); tone(160, 35, 0.5, 'triangle', 0.08); },
    roundEnd() { [660, 550, 440, 880].forEach((note, i) => tone(note, note, 0.3, 'triangle', i * 0.16)); },
    effectEnded() { tone(440, 330, 0.18, 'sine'); tone(330, 220, 0.18, 'sine', 0.16); },
    shoot() { tone(950, 140, 0.12, 'triangle'); },
    explode() {
      if (!context || !enabled) return;
      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      const now = context.currentTime;
      source.buffer = noise;
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.frequency.exponentialRampToValueAtTime(80, now + 0.28);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      source.connect(filter).connect(gain).connect(master);
      source.start();
      source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
      tone(100, 35, 0.24);
    },
    thrust(value) {
      if (context) engineGain.gain.setTargetAtTime(value ? 0.13 : 0, context.currentTime, 0.05);
    },
    toggle() {
      enabled = !enabled;
      if (context) master.gain.setTargetAtTime(enabled ? 0.22 : 0, context.currentTime, 0.02);
      return enabled;
    },
    close() { if (context) { engine?.stop(); context.close().catch(() => {}); } },
  };
}
