import { useEffect, useRef } from 'react';
import { about, stats } from '../data';
import { prefersReducedMotion, useInView } from '../hooks';

/** Paragraph whose words light up as you scroll through it. */
export default function About() {
  const wrap = useRef(null);
  const [statsRef, statsSeen] = useInView();
  const words = about.split(' ');

  useEffect(() => {
    const el = wrap.current;
    if (!el) return undefined;
    const spans = Array.from(el.querySelectorAll('.word'));
    if (prefersReducedMotion()) {
      spans.forEach((s) => (s.style.opacity = 1));
      return undefined;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the block's top enters at 85% of viewport, 1 when its bottom hits 45%
      const start = vh * 0.85;
      const end = vh * 0.45;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height)));
      const lit = p * spans.length;
      spans.forEach((s, i) => {
        s.style.opacity = Math.min(1, Math.max(0.14, lit - i + 1)).toFixed(2);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="about" className="section about">
      <p className="eyebrow mono">(02) About</p>
      <p className="about__text" ref={wrap} aria-label={about}>
        {words.map((w, i) => (
          <span className="word" key={i} aria-hidden="true">
            {w}{' '}
          </span>
        ))}
      </p>

      <dl ref={statsRef} className={`stats reveal ${statsSeen ? 'is-in' : ''}`}>
        {stats.map((s) => (
          <div key={s.label} className="stats__item">
            <dt className="mono">{s.label}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
