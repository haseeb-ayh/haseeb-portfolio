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
  Globe,
  Download,
  FileText
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from './Icons';
import { usePortfolioData } from '../context/PortfolioDataContext';

export default function Hero() {
  const { personalInfo, aboutData, cvData, openAdmin } = usePortfolioData();
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleCvClick = (e) => {
    if (!cvData.url) {
      e.preventDefault();
      const proceed = window.confirm(
        'No CV / Resume is linked yet. Would you like to open the Admin CMS to upload your updated CV PDF now?'
      );
      if (proceed) {
        openAdmin();
      }
    }
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
                  src={personalInfo.images?.avatar || '/images/profile.jpg'} 
                  alt={personalInfo.name} 
                  className="hero-avatar-img"
                  onError={(e) => {
                    e.target.src = '/image/WhatsApp Image 2025-11-14 at 4.57.00 PM.jpeg';
                  }}
                />
                <span className="hero-online-status" title={personalInfo.availability || 'Active Developer'}></span>
              </div>

              <div className="hero-social-strip">
                {personalInfo.socials?.github && (
                  <a 
                    href={personalInfo.socials.github} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="social-btn"
                    title="GitHub"
                  >
                    <GithubIcon size={16} />
                  </a>
                )}
                {personalInfo.socials?.linkedin && (
                  <a 
                    href={personalInfo.socials.linkedin} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="social-btn"
                    title="LinkedIn"
                  >
                    <LinkedinIcon size={16} />
                  </a>
                )}
                {personalInfo.socials?.twitter && (
                  <a 
                    href={personalInfo.socials.twitter} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="social-btn"
                    title="Twitter / X"
                  >
                    <TwitterIcon size={16} />
                  </a>
                )}
                {personalInfo.socials?.instagram && (
                  <a 
                    href={personalInfo.socials.instagram} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="social-btn"
                    title="Instagram"
                  >
                    <InstagramIcon size={16} />
                  </a>
                )}
              </div>
            </div>

            {/* Right: Bio & Key Resume Details */}
            <div className="hero-text-col">
              
              <div className="hero-badge-row">
                <span className="badge badge-success">
                  <span className="status-dot"></span>
                  <span>{personalInfo.availability || 'Intern @ CorePro Techno • Open to Opportunities'}</span>
                </span>
                <span className="badge badge-neutral">MERN Full Stack</span>
              </div>

              <h1 className="hero-name">{personalInfo.name}</h1>
              <p className="hero-role-title">{personalInfo.title}</p>

              <p className="hero-bio">
                {personalInfo.shortBio || (
                  <>
                    Building a <strong>Unified School Management ERP</strong> at <strong>CorePro Techno</strong> following MVC + Service architecture across 15 MongoDB collections. Trained through <strong>Brototype's intensive 52-week MERN programme</strong> with deep hands-on expertise in React, Node.js, Express, MongoDB, and Role-Based Access Control.
                  </>
                )}
              </p>

              {/* Quick Meta Pills */}
              <div className="hero-meta-pills">
                <span className="meta-pill">
                  <Briefcase size={13} />
                  <span>{personalInfo.currentCompany || 'CorePro Techno, Kerala'}</span>
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
                  <span>{(personalInfo.portfolioUrl || 'haseebpm.vercel.app').replace('https://', '')}</span>
                </span>
              </div>

              {/* Hero Actions */}
              <div className="hero-actions-row">
                <a href="#projects" className="btn btn-primary">
                  <span>View Projects</span>
                  <ArrowRight size={14} />
                </a>

                {/* Prominent Download CV Button */}
                <a 
                  href={cvData.url || '#'} 
                  download={cvData.fileName || 'Abdul_Haseeb_MERN_Resume.pdf'}
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-outline hero-cv-btn"
                  onClick={handleCvClick}
                  title="Download or view updated resume"
                >
                  <Download size={14} />
                  <span>Download CV</span>
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
            {aboutData.stats?.map((stat, i) => (
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
