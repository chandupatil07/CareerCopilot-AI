import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { SUPPORT_FAQS } from '../../constants/dashboardData';
import mockDb from '../../services/mockDb';

function Support() {
  const [faqs, setFaqs] = useState(
    SUPPORT_FAQS.map((f, idx) => ({ ...f, id: idx, expanded: false }))
  );
  const [searchQuery, setSearchQuery] = useState('');
  
  // Ticket form states
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Technical Issue');
  const [message, setMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleFaq = (id) => {
    setFaqs(prev => prev.map(f => ({
      ...f,
      expanded: f.id === id ? !f.expanded : f.expanded
    })));
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!subject || !message) return;

    setLoading(true);
    setTimeout(() => {
      setTicketSubmitted(true);
      setLoading(false);
      setSubject('');
      setMessage('');
    }, 1000);
  };

  const filteredFaqs = faqs.filter(
    f => f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
         f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Help & Support Workspace" 
        description="Search platform guides, solve account inquiries, or contact our simulated helpdesk."
      />

      <div className="grid-2">
        {/* FAQs list accordion */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Frequently Asked Questions
          </h3>

          <div style={{ marginBottom: '1.5rem' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="🔍 Search FAQ topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredFaqs.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                No FAQs matched your search term.
              </div>
            ) : (
              filteredFaqs.map(f => (
                <div 
                  key={f.id}
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-md)',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(15, 23, 42, 0.2)'
                  }}
                >
                  <div 
                    onClick={() => toggleFaq(f.id)}
                    style={{
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: f.expanded ? 'var(--color-accent)' : 'var(--text-primary)',
                      backgroundColor: f.expanded ? 'rgba(56, 189, 248, 0.03)' : 'transparent',
                      transition: 'all 0.2s ease'
                    }}
                    className="hover-glow"
                  >
                    <span>{f.question}</span>
                    <span>{f.expanded ? '▲' : '▼'}</span>
                  </div>
                  {f.expanded && (
                    <div style={{
                      padding: '1rem',
                      borderTop: '1px solid var(--border-color)',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.6',
                      backgroundColor: 'rgba(7, 12, 27, 0.2)'
                    }}>
                      {f.answer}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Local storage reset option */}
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            border: '1px dashed var(--border-color)', 
            borderRadius: 'var(--border-radius-md)',
            backgroundColor: 'rgba(239, 68, 68, 0.02)'
          }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--color-error)', fontWeight: 600, marginBottom: '6px' }}>
              🔧 Advanced: Reset Simulated Database
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Clearing local storage restores all mock job entries, scheduled interviews, and dashboard statistics to their factory configurations.
            </p>
            <button 
              className="btn btn-secondary" 
              style={{ color: 'var(--color-error)', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '0.4rem 1rem', fontSize: '0.8rem' }}
              onClick={() => {
                if (window.confirm('Reset local storage simulation databases back to initial mock presets? All custom edits will be wiped.')) {
                  mockDb.reset();
                }
              }}
            >
              Reset Mock Storage
            </button>
          </div>
        </div>

        {/* Support Ticketing form */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Submit a Help Ticket
          </h3>

          {ticketSubmitted ? (
            <div className="animate-fade-in" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '300px', padding: '2rem' }}>
              <div>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>✉️</span>
                <h4 style={{ color: 'var(--color-success)', fontWeight: 700, fontSize: '1.25rem', marginBottom: '6px' }}>Ticket Submitted Successfully!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  Your support inquiry was captured locally. In a production build, our telemetry service uploads this query to Zendesk or Jira Service Desk.
                </p>
                <button className="btn btn-primary" onClick={() => setTicketSubmitted(false)}>
                  Submit Another Ticket
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="subj">Ticket Subject</label>
                <input 
                  type="text" 
                  id="subj" 
                  className="form-input" 
                  required 
                  placeholder="e.g. ATS Score keywords mapping bug"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="cat">Category</label>
                <select 
                  id="cat" 
                  className="form-input"
                  style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff' }}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Technical Issue">Technical / Layout Issue</option>
                  <option value="Resume Analysis">Resume Scanner Question</option>
                  <option value="Outreach Builder">Outreach Template Inquiry</option>
                  <option value="Account Privacy">General Questions</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label className="form-label" htmlFor="details">Trouble Details</label>
                <textarea 
                  id="details" 
                  className="form-input" 
                  required 
                  rows="6" 
                  style={{ resize: 'vertical', flex: 1 }}
                  placeholder="Explain what happened, including any layout or browser specific coordinates..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Submitting Inquiry...' : '⚡ Launch Help Ticket'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Support;
