/**
 * File Explanation: AboutPage.jsx (Meet the Team Alignment)
 * 
 * 1. What is it?
 *    AboutPage.jsx houses the organizational vision, core history, and leadership directory for CareerCopilot AI.
 * 
 * 2. Why is it needed?
 *    Adding fixed height constraints and overflow clipping on the story page layout prevents large images
 *    from expanding out of boundary bounds, ensuring uniform column scales.
 * 
 * 3. How does it work?
 *    It sets up height boundaries (`height: 280px`) and overflow properties (`overflow: hidden`) on image wrappers,
 *    mapping images to fit via `object-fit: cover`.
 * 
 * 4. Real-world example
 *    Startup portals crop group photographs of their teams to standard visual grids, matching side text cards.
 * 
 * 5. Advantages
 *    - Image never spills out of parent margins.
 *    - Preserves grid column dimensions.
 */

import React from 'react';
import teamOffice from '../assets/team_office.png';
import userAvatar from '../assets/user_avatar.png';

function AboutPage() {
  const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem 0'
  };

  const blockStyle = {
    marginBottom: '3.5rem'
  };

  const teamMembers = [
    { name: 'Jane Doe', title: 'Co-Founder & CEO', bio: 'Former Tech Recruiter who scaled talent desks at Stripe and Airbnb.', filter: 'none' },
    { name: 'Marc Smith', title: 'Chief Technology Officer', bio: 'Former Staff Infrastructure Architect. Specializes in scalable client-side rendering systems.', filter: 'grayscale(100%)' },
    { name: 'Alex Johnson', title: 'Head of Product Design', bio: 'UX Architect specializing in building clean, distraction-free SaaS workspaces.', filter: 'sepia(30%) contrast(115%)' }
  ];

  return (
    <div style={containerStyle} className="animate-fade-in">
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span className="badge badge-cyan">Our Philosophy</span>
        <h1 style={{ fontSize: '3rem', marginTop: '1rem', marginBottom: '1rem' }}>About CareerCopilot AI</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          Empowering candidate agency using transparent, controlled machine intelligence.
        </p>
      </div>

      {/* MISSION & VISION */}
      <div className="grid-2" style={blockStyle}>
        <div className="card card-accent-cyan">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Our Mission</h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            To de-mystify the tech recruiting pipeline. We aim to equip job seekers with algorithmic resume optimization tools and smart follow-up templates, ensuring everyone has equal access to career advancement.
          </p>
        </div>
        <div className="card card-accent-purple">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Our Vision</h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            A career landscape where artificial intelligence acts as a helpful co-pilot, leaving final decisions and personal agency to the human user. No automated spamming—just high-fidelity, verified job matching.
          </p>
        </div>
      </div>

      {/* STORY & COLLABORATION IMAGE - HEIGHT CLAMPED */}
      <div className="card" style={{ ...blockStyle, padding: '2rem' }}>
        <div className="grid-2" style={{ alignItems: 'center', gap: '2.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Our Story
            </h2>
            <p style={{ marginBottom: '1rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
              CareerCopilot AI was founded by a team of software engineers, tech recruiters, and product architects who realized the modern job application loop was broken. Candidates were spending hours adapting resumes for automated filters, while recruiter inboxes were flooded with low-quality, fully automated spam.
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
              We set out to build a platform that balances machine efficiency with authentic human interaction. By enforcing our core "User Control Rule"—requiring explicit user verification before any action is committed—we build tools that recruiters trust and candidates rely on.
            </p>
          </div>
          <div style={{ borderRadius: 'var(--border-radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-glow-purple)', height: '280px', width: '100%' }}>
            <img 
              src={teamOffice} 
              alt="CareerCopilot AI Collaborative Team" 
              style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      {/* LEADERSHIP DIRECTORY */}
      <div style={blockStyle}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', textAlign: 'center' }}>
          Meet the Leadership Team
        </h2>
        <div className="grid-3">
          {teamMembers.map((member, index) => (
            <div key={index} className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img 
                src={userAvatar} 
                alt={`${member.name} headshot`} 
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  border: '2px solid var(--color-accent)', 
                  marginBottom: '1rem',
                  objectFit: 'cover',
                  filter: member.filter
                }}
              />
              <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 600 }}>{member.name}</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 500, display: 'block', marginBottom: '0.75rem' }}>
                {member.title}
              </span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* VALUES */}
      <div style={blockStyle}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          Core Values
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🤝</span>
            <div>
              <h4 style={{ color: 'var(--text-primary)' }}>Transparency First</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>We never mask automated AI outputs. The user knows exactly what data is parsed and holds full keys to modify drafts.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📈</span>
            <div>
              <h4 style={{ color: 'var(--text-primary)' }}>Career Development</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>We build tools that teach. Our prep questions and resume feedback help candidates learn engineering best practices.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🔒</span>
            <div>
              <h4 style={{ color: 'var(--text-primary)' }}>Privacy & Data Rights</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your career path data belongs to you. We reject black-box parsing profiles and store parameters securely.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
