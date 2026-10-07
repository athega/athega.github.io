"""Compact touch UI regression. Run like space-browser-smoke.py."""
import os
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parent.parent
source=(root/'assets/space-egg/game.js').read_text().replace('    if (invitedPeerId) showLobby(invitedPeerId);', "window.__grant=()=>{ordnance.recordDrop(999,'mine');ordnance.collect('mine',999);ordnance.recordDrop(998,'bomb');ordnance.collect('bomb',998)};    if (invitedPeerId) showLobby(invitedPeerId);")
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.getenv('PLAYWRIGHT_CHROMIUM_EXECUTABLE'))
 for w,h in [(374,667),(390,844),(844,390)]:
  page=b.new_page(viewport={'width':w,'height':h},is_mobile=True,has_touch=True,device_scale_factor=2)
  page.route('**/space-egg/game.js?*',lambda r:r.fulfill(body=source,content_type='application/javascript'))
  page.goto(sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8082/');page.wait_for_load_state('networkidle')
  for k in ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']:page.keyboard.press(k)
  page.locator('.launch').wait_for()
  assert page.locator('.hud').is_hidden()
  page.locator('.launch').tap();page.wait_for_timeout(150)
  assert page.locator('.scoreboard').bounding_box()['height']<=60
  assert page.locator('.multiplayer').is_hidden()
  assert page.locator('.scroll-toggle').is_hidden()
  assert page.locator('.radar').is_hidden()
  assert page.locator('.lay-mine').is_hidden()
  assert page.locator('.fire').evaluate("n=>getComputedStyle(n).userSelect")=='none'
  assert page.locator('.fire').evaluate("n=>!n.dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true}))")
  page.evaluate('window.__grant()');page.locator('.lay-mine').wait_for()
  page.locator('.tools-toggle').tap();page.locator('.multiplayer').wait_for()
  page.locator('.tools-close').tap();page.locator('.tools').wait_for(state='hidden')
  print('PASS',w,h,flush=True);page.close()
 b.close()
