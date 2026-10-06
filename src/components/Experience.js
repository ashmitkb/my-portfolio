import { useEffect, useRef } from 'react';
import { awards, certifications, experience, leadership } from '../data';
import { prefersReducedMotion, useInView } from '../hooks';

const track = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
};

/** Timeline whose rail draws itself as you scroll; each node lights up as its entry arrives. */
function Timeline() {
  const list = useRef(null);

  useEffect(() => {
    const el = list.current;
    if (!el) return undefined;
    const items = Array.from(el.querySelectorAll('.xp__item'));
    if (prefersReducedMotion()) {
      el.style.setProperty('--draw', 1);
      items.forEach((it) => it.classList.add('is-lit'));
      return undefined;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.62; // the "now" line the rail draws down to
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
      el.style.setProperty('--draw', p.toFixed(4));
      items.forEach((it) => it.classList.toggle('is-lit', it.getBoundingClientRect().top + 28 < line));
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
    <ol className="xp__timeline" ref={list}>
      <span className="xp__rail" aria-hidden="true">
        <span className="xp__rail-fill" />
      </span>
      {experience.map((x, i) => (
        <li
          key={x.role + x.when}
          className="xp__item"
          // the 3D keyboard stays out of view until the last entry
          id={i === experience.length - 1 ? 'experience-end' : undefined}
        >
          <span className="xp__node" aria-hidden="true" />
          <article className="xp__card glass" onMouseMove={track}>
            <header className="xp__head">
              <span className="xp__mono" aria-hidden="true">
                {x.mono}
              </span>
              <div>
                <p className="xp__meta mono">
                  <span className="xp__type">{x.type}</span>
                  <span>{x.when}</span>
                </p>
                <h3 className="xp__role">{x.role}</h3>
                <p className="xp__org">{x.org}</p>
              </div>
            </header>
            <p className="xp__text">{x.text}</p>
            {x.facts && (
              <ul className="tags mono">
                {x.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            )}
          </article>
        </li>
      ))}
    </ol>
  );
}

export default function Experience() {
  const [head, seen] = useInView();
  const [side, sideSeen] = useInView({ threshold: 0.1 });

  return (
    <section id="experience" className="section experience">
      <div ref={head} className={`section__head reveal ${seen ? 'is-in' : ''}`}>
        <p className="eyebrow mono">(03) Experience</p>
        <h2 className="display">
          Where I’ve <em>been</em>
        </h2>
      </div>

      <div id="experience-body" className="xp">
        <Timeline />

        <aside ref={side} className={`xp__side reveal ${sideSeen ? 'is-in' : ''}`} aria-label="Highlights">
          <section className="xp__block glass panel" onMouseMove={track}>
            <h3 className="mono panel__title">Awards</h3>
            <ul className="awards">
              {awards.map((a) => (
                <li key={a.event} className="award">
                  <span className="award__place">{a.place}</span>
                  <div>
                    <p className="award__event">{a.event}</p>
                    <p className="award__where mono">
                      {a.where} · {a.when}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="xp__block glass panel" onMouseMove={track}>
            <h3 className="mono panel__title">Leadership</h3>
            <ul className="roles">
              {leadership.map((l) => (
                <li key={l.role}>
                  <p className="roles__role">{l.role}</p>
                  <p className="roles__org">
                    {l.org} <span className="mono">· {l.when}</span>
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="xp__block glass panel" onMouseMove={track}>
            <h3 className="mono panel__title">Certifications</h3>
            <ul className="certs">
              {certifications.map((c) => (
                <li key={c.name}>
                  <span className="certs__name">{c.name}</span>
                  <span className="certs__by mono">{c.by}</span>
                  <span className="certs__when mono">{c.when}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </section>
  );
}
