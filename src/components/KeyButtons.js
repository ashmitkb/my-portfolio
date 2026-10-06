import { keys } from '../scene/keys';
import { runAction } from '../scene/actions';

const label = (k) =>
  k.letter || (k.legend.text ? k.legend.text.join(' ') : k.id === 'figma' ? 'Design' : 'Like');

/**
 * Real buttons mirroring the 3D keys, for keyboard and screen-reader users.
 * Visually hidden until one of them receives focus.
 */
export default function KeyButtons() {
  return (
    <div className="key-buttons glass-pill" role="group" aria-label="Keyboard shortcuts">
      {keys.map((k) => (
        <button key={k.id} type="button" className="mono" onClick={() => runAction(k)}>
          {label(k)}
        </button>
      ))}
    </div>
  );
}
