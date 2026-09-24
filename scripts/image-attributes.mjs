// Adds width/height (from the image file itself) and lazy loading to <img> tags
// in the generated HTML, so pages don't jump while images load. Content files
// stay free of these details. Existing width/height/loading attributes win.
import fs from "node:fs";
import path from "node:path";

const cache = new Map();

function pngSize(b) {
  return b.toString("latin1", 1, 4) === "PNG" ? [b.readUInt32BE(16), b.readUInt32BE(20)] : null;
}

function gifSize(b) {
  return b.toString("latin1", 0, 3) === "GIF" ? [b.readUInt16LE(6), b.readUInt16LE(8)] : null;
}

function jpegSize(b) {
  if (b[0] !== 0xff || b[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const marker = b[i + 1];
    // SOF0–SOF15, except DHT (c4), JPG (c8) and DAC (cc)
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
    }
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
}

function webpSize(b) {
  if (b.toString("latin1", 0, 4) !== "RIFF" || b.toString("latin1", 8, 12) !== "WEBP") return null;
  const kind = b.toString("latin1", 12, 16);
  if (kind === "VP8X") return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  if (kind === "VP8L") {
    const bits = b.readUInt32LE(21);
    return [1 + (bits & 0x3fff), 1 + ((bits >> 14) & 0x3fff)];
  }
  if (kind === "VP8 ") return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
  return null;
}

export function imageSize(file) {
  if (cache.has(file)) return cache.get(file);
  let size = null;
  try {
    const fd = fs.openSync(file, "r");
    try {
      // JPEG size markers can come after large EXIF blocks; 64 KB covers nearly all.
      const buffer = Buffer.alloc(65536);
      const read = fs.readSync(fd, buffer, 0, buffer.length, 0);
      const head = buffer.subarray(0, read);
      size = pngSize(head) ?? gifSize(head) ?? jpegSize(head) ?? webpSize(head);
    } finally {
      fs.closeSync(fd);
    }
  } catch {
    // Missing or unreadable file: leave the tag as it is.
  }
  cache.set(file, size);
  return size;
}

const hasAttribute = (tag, name) => new RegExp(`\\s${name}\\s*=`, "i").test(tag);

export default function imageAttributes(eleventyConfig) {
  eleventyConfig.addTransform("image-attributes", function (content) {
    if (!this.page.outputPath?.endsWith(".html") || !content.includes("<img")) return content;

    // The first image in <main> is usually what the visitor sees first: don't lazy-load it.
    const mainStart = content.indexOf("<main");
    const firstMainImage = mainStart === -1 ? -1 : content.indexOf("<img", mainStart);
    const headerEnd = content.indexOf("</header>");

    return content.replace(/<img\b[^>]*>/g, (tag, offset) => {
      const added = [];
      const src = tag.match(/\ssrc\s*=\s*"([^"]+)"/i)?.[1];
      if (src?.startsWith("/") && !src.startsWith("//") && !hasAttribute(tag, "width") && !hasAttribute(tag, "height")) {
        const size = imageSize(path.join(process.cwd(), decodeURI(src.split(/[?#]/)[0])));
        if (size) added.push(`width="${size[0]}"`, `height="${size[1]}"`);
      }
      const inHeader = headerEnd !== -1 && offset < headerEnd;
      if (!inHeader && offset !== firstMainImage && !hasAttribute(tag, "loading")) added.push('loading="lazy"');
      if (!inHeader && !hasAttribute(tag, "decoding")) added.push('decoding="async"');
      return added.length ? tag.replace(/(\s*\/?>)$/, ` ${added.join(" ")}$1`) : tag;
    });
  });
}
