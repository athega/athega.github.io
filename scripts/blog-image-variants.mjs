// Run manually with local image paths; generated files are committed, not built in CI.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { imageSize } from './image-attributes.mjs';

const files = process.argv.slice(2);
if (!files.length) throw new Error('Usage: node scripts/blog-image-variants.mjs assets/blog/image.webp ... (requires cwebp)');
const manifestFile = '_data/blogImages.json';
const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
mkdirSync('assets/img/blog-cards', { recursive: true });
for (const file of files) {
  const relative = path.relative(process.cwd(), path.resolve(file));
  if (relative.startsWith('..') || !/\.(png|jpe?g|webp)$/i.test(relative)) {
    throw new Error(`Expected a local PNG, JPEG or WebP: ${file}`);
  }
  const size = imageSize(relative);
  if (!size) throw new Error(`Cannot read image dimensions: ${file}`);
  const bytes = readFileSync(relative);
  // Animated WebP must keep its frames; cwebp only encodes still images.
  if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 12, 16) === 'VP8X' && (bytes[20] & 2)) {
    console.log(`Keeping animated original: ${file}`);
    continue;
  }
  const source = '/' + relative;
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 16);
  const candidates = [];
  for (const width of [192, 384, 768]) {
    if (width >= size[0]) continue;
    const output = `assets/img/blog-cards/${hash}-${width}.webp`;
    execFileSync('cwebp', ['-quiet', '-q', '80', '-resize', String(width), '0', relative, '-o', output]);
    candidates.push(`/${output} ${width}w`);
  }
  candidates.push(`${source} ${size[0]}w`);
  manifest[source] = candidates.join(', ');
}
writeFileSync(manifestFile, JSON.stringify(Object.fromEntries(Object.entries(manifest).sort()), null, 2) + '\n');
console.log(`Updated ${files.length} blog images.`);
