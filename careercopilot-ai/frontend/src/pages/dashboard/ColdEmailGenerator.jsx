import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';

function ColdEmailGenerator() {
  const [company, setCompany] = useState('');
  const [recruiter, setRecruiter] = useState('');
  const [role, setRole] = useState('');
  const [purpose, setPurpose] = useState('Job Referral'); // Job Referral, General Networking, Post-Application Follow-up
  const [tone, setTone] = useState('Professional'); // Professional, Friendly/Casual, Bold/Direct
  const [isGenerated, setIsGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const generateEmail = (e) => {
    e.preventDefault();
    if (!company || !role) return;

    setLoading(true);
    setCopySuccess(false);
    setIsApproved(false);

    setTimeout(() => {
      const recName = recruiter || 'Hiring Manager';
      let subject = '';
      let body = '';

      if (purpose === 'Job Referral') {
        subject = `Inquiry: ${role} Opening at ${company}`;
        if (tone === 'Friendly/Casual') {
          body = `Hi ${recName},\n\nI hope you're having a great week! 👋\n\nI've been following ${company}'s progress recently, especially your tech roadmap. I saw you're hiring a new ${role} and wanted to reach out.\n\nMy background is in React architectures and performance optimizations. I would love to connect and learn more about the engineering culture, and perhaps chat briefly for 10 minutes next week if you have time?\n\nI've attached my resume for context. Thanks so much!\n\nBest,\nJane Doe`;
        } else if (tone === 'Bold/Direct') {
          body = `Hi ${recName},\n\nI noticed the ${role} position open at ${company}. With my background scaling React render times by 35% and optimizing assets bundles, I believe I can make an immediate contribution to your engineering team.\n\nCould we schedule a 10-minute chat next Tuesday or Thursday to discuss how my skill set aligns with your current roadmap goals?\n\nMy resume is attached. Thanks for your time.\n\nBest regards,\nJane Doe`;
        } else {
          // Professional default
          body = `Dear ${recName},\n\nI hope this email finds you well.\n\nI am writing to express my interest in the ${role} opening at ${company}. As a frontend engineer with over four years of experience building modular design systems and performance-optimized React applications, I believe my background aligns closely with your team's objectives.\n\nI would appreciate the opportunity to schedule a brief 10-minute call next week to discuss how my technical skills can support ${company}'s frontend goals. I have attached my resume for your review.\n\nThank you for your time and consideration.\n\nSincerely,\nJane Doe`;
        }
      } else if (purpose === 'General Networking') {
        subject = `Hello from a fan of ${company}'s Frontend Engineering team`;
        body = `Dear ${recName},\n\nI hope you're doing well.\n\nI have been following the engineering blog posts from ${company} (particularly your articles on asset chunking and bundler optimizations) and I am very impressed by your tech culture.\n\nAs a Frontend Developer specializing in React and CSS variables, I wanted to reach out to connect. I would love to ask you a couple of quick questions about how your team approaches component design constraints. If you have 10 minutes for a virtual coffee in the coming weeks, it would be an absolute pleasure.\n\nBest regards,\nJane Doe`;
      } else {
        // Post-Application Follow-up
        subject = `Follow-up: ${role} Application - Jane Doe`;
        body = `Dear ${recName},\n\nI hope you are having a productive week.\n\nI recently submitted my application for the ${role} position at ${company}. I wanted to follow up to reiterate my strong interest in the role and to ensure you received my resume.\n\nGiven my experience configuring Vite pipelines and building responsive layouts, I am very excited about the possibility of joining ${company}. If there are any additional details or portfolio samples I can provide to support my application, please let me know.\n\nThank you for your time and guidance.\n\nSincerely,\nJane Doe`;
      }

      setEmailSubject(subject);
      setEmailBody(body);
      setIsGenerated(true);
      setLoading(false);
    }, 800);
  };

  const handleCopy = () => {
    const fullText = `Subject: ${emailSubject}\n\n${emailBody}`;
    navigator.clipboard.writeText(fullText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Cold Email Generator" 
        description="Draft hyper-personalized cold outreach emails targeting hiring managers and recruiters."
      />

      <div className="grid-2">
        {/* Form panel */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Email Specifications
          </h3>
          <form onSubmit={generateEmail}>
            <div className="form-group">
              <label className="form-label" htmlFor="company">Company Name</label>
              <input 
                type="text" 
                id="company" 
                className="form-input" 
                required 
                placeholder="e.g. Stripe" 
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="role">Target Job Title</label>
              <input 
                type="text" 
                id="role" 
                className="form-input" 
                required 
                placeholder="e.g. Staff UI Engineer" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="recruiter">Recruiter / Manager Name (Optional)</label>
              <input 
                type="text" 
                id="recruiter" 
                className="form-input" 
                placeholder="e.g. Alex Smith" 
                value={recruiter}
                onChange={(e) => setRecruiter(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="purpose">Outreach Purpose</label>
              <select 
                id="purpose" 
                className="form-input"
                style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff' }}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              >
                <option value="Job Referral">Request Job Referral</option>
                <option value="General Networking">Informational Interview / Coffee Chat</option>
                <option value="Post-Application Follow-up">Post-Application Follow-up</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="tone">Brand Tone</label>
              <select 
                id="tone" 
                className="form-input"
                style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff' }}
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="Professional">Professional Corporate</option>
                <option value="Friendly/Casual">Friendly & Conversational</option>
                <option value="Bold/Direct">Bold & Results-Oriented</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.25rem' }} disabled={loading}>
              {loading ? 'Composing Draft...' : '✨ Compile Outreach Email'}
            </button>
          </form>
        </div>

        {/* Output panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Draft Preview & Review
          </h3>

          {!isGenerated ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
              <div>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>✉️</span>
                Fill in the parameters on the left and hit generate to draft a highly targeted outreach template.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }} className="animate-fade-in">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subject Line</label>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 'bold' }}
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Body</label>
                <textarea 
                  className="form-input" 
                  rows="12"
                  style={{ fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: '1.5', resize: 'vertical', flex: 1 }}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                />
              </div>

              {/* Compliance & Operations Toolbar */}
              <div style={{ 
                backgroundColor: 'rgba(245, 158, 11, 0.05)', 
                border: '1px solid rgba(245, 158, 11, 0.15)', 
                borderRadius: 'var(--border-radius-md)', 
                padding: '1rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '8px' 
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-warning)', fontWeight: 600 }}>
                  ⚠️ MOCK CONTROL RULE: Edit templates to review styling and content validation gates.
                </span>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '4px' }}>
                  <button 
                    className={`btn ${isApproved ? 'btn-secondary' : 'btn-primary'}`} 
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                    onClick={() => setIsApproved(true)}
                  >
                    {isApproved ? 'Approved ✅' : 'Approve Copy'}
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                    onClick={handleCopy}
                  >
                    {copySuccess ? 'Copied! ✅' : '📋 Copy Draft'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ColdEmailGenerator;
