import React, { useState } from 'react';
import { 
  Code2, 
  Server, 
  Database, 
  ShieldCheck,
  Wrench, 
  Cpu,
  Layers,
  FileCode
} from 'lucide-react';
import { technicalSkills } from '../data/portfolioData';

export default function Skills() {
  const [activeTab, setActiveTab] = useState('all');

  const getCategoryIcon = (id) => {
    switch (id) {
      case 'languages':
        return <FileCode size={18} className="cat-icon-svg text-blue" />;
      case 'frontend':
        return <Code2 size={18} className="cat-icon-svg text-blue" />;
      case 'backend':
        return <Server size={18} className="cat-icon-svg text-green" />;
      case 'database':
        return <Database size={18} className="cat-icon-svg text-amber" />;
      case 'security':
        return <ShieldCheck size={18} className="cat-icon-svg text-purple" />;
      case 'tools':
        return <Wrench size={18} className="cat-icon-svg text-teal" />;
      case 'concepts':
      default:
        return <Cpu size={18} className="cat-icon-svg text-blue" />;
    }
  };

  const filteredCategories = activeTab === 'all'
    ? technicalSkills
    : technicalSkills.filter((c) => c.id === activeTab);

  const totalSkillsCount = technicalSkills.reduce((acc, c) => acc + c.skills.length, 0);

  return (
    <section id="skills" className="section-container">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-head">
          <div className="section-sub-badge">
            <Layers size={13} />
            <span>Technical Skills</span>
          </div>
          <h2 className="section-main-title">Skills &amp; Technologies</h2>
          <p className="section-description">
            Complete technical competencies from my resume covering programming languages, full-stack frameworks, database design, and security architectures.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs-bar">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Skills ({totalSkillsCount})
          </button>
          {technicalSkills.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`tab-btn ${activeTab === cat.id ? 'active' : ''}`}
              onClick={() => setActiveTab(cat.id)}
            >
              {cat.category} ({cat.skills.length})
            </button>
          ))}
        </div>

        {/* Skill Category Cards */}
        <div className="skill-cards-stack">
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="skill-cat-card">
              
              <div className="skill-cat-header">
                <div className="cat-title-wrap">
                  <div className="cat-icon-box">
                    {getCategoryIcon(cat.id)}
                  </div>
                  <div>
                    <h3 className="cat-heading">{cat.category}</h3>
                    <p className="cat-subtitle">{cat.skills.length} core competencies</p>
                  </div>
                </div>
                <span className="cat-count-badge">{cat.skills.length} skills</span>
              </div>

              <div className="skill-items-grid">
                {cat.skills.map((skill, sIdx) => (
                  <div key={sIdx} className="skill-item-card">
                    <div className="skill-item-top">
                      <h4 className="skill-name">{skill.name}</h4>
                    </div>
                    <p className="skill-desc-text">{skill.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
