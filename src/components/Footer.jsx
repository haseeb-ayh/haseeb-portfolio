import React from 'react';
import { ArrowUp } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from './Icons';
import { personalInfo } from '../data/portfolioData';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="container footer-container">
        
        <div className="footer-left">
          <span className="footer-brand-name">{personalInfo.name}</span>
          <span className="footer-sep">•</span>
          <span className="footer-role-text">MERN &amp; Web Developer</span>
        </div>

        <div className="footer-center">
          <div className="footer-social-links">
            <a href={personalInfo.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <GithubIcon size={16} />
            </a>
            <a href={personalInfo.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <LinkedinIcon size={16} />
            </a>
            <a href={personalInfo.socials.twitter} target="_blank" rel="noreferrer" aria-label="Twitter">
              <TwitterIcon size={16} />
            </a>
            <a href={personalInfo.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <InstagramIcon size={16} />
            </a>
          </div>
        </div>

        <div className="footer-right">
          <span className="footer-copy-text">© {new Date().getFullYear()} All rights reserved</span>
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
