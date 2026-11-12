import React from 'react';
import { Briefcase, GraduationCap, Calendar, MapPin, Building2, CheckCircle2 } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';

export default function Experience() {
  const { workExperience, educationData } = usePortfolioData();

  return (
    <section id="experience" className="section-container">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-head">
          <div className="section-sub-badge">
            <Briefcase size={13} />
            <span>Professional Experience &amp; Education</span>
          </div>
          <h2 className="section-main-title">Work Experience &amp; Education</h2>
          <p className="section-description">
            Hands-on professional engineering internship at CorePro Techno and rigorous training background.
          </p>
        </div>

        {/* Work Experience Area */}
        <div className="exp-group-wrapper">
          <h3 className="group-sub-title">
            <Building2 size={16} className="text-blue" />
            <span>Work Experience</span>
          </h3>

          <div className="journey-cards-stack">
            {workExperience.map((job, idx) => (
              <div key={idx} className="journey-card featured-work-card">
                
                <div className="journey-card-header">
                  <div className="journey-title-wrap">
                    <div className="journey-icon-box work-icon">
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <h4 className="journey-role">{job.role}</h4>
                      <h5 className="journey-org">{job.company}</h5>
                    </div>
                  </div>

                  <div className="journey-meta-pills">
                    <span className="badge badge-success">Current Role</span>
                    <span className="journey-period">
                      <Calendar size={12} />
                      <span>{job.period}</span>
                    </span>
                    <span className="journey-location">
                      <MapPin size={12} />
                      <span>{job.location}</span>
                    </span>
                  </div>
                </div>

                <p className="journey-summary">{job.summary}</p>

                {job.bullets && job.bullets.length > 0 && (
                  <ul className="journey-bullets">
                    {job.bullets.map((b, bIdx) => (
                      <li key={bIdx}>
                        <CheckCircle2 size={14} className="text-blue bullet-icon" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {job.tech && job.tech.length > 0 && (
                  <div className="journey-tech-strip">
                    <span className="tech-strip-label">Applied Technologies:</span>
                    <div className="journey-tech-tags">
                      {job.tech.map((t, tIdx) => (
                        <span key={tIdx} className="tech-tag-chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>

        {/* Education & Training Area */}
        <div className="exp-group-wrapper mt-5">
          <h3 className="group-sub-title">
            <GraduationCap size={16} className="text-blue" />
            <span>Education &amp; Intensive Training</span>
          </h3>

          <div className="journey-cards-grid">
            {educationData.map((edu, idx) => (
              <div key={idx} className="journey-card edu-card">
                
                <div className="journey-card-header">
                  <div className="journey-title-wrap">
                    <div className="journey-icon-box edu-icon">
                      <GraduationCap size={18} />
                    </div>
                    <div>
                      <h4 className="journey-role">{edu.programme}</h4>
                      <h5 className="journey-org">{edu.institution}</h5>
                    </div>
                  </div>

                  <div className="journey-meta-pills">
                    <span className="journey-period">
                      <Calendar size={12} />
                      <span>{edu.period}</span>
                    </span>
                    <span className="journey-location">
                      <MapPin size={12} />
                      <span>{edu.location}</span>
                    </span>
                  </div>
                </div>

                {edu.note && <span className="edu-note-pill">{edu.note}</span>}

                {edu.highlights && edu.highlights.length > 0 && (
                  <ul className="journey-bullets">
                    {edu.highlights.map((h, hIdx) => (
                      <li key={hIdx}>
                        <span className="edu-dot"></span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
