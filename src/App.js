import { useState } from 'react';
import './App.css';
import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Work from './components/Work';
import About from './components/About';
import Services from './components/Services';
import Experience from './components/Experience';
import Contact from './components/Contact';
import SceneLayer from './components/SceneLayer';
import GlassFilter from './components/GlassFilter';
import Toast from './components/Toast';

function App() {
  const [ready, setReady] = useState(false);

  return (
    <div className="App">
      <div className="bg-layer" aria-hidden="true" />
      <Preloader onDone={() => setReady(true)} />
      <Cursor />
      <GlassFilter />
      <SceneLayer />
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
        <Experience />
        <Services />
      </main>
      <Contact />
      <Toast />
    </div>
  );
}

export default App;
