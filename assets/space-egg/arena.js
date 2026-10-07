export const WORLD_WIDTH = 1280;
export const WORLD_HEIGHT = 800;

// Every pilot uses this layout viewport. Only the camera changes with the screen.
export function cameraFor(viewWidth, viewHeight, ship) {
  const scale = Math.min(1, Math.max(viewWidth / WORLD_WIDTH, viewHeight / WORLD_HEIGHT));
  const visibleWidth = viewWidth / scale;
  const visibleHeight = viewHeight / scale;
  const x = Math.max(0, Math.min(WORLD_WIDTH - visibleWidth, ship.x - visibleWidth / 2));
  const y = Math.max(0, Math.min(WORLD_HEIGHT - visibleHeight, ship.y - visibleHeight / 2));
  return {
    x, y, scale,
    left: Math.max(0, (viewWidth - WORLD_WIDTH * scale) / 2) - x * scale,
    top: Math.max(0, (viewHeight - WORLD_HEIGHT * scale) / 2) - y * scale,
    visibleWidth: Math.min(WORLD_WIDTH, visibleWidth),
    visibleHeight: Math.min(WORLD_HEIGHT, visibleHeight),
  };
}

export async function createArena(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Spelplanen kunde inte laddas.');
  const page = new DOMParser().parseFromString(await response.text(), 'text/html');
  page.querySelectorAll('script, base, meta[http-equiv="refresh"]').forEach(node => node.remove());
  const base = page.createElement('base');
  base.href = response.url;
  page.head.prepend(base);
  const style = page.createElement('style');
  style.textContent = 'html { scrollbar-width: none; scroll-behavior: auto !important; } ::-webkit-scrollbar { display: none; }';
  page.head.append(style);
  const container = document.createElement('div');
  container.id = 'athega-space-arena';
  container.inert = true;
  container.setAttribute('aria-hidden', 'true');
  container.style.cssText = 'position:fixed;inset:0;overflow:hidden;background:#050b14;z-index:2147483646;pointer-events:none';
  const iframe = document.createElement('iframe');
  iframe.title = 'Gemensam spelplan';
  iframe.setAttribute('sandbox', 'allow-same-origin');
  iframe.style.cssText = `position:absolute;width:${WORLD_WIDTH}px;height:${WORLD_HEIGHT}px;border:0;transform-origin:0 0`;
  container.append(iframe);
  iframe.srcdoc = '<!doctype html>' + page.documentElement.outerHTML;
  document.body.append(container);
  try {
    // A sandboxed document may eagerly fetch archive images. The arena only needs
    // its DOM, styles and fonts; waiting for window.load stalls large blog pages.
    await new Promise((resolve, reject) => {
      const started = performance.now();
      const poll = setInterval(() => {
        const doc = iframe.contentDocument;
        // Force layout so web fonts are requested before checking their status.
        doc?.documentElement?.getBoundingClientRect();
        if (doc?.querySelector('main') && doc.readyState !== 'loading'
          && [...doc.querySelectorAll('link[rel="stylesheet"]')].every(link => link.sheet) && doc.fonts.status === 'loaded') {
          clearInterval(poll);
          resolve();
        } else if (performance.now() - started > 15000) {
          clearInterval(poll);
          reject(new Error('Spelplanen tog för lång tid att ladda.'));
        }
      }, 50);
    });
  } catch (error) {
    container.remove();
    throw error;
  }
  return {
    container,
    document: iframe.contentDocument,
    window: iframe.contentWindow,
    position(camera) {
      iframe.style.transform = `translate(${camera.left}px, ${camera.top}px) scale(${camera.scale})`;
    },
    close() { container.remove(); },
  };
}
