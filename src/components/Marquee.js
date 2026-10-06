import { useEffect, useRef } from 'react';
import { marqueeWords } from '../data';
import { prefersReducedMotion } from '../hooks';

/** Infinite marquee whose speed and skew react to scroll velocity. */
export default function Marquee() {
  const track = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    let x = 0;
    let dir = -1;
    let boost = 0;
    let lastY = window.scrollY;
    let raf = 0;
    const loop = () => {
      const y = window.scrollY;
      const v = y - lastY;
      lastY = y;
      if (v !== 0) dir = v > 0 ? -1 : 1;
      boost += (Math.min(Math.abs(v), 60) - boost) * 0.1;
      x += dir * (0.6 + boost * 0.35);
      const el = track.current;
      if (el) {
        const half = el.scrollWidth / 2;
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        el.style.transform = `translate3d(${x}px,0,0) skewX(${(-dir * boost * 0.12).toFixed(2)}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    // only animate while the strip is on screen
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !raf) {
        lastY = window.scrollY;
        raf = requestAnimationFrame(loop);
      } else if (!entry.isIntersecting && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    if (track.current) io.observe(track.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const row = marqueeWords.map((w, i) => (
    <span className="marquee__item" key={w}>
      {i % 2 ? <em>{w}</em> : w}
      <span className="marquee__star" aria-hidden="true">
        ✦
      </span>
    </span>
  ));

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track" ref={track}>
        {row}
        {row}
      </div>
    </div>
  );
}
