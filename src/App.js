import { useRef, useState } from 'react';
import './App.css';
import { useScrollProgressVar } from './hooks';
import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Work from './components/Work';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';

function App() {
  const root = useRef(null);
  const [ready, setReady] = useState(false);
  useScrollProgressVar(root);

  return (
    <div className="App" ref={root}>
      <Preloader onDone={() => setReady(true)} />
      <Cursor />
      <div className="progress" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <a className="skip" href="#work">
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <Work />
        <About />
        <Services />
      </main>
      <Contact />
    </div>
  );
}

export default App;
