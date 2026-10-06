import { projects } from '../data';
import { useInView } from '../hooks';

const art = (c) =>
  `radial-gradient(circle at 20% 25%, ${c[0]} 0%, transparent 55%),
   radial-gradient(circle at 85% 80%, ${c[1]} 0%, transparent 50%), ${c[2]}`;

const track = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
};

export default function Work() {
  const [head, seen] = useInView();
  return (
    <section id="work" className="section work">
      <div ref={head} className={`section__head reveal ${seen ? 'is-in' : ''}`}>
        <p className="eyebrow mono">(01) Selected Work</p>
        <h2 className="display">
          Things I’ve <em>made</em>
        </h2>
      </div>

      <ul className="stack">
        {projects.map((p, i) => (
          <li key={p.id} className="stack__item" style={{ '--i': i }}>
            <a
              className="card glass"
              href={p.href}
              target={p.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              onMouseMove={track}
              data-cursor="view"
              data-cursor-label="Open"
            >
              <div className="card__media" style={{ background: art(p.colors) }}>
                {p.image && <img src={p.image} alt={`${p.title} preview`} loading="lazy" />}
                <span className="card__id mono">{p.id}</span>
              </div>
              <div className="card__body">
                <p className="mono card__meta">
                  {p.kind} · {p.year}
                </p>
                <h3 className="card__title">{p.title}</h3>
                <ul className="tags mono">
                  {p.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <span className="card__go" aria-hidden="true">
                  ↗
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
