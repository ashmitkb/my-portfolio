import { useRef, useState } from 'react';
import { projects } from '../data';
import { isFinePointer, useInView } from '../hooks';

const art = (c) =>
  `radial-gradient(circle at 25% 30%, ${c[0]} 0%, transparent 55%),
   radial-gradient(circle at 80% 75%, ${c[1]} 0%, transparent 50%),
   ${c[2]}`;

export default function Work() {
  const [active, setActive] = useState(null);
  const preview = useRef(null);
  const [head, seen] = useInView();

  const onMove = (e) => {
    if (!preview.current || !isFinePointer()) return;
    preview.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
  };

  return (
    <section id="work" className="section work" onMouseMove={onMove}>
      <div ref={head} className={`section__head reveal ${seen ? 'is-in' : ''}`}>
        <p className="eyebrow mono">(01) Selected Work</p>
        <h2 className="display">
          Things I’ve <em>made</em>
        </h2>
      </div>

      <ul className="work__list" onMouseLeave={() => setActive(null)}>
        {projects.map((p, i) => (
          <WorkRow
            key={p.id}
            p={p}
            index={i}
            dimmed={active !== null && active !== i}
            onEnter={() => setActive(i)}
          />
        ))}
      </ul>

      <div
        ref={preview}
        className={`work__preview ${active !== null ? 'is-on' : ''}`}
        aria-hidden="true"
      >
        <div
          className="work__preview-card"
          style={{ background: active !== null ? art(projects[active].colors) : 'none' }}
        >
          <span className="mono">{active !== null ? projects[active].kind : ''}</span>
        </div>
      </div>
    </section>
  );
}

function WorkRow({ p, index, dimmed, onEnter }) {
  const [ref, seen] = useInView({ threshold: 0.3 });
  return (
    <li
      ref={ref}
      className={`work__row reveal ${seen ? 'is-in' : ''} ${dimmed ? 'is-dim' : ''}`}
      style={{ '--delay': `${index * 70}ms` }}
      onMouseEnter={onEnter}
      onFocus={onEnter}
    >
      <a href={p.href} data-cursor="view" data-cursor-label="View">
        <span className="work__id mono">{p.id}</span>
        <span className="work__title">{p.title}</span>
        <span className="work__kind">{p.kind}</span>
        <span className="work__tags mono">{p.tags.join(' / ')}</span>
        <span className="work__year mono">{p.year}</span>
        <span className="work__thumb" style={{ background: art(p.colors) }} aria-hidden="true" />
      </a>
    </li>
  );
}
