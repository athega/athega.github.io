// Original looping chip tune, synthesized locally. SID-inspired, not a SID emulator.
export function createMusic(context, destination, noise) {
  const bus = context.createGain();
  bus.gain.value = 0.32;
  bus.connect(destination);
  const voices = new Set();
  const stepSeconds = 60 / 124 / 4;
  const roots = [45, 41, 48, 43, 45, 41, 48, 43];
  const melody = [
    [76, null, 79, 81, 79, 76, 74, 72],
    [77, null, 76, 72, 69, 72, 76, 77],
    [79, null, 76, 79, 84, 83, 79, 76],
    [74, 76, 79, null, 78, 74, 71, 74],
    [81, 79, 76, 79, 84, null, 83, 81],
    [77, 76, 72, 69, 72, null, 76, 77],
    [79, 84, 83, 79, 76, 79, 84, null],
    [83, 81, 79, 78, 74, 71, 74, 76],
  ];
  const pulseWaves = [0.125, 0.25, 0.5].map(duty => {
    const real = new Float32Array(33);
    const imag = new Float32Array(33);
    for (let harmonic = 1; harmonic < real.length; harmonic++) {
      real[harmonic] = 2 * Math.sin(2 * Math.PI * harmonic * duty) / (Math.PI * harmonic);
      imag[harmonic] = 2 * (1 - Math.cos(2 * Math.PI * harmonic * duty)) / (Math.PI * harmonic);
    }
    return context.createPeriodicWave(real, imag);
  });
  let timer = null;
  let step = 0;
  let nextTime = 0;
  const frequency = midi => 440 * 2 ** ((midi - 69) / 12);

  function envelope(source, output, time, length, volume, extraNodes = []) {
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(volume, time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + length);
    output.connect(gain).connect(bus);
    voices.add(source);
    source.onended = () => {
      voices.delete(source);
      source.disconnect(); gain.disconnect();
      for (const node of extraNodes) node.disconnect();
    };
    source.start(time);
    source.stop(time + length + 0.01);
  }

  function note(midi, time, length, volume, wave, slide = false) {
    const oscillator = context.createOscillator();
    oscillator.setPeriodicWave(pulseWaves[wave]);
    const pitch = frequency(midi);
    oscillator.frequency.setValueAtTime(slide ? pitch * 1.025 : pitch, time);
    oscillator.frequency.exponentialRampToValueAtTime(pitch, time + 0.035);
    envelope(oscillator, oscillator, time, length, volume);
  }

  function drum(time, snare) {
    const source = context.createBufferSource();
    source.buffer = noise;
    const filter = context.createBiquadFilter();
    filter.type = snare ? 'bandpass' : 'highpass';
    filter.frequency.value = snare ? 1700 : 6500;
    source.connect(filter);
    envelope(source, filter, time, snare ? 0.12 : 0.035, snare ? 0.28 : 0.09, [filter]);
  }

  function scheduleStep(time) {
    const bar = Math.floor(step / 16) % roots.length;
    const beat = step % 16;
    const root = roots[bar];
    const third = bar % 4 === 0 ? 3 : 4;
    note(root + 24 + [0, third, 7, 12][beat % 4], time, stepSeconds * 0.85, 0.13, bar % 3);
    if (beat % 2 === 0) {
      note(root + (beat % 8 === 6 ? 12 : 0), time, stepSeconds * 1.6, 0.36, 1);
      const lead = melody[bar][beat / 2];
      if (lead !== null) note(lead, time, stepSeconds * 1.8, 0.24, 0, true);
    }
    drum(time, beat % 8 === 4);
    if (beat % 8 === 0) {
      const kick = context.createOscillator();
      kick.frequency.setValueAtTime(150, time);
      kick.frequency.exponentialRampToValueAtTime(42, time + 0.1);
      envelope(kick, kick, time, 0.14, 0.6);
    }
    step = (step + 1) % (roots.length * 16);
  }

  function schedule() {
    if (context.state !== 'running') return;
    // Resume at the current beat; never schedule a backlog after a hidden tab.
    nextTime = Math.max(nextTime, context.currentTime + 0.01);
    while (nextTime < context.currentTime + 0.16) {
      scheduleStep(nextTime);
      nextTime += stepSeconds;
    }
  }

  function stop() {
    clearInterval(timer);
    timer = null;
    for (const voice of voices) voice.stop();
    voices.clear();
  }

  return {
    start() {
      if (timer !== null) return;
      nextTime = context.currentTime + 0.03;
      timer = setInterval(schedule, 50);
      schedule();
    },
    stop,
    close() { stop(); bus.disconnect(); },
  };
}
