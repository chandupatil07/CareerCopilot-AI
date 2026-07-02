import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';

function LinkedInGenerator() {
  const [recruiter, setRecruiter] = useState('');
  const [role, setRole] = useState('');
  const [context, setContext] = useState('');
  const [activeTab, setActiveTab] = useState('connect'); // connect, followup, thankYou
  const [isGenerated, setIsGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  // Draft templates state
  const [connectText, setConnectText] = useState('');
  const [followupText, setFollowupText] = useState('');
  const [thankYouText, setThankYouText] = useState('');

  const generateMessages = (e) => {
    e.preventDefault();
    if (!role) return;

    setLoading(true);
    setCopySuccess(false);
    setIsApproved(false);

    setTimeout(() => {
      const recName = recruiter || 'Hiring Team';
      const companyContext = context ? `at ${context}` : '';

      // 1. Connection Request (Strict limit: Max 300 characters for standard LinkedIn invites!)
      const inviteMsg = `Hi ${recName}, I noticed your team is hiring a ${role} ${companyContext}. With my background designing high-performance React architectures, I'm keen to connect and learn about your front-end roadmap. Let's link up!`;

      // 2. Follow-up Message
      const followupMsg = `Hi ${recName},\n\nHope you're having a productive week.\n\nI recently applied for the ${role} opening ${companyContext}. I wanted to check in to see if you have had a chance to review my profile. I'd love to jump on a quick call to talk about how my React system design skills align with your goals.\n\nThanks!\nJane Doe`;

      // 3. Thank You Message
      const thankYouMsg = `Hi ${recName},\n\nThank you so much for taking the time to speak with me today about the ${role} opportunity. I really enjoyed hearing about the challenges your team is solving.\n\nI'm excited about the possibility of contributing and will follow up if you need any additional portfolio samples.\n\nBest,\nJane Doe`;

      setConnectText(inviteMsg);
      setFollowupText(followupMsg);
      setThankYouText(thankYouMsg);
      setIsGenerated(true);
      setLoading(false);
    }, 800);
  };

  const getActiveText = () => {
    if (activeTab === 'connect') return connectText;
    if (activeTab === 'followup') return followupText;
    return thankYouText;
  };

  const updateActiveText = (val) => {
    if (activeTab === 'connect') setConnectText(val);
    else if (activeTab === 'followup') setFollowupText(val);
    else setThankYouText(val);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveText());
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const getCharacterCount = () => {
    return getActiveText().length;
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="LinkedIn Message Builder" 
        description="Build LinkedIn connection requests, follow-ups, and thank-you templates."
      />

      <div className="grid-2">
        {/* Input panel */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            LinkedIn Parameters
          </h3>
          <form onSubmit={generateMessages}>
            <div className="form-group">
              <label className="form-label" htmlFor="role">Target Job Title</label>
              <input 
                type="text" 
                id="role" 
                className="form-input" 
                required 
                placeholder="e.g. Senior Product Engineer" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="recruiter">Recruiter Name (Optional)</label>
              <input 
                type="text" 
                id="recruiter" 
                className="form-input" 
                placeholder="e.g. Sarah Jenkins" 
                value={recruiter}
                onChange={(e) => setRecruiter(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="context">Target Company (Optional)</label>
              <input 
                type="text" 
                id="context" 
                className="form-input" 
                placeholder="e.g. Vercel" 
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.25rem' }} disabled={loading}>
              {loading ? 'Drafting Messages...' : '✨ Compile LinkedIn Templates'}
            </button>
          </form>
        </div>

        {/* Output panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Message Previews & Actions
          </h3>

          {!isGenerated ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
              <div>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>💬</span>
                Submit parameters to formulate the three core outreach templates.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }} className="animate-fade-in">
              {/* Tab navigation */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <button 
                  className={`btn ${activeTab === 'connect' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                  onClick={() => { setActiveTab('connect'); setCopySuccess(false); }}
                >
                  Connection Invite
                </button>
                <button 
                  className={`btn ${activeTab === 'followup' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                  onClick={() => { setActiveTab('followup'); setCopySuccess(false); }}
                >
                  Follow-up Note
                </button>
                <button 
                  className={`btn ${activeTab === 'thankYou' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                  onClick={() => { setActiveTab('thankYou'); setCopySuccess(false); }}
                >
                  Thank You
                </button>
              </div>

              {/* Text area edit field */}
              <div className="form-group" style={{ margin: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', margin: 0 }}>Message Copy</label>
                  {activeTab === 'connect' && (
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: getCharacterCount() > 300 ? 'var(--color-warning)' : 'var(--text-muted)',
                      fontWeight: getCharacterCount() > 300 ? 700 : 500
                    }}>
                      Length: {getCharacterCount()}/300 chars {getCharacterCount() > 300 ? '⚠️ Exceeds limit' : '✅ Safe invite'}
                    </span>
                  )}
                </div>
                <textarea 
                  className="form-input" 
                  rows="10"
                  style={{ fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: '1.5', resize: 'none', flex: 1 }}
                  value={getActiveText()}
                  onChange={(e) => updateActiveText(e.target.value)}
                />
              </div>

              {/* Toolbar */}
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
                  ⚠️ REGULATION COMPLIANCE: Verify invite lengths conform to standard constraints.
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
                    {copySuccess ? 'Copied! ✅' : '📋 Copy Text'}
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

export default LinkedInGenerator;
