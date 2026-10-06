import { useEffect } from 'react';

// SVG displacement refraction only works inside backdrop-filter on Chromium.
const isChromium = () =>
  typeof navigator !== 'undefined' &&
  /Chrome|Chromium|Edg\//.test(navigator.userAgent) &&
  !/OPR|Firefox/.test(navigator.userAgent);

/** Shared SVG refraction filter used by the liquid-glass pills and buttons. */
export default function GlassFilter() {
  useEffect(() => {
    document.documentElement.classList.toggle('can-refract', isChromium());
  }, []);

  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <filter id="liquid" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="7" result="noise" />
        <feGaussianBlur in="noise" stdDeviation="3" result="soft" />
        <feDisplacementMap in="SourceGraphic" in2="soft" scale="38" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
