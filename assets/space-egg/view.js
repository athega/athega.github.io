export function gameMarkup() {
  return `
    <link rel="stylesheet" href="${new URL('./game.css?v=14', import.meta.url).href}">
    <div role="dialog" aria-modal="true" aria-label="Athega Space – hemligt arkadspel">
      <canvas class="world-canvas" aria-hidden="true"></canvas><div class="offscreen-pilots" aria-hidden="true"></div><div class="radar" hidden><canvas width="128" height="80" aria-label="Radar över piloterna"></canvas><span>RADAR</span></div>
      <div class="hud">
        <div class="scoreboard"><span class="kicker">Athega / Space</span><output class="score" aria-label="Poäng">00000</output><span class="round-clock">2:00</span><span class="kill-count">0 kills · 0 dödsfall</span><span class="pace">×1 · 0.0 s</span><span class="connection-status" aria-live="polite">Soloflygning</span><ul class="pilot-list" aria-label="Piloter"></ul><span class="hull-status" aria-live="polite">Skrov 100</span><span class="gravity-status" role="status" hidden></span><span class="power-status" aria-live="polite">Redo</span></div>
        <div class="actions"><button class="multiplayer">Spela tillsammans</button><button class="menu-toggle" hidden aria-expanded="false">Meny</button><button class="theme" aria-pressed="true" aria-label="Mörkt spelläge">Mörkt</button><button class="sound" aria-pressed="true" aria-label="Ljud på">Ljud på</button><button class="exit">Avsluta ×</button></div>
      </div>
      <div class="play-ui" hidden>
        <p class="hint">← → / A D: rotera · ↑ / W: gas · Mellanslag: skjut · N: navigera · Esc: avsluta</p>
        <div class="bottom"><button class="scroll-toggle" aria-pressed="false">Pausa scroll</button><button class="missions-open">Byt uppdrag</button></div>
        <div class="ordnance"><button class="lay-mine" title="M: placera mina">Mina · 0</button><button class="drop-bomb" title="B: släpp bomb">Bomb · 0</button></div>
        <div class="touch stick" role="group" aria-label="Dra för att styra skeppet"><span>STYR</span></div>
        <button class="touch navigate" aria-label="Håll för navigationsskott">NAV</button>
        <button class="touch fire" aria-label="Håll för att skjuta">ELD</button>
      </div>
      <div class="briefing"><div class="panel">
        <span class="kicker">Hemligt uppdrag / 001</span>
        <h1>Vi gillar att<br>bryta ny mark.</h1>
        <p>Men du får börja med den här sidan. Ta kontroll över skeppet och skjut layouten i småbitar.</p>
        <p class="instructions">Dator: piltangenter eller W A S D + mellanslag.<br>N: navigationsskott – träffa en intern länk.<br>Mobil: styrspak, ELD och NAV.<br>Plocka upp MIN/BOM. M: lägg mina · B: släpp bomb (1 sekund).<br>Din mina skadar aldrig dig. Din bomb kan göra det.<br>Powerups: 3X trippelskott · RF snabbeld · SK sköld · + reparation · T turbo · G↓ gravitation · S↕ snabbscroll för alla.<br>Täta träffar ger upp till ×5. Rensa sidan snabbt för tidsbonus.<br>Esc eller Avsluta återställer allt.</p>
        <button class="primary launch">Starta motorerna</button>
      </div></div>
      <div class="lobby" hidden><div class="panel">
        <span class="kicker">Besättning / upp till fyra</span><h2>Flyg tillsammans</h2>
        <p class="lobby-intro">Skapa ett rum och bjud in med en länk.</p>
        <label class="name-label">Pilotnamn <span>(valfritt)</span><input class="pilot-name" maxlength="20" autocomplete="off" placeholder="Ditt anropsnamn"></label>
        <section class="crew" hidden aria-label="Besättning"><h3>Besättning <span class="crew-count"></span></h3><ul class="crew-list" aria-live="polite"></ul></section>
        <details class="rules"><summary>Spelregler <span>Värden bestämmer</span></summary>
          <label class="rule"><input class="friendly-fire" type="checkbox"><span>Friendly fire<small>Kompisarnas skott, minor och bomber ger skada.</small></span></label>
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
}

export const gameTheme = `
    body[data-space-dark] { --paper: #111b26; --ink: #e5edf5; --muted: #b2c0ce; --line: #344452; --line-strong: #536b80; --neutral: #1b2a39; --on-dark-muted: #c5d3e1; background: radial-gradient(ellipse at 80% 15%, #163a5366, transparent 55%), radial-gradient(ellipse at 10% 80%, #37205255, transparent 60%), #050b14; background-attachment: fixed; color: var(--ink); }
    body[data-space-dark] .site-header { background: #0d1620ed; border-color: #344452; }
    body[data-space-dark] .page-hero { background: transparent; }
    body[data-space-dark] :is(.dark-section, .unified-callout, .article-body pre) { background: #080f17; }
  `;

// Do not make the real site inert until the game's controls are styled and usable.
export function waitForStyles(link, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => finish(new Error('Spelstilarna kunde inte laddas.')), 10000);
    function finish(error) {
      clearTimeout(timer);
      link.onload = link.onerror = null;
      signal?.removeEventListener('abort', abort);
      if (error) reject(error); else resolve();
    }
    function abort() { finish(signal.reason); }
    link.onload = () => finish();
    link.onerror = () => finish(new Error('Spelstilarna kunde inte laddas.'));
    signal?.addEventListener('abort', abort, { once: true });
    if (signal?.aborted) abort();
    else if (link.sheet) finish();
  });
}
