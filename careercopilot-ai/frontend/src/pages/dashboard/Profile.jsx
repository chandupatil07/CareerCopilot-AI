import React from 'react';
import PageHeader from '../../components/PageHeader';

function Profile() {
  const skillsList = ['React', 'Node.js', 'Vite', 'JavaScript', 'CSS Grid', 'System Design', 'Python', 'REST APIs'];

  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '2rem'
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="My Profile" 
        description="Manage your professional metadata, credentials, and portfolio links." 
      />

      <div style={gridContainerStyle} className="profile-grid">
        {/* 1. PERSONAL INFORMATION */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            👤 Personal Information
          </h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" className="form-input" defaultValue="Jane Doe" placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="emailAddress">Email Address</label>
              <input type="email" id="emailAddress" className="form-input" defaultValue="developer@profile.com" placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="targetTitle">Target Title</label>
              <input type="text" id="targetTitle" className="form-input" defaultValue="Senior Software Engineer" placeholder="Staff UI Engineer" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
              <input type="text" id="phoneNumber" className="form-input" defaultValue="+1 (555) 019-2834" placeholder="+1 (555) 000-0000" />
            </div>
          </form>
        </div>

        {/* 2. EDUCATION */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            🎓 Education Credentials
          </h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="form-label" htmlFor="degree">Degree & Major</label>
              <input type="text" id="degree" className="form-input" defaultValue="B.S. in Computer Science" placeholder="B.S. in Computer Science" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="school">Institution / University</label>
              <input type="text" id="school" className="form-input" defaultValue="Stanford University" placeholder="Stanford University" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="gradYear">Graduation Year</label>
              <input type="text" id="gradYear" className="form-input" defaultValue="2020" placeholder="2022" />
            </div>
          </form>
        </div>

        {/* 3. TECHNICAL SKILLS */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            ⚡ Core Skills
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Skills checklist used for resume tailoring and mock coaching evaluations.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2rem' }}>
            {skillsList.map((skill, index) => (
              <span key={index} className="badge badge-cyan" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                {skill}
              </span>
            ))}
          </div>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: '8px' }}>
            <input type="text" className="form-input" placeholder="Add custom skill..." disabled style={{ opacity: 0.6 }} />
            <button className="btn btn-secondary" style={{ padding: '0 1.25rem' }} disabled>Add</button>
          </form>
        </div>

        {/* 4. PROFESSIONAL LINKS */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            🔗 Professional Links
          </h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="form-label" htmlFor="githubLink">GitHub Profile</label>
              <input type="url" id="githubLink" className="form-input" defaultValue="https://github.com/janedoe" placeholder="https://github.com/username" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="linkedinLink">LinkedIn Profile</label>
              <input type="url" id="linkedinLink" className="form-input" defaultValue="https://linkedin.com/in/janedoe" placeholder="https://linkedin.com/in/username" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="portfolioLink">Portfolio Website</label>
              <input type="url" id="portfolioLink" className="form-input" defaultValue="https://janedoe.dev" placeholder="https://yourwebsite.com" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="resumeUrl">Resume URL (Hosted PDF)</label>
              <input type="url" id="resumeUrl" className="form-input" defaultValue="https://drive.google.com/file/d/janedoe-resume.pdf" placeholder="https://example.com/resume.pdf" />
            </div>
          </form>
        </div>
      </div>

      <div style={{ marginTop: '2.5rem', textAlign: 'right' }}>
        <button className="btn btn-primary" style={{ cursor: 'not-allowed', opacity: 0.6 }} title="Save disabled in early Module 1.2 mockup">
          Save Profile Changes (Mocked)
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Profile;
