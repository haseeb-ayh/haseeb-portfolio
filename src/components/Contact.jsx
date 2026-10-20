import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Copy, 
  Check, 
  CheckCircle, 
  MessageSquare, 
  AlertCircle
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from './Icons';
import { personalInfo } from '../data/portfolioData';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('https://formspree.io/f/myzlkojp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const data = await response.json().catch(() => ({}));
        setFormStatus('error');
        setErrorMessage(data.error || 'Failed to send message. Please reach out directly via email.');
      }
    } catch (err) {
      setFormStatus('error');
      setErrorMessage('Network error. Please try again or email directly.');
    }
  };

  return (
    <section id="contact" className="section-container">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-head">
          <div className="section-sub-badge">
            <MessageSquare size={13} />
            <span>Connect &amp; Collaborate</span>
          </div>
          <h2 className="section-main-title">Get In Touch</h2>
          <p className="section-description">
            Have a project in mind, a junior developer role, or want to discuss full-stack development? Feel free to reach out.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="contact-cards-layout">
          
          {/* Left: Contact Info Card */}
          <div className="contact-details-card">
            <h3 className="contact-card-heading">Contact Details</h3>
            <p className="contact-card-sub">
              I am open to internships, full-time junior positions, and freelance opportunities.
            </p>

            <div className="contact-rows-stack">
              
              {/* Email */}
              <div className="contact-info-row">
                <div className="info-icon-box">
                  <Mail size={16} />
                </div>
                <div className="info-text-area">
                  <span className="info-key">Email</span>
                  <a href={`mailto:${personalInfo.email}`} className="info-val-link">
                    {personalInfo.email}
                  </a>
                </div>
                <button
                  type="button"
                  className="quick-copy-btn"
                  onClick={handleCopyEmail}
                  title="Copy Email"
                >
                  {copiedEmail ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                </button>
              </div>

              {/* Phone */}
              <div className="contact-info-row">
                <div className="info-icon-box">
                  <Phone size={16} />
                </div>
                <div className="info-text-area">
                  <span className="info-key">Phone</span>
                  <a href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`} className="info-val-link">
                    {personalInfo.phone}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="contact-info-row">
                <div className="info-icon-box">
                  <MapPin size={16} />
                </div>
                <div className="info-text-area">
                  <span className="info-key">Location</span>
                  <span className="info-val-text">{personalInfo.location}</span>
                </div>
              </div>

            </div>

            {/* Social Channels */}
            <div className="contact-socials-area">
              <span className="socials-label">Developer Profiles:</span>
              <div className="socials-pills-row">
                <a 
                  href={personalInfo.socials.github} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="social-pill-link"
                >
                  <GithubIcon size={14} />
                  <span>GitHub</span>
                </a>
                <a 
                  href={personalInfo.socials.linkedin} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="social-pill-link"
                >
                  <LinkedinIcon size={14} />
                  <span>LinkedIn</span>
                </a>
                <a 
                  href={personalInfo.socials.twitter} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="social-pill-link"
                >
                  <TwitterIcon size={14} />
                  <span>Twitter / X</span>
                </a>
                <a 
                  href={personalInfo.socials.instagram} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="social-pill-link"
                >
                  <InstagramIcon size={14} />
                  <span>Instagram</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right: Clean Form Card */}
          <div className="contact-form-card">
            
            {formStatus === 'success' ? (
              <div className="contact-success-box">
                <CheckCircle size={44} className="text-green success-ico" />
                <h3 className="success-heading">Message Delivered!</h3>
                <p className="success-sub">
                  Thank you for reaching out, Abdul Haseeb will respond to your email as soon as possible.
                </p>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setFormStatus('idle')}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="clean-form">
                
                <div className="form-two-cols">
                  <div className="form-field">
                    <label htmlFor="contact-name" className="field-label">
                      Your Name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. John Doe"
                      className="field-input"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-email" className="field-label">
                      Email Address <span className="req">*</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="e.g. john@example.com"
                      className="field-input"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="contact-subject" className="field-label">
                    Subject <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Full-Stack Developer Opportunity"
                    className="field-input"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="contact-message" className="field-label">
                    Message <span className="req">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell me about your project, timeline, or open role..."
                    className="field-textarea"
                  ></textarea>
                </div>

                {formStatus === 'error' && (
                  <div className="field-error-alert">
                    <AlertCircle size={15} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="btn btn-primary submit-btn"
                >
                  {formStatus === 'submitting' ? (
                    <span>Sending message...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={14} />
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
