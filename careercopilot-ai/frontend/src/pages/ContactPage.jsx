/**
 * File Explanation: ContactPage.jsx (Image Constraints & Alignments)
 * 
 * 1. What is it?
 *    ContactPage.jsx renders the support contact forms and partnership inquiry panels.
 * 
 * 2. Why is it needed?
 *    Large images can break visual grids on different screen resolutions. Applying fixed-height boundaries
 *    and overflow clipping ensures the cards align and never leak pixels.
 * 
 * 3. How does it work?
 *    It clamps image containers (`height: 120px` and `height: 100px`) with `overflow: hidden`, mapping images
 *    with `object-fit: cover` to scale.
 * 
 * 4. Real-world example
 *    Startup contact panels crop office headshots or meeting graphics to standard, fixed dimensions next to email forms.
 * 
 * 5. Advantages
 *    - Image bounds are strictly controlled.
 *    - Layout margins are preserved.
 */

import React, { useState } from 'react';
import teamOffice from '../assets/team_office.png';
import meetingShakingHands from '../assets/meeting_shaking_hands.png';

function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem 0'
  };

  return (
    <div style={containerStyle} className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span className="badge badge-cyan">Get In Touch</span>
        <h1 style={{ fontSize: '3rem', marginTop: '1rem', marginBottom: '1rem' }}>Contact CareerCopilot</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          Have questions or want to partner with us? Drop us a line.
        </p>
      </div>

      {/* Outer grid container with height-stretching alignment */}
      <div className="contact-grid-wrapper" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '2rem', alignItems: 'stretch' }}>
        
        {/* Left Column: Contact info & Partnerships using grid to prevent image overlap */}
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '1.5rem' }}>
          
          {/* Card 1: Contact Details */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div>
              <h3>Contact Information</h3>
              <p style={{ marginTop: '0.75rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                We are based in San Francisco, CA. Drop us an email or reach out on social media.
              </p>
              <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span>✉️</span>
                  <span>support@careercopilot.ai</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span>📍</span>
                  <span>100 Pine Street, San Francisco, CA</span>
                </div>
              </div>
            </div>
            
            {/* Team Image with dynamic height filling the card and top alignment to show heads */}
            <div style={{ marginTop: '1.5rem', borderRadius: 'var(--border-radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', flex: '1', minHeight: '160px', width: '100%' }}>
              <img 
                src={teamOffice} 
                alt="CareerCopilot AI Support Team" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
              />
            </div>
          </div>

          {/* Card 2: Partnerships */}
          <div className="card card-accent-purple" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.75rem' }}>
            <div>
              <h3>Startup Partnerships</h3>
              <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Looking to deploy CareerCopilot for your bootcamp or placement desk? Contact our integration office.
              </p>
            </div>
            {/* Handshake Image with dynamic height filling the card */}
            <div style={{ marginTop: '1.5rem', borderRadius: 'var(--border-radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', flex: '1', minHeight: '130px', width: '100%' }}>
              <img 
                src={meetingShakingHands} 
                alt="Corporate Meeting Handshake" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2.5rem' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <span style={{ fontSize: '3rem' }}>✅</span>
              <h3 style={{ marginTop: '1rem' }}>Message Submitted!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                Thank you for reaching out. A team member will respond shortly.
              </p>
              <button className="btn btn-secondary" style={{ marginTop: '1.5rem' }} onClick={() => setSubmitted(false)}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ marginBottom: '1.5rem' }}>Send Us a Message</h3>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    className="form-input" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    className="form-input" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    placeholder="john@example.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="message">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    className="form-input" 
                    rows="4"
                    value={formData.message} 
                    onChange={handleChange} 
                    required 
                    placeholder="How can we help you?"
                    style={{ resize: 'none', fontFamily: 'inherit' }}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 768px) {
          .contact-grid-wrapper {
            grid-template-columns: 1fr !important;
          }
          .contact-grid-wrapper .card {
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ContactPage;
