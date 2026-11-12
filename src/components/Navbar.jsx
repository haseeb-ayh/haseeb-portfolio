import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Code2, Sun, Moon, FileText, Download, Shield } from 'lucide-react';
import { GithubIcon } from './Icons';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { useTheme } from '../context/useTheme';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { personalInfo, cvData, openAdmin } = usePortfolioData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);

      const sections = ['home', 'about', 'skills', 'projects', 'journey', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Overview', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleCvClick = (e) => {
    if (!cvData.url) {
      e.preventDefault();
      const proceed = window.confirm(
        'No CV / Resume is linked yet. Would you like to open Admin CMS to upload your updated CV PDF now?'
      );
      if (proceed) {
        openAdmin();
      }
    }
  };

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        
        {/* Brand */}
        <a href="#home" className="nav-brand">
          <div className="brand-avatar-mini">
            <img 
              src={personalInfo.images?.avatar || '/images/profile.jpg'} 
              alt={personalInfo.name} 
              onError={(e) => {
                e.target.src = '/image/WhatsApp Image 2025-11-14 at 4.57.00 PM.jpeg';
              }}
            />
          </div>
          <div className="brand-text">
            <span className="brand-name">haseeb</span>
            <span className="brand-dot">.dev</span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          <ul className="nav-list">
            {navLinks.map((link) => {
              const id = link.href.replace('#', '');
              const isActive = activeSection === id;
              return (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    {link.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right Actions */}
        <div className="nav-actions">
          
          {/* Resume Button in Navbar */}
          <a
            href={cvData.url || '#'}
            download={cvData.fileName || 'Abdul_Haseeb_MERN_Resume.pdf'}
            target="_blank"
            rel="noreferrer"
            onClick={handleCvClick}
            className="btn btn-outline btn-sm nav-cv-btn"
            title="Download or preview updated CV"
          >
            <FileText size={14} />
            <span>Resume</span>
          </a>

          {/* Theme Toggle */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* GitHub Icon */}
          {personalInfo.socials?.github && (
            <a
              href={personalInfo.socials.github}
              target="_blank"
              rel="noreferrer"
              className="nav-icon-link"
              aria-label="GitHub Profile"
            >
              <GithubIcon size={18} />
            </a>
          )}

          {/* Contact CTA Button */}
          <a href="#contact" className="btn btn-primary btn-sm nav-cta">
            <span>Get in touch</span>
          </a>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="mobile-nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <li className="mobile-nav-cta">
                <a
                  href={cvData.url || '#'}
                  download={cvData.fileName}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-block mb-2"
                  onClick={(e) => {
                    handleCvClick(e);
                    setMobileMenuOpen(false);
                  }}
                >
                  <Download size={14} className="mr-1" />
                  <span>Download CV / Resume</span>
                </a>
                <a
                  href="#contact"
                  className="btn btn-primary btn-block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact Me
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
