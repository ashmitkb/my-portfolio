import { useEffect, useRef } from 'react';
import { isFinePointer, prefersReducedMotion } from '../hooks';

// SVG displacement refraction only works inside backdrop-filter on Chromium.
const isChromium = () =>
  typeof navigator !== 'undefined' &&
  /Chrome|Chromium|Edg\//.test(navigator.userAgent) &&
  !/OPR|Firefox/.test(navigator.userAgent);

/**
 * Shared SVG refraction filter (used by glass UI) plus a glass lens that trails
 * the cursor over the hero typography.
 */
export default function Lens() {
  const lens = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('can-refract', isChromium());
    if (!isFinePointer() || prefersReducedMotion()) return undefined;
    const pos = { x: -300, y: -300 };
    const cur = { x: -300, y: -300 };
    let raf;
    const move = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
    };
    const loop = () => {
      cur.x += (pos.x - cur.x) * 0.12;
      cur.y += (pos.y - cur.y) * 0.12;
      if (lens.current) lens.current.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('mousemove', move, { passive: true });
    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <filter id="liquid" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="7" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="3" result="soft" />
          <feDisplacementMap in="SourceGraphic" in2="soft" scale="38" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div ref={lens} className="lens" aria-hidden="true" />
    </>
  );
}
