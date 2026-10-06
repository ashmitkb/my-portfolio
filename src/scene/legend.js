import { CanvasTexture, SRGBColorSpace } from 'three';

const PX = 256; // canvas pixels per key unit

const FONTS = {
  sans: '"Inter Tight", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
};

function roundRect(g, x, y, w, h, [tl, tr, br, bl]) {
  g.beginPath();
  g.moveTo(x + tl, y);
  g.lineTo(x + w - tr, y);
  g.arcTo(x + w, y, x + w, y + tr, tr);
  g.lineTo(x + w, y + h - br);
  g.arcTo(x + w, y + h, x + w - br, y + h, br);
  g.lineTo(x + bl, y + h);
  g.arcTo(x, y + h, x, y + h - bl, bl);
  g.lineTo(x, y + tl);
  g.arcTo(x, y, x + tl, y, tl);
  g.closePath();
  g.fill();
}

function drawFigma(g, cx, cy, s) {
  const r = s / 2;
  const x0 = cx - s;
  const y0 = cy - 1.5 * s;
  roundRect(g, x0, y0, s, s, [r, 0, 0, r]);
  roundRect(g, x0 + s, y0, s, s, [0, r, r, 0]);
  roundRect(g, x0, y0 + s, s, s, [r, 0, 0, r]);
  g.beginPath();
  g.arc(x0 + 1.5 * s, y0 + 1.5 * s, r, 0, Math.PI * 2);
  g.fill();
  roundRect(g, x0, y0 + 2 * s, s, s, [r, 0, r, r]);
}

function drawHeart(g, cx, cy, s) {
  g.beginPath();
  g.moveTo(cx, cy + s * 0.38);
  g.bezierCurveTo(cx - s * 0.62, cy - s * 0.02, cx - s * 0.42, cy - s * 0.62, cx, cy - s * 0.26);
  g.bezierCurveTo(cx + s * 0.42, cy - s * 0.62, cx + s * 0.62, cy - s * 0.02, cx, cy + s * 0.38);
  g.fill();
}

function drawEnter(g, x, y, s, color) {
  g.strokeStyle = color;
  g.lineWidth = s * 0.12;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  g.beginPath();
  g.moveTo(x + s, y - s * 0.7);
  g.lineTo(x + s, y);
  g.lineTo(x, y);
  g.moveTo(x + s * 0.32, y - s * 0.3);
  g.lineTo(x, y);
  g.lineTo(x + s * 0.32, y + s * 0.3);
  g.stroke();
}

function draw(c, spec, w, d) {
  const g = c.getContext('2d');
  const cw = c.width;
  const ch = c.height;
  g.clearRect(0, 0, cw, ch);
  g.fillStyle = spec.color || '#ffffff';

  if (spec.icon === 'figma') {
    drawFigma(g, cw / 2, ch / 2, ch * 0.2);
    return;
  }
  if (spec.icon === 'heart') {
    drawHeart(g, cw / 2, ch / 2 + ch * 0.03, ch * 0.5);
    return;
  }

  const px = spec.size * PX;
  g.font = `500 ${px}px ${FONTS[spec.font || 'sans']}`;
  if ('letterSpacing' in g) g.letterSpacing = `${(spec.tracking || 0) * px}px`;
  g.textBaseline = 'middle';
  const lh = px * 1.08;

  if (spec.align === 'topleft') {
    g.textAlign = 'left';
    const x = cw * 0.16;
    let y = PX * 0.3;
    spec.text.forEach((line, i) => {
      g.fillText(line, x, y + i * lh);
    });
    if (spec.enter) {
      const last = spec.text[spec.text.length - 1];
      const tw = g.measureText(last).width;
      drawEnter(g, x + tw + px * 0.4, y + (spec.text.length - 1) * lh, px * 0.6, spec.color);
    }
    return;
  }

  g.textAlign = 'center';
  const total = (spec.text.length - 1) * lh;
  spec.text.forEach((line, i) => {
    g.fillText(line, cw / 2 + (spec.dx || 0) * PX, ch / 2 - total / 2 + i * lh);
  });
}

/** Draws a keycap legend onto a canvas texture sized to the key (no CDN fonts). */
export function legendTexture(spec, w, d) {
  const c = document.createElement('canvas');
  c.width = Math.round(PX * w);
  c.height = Math.round(PX * d);
  draw(c, spec, w, d);
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  // redraw once web fonts are ready so legends use the site typefaces
  if (document.fonts && document.fonts.status !== 'loaded') {
    document.fonts.ready.then(() => {
      draw(c, spec, w, d);
      tex.needsUpdate = true;
    });
  }
  return tex;
}
