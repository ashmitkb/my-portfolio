import learnImg from './assets/1learntls.png';
import bcaImg from './assets/bca-directory.jpg';
import meImg from './assets/me.jpg';

// All copy lives here — edit this file to make the site yours.

export const profile = {
  name: 'Ashmit',
  fullName: 'Ashmit Kiran Bhandary',
  role: 'Developer — web, AI & IoT',
  tagline: 'BCA ’27 · CHRIST University, Bengaluru',
  email: 'ashmitbdry@gmail.com',
  location: 'Bengaluru, India',
  timeZone: 'Asia/Kolkata',
  photo: meImg,
  // Set to a URL to make the Figma key open it directly.
  figma: null,
  // Cursor style: 'droplet', 'ring' or 'invert'. Try them live with ?cursor=ring etc.
  cursor: 'droplet',
  intro:
    'I build things where curiosity, code and data meet — cinematic websites, local-first AI and IoT systems for the real world.',
};

export const about =
  'I’m a BCA student at CHRIST University, Bengaluru, who builds things that go beyond coursework — premium websites for real clients, an AI system that clears traffic for ambulances, and a voice assistant that runs entirely on my own laptop. I care about the details people feel, whether that’s a scroll animation or a p-value.';

export const now = [
  {
    label: 'Green Corridor',
    text: 'Building the full model for a pilot junction offered by Bengaluru Traffic Police. Patent filing in progress.',
  },
  {
    label: 'F1 research',
    text: 'Training a Bi-LSTM to predict Soft, Medium or Hard tire choices from lap and telemetry data.',
  },
  {
    label: 'Deo',
    text: 'Next up: a free wake-word engine and more reliable tool-calling.',
  },
];

export const aboutStats = [
  { value: 382, label: 'Survey responses analysed in my research internship' },
  { value: 20, label: 'Papers reviewed for my F1 research' },
  { value: 2, label: 'Inter-university first places' },
  { value: 3, label: 'Languages — English, Hindi & Kannada' },
];

export const offKeyboard = [
  { label: 'Football', text: 'Captain of my department team — strategy on and off the pitch.' },
  { label: 'Gaming', text: 'Ran team operations for Vizerion, CHRIST’s gaming club.' },
  { label: 'Game dev', text: 'Building a Unity game with a friend, together over GitHub.' },
  { label: 'Abroad', text: 'Spent a semester at Edge Hill University in England.' },
];

export const skills = [
  { group: 'Code & web', items: ['Python', 'JavaScript', 'React', 'Node / Express', 'SQL', 'HTML & CSS'] },
  { group: 'AI & data', items: ['PyTorch / TensorFlow', 'Pandas · NumPy', 'Matplotlib / Seaborn', 'Ollama', 'Statistical modelling'] },
  { group: 'Systems & more', items: ['ESP32', 'Raspberry Pi', 'LoRa', 'Unity', 'Git', '3D modelling'] },
];

// Featured work. `href` is optional — cards without one aren't links.
// `poster` draws typographic artwork when there's no screenshot yet.
export const projects = [
  {
    id: '01',
    title: 'AI-Driven Green Corridor',
    kind: 'IoT · AI',
    year: 'Jan 2025 – now',
    hook: 'When an ambulance is stuck at a red light, a green signal isn’t enough — the traffic ahead has to clear too. This system does both.',
    highlights: [
      'Demoed to the Bengaluru Traffic Police Commissioner, who offered a junction for a pilot',
      'Siren detection relayed over LoRa, confirmed by camera, signal override via ESP32',
      'Patent filing in progress',
    ],
    tags: ['ESP32-S3', 'LoRa', 'Raspberry Pi', 'Google Coral'],
    href: 'https://github.com/ashmitkb/Green_corridor_project',
    poster: { word: 'GREEN', sub: 'Siren → LoRa → signal override' },
    colors: ['#5ee0b8', '#2b6f8f', '#061517'],
  },
  {
    id: '02',
    title: 'YUKI',
    kind: 'Restaurant websites',
    hook: 'Two premium single-page sites for Bengaluru restaurants that feel as considered as the food.',
    highlights: [
      'Japanese omakase site with cinematic scroll, parallax and glass navigation',
      'Pan-Asian cocktail bar site, refined over several versions with heavy mobile polish',
    ],
    tags: ['HTML', 'CSS', 'JavaScript'],
    href: 'https://github.com/ashmitkb/yuki',
    poster: { word: '雪', sub: 'Yuki — omakase & cocktail bar', serif: true },
    colors: ['#ff9d8a', '#5a1a2a', '#0d0608'],
  },
  {
    id: '03',
    title: 'Deo',
    kind: 'Local voice assistant',
    year: 'Mar – Jul 2026',
    hook: 'A voice assistant that runs entirely on my own laptop — no cloud required.',
    highlights: [
      'faster-whisper in, a local Qwen2.5 7B for reasoning, Piper TTS out',
      'Tool-calling for apps, web search and productivity; persistent JSON memory',
      'Successor to JARVIS, my earlier PyQt5 desktop assistant',
    ],
    tags: ['Python', 'Ollama', 'faster-whisper', 'Piper TTS'],
    poster: { word: 'Deo', sub: 'On-device · no cloud', serif: true },
    colors: ['#8f6bff', '#2b1d6e', '#0b0818'],
  },
  {
    id: '04',
    title: 'F1 Tire Compound Prediction',
    kind: 'ML research paper',
    year: 'Jun 2026 – now',
    hook: 'Can race data predict which tire a team will choose? A research paper that tries to answer that.',
    highlights: [
      'Bi-LSTM predicting Soft, Medium or Hard from lap and telemetry data',
      'Extends Sasikumar et al. (2025) with a new car-setup archetype feature',
      '20-paper literature review and full EDA done',
    ],
    tags: ['Python', 'PyTorch', 'FastF1'],
    href: 'https://github.com/ashmitkb/f1-tire-compound-bilstm',
    poster: { word: 'F1', sub: 'Soft · Medium · Hard', tires: true },
    colors: ['#ff4b3b', '#5a1010', '#0e0606'],
  },
  {
    id: '05',
    title: 'BCA Batch Directory',
    kind: 'Web app',
    hook: 'A home on the web for my entire 2023–27 BCA batch at CHRIST, YPR campus.',
    highlights: [
      'Profiles auto-populated from each student’s résumé via a Google Form',
      'Slide-out profile drawer, scroll progress, navy-and-gold glass UI',
    ],
    tags: ['React', 'Vite'],
    image: bcaImg,
    href: 'https://bca-4th-year-brochure.vercel.app/',
    colors: ['#e8c26b', '#1b2a55', '#070b18'],
  },
  {
    id: '06',
    title: '1learnTLS',
    kind: 'Company website · paid client work',
    year: 'Mar – Jun 2025',
    hook: 'My first paid client work: a company website taken from a blank page to a live deployment.',
    highlights: ['Designed, built and deployed independently, hitting every milestone on schedule'],
    tags: ['Design', 'Development', 'Deployment'],
    image: learnImg,
    href: 'https://1learntls.com/',
    colors: ['#8fc4ff', '#9fe6d6', '#0d1b2e'],
  },
];

export const otherWork = [
  {
    title: 'Game development',
    text: 'Working on a few game projects in Unity and C# — designing mechanics and building playable prototypes.',
    tags: ['Unity', 'C#', 'Game design'],
  },
];

export const experience = [
  {
    when: 'Nov 2025 – Mar 2026',
    role: 'Research Intern',
    org: 'CHRIST (Deemed to be University)',
    text: 'Faculty seed-money study on how smartphone addiction, academic anxiety and cybersecurity behaviour connect among students. Owned the data pipeline end to end — 382 respondents, reliability checks and binary logistic regression in Python. Findings feed a proposed IT policy addendum on digital wellbeing.',
  },
  {
    when: 'Mar – Jun 2025',
    role: 'Web Development Intern (paid)',
    org: '1learnTLS, Bengaluru',
    text: 'Built the company website from scratch — design to deployment — and met every deadline independently.',
  },
  {
    when: 'Jan – May 2025',
    role: 'Semester exchange',
    org: 'Edge Hill University, England',
    text: 'Fourth semester of my BCA, studied in the UK.',
  },
  {
    when: '2023 – 2027',
    role: 'Bachelor of Computer Applications',
    org: 'CHRIST (Deemed to be University), Bengaluru',
    text: 'Data analysis, web development and machine learning.',
  },
];

export const extras = [
  {
    title: 'Leadership',
    items: [
      'Team operations lead — Vizerion Gaming Club, CHRIST (2025–26)',
      'Captain — departmental football team, 15 players (2024–25)',
    ],
  },
  {
    title: 'Awards',
    items: [
      '1st place — inter-university tech quiz, Presidency University (Dec 2024)',
      '1st place — inter-university treasure hunt, Bishop Cotton Academy (Jan 2025)',
    ],
  },
  {
    title: 'Certifications',
    items: ['Google Data Analytics (2026)', 'AWS Cloud (2025)', 'E-Business — NPTEL (2025)'],
  },
];

export const services = [
  {
    title: 'Web Development',
    body: 'Cinematic, mobile-polished websites — scroll animation, parallax and glass UI — taken from a blank page to a live deployment.',
    items: ['1learnTLS', 'YUKI', 'React · Vite'],
  },
  {
    title: 'AI & Machine Learning',
    body: 'Local-first AI and ML research: on-device voice assistants, sequence models on race telemetry, and statistics that hold up.',
    items: ['Deo', 'F1 Bi-LSTM', 'Logistic regression'],
  },
  {
    title: 'IoT & Systems',
    body: 'Hardware and software that work together in the real world — sensors, long-range radio and edge AI wired into existing infrastructure.',
    items: ['ESP32 · LoRa', 'Raspberry Pi + Coral', 'Green Corridor'],
  },
];

export const marqueeWords = ['Web', 'AI', 'IoT', 'Data', 'Motion', 'Research'];

export const socials = [
  { label: 'GitHub', href: 'https://github.com/ashmitkb' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ashmit-bhandary/' },
  { label: 'X', href: 'https://twitter.com/ashmitkb' },
];
