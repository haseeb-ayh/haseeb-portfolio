import React from 'react';
import { 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  GraduationCap, 
  Globe, 
  CheckCircle2, 
  Award,
  Code,
  Building2
} from 'lucide-react';
import { aboutData, personalInfo } from '../data/portfolioData';

export default function About() {
  return (
    <section id="about" className="section-container">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-head">
          <div className="section-sub-badge">
            <User size={13} />
            <span>Profile Summary</span>
          </div>
          <h2 className="section-main-title">About Me</h2>
          <p className="section-description">
            {aboutData.headline}
          </p>
        </div>

        {/* About Grid */}
        <div className="about-cards-grid">
          
          {/* Profile Card */}
          <div className="about-profile-card">
            <div className="about-img-frame">
              <img 
                src={personalInfo.images.about} 
                alt={personalInfo.name} 
                className="about-portrait-img"
                onError={(e) => {
                  e.target.src = '/image/WhatsApp Image 2025-11-14 at 6.09.43 PM.jpeg';
                }}
              />
            </div>
            
            <div className="about-profile-info">
              <h3 className="about-profile-name">{personalInfo.name}</h3>
              <p className="about-profile-subtitle">{personalInfo.title}</p>
              
              <div className="about-details-list">
                <div className="detail-row">
                  <span className="detail-key">Current Role:</span>
                  <span className="detail-val font-medium">Intern @ CorePro Techno</span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Location:</span>
                  <span className="detail-val">{personalInfo.location}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Email:</span>
                  <a href={`mailto:${personalInfo.email}`} className="detail-val link">
                    {personalInfo.email}
                  </a>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Phone:</span>
                  <a href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`} className="detail-val link">
                    {personalInfo.phone}
                  </a>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Portfolio:</span>
                  <a href={personalInfo.portfolioUrl} target="_blank" rel="noreferrer" className="detail-val link">
                    {personalInfo.portfolioUrl.replace('https://', '')}
                  </a>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Training:</span>
                  <span className="detail-val">52-Week Brototype MERN</span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Education:</span>
                  <span className="detail-val">Plus Two CS (2025)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio & Philosophy Card */}
          <div className="about-narrative-card">
            
            <div className="narrative-section">
              <h4 className="narrative-heading">
                <Code size={16} className="text-blue inline-icon" />
                <span>Professional Engineering Profile</span>
              </h4>
              <div className="narrative-paragraphs">
                <p className="narrative-p highlight-p">
                  {aboutData.profileSummary}
                </p>
              </div>
            </div>

            {/* Core Values Strip */}
            <div className="values-box">
              <h5 className="values-title">Core Engineering Practices:</h5>
              <div className="values-grid">
                <div className="value-item">
                  <CheckCircle2 size={15} className="text-green" />
                  <span>MVC + Service Layer architecture</span>
                </div>
                <div className="value-item">
                  <CheckCircle2 size={15} className="text-green" />
                  <span>Role-Based Access Control (RBAC)</span>
                </div>
                <div className="value-item">
                  <CheckCircle2 size={15} className="text-green" />
                  <span>Structured 15+ MongoDB schema design</span>
                </div>
                <div className="value-item">
                  <CheckCircle2 size={15} className="text-green" />
                  <span>Git feature-branch collaborative workflows</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
