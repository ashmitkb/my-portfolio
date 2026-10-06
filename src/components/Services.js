import { useState } from 'react';
import { services } from '../data';
import { useInView } from '../hooks';

export default function Services() {
  const [open, setOpen] = useState(0);
  const [ref, seen] = useInView();

  return (
    <section id="services" className="section services">
      <div ref={ref} className={`section__head reveal ${seen ? 'is-in' : ''}`}>
        <p className="eyebrow mono">(04) Capabilities</p>
        <h2 className="display">
          What I <em>do</em>
        </h2>
      </div>

      <ul className="acc glass">
        {services.map((s, i) => {
          const isOpen = open === i;
          return (
            <li key={s.title} className={`acc__item ${isOpen ? 'is-open' : ''}`}>
              <h3>
                <button
                  className="acc__btn"
                  aria-expanded={isOpen}
                  aria-controls={`svc-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  data-cursor="hover"
                >
                  <span className="mono">0{i + 1}</span>
                  <span className="acc__title">{s.title}</span>
                  <span className="acc__plus" aria-hidden="true" />
                </button>
              </h3>
              <div className="acc__panel" id={`svc-${i}`} role="region">
                <div className="acc__panel-inner">
                  <p>{s.body}</p>
                  <ul className="acc__tags mono">
                    {s.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
