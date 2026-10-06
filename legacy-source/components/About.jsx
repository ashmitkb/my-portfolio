// Enhanced components/About.jsx with skills visualization
import React, { useState, useEffect } from 'react';
import './About.css';
import me from './me.jpg';

const About = ({ activeSection, sectionRef }) => {
  const [skillsVisible, setSkillsVisible] = useState(false);

  const skills = [
    { name: 'React', level: 90, icon: 'fab fa-react' },
    { name: 'JavaScript', level: 85, icon: 'fab fa-js-square' },
    { name: 'Three.js', level: 75, icon: 'fas fa-cube' },
    { name: 'CSS/SCSS', level: 88, icon: 'fab fa-css3-alt' },
    { name: 'HTML5', level: 92, icon: 'fab fa-html5' },
    { name: 'Node.js', level: 70, icon: 'fab fa-node-js' },
    { name: 'Git', level: 80, icon: 'fab fa-git-alt' },
    { name: 'Responsive Design', level: 85, icon: 'fas fa-mobile-alt' }
  ];

  useEffect(() => {
    if (activeSection === 'about') {
      const timer = setTimeout(() => {
        setSkillsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeSection]);

  return (
    <section 
      id="about" 
      className={`enhanced-card ${activeSection === 'about' ? 'active' : ''}`}
      ref={sectionRef}
    >
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <div className="about-image">
            <div className="image-container">
              <img src={me} alt="Profile" />
              <div className="image-overlay">
                <div className="social-icons">
                  <a href="https://github.com/ashmitkb" aria-label="GitHub">
                    <i className="fab fa-github"></i>
                  </a>
                  <a href="https://www.linkedin.com/in/ashmit-bhandary-aba060307/" aria-label="LinkedIn">
                    <i className="fab fa-linkedin"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="about-text">
            <h3>Hi, I'm <span className="highlight">Ashmit Kiran Bhandary</span></h3>
            <p className="bio">
              I'm a passionate frontend developer with a love for creating beautiful, interactive web experiences. 
              With expertise in React, Three.js, and modern web technologies, I blend creativity with technical skills 
              to build engaging digital solutions.
            </p>
          </div>
        </div>
        
        <div className="skills-section">
          <h3 className="skills-title">Technical Skills</h3>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <div key={skill.name} className="skill-item" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="skill-header">
                  <i className={skill.icon}></i>
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-percentage">{skill.level}%</span>
                </div>
                <div className="skill-progress">
                  <div 
                    className="skill-fill"
                    style={{ 
                      width: skillsVisible ? `${skill.level}%` : '0%',
                      transitionDelay: `${index * 0.1}s`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;