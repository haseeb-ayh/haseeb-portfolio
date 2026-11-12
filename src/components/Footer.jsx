import React from 'react';
import { ArrowUp, Shield } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from './Icons';
import { usePortfolioData } from '../context/PortfolioDataContext';

export default function Footer() {
  const { personalInfo, openAdmin } = usePortfolioData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="container footer-container">
        
        <div className="footer-left">
          <span className="footer-brand-name">{personalInfo.name}</span>
          <span className="footer-sep">•</span>
          <span className="footer-role-text">{personalInfo.title || 'MERN & Web Developer'}</span>
        </div>

        <div className="footer-center">
          <div className="footer-social-links">
            {personalInfo.socials?.github && (
              <a href={personalInfo.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <GithubIcon size={16} />
              </a>
            )}
            {personalInfo.socials?.linkedin && (
              <a href={personalInfo.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <LinkedinIcon size={16} />
              </a>
            )}
            {personalInfo.socials?.twitter && (
              <a href={personalInfo.socials.twitter} target="_blank" rel="noreferrer" aria-label="Twitter">
                <TwitterIcon size={16} />
              </a>
            )}
            {personalInfo.socials?.instagram && (
              <a href={personalInfo.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <InstagramIcon size={16} />
              </a>
            )}
          </div>
        </div>

        <div className="footer-right">
          <button
            type="button"
            className="footer-admin-btn"
            onClick={openAdmin}
            title="Open Admin CMS"
          >
            <Shield size={12} />
            <span>Admin</span>
          </button>

          <span className="footer-copy-text">© {new Date().getFullYear()}</span>
          
          <button
            type="button"
            className="footer-top-btn"
            onClick={scrollToTop}
            title="Scroll to top"
          >
            <span>Top</span>
            <ArrowUp size={13} />
          </button>
        </div>

      </div>
    </footer>
  );
}
