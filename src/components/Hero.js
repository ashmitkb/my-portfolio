import { useEffect, useRef } from 'react';
import { profile } from '../data';
import { isFinePointer, prefersReducedMotion } from '../hooks';

const Line = ({ children, delay }) => (
  <span className="mask">
    <span className="mask__inner" style={{ '--d': `${delay}ms` }}>
      {children}
    </span>
  </span>
);

export default function Hero({ ready }) {
  const blob = useRef(null);

  // a soft light that eases toward the pointer
  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return undefined;
    const target = { x: 0.5, y: 0.5 };
    const cur = { x: 0.5, y: 0.5 };
    let raf;
    const onMove = (e) => {
      target.x = e.clientX / window.innerWidth;
      target.y = e.clientY / window.innerHeight;
    };
    const loop = () => {
      cur.x += (target.x - cur.x) * 0.06;
      cur.y += (target.y - cur.y) * 0.06;
      if (blob.current) {
        blob.current.style.setProperty('--mx', `${(cur.x * 100).toFixed(2)}%`);
        blob.current.style.setProperty('--my', `${(cur.y * 100).toFixed(2)}%`);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="top" className={`hero ${ready ? 'is-ready' : ''}`}>
      <div ref={blob} className="hero__glow" aria-hidden="true" />

      <p className="hero__eyebrow mono">
        <span className="dot" /> Available for new projects
      </p>

      <h1 className="hero__title" aria-label={`${profile.name}, ${profile.role}`}>
        <Line delay={0}>Creative</Line>
        <Line delay={120}>
          <em>Developer</em> &amp;
        </Line>
        <Line delay={240}>Designer.</Line>
      </h1>

      <div className="hero__foot">
        <p className="hero__intro">{profile.intro}</p>
        <a href="#work" className="hero__scroll mono" data-cursor="hover">
          Scroll
          <span className="hero__arrow" aria-hidden="true">
            ↓
          </span>
        </a>
      </div>
    </section>
  );
}
