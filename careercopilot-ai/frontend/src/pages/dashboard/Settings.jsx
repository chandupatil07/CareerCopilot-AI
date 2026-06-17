/**
 * File Explanation: Settings.jsx
 * 
 * 1. What is it?
 *    Settings.jsx configures operational parameters, AI output configurations, and human validation rules.
 * 
 * 2. Why is it needed?
 *    Early SaaS architectures require preference settings. It houses switches that enforce our critical
 *    "User Control Rule"—ensuring the system never takes external actions without human approval.
 * 
 * 3. How does it work?
 *    It uses checkbox and selection list hooks (`useState`) to toggle configuration values and mock saving updates locally.
 * 
 * 4. Real-world example
 *    Enterprise applications (like Slack settings or Gmail automation panels) provide switches to block automatic
 *    outbounds and enforce review steps.
 * 
 * 5. Advantages
 *    - Enforces security guidelines transparently.
 *    - Reuses styled design system components.
 * 
 * 6. Limitations
 *    - Resetting browser cache resets all preferences back to default configurations.
 * 
 * 7. Interview questions
 *    - What is a Human-in-the-loop (HITL) architectural pattern and why is it important in AI systems?
 * 
 * 8. Interview answers
 *    - Answer: It is a design workflow that inserts a human validation gate before an AI automated action is committed,
 *      ensuring safety, compliance, and guarding against high-risk generative errors (hallucinations).
 */

import React, { useState } from 'react';

function Settings() {
  const [emailConfirm, setEmailConfirm] = useState(true);
  const [recordConfirm, setRecordConfirm] = useState(true);
  const [tone, setTone] = useState('Professional');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Settings & Rules</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Configure AI parameters and audit human confirmation rules.
        </p>
      </div>

      {saved && (
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.75rem', borderRadius: 'var(--border-radius-md)', marginBottom: '1.5rem', textAlign: 'center' }}>
          ✅ Settings Updated Successfully
        </div>
      )}

      <div className="grid-2">
        {/* MANDATORY HUMAN CONFIRMATION RULES */}
        <div className="card card-accent-purple">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            ⚠️ User Control Rules (Mandatory)
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Enforce human validation checks before CareerCopilot commits automated actions.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={emailConfirm} 
                onChange={(e) => setEmailConfirm(e.target.checked)}
                style={{ accentColor: 'var(--color-accent)', marginTop: '4px' }}
              />
              <div>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Confirm Outbound Mail Generation</span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Always present a review editor before copying or sending outreach emails.</p>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={recordConfirm} 
                onChange={(e) => setRecordConfirm(e.target.checked)}
                style={{ accentColor: 'var(--color-accent)', marginTop: '4px' }}
              />
              <div>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Confirm Status Transitions</span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Prompt confirmation dialogs before moving job applications between pipeline boards.</p>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', opacity: 0.6 }}>
              <input 
                type="checkbox" 
                checked={true} 
                disabled
                style={{ accentColor: 'var(--color-accent)', marginTop: '4px' }}
              />
              <div>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Confirm Calendar Integration (Locked)</span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Mandatory check before linking interviews to external calendar applications.</p>
              </div>
            </label>
          </div>
        </div>

        {/* AI OUTPUT TONAL SETTINGS */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            AI Writing Style
          </h3>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label" htmlFor="tone">Output Tone</label>
              <select 
                id="tone" 
                className="form-input" 
                value={tone} 
                onChange={(e) => setTone(e.target.value)}
                style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff' }}
              >
                <option value="Casual">Casual & Friendly</option>
                <option value="Professional">Standard Corporate</option>
                <option value="Technical">Senior Engineer Focus</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="gpt">Model Tier</label>
              <input 
                type="text" 
                id="gpt" 
                className="form-input" 
                value="CareerCopilot-Large-Preview" 
                disabled 
                style={{ opacity: 0.6 }} 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Save Configurations
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
