// Updated App.jsx with improved loading and hero text visibility
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SplineScene from './components/SplineScene';
import AnimatedBackground from './components/AnimatedBackground';
import ThemeToggle from './components/ThemeToggle';
import useScrollObserver from './hooks/useScrollObserver';
import './App.css';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [theme, setTheme] = useState('light');
  const sectionRefs = {
    home: useRef(null),
    about: useRef(null),
    projects: useRef(null),
    contact: useRef(null)
  };

  // Theme effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  // Effect for initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Use our custom scroll observer hook
  useScrollObserver(sectionRefs, setActiveSection);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app">
      <AnimatedBackground />
      {loading ? (
        <div className="loader">
          <div className="spinner"></div>
          <h2 className="loader-text">Preparing your 3D experience...</h2>
        </div>
      ) : (
        <>
          <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

          <main>
            <section 
              id="home" 
              className={`hero-section ${activeSection === 'home' ? 'active' : ''}`}
              ref={sectionRefs.home}
            >
              <div className="spline-container">
                <SplineScene />
                <div className="hero-content">
                  <h1 className="typewriter">
                    Hello, I'm <span className="highlight">Ashmit</span>
                  </h1>
                  <p className="subtitle fade-in-up">Frontend Developer & 3D Enthusiast</p>
                  <button 
                    className="cta-button pulse-animation" 
                    onClick={() => {
                      setActiveSection('about');
                      sectionRefs.about.current.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Explore My Work
                  </button>
                </div>
              </div>
            </section>

            <About activeSection={activeSection} sectionRef={sectionRefs.about} />
            <Projects activeSection={activeSection} sectionRef={sectionRefs.projects} />
            <Contact activeSection={activeSection} sectionRef={sectionRefs.contact} />
          </main>

          <Footer />
        </>
      )}
    </div>
  );
};

export default App;
