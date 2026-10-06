import appleImg from './assets/apple.png';
import learnImg from './assets/1learntls.png';
import meImg from './assets/me.jpg';

// All copy lives here — edit this file to make the site yours.
// Items marked PLACEHOLDER are stand-ins until you send the real details.

export const profile = {
  name: 'Ashmit',
  fullName: 'Ashmit Kiran Bhandary',
  role: 'Frontend Developer & 3D Enthusiast',
  email: 'ashmitbdry@gmail.com',
  location: 'Bangalore, India',
  timeZone: 'Asia/Kolkata',
  photo: meImg,
  // Set these to URLs to make the Résumé and Figma keys open them directly.
  resume: null,
  figma: null,
  intro:
    'I build bold, fast interfaces where motion, 3D and engineering meet.',
};

export const about =
  'I’m a frontend developer who loves the details you feel but can’t always name — the weight of a button press, the rhythm of a headline, the way light bends through glass. I turn ambitious ideas into interfaces that are quick, accessible and quietly unforgettable.';

export const now = [
  // PLACEHOLDER — based on repo names; replace with what you want to say.
  { label: 'Machine learning', text: 'F1 tire compound prediction with a BiLSTM' },
  { label: 'Apps', text: 'Bitewise & a diet tracker' },
  { label: 'Games', text: '2D Penalty and other game-dev experiments' },
];

export const skills = [
  { group: 'Front-end', items: ['React', 'JavaScript', 'HTML5', 'CSS / SCSS', 'Responsive design'] },
  { group: '3D & motion', items: ['Three.js', 'React Three Fiber', 'GSAP', 'GLSL (learning)'] },
  { group: 'Tooling', items: ['Node.js', 'Git', 'Vite / CRA'] },
];

export const projects = [
  {
    id: '01',
    title: 'Apple Website Replica',
    kind: 'Interactive web',
    year: '2025',
    tags: ['React', 'GSAP', 'Full stack'],
    image: appleImg,
    href: 'https://github.com/ashmitkb/react-apple-replica-project',
    colors: ['#ff9d8a', '#8fc4ff', '#14101f'],
  },
  {
    id: '02',
    title: '1Learn',
    kind: 'E-commerce platform',
    year: '2025',
    tags: ['React'],
    image: learnImg,
    href: 'https://1learntls.com/',
    colors: ['#8fc4ff', '#9fe6d6', '#0d1b2e'],
  },
  {
    // PLACEHOLDER
    id: '03',
    title: 'Project Three',
    kind: 'Coming soon',
    year: '2026',
    tags: ['Your stack here'],
    href: '#contact',
    colors: ['#c9b8ff', '#ff8a73', '#1a1030'],
  },
  {
    // PLACEHOLDER
    id: '04',
    title: 'Project Four',
    kind: 'Coming soon',
    year: '2026',
    tags: ['Your stack here'],
    href: '#contact',
    colors: ['#ffe08a', '#ff6b8f', '#24101a'],
  },
];

export const services = [
  {
    title: 'Creative Development',
    body: 'Pixel-faithful builds with buttery motion — scroll choreography, micro-interactions and real-time 3D moments that make people stop and play.',
    items: ['Motion & animation', 'Three.js / R3F', 'Interactive storytelling'],
  },
  {
    title: 'Front-end Engineering',
    body: 'Scalable React architecture and rock-solid performance. Accessible by default, fast on the worst phone in the room.',
    items: ['React', 'Design systems', 'Performance & a11y'],
  },
  {
    title: 'Design Direction',
    body: 'From first sketch to final polish: typography, layout and art direction that give a product a point of view.',
    items: ['UI / UX', 'Prototyping', 'Visual identity'],
  },
];

export const marqueeWords = ['Design', 'Motion', 'Code', '3D', 'Craft', 'Detail'];

export const socials = [
  { label: 'GitHub', href: 'https://github.com/ashmitkb' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ashmit-bhandary-aba060307/' },
  { label: 'X', href: 'https://twitter.com/ashmitkb' },
];
