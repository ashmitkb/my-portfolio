// components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = ({ activeSection, setActiveSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    setMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div 
          className="logo" 
          onClick={() => scrollToSection('home')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              scrollToSection('home');
            }
          }}
        >
          <span>Portfolio</span>
        </div>
        
        <div 
          className={`menu-toggle ${menuOpen ? 'active' : ''}`} 
          onClick={() => setMenuOpen(!menuOpen)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setMenuOpen(!menuOpen);
            }
          }}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li>
            <a 
              href="#home"
              className={activeSection === 'home' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('home');
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  scrollToSection('home');
                }
              }}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="#about"
              className={activeSection === 'about' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('about');
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  scrollToSection('about');
                }
              }}
            >
              About
            </a>
          </li>
          <li>
            <a 
              href="#projects"
              className={activeSection === 'projects' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('projects');
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  scrollToSection('projects');
                }
              }}
            >
              Projects
            </a>
          </li>
          <li>
            <a 
              href="#contact"
              className={activeSection === 'contact' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('contact');
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  scrollToSection('contact');
                }
              }}
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;