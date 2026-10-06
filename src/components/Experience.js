import { experience, extras } from '../data';
import { useInView } from '../hooks';

export default function Experience() {
  const [head, seen] = useInView();
  const [body, bodySeen] = useInView({ threshold: 0.1 });

  return (
    <section id="experience" className="section experience">
      <div ref={head} className={`section__head reveal ${seen ? 'is-in' : ''}`}>
        <p className="eyebrow mono">(03) Experience</p>
        <h2 className="display">
          Where I’ve <em>been</em>
        </h2>
      </div>

      <div ref={body} className={`experience__grid reveal ${bodySeen ? 'is-in' : ''}`}>
        <ol className="timeline glass">
          {experience.map((x) => (
            <li key={x.role + x.when} className="timeline__item">
              <p className="mono timeline__when">{x.when}</p>
              <div>
                <h3 className="timeline__role">{x.role}</h3>
                <p className="timeline__org">{x.org}</p>
                <p className="timeline__text">{x.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="extras">
          {extras.map((g) => (
            <div key={g.title} className="glass panel">
              <h3 className="mono panel__title">{g.title}</h3>
              <ul className="extras__list">
                {g.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
