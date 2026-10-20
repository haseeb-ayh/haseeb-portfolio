import React, { useState } from 'react';
import { 
  FolderGit2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Layers
} from 'lucide-react';
import { GithubIcon } from './Icons';
import { projectsData } from '../data/portfolioData';

export default function Projects() {
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Full-Stack', 'Front-End', 'Back-End'];

  const filteredProjects = filter === 'All'
    ? projectsData
    : projectsData.filter((p) => p.category.toLowerCase().includes(filter.toLowerCase()));

  const getStatusBadge = (status, statusType) => {
    if (statusType === 'progress' || status.includes('Progress')) {
      return (
        <span className="repo-status-badge status-progress">
          <span className="repo-dot amber"></span>
          <span>{status}</span>
        </span>
      );
    }
    return (
      <span className="repo-status-badge status-completed">
        <span className="repo-dot green"></span>
        <span>{status}</span>
      </span>
    );
  };

  return (
    <section id="projects" className="section-container">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-head">
          <div className="section-sub-badge">
            <FolderGit2 size={13} />
            <span>Featured Engineering Work</span>
          </div>
          <h2 className="section-main-title">Projects</h2>
          <p className="section-description">
            A comprehensive collection of full-stack, frontend, and backend projects—spanning Firebase architectures, MVC patterns, Redux state pipelines, and enterprise ERP systems.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="filter-pills-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-pill-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="repo-cards-grid">
          {filteredProjects.map((project) => (
            <article key={project.id} className="repo-card">
              
              {/* Repo Card Top */}
              <div className="repo-card-top">
                <div className="repo-header-info">
                  <FolderGit2 size={16} className="repo-folder-icon" />
                  <h3 className="repo-name">{project.name}</h3>
                  <span className="repo-visibility-tag">Public</span>
                </div>
                
                {getStatusBadge(project.status, project.statusType)}
              </div>

              {/* Title & Substack */}
              <h4 className="repo-title-text">{project.title}</h4>
              <p className="repo-stack-summary">{project.stackSummary}</p>
              
              <p className="repo-desc-text">{project.description}</p>

              {/* Key Features from Resume & Architecture */}
              <div className="repo-features-box">
                <span className="features-label">Technical Highlights:</span>
                <ul className="features-list">
                  {project.bullets.map((b, i) => (
                    <li key={i}>
                      <span className="feature-check">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack Pills */}
              <div className="repo-tags-wrap">
                {project.language && (
                  <span className="repo-lang-tag">
                    <span 
                      className="lang-color-circle" 
                      style={{ backgroundColor: project.languageColor || '#0969da' }}
                    ></span>
                    <span>{project.language}</span>
                  </span>
                )}
                {project.tech.map((t, idx) => (
                  <span key={idx} className="tech-badge-chip">
                    {t}
                  </span>
                ))}
              </div>

              {/* Repo Card Footer */}
              <div className="repo-footer">
                <div className="repo-actions-left">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline btn-sm repo-btn"
                    >
                      <GithubIcon size={14} />
                      <span>GitHub</span>
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary btn-sm repo-btn"
                    >
                      <span>Live Demo</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>

                <span className="repo-category-pill">{project.category}</span>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
