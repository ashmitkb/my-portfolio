import { CanvasTexture, SRGBColorSpace } from 'three';

const cache = new Map();

/** Draws a keycap legend onto a canvas texture (no font/CDN dependency). */
export function legendTexture(text, { color = '#ffffff', size = 1 } = {}) {
  const key = `${text}|${color}|${size}`;
  if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const g = c.getContext('2d');
  g.clearRect(0, 0, c.width, c.height);
  g.fillStyle = color;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const px = (text.length > 4 ? 78 : text.length > 1 ? 104 : 168) * size;
  g.font = `600 ${px}px "Inter Tight", system-ui, sans-serif`;
  g.fillText(text, c.width / 2, c.height / 2 + px * 0.04);
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  cache.set(key, tex);
  return tex;
}
