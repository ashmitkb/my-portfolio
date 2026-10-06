import { profile } from '../data';

export const toast = (message) =>
  window.dispatchEvent(new CustomEvent('toast', { detail: message }));

const go = (selector) =>
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });

let typed = '';
let typedTimer;

function readLikes() {
  try {
    return Number(localStorage.getItem('likes')) || 0;
  } catch {
    return 0;
  }
}

function saveLikes(n) {
  try {
    localStorage.setItem('likes', String(n));
  } catch {
    /* storage unavailable — the count just won't persist */
  }
}

/** What each key on the 3D keyboard (and its accessible twin button) does. */
export function runAction(key) {
  switch (key.action) {
    case 'works':
      go('#work');
      break;
    case 'resume':
      go('#experience');
      break;
    case 'figma':
      if (profile.figma) window.open(profile.figma, '_blank', 'noopener');
      else go('#services');
      break;
    case 'hire':
      toast('Let’s talk — I’m open to work ✦');
      go('#contact');
      break;
    case 'heart': {
      const n = readLikes() + 1;
      saveLikes(n);
      toast(`♥ × ${n} — thanks for the love`);
      window.dispatchEvent(new CustomEvent('scene-burst'));
      break;
    }
    case 'letter':
      typeLetter(key.letter);
      break;
    default:
  }
}

/** U · I · U · X typed on the pad (or a real keyboard) unlocks a little easter egg. */
export function typeLetter(letter) {
  typed = (typed + letter).slice(-4);
  clearTimeout(typedTimer);
  typedTimer = setTimeout(() => (typed = ''), 2500);
  if (typed === 'UIUX') {
    typed = '';
    toast('UI/UX unlocked ✦ — here’s what I do');
    window.dispatchEvent(new CustomEvent('scene-burst'));
    go('#services');
  } else {
    toast(`${typed.split('').join(' ')}${' _'.repeat(4 - typed.length)}   — try U I U X`);
  }
}
