"""Audio recovery regression: real Web Audio with injected Safari failure modes.
Run with the same Python/Chromium environment as space-browser-smoke.py.
"""
import os
import sys
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.getenv('PLAYWRIGHT_CHROMIUM_EXECUTABLE'), args=['--autoplay-policy=no-user-gesture-required'])
    page = browser.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8082/')
    result = page.evaluate('''async () => {
      const Original = window.AudioContext;
      const contexts = [];
      window.AudioContext = class extends Original {
        constructor() { super(); contexts.push(this); this.notes = 0; }
        createOscillator() { this.notes++; return super.createOscillator(); }
        get currentTime() { return this.frozen ? 10 : super.currentTime; }
        get state() { return this.frozen ? 'running' : super.state; }
        suspend() { return this.frozen ? new Promise(() => {}) : super.suspend(); }
        resume() { return this.frozen ? new Promise(() => {}) : super.resume(); }
      };
      const {createSound} = await import('/assets/space-egg/sound.js?v=17');
      const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
      const check = (ok, message) => { if (!ok) throw Error(message); };
      const sound = createSound();
      sound.init(); await wait(200);
      const first = contexts[0];
      sound.setBackground(true); await wait(100);
      check(first.state === 'suspended', 'background did not suspend');
      const paused = first.notes;
      sound.setBackground(false); await wait(800);
      check(first.state === 'running' && first.notes > paused, 'ordinary resume failed');
      check(contexts.length === 1, 'healthy context was replaced');
      sound.setBackground(true); await wait(100);
      first.frozen = true;
      sound.setBackground(false); await wait(950);
      check(contexts.length === 2, 'frozen context was not replaced');
      check(contexts[1].state === 'running' && contexts[1].notes > 1, 'music did not restart');
      first.frozen = false;
      check(first.state === 'closed', 'old context leaked');
      sound.toggleMusic();
      sound.setBackground(true); await wait(100);
      contexts[1].frozen = true;
      sound.setBackground(false); await wait(950);
      check(contexts.length === 3 && contexts[2].notes === 1, 'music-off preference lost');
      contexts[1].frozen = false;
      sound.setBackground(true); await wait(100);
      contexts[2].frozen = true;
      sound.setBackground(false); sound.close(); await wait(800);
      contexts[2].frozen = false;
      check(contexts.length === 3, 'recovery continued after exit');
      check(contexts.every(context => context.state === 'closed'), 'audio leaked on exit');
      return 'normal resume, frozen running clock, hanging promises, mute preference, cleanup';
    }''')
    assert not errors, errors
    print('PASS:', result)
    browser.close()
