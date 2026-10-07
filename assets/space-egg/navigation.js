export function internalDestination(href, currentUrl) {
  if (typeof href !== 'string' || !href) return null;
  let destination;
  try { destination = new URL(href, currentUrl); } catch { return null; }
  if (destination.origin !== new URL(currentUrl).origin || !['https:', 'http:'].includes(destination.protocol)) return null;
  // Only navigate to site pages, never downloads or standalone blog demos.
  if (destination.pathname.startsWith('/assets/') || /\.[^/]+$/.test(destination.pathname) && !/\.html?$/.test(destination.pathname)) return null;
  return destination;
}

