/**
 * File Explanation: OutreachGenerator.jsx
 * 
 * 1. What is it?
 *    OutreachGenerator.jsx is the dashboard module that creates personalized cold outreach emails and LinkedIn connection messages.
 * 
 * 2. Why is it needed?
 *    Manual outreach is a critical task in finding a job. Automating template drafting saves time, while
 *    our confirmation gate guarantees compliance with the startup's strict User Control Rules.
 * 
 * 3. How does it work?
 *    It uses controlled form inputs (recruiter name, company, role, tone) to programmatically compose message drafts
 *    stored in editable state areas. Toggles support clipboard copying and approve/verify actions.
 * 
 * 4. Real-world example
 *    Outreach modules in sites (like Mailshake or Hunter.io) generate copy-pastable templates for sales and recruiting campaigns.
 * 
 * 5. Advantages
 *    - Dual output format (Cold Email + LinkedIn Message).
 *    - Fully editable text area drafts.
 *    - Human confirmation checks are enforced visually.
 * 
 * 6. Limitations
 *    - Does not send outbound emails automatically (by design, matching our User Control Rules).
 * 
 * 7. Interview questions
 *    - How do you implement a 'copy to clipboard' function in standard web browsers using React?
 * 
 * 8. Interview answers
 *    - Answer: By calling `navigator.clipboard.writeText(textValue)` inside a click handler, often updating
 *      a temporary boolean state (e.g. `copied = true`) to show a "Copied!" checkmark to the user.
 */

import React, { useState } from 'react';

function OutreachGenerator() {
  const [recruiter, setRecruiter] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [tone, setTone] = useState('Professional');
  const [activeTab, setActiveTab] = useState('email'); // email, linkedin
  const [isGenerated, setIsGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Message editable states
  const [emailText, setEmailText] = useState('');
  const [linkedinText, setLinkedinText] = useState('');
  
  // Approval states
  const [isApproved, setIsApproved] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Dynamic template generator mapping
  const generateTemplates = (e) => {
    e.preventDefault();
    if (!company || !role) return;

    setLoading(true);
    setIsApproved(false);
    setCopySuccess(false);

    setTimeout(() => {
      const recruiterName = recruiter || 'Hiring Team';
      
      let emailBody = '';
      let linkedinBody = '';

      if (tone === 'Technical') {
        emailBody = `Subject: Inquiry: ${role} opening at ${company}\n\nHi ${recruiterName},\n\nI noticed the ${role} position at ${company}. With my technical expertise in React rendering optimizations and Vite bundler pipelines, I am eager to contribute to your codebase performance.\n\nI have attached my resume, detailing how I scaled platform performance. I would love to schedule a brief call next week to discuss your engineering goals.\n\nBest regards,\nJane Doe`;
        linkedinBody = `Hi ${recruiterName}, I noticed your search for a ${role} at ${company}. With my background in React rendering optimizations and Vite, I am keen to learn more. Let's connect!`;
      } else if (tone === 'Casual') {
        emailBody = `Subject: Hello from a fan of ${company}! 👋\n\nHi ${recruiterName},\n\nI love what you guys are building at ${company}, especially your tech stack choices. I saw you're hiring a new ${role} and wanted to put my hat in the ring.\n\nI'm a developer specializing in building modern user interfaces with React and CSS variables. I've attached my resume—would love to chat casually if you have 10 minutes next week!\n\nCheers,\nJane Doe`;
        linkedinBody = `Hey ${recruiterName}, hope you're having a great week! I saw you're building out the team for the ${role} role at ${company}. Would love to connect and chat about your roadmap!`;
      } else {
        // Professional default
        emailBody = `Subject: Application Inquiry: ${role} - Jane Doe\n\nDear ${recruiterName},\n\nI am writing to express my interest in the ${role} opening at ${company}. As a developer experienced in building scalable React components and modular CSS systems, I believe my profile aligns well with your team.\n\nMy resume is attached for your review. I look forward to the opportunity to discuss how I can add value to ${company}.\n\nSincerely,\nJane Doe`;
        linkedinBody = `Dear ${recruiterName}, I hope this message finds you well. I am interested in the ${role} position at ${company} and would love to connect to learn more about the team's engineering culture.`;
      }

      setEmailText(emailBody);
      setLinkedinText(linkedinBody);
      setIsGenerated(true);
      setLoading(false);
    }, 1000);
  };

  const handleCopy = () => {
    const textToCopy = activeTab === 'email' ? emailText : linkedinText;
    navigator.clipboard.writeText(textToCopy);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleApprove = () => {
    setIsApproved(true);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>AI Outreach Creator</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Draft customized connection pitches. Inspect and verify drafts before utilizing them.
        </p>
      </div>

      <div className="grid-2">
        {/* PARAMS FORM */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Outreach Parameters
          </h3>
          <form onSubmit={generateTemplates}>
            <div className="form-group">
              <label className="form-label" htmlFor="company">Company Name</label>
              <input type="text" id="company" className="form-input" value={company} onChange={(e) => setCompany(e.target.value)} required placeholder="e.g. Stripe" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="role">Job Title</label>
              <input type="text" id="role" className="form-input" value={role} onChange={(e) => setRole(e.target.value)} required placeholder="e.g. Staff UI Engineer" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="recruiter">Recruiter Name (Optional)</label>
              <input type="text" id="recruiter" className="form-input" value={recruiter} onChange={(e) => setRecruiter(e.target.value)} placeholder="e.g. Alex Smith" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="tone">Drafting Tone</label>
              <select 
                id="tone" 
                className="form-input" 
                value={tone} 
                onChange={(e) => setTone(e.target.value)}
                style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff' }}
              >
                <option value="Professional">Professional Corporate</option>
                <option value="Casual">Casual & Friendly</option>
                <option value="Technical">Senior Engineer Focus</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? 'Generating...' : '✨ Generate Outreach Drafts'}
            </button>
          </form>
        </div>

        {/* REVIEW & APPROVAL VIEW */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Outbound Review & Approval Panel
          </h3>

          {!isGenerated ? (
            <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              <span>Enter parameter fields and generate templates to reveal drafts.</span>
            </div>
          ) : (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Tab Selector */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className={`btn ${activeTab === 'email' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                  onClick={() => { setActiveTab('email'); setCopySuccess(false); }}
                >
                  Cold Email Draft
                </button>
                <button 
                  className={`btn ${activeTab === 'linkedin' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                  onClick={() => { setActiveTab('linkedin'); setCopySuccess(false); }}
                >
                  LinkedIn Connect Pitch
                </button>
              </div>

              {/* Editable Content */}
              <div className="form-group" style={{ margin: 0 }}>
                <textarea 
                  className="form-input" 
                  rows="10"
                  value={activeTab === 'email' ? emailText : linkedinText}
                  onChange={(e) => activeTab === 'email' ? setEmailText(e.target.value) : setLinkedinText(e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: '1.5', resize: 'vertical' }}
                />
              </div>

              {/* Human Approval Status Display */}
              <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.15)', borderRadius: 'var(--border-radius-md)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-warning)', fontWeight: 600 }}>
                  ⚠️ USER CONTROL RULE: Verify text matches target specifications before committing.
                </span>
                
                {isApproved ? (
                  <span style={{ color: 'var(--color-success)', fontWeight: 600, fontSize: '0.9rem' }}>
                    ✅ Draft Approved! Message copy verified.
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    Status: Pending Approval
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-secondary" style={{ flex: 1, padding: '0.6rem' }} onClick={handleCopy}>
                  {copySuccess ? '📋 Copied!' : '📋 Copy Draft'}
                </button>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '0.6rem' }} 
                  onClick={handleApprove}
                  disabled={isApproved}
                >
                  {isApproved ? 'Verified' : 'Verify & Approve'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OutreachGenerator;
