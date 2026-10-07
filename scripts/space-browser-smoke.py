"""Optional browser regression: pip install playwright && playwright install chromium.
Run against npm start, e.g. python scripts/space-browser-smoke.py http://localhost:8082/
PLAYWRIGHT_CHROMIUM_EXECUTABLE can select an existing Chromium installation.
"""
import os
import sys
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8080/'
CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

def activate(page):
    for key in CODE:
        page.keyboard.press(key)

with sync_playwright() as playwright:
    options = {'headless': True}
    if os.getenv('PLAYWRIGHT_CHROMIUM_EXECUTABLE'):
        options['executable_path'] = os.environ['PLAYWRIGHT_CHROMIUM_EXECUTABLE']
    browser = playwright.chromium.launch(**options)
    errors = []
    for viewport in [{'width': 1440, 'height': 1000}, {'width': 390, 'height': 844}]:
        page = browser.new_page(viewport=viewport)
        requests = []
        page.on('request', lambda request: requests.append(request.url))
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(BASE)
        page.wait_for_timeout(250)
        assets = [url for url in requests if '/space-egg/' in url]
        assert len(assets) == 1 and 'trigger.js?' in assets[0], assets
        original = page.locator('main').inner_html()
        for _ in range(2):
            activate(page)
            page.locator('.launch').click()
            page.locator('.hud').wait_for()
            assert not any('peerjs' in url.lower() for url in requests)
            page.keyboard.press('Escape')
            page.locator('#athega-space-game').wait_for(state='detached')
            assert page.locator('main').inner_html() == original
            assert page.locator('[inert]').count() == 0
            assert page.locator('#athega-space-arena').count() == 0
        page.close()
    print('PASS: desktop/mobile, lazy assets, repeat open/close, original DOM restored')

    page = browser.new_page()
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.route('**/space-egg/game.css?*', lambda route: route.abort())
    page.goto(BASE)
    with page.expect_event('console', predicate=lambda message: 'Rymdskeppet kunde inte starta.' in message.text):
        activate(page)
    page.wait_for_function("document.querySelector('#athega-space-game') === null && document.querySelector('#athega-space-arena') === null")
    assert page.locator('[inert]').count() == 0
    page.unroute('**/space-egg/game.css?*')
    activate(page)
    page.locator('.launch').click()
    page.keyboard.press('Escape')
    page.locator('#athega-space-game').wait_for(state='detached')
    print('PASS: failed CSS load releases page and allows retry')
    # Hold the initial arena fetch to verify Escape can cancel startup.
    pending = []
    page.route(BASE, lambda route: pending.append(route) if route.request.resource_type == 'fetch' else route.continue_())
    with page.expect_request(lambda request: request.resource_type == 'fetch' and request.url == BASE):
        activate(page)
    page.keyboard.press('Escape')
    for route in pending:
        route.abort()
    page.unroute(BASE)
    page.wait_for_timeout(100)
    assert page.locator('[inert]').count() == 0
    activate(page)
    page.locator('.launch').click()
    page.keyboard.press('Escape')
    page.locator('#athega-space-game').wait_for(state='detached')
    print('PASS: Escape cancels startup and permits a fresh attempt')
    assert not errors, errors
    browser.close()
