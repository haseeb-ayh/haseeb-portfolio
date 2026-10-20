import React, { useState } from 'react';
import { 
  ArrowRight, 
  Copy, 
  Check, 
  MapPin, 
  Briefcase, 
  Mail, 
  ExternalLink,
  GraduationCap,
  Globe
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from './Icons';
import { personalInfo, aboutData } from '../data/portfolioData';

export default function Hero() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="home" className="hero-section">
      <div className="container">
        
        {/* Main Hero Card */}
        <div className="hero-card">
          
          <div className="hero-card-inner">
            
            {/* Left: Avatar & Socials */}
            <div className="hero-avatar-col">
              <div className="hero-avatar-wrapper">
                <img 
                  src={personalInfo.images.avatar} 
                  alt={personalInfo.name} 
                  className="hero-avatar-img"
                  onError={(e) => {
                    e.target.src = '/image/WhatsApp Image 2025-11-14 at 4.57.00 PM.jpeg';
                  }}
                />
                <span className="hero-online-status" title="Active Developer Intern"></span>
              </div>

              <div className="hero-social-strip">
                <a 
                  href={personalInfo.socials.github} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="social-btn"
                  title="GitHub"
                >
                  <GithubIcon size={16} />
                </a>
                <a 
                  href={personalInfo.socials.linkedin} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="social-btn"
                  title="LinkedIn"
                >
                  <LinkedinIcon size={16} />
                </a>
                <a 
                  href={personalInfo.socials.twitter} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="social-btn"
                  title="Twitter / X"
                >
                  <TwitterIcon size={16} />
                </a>
                <a 
                  href={personalInfo.socials.instagram} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="social-btn"
                  title="Instagram"
                >
                  <InstagramIcon size={16} />
                </a>
              </div>
            </div>

            {/* Right: Bio & Key Resume Details */}
            <div className="hero-text-col">
              
              <div className="hero-badge-row">
                <span className="badge badge-success">
                  <span className="status-dot"></span>
                  <span>Intern @ CorePro Techno</span>
                </span>
                <span className="badge badge-neutral">MERN Full Stack</span>
              </div>

              <h1 className="hero-name">{personalInfo.name}</h1>
              <p className="hero-role-title">{personalInfo.title}</p>

              <p className="hero-bio">
                Building a <strong>Unified School Management ERP</strong> at <strong>CorePro Techno</strong> following MVC + Service architecture across 15 MongoDB collections. Trained through <strong>Brototype's intensive 52-week MERN programme</strong> with deep hands-on expertise in React, Node.js, Express, MongoDB, and Role-Based Access Control.
              </p>

              {/* Quick Meta Pills */}
              <div className="hero-meta-pills">
                <span className="meta-pill">
                  <Briefcase size={13} />
                  <span>CorePro Techno, Kerala</span>
                </span>
                <span className="meta-pill">
                  <GraduationCap size={13} />
                  <span>52-Week Brototype MERN</span>
                </span>
                <span className="meta-pill">
                  <MapPin size={13} />
                  <span>{personalInfo.location}</span>
                </span>
                <span className="meta-pill">
                  <Globe size={13} />
                  <span>{personalInfo.portfolioUrl.replace('https://', '')}</span>
                </span>
              </div>

              {/* Hero Actions */}
              <div className="hero-actions-row">
                <a href="#projects" className="btn btn-primary">
                  <span>View Projects</span>
                  <ArrowRight size={14} />
                </a>

                <a href="#experience" className="btn btn-outline">
                  <span>Work Experience</span>
                </a>

                <button 
                  type="button" 
                  className="btn btn-ghost copy-btn"
                  onClick={copyEmail}
                  title="Copy email to clipboard"
                >
                  {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                  <span>{copied ? 'Email Copied!' : 'Copy Email'}</span>
                </button>
              </div>

            </div>

          </div>

          {/* Bottom Stats Strip */}
          <div className="hero-stats-strip">
            {aboutData.stats.map((stat, i) => (
              <div key={i} className="stat-item">
                <span className="stat-number">{stat.value}</span>
                <span className="stat-name">{stat.label}</span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
