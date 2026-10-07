"""Live two-player regression. Requires Playwright, a local build server and PeerJS Cloud access.
Run like space-browser-smoke.py; hooks are injected in browser routes, never shipped.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os
import sys
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8080/'
source = (Path(__file__).resolve().parent.parent / 'assets/space-egg/game.js').read_text()
hook = "let crashCount=0;const crash=sound.crash;sound.crash=function(){crashCount++;return crash.call(sound)};window.__test={ship,fire,send:message=>network.send(message),navigate:url=>navigateTo({destination:new URL(url,currentUrl)}),target:()=>({id:targets.findIndex(n=>n.tagName==='H1'),health:targetHealth.get(targets.find(n=>n.tagName==='H1'))||4}),state:()=>({hull,respawn,roomStarted,roundEnded,roundRemaining,roundDeadline,roundSerial,pageRevision,currentUrl,stats:[...roundStats.values()],crashCount}),vulnerable:()=>{invulnerable=0},expire:()=>{roundDeadline=performance.now()+50}};"
source = source.replace('  if (invitedPeerId) showLobby(invitedPeerId);', hook + '  if (invitedPeerId) showLobby(invitedPeerId);')
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.getenv('PLAYWRIGHT_CHROMIUM_EXECUTABLE'), args=['--disable-background-timer-throttling', '--disable-renderer-backgrounding'])
    errors = []

    def page():
        c = b.new_context(viewport={'width': 1440, 'height': 1000})
        c.route('**/space-egg/game.js?*', lambda r: r.fulfill(status=200, body=source, content_type='application/javascript'))
        g = c.new_page()
        g.on('pageerror', lambda e: errors.append(str(e)))
        return g
    h = page()
    h.goto(BASE)
    for k in ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']:
        h.keyboard.press(k)
    h.locator('.multiplayer').click()
    h.locator('.pilot-name').fill('Chrille')
    h.locator('.rules summary').click()
    h.locator('.friendly-fire').check()
    h.locator('.host-game').click()
    h.wait_for_function("document.querySelector('#athega-space-game').shadowRoot.querySelector('.outgoing-link').value.length>0", timeout=25000)
    link = h.locator('.outgoing-link').input_value()
    g = page()
    g.goto(link)
    g.locator('.pilot-name').fill('Mats')
    g.locator('.join-game').click()
    try:
        g.locator('.connection-status').filter(has_text='2 / 4').wait_for(timeout=35000)
    except Exception:
        print('HOST:', h.locator('.lobby-status').inner_text(), flush=True)
        print('GUEST:', g.locator('.lobby-status').inner_text(), flush=True)
        print('BROWSER ERRORS:', errors, flush=True)
        raise
    assert g.locator('.lobby').is_visible()
    h.locator('.start-room').click()
    g.locator('.lobby').wait_for(state='hidden')
    h.locator('.scroll-toggle').click()
    assert 117 < g.evaluate('window.__test.state().roundRemaining') <= 120
    h.evaluate("()=>{const s=window.__test.state();window.__test.send({type:'target-damage',id:window.__test.target().id,remaining:1,page:s.currentUrl,round:s.roundSerial-1,revision:s.pageRevision})}")
    g.wait_for_timeout(150)
    assert g.evaluate('window.__test.target().health') == 4
    h.evaluate('Object.assign(window.__test.ship,{vx:100,vy:0})')
    h.locator('.multiplayer').click()
    before = h.evaluate('window.__test.ship.x')
    h.wait_for_timeout(250)
    assert h.evaluate('window.__test.ship.x') > before
    h.locator('.lobby-close').click()
    h.evaluate("window.__test.navigate('/blogg/')")
    g.wait_for_function("window.__test.state().currentUrl.includes('/blogg/')")
    h.evaluate("window.__test.navigate('/')")
    g.wait_for_function("new URL(window.__test.state().currentUrl).pathname==='/'")
    h.evaluate("()=>{const s=window.__test.state();window.__test.send({type:'target-damage',id:window.__test.target().id,remaining:1,page:s.currentUrl,round:s.roundSerial,revision:s.pageRevision-1})}")
    g.wait_for_timeout(150)
    assert g.evaluate('window.__test.target().health') == 4
    print('OLD ROUND/PAGE MESSAGES IGNORED; MENUS KEEP SIMULATING; PAGE NAVIGATION SYNCS', flush=True)
    h.evaluate('Object.assign(window.__test.ship,{x:300,y:60,vx:0,vy:0,angle:0})')
    g.evaluate('Object.assign(window.__test.ship,{x:440,y:60,vx:0,vy:0,angle:0})')
    g.wait_for_timeout(200)
    for i in range(5):
        g.evaluate('window.__test.vulnerable()')
        h.evaluate('window.__test.fire()')
        g.wait_for_timeout(400)
        assert g.evaluate('window.__test.state().hull') == 100 - 20 * (i + 1), g.evaluate('window.__test.state()')
    for x in [h, g]:
        stats = x.evaluate('window.__test.state().stats')
        assert next((s for s in stats if s['name'] == 'Chrille'))['kills'] == 1, stats
        assert next((s for s in stats if s['name'] == 'Mats'))['deaths'] == 1, stats
        assert x.evaluate('window.__test.state().crashCount') == 1
    print('ONE KILL, ONE DEATH AND CRASH AUDIO ON BOTH', flush=True)
    h.evaluate('window.__test.expire()')
    h.locator('.results').wait_for()
    g.locator('.results').wait_for()
    assert h.locator('.result-title').inner_text() == 'Chrille vinner!'
    assert g.locator('.result-title').inner_text() == 'Chrille vinner!'
    assert g.locator('.rematch').is_hidden()
    print('SAME WINNER AT TIME LIMIT', flush=True)
    h.screenshot(path='/tmp/athega-round-results.png')
    h.locator('.rematch').click()
    g.locator('.lobby').wait_for()
    assert g.locator('.results').is_hidden()
    assert g.evaluate('window.__test.state().hull') == 100
    assert all((s['kills'] == 0 for s in g.evaluate('window.__test.state().stats')))
    g.wait_for_timeout(1200)
    assert g.evaluate('window.__test.state().roundDeadline') == 0
    assert g.evaluate('window.__test.state().roundRemaining') == 120
    h.locator('.start-room').click()
    g.locator('.lobby').wait_for(state='hidden')
    assert not g.evaluate('window.__test.state().roundEnded')
    print('REMATCH RESETS AND STARTS TOGETHER', flush=True)
    assert not errors, errors
    print('NO ERRORS', flush=True)
    b.close()
