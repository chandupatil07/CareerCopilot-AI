import React from 'react';
import PageHeader from '../../components/PageHeader';
import Badge from '../../components/Badge';

function ResumeCenter() {
  const mockSkillsMatched = ['React', 'JavaScript', 'CSS Grid', 'System Design'];
  const mockSkillsMissing = ['Node.js', 'Vite', 'Python'];

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Resume Center" 
        description="Verify document formatting and audit ATS keyword matches against targeted job requirements." 
      />

      <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
        {/* Document Operations Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              📄 Document Administration
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Upload new resume files, replace existing documents, or download your verified master profile PDF.
            </p>
            <div style={{ padding: '1.5rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--border-radius-md)', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.01)', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📄</span>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>Jane_Doe_CV_2026.pdf</strong>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Size: 1.2 MB | Uploaded 2 days ago</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
              Upload Resume
            </button>
            <button className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
              Replace Resume
            </button>
            <button className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
              Download PDF
            </button>
          </div>
        </div>

        {/* Analyze Operations Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              🔍 Job Description Analysis
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Paste a targeted job listing text description to calculate ATS compatibility match scores.
            </p>
            <div className="form-group">
              <label className="form-label" htmlFor="jobDescInput">Target Job Description</label>
              <textarea 
                id="jobDescInput" 
                className="form-input" 
                rows="4" 
                placeholder="We are looking for a Senior React Developer with experience in building scalable CSS grids and system design..." 
                disabled 
                style={{ opacity: 0.6, resize: 'none' }}
              />
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem' }}>
            Analyze Resume Match
          </button>
        </div>
      </div>

      {/* Mock ATS Analysis Results Card */}
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          📊 Mock Compatibility Audit
        </h3>
        <div className="grid-3" style={{ alignItems: 'center' }}>
          {/* Circular Score */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '0.75rem' }}>
              78%
            </div>
            <h4>ATS Match Rating</h4>
          </div>

          {/* Keywords Matched */}
          <div>
            <h4 style={{ color: 'var(--color-success)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>Matching Keywords found:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {mockSkillsMatched.map(skill => (
                <Badge key={skill} type="success">{skill}</Badge>
              ))}
            </div>
          </div>

          {/* Keyword Gaps */}
          <div>
            <h4 style={{ color: 'var(--color-warning)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>Target Gaps Detected:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {mockSkillsMissing.map(skill => (
                <Badge key={skill} type="warning">{skill}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeCenter;
