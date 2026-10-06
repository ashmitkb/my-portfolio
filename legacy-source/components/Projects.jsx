// Updated components/Projects.jsx
import React from 'react';
import './Projects.css';
import projectimage from "./apple.png"
import projectimage1 from "./1learntls.png" 
import projectimage2 from "./netflix.png"
const Projects = ({ activeSection, sectionRef }) => {
  const projects = [
    {
      id: 1,
      title: "Apple Website Replica",
      description: "Interactive apple website replica",
      image: projectimage,
      tags: ["React", "Full Stack", "GSAP"],
      link: "#"
    },
    {
      id: 2,
      title: "E-commerce Platform",
      description: "Modern e-commerce site",
      image: projectimage1,
      tags: ["React"],
      link: "https://1learntls.com/"
    },
    {
      id: 3,
      title: "Netflix Replica",
      description: "Web development project",
      image: projectimage2,
      tags: ["React",'Full stack'],
      link: ""
    }
  ];

  return (
    <section 
      id="projects" 
      className={activeSection === 'projects' ? 'active' : ''} 
      ref={sectionRef}
    >
      <div className="container">
        <h2 className="section-title">My Projects</h2>
        <div className="projects-grid">
          {projects.map(project => (
            <div className="project-card" key={project.id}>
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <div className="project-overlay">
                  <a href={project.link} className="view-project">View Project</a>
                </div>
              </div>
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="project-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;