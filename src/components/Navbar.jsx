import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Code2, Sun, Moon } from 'lucide-react';
import { GithubIcon } from './Icons';
import { personalInfo } from '../data/portfolioData';
import { useTheme } from '../context/useTheme';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
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

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        
        {/* Brand */}
        <a href="#home" className="nav-brand">
          <div className="brand-avatar-mini">
            <img src={personalInfo.images.avatar} alt="Abdul Haseeb" />
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
          <a
            href={personalInfo.socials.github}
            target="_blank"
            rel="noreferrer"
            className="nav-icon-link"
            aria-label="GitHub Profile"
          >
            <GithubIcon size={18} />
          </a>

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
