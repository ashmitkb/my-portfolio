import { otherWork, projects } from '../data';
import { useInView } from '../hooks';

const art = (c) =>
  `radial-gradient(circle at 20% 25%, ${c[0]} 0%, transparent 55%),
   radial-gradient(circle at 85% 80%, ${c[1]} 0%, transparent 50%), ${c[2]}`;

const track = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
};

/** Typographic artwork for projects without a screenshot yet. */
function Poster({ poster }) {
  return (
    <div className="poster" aria-hidden="true">
      <span className={`poster__word ${poster.serif ? 'is-serif' : ''}`}>{poster.word}</span>
      {poster.tires && (
        <span className="poster__tires">
          <i style={{ '--c': '#ff3b3b' }} />
          <i style={{ '--c': '#ffd23f' }} />
          <i style={{ '--c': '#f4f1ea' }} />
        </span>
      )}
      <span className="poster__sub mono">{poster.sub}</span>
    </div>
  );
}

function Card({ p }) {
  const external = p.href && p.href.startsWith('http');
  const Tag = p.href ? 'a' : 'article';
  const linkProps = p.href
    ? {
        href: p.href,
        target: external ? '_blank' : undefined,
        rel: external ? 'noopener noreferrer' : undefined,
        'data-cursor': 'view',
        'data-cursor-label': external && p.href.includes('github.com') ? 'Code' : 'Open',
        'data-cursor-arrow': '',
      }
    : {};

  return (
    <Tag className={`card glass ${p.href ? 'is-link' : ''}`} onMouseMove={track} {...linkProps}>
      <div className="card__media" style={{ background: art(p.colors) }}>
        {p.image ? (
          <img src={p.image} alt={`${p.title} preview`} loading="lazy" />
        ) : (
          <Poster poster={p.poster} />
        )}
        <span className="card__id mono">{p.id}</span>
      </div>
      <div className="card__body">
        <p className="mono card__meta">
          {p.kind}
          {p.year && ` · ${p.year}`}
        </p>
        <h3 className="card__title">{p.title}</h3>
        <p className="card__hook">{p.hook}</p>
        {p.highlights && (
          <ul className="card__points">
            {p.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
        <ul className="tags mono">
          {p.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        {p.href && (
          <span className="card__go" aria-hidden="true">
            ↗
          </span>
        )}
      </div>
    </Tag>
  );
}

export default function Work() {
  const [head, seen] = useInView();
  const [more, moreSeen] = useInView();
  return (
    <section id="work" className="section work">
      <div ref={head} className={`section__head reveal ${seen ? 'is-in' : ''}`}>
        <p className="eyebrow mono">(01) Selected Work</p>
        <h2 className="display">
          Things I’ve <em>built</em>
        </h2>
      </div>

      <ul className="stack">
        {projects.map((p, i) => (
          <li key={p.id} className="stack__item" style={{ '--i': i }}>
            <Card p={p} />
          </li>
        ))}
      </ul>

      <div ref={more} className={`other reveal ${moreSeen ? 'is-in' : ''}`}>
        <h3 className="mono other__title">Also on the bench</h3>
        <ul className="other__grid">
          {otherWork.map((o) => (
            <li key={o.title} className="glass panel" onMouseMove={track}>
              <h4>{o.title}</h4>
              <p>{o.text}</p>
              <ul className="tags mono">
                {o.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
