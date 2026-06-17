/**
 * File Explanation: Notifications.jsx
 * 
 * 1. What is it?
 *    Notifications.jsx displays reminders, alert flags, and system suggestions.
 * 
 * 2. Why is it needed?
 *    Candidates manage multiple threads during a job search. Centralized notifications prevent them from
 *    forgetting followups or failing to respond to recruiter emails on time.
 * 
 * 3. How does it work?
 *    It maps an array of alert items to UI list items, using color status tags (warning, success, info)
 *    to denote severity.
 * 
 * 4. Real-world example
 *    Alert modules (like Slack notifications or GitHub alert centers) categorize alerts by urgency
 *    and provide quick action buttons.
 * 
 * 5. Advantages
 *    - Unified notification center.
 *    - Direct action buttons (e.g. "Prepare Outbound", "Launch Coach").
 * 
 * 6. Limitations
 *    - Cleared alerts do not persist across refreshes.
 * 
 * 7. Interview questions
 *    - What is a key layout rule for notifications centers to ensure high readability?
 * 
 * 8. Interview answers
 *    - Answer: Keeping spacing clean, grouping items chronologically, using recognizable icons,
 *      and rendering action buttons directly next to the notifications.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Notifications() {
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', text: 'Stripe application has been stagnant for 5 days. Consider drafting a follow-up LinkedIn message.', date: 'Today', actionLink: '/dashboard/profile', actionLabel: 'Profile Preferences' },
    { id: 2, type: 'info', text: 'Technical interview with Google scheduled for tomorrow. Have you practiced your React System Design question list?', date: '1 day ago', actionLink: '/dashboard/interviews', actionLabel: 'Start Coach' },
    { id: 3, type: 'success', text: 'Resume analysis parsed successfully. Your targeted matching score is now 84%!', date: '3 days ago', actionLink: '/dashboard/resumes', actionLabel: 'View Audit' }
  ]);

  const handleDismiss = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const getAlertColor = (type) => {
    switch(type) {
      case 'warning': return 'var(--color-warning)';
      case 'success': return 'var(--color-success)';
      default: return 'var(--color-accent)';
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Notification Hub</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Follow-up prompts and platform recommendations to govern your application pipelines.
        </p>
      </div>

      <div className="card">
        {alerts.length === 0 ? (
          <div style={{ padding: '3rem 0', textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem' }}>🍃</span>
            <h3 style={{ marginTop: '1rem', color: 'var(--text-primary)' }}>All caught up!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No pending alerts or action suggestions.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '1rem',
                  padding: '1.25rem', 
                  backgroundColor: 'rgba(255,255,255,0.01)',
                  border: '1px solid var(--border-color)', 
                  borderLeft: `4px solid ${getAlertColor(alert.type)}`,
                  borderRadius: 'var(--border-radius-md)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{alert.text}</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{alert.date}</span>
                  </div>
                  <button 
                    onClick={() => handleDismiss(alert.id)}
                    style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 'bold' }}
                    className="hover-glow"
                  >
                    ×
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to={alert.actionLink} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    {alert.actionLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
