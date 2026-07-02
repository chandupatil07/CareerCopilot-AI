import React from 'react';
import PageHeader from '../../components/PageHeader';

function Settings() {
  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '2rem'
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Settings & Preferences" 
        description="Configure your SaaS environment, account security, and alert integrations." 
      />

      <div style={gridContainerStyle} className="settings-grid">
        {/* 1. PROFILE SETTINGS */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            👤 Profile Settings
          </h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input type="text" id="username" className="form-input" defaultValue="janedoe" placeholder="username" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="avatarUpload">Profile Photo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '5px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                  👤
                </div>
                <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} disabled>
                  Upload New Photo
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* 2. APPEARANCE SETTINGS */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            🎨 Appearance Settings
          </h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="form-label" htmlFor="themeSelect">Interface Theme</label>
              <select id="themeSelect" className="form-input" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff' }} defaultValue="midnight">
                <option value="midnight">Space Midnight (Dark Mode)</option>
                <option value="light">Classic Light (Locked)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Layout Mode</label>
              <div style={{ display: 'flex', gap: '15px', marginTop: '4px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input type="radio" name="layoutMode" defaultChecked style={{ accentColor: 'var(--color-accent)' }} />
                  <span>Standard</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input type="radio" name="layoutMode" style={{ accentColor: 'var(--color-accent)' }} />
                  <span>Compact</span>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* 3. NOTIFICATIONS SETTINGS */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            🔔 Notifications Preferences
          </h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--color-accent)' }} />
                <span>Send email alerts for upcoming interviews</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--color-accent)' }} />
                <span>Show desktop push notifications</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--color-accent)' }} />
                <span>Remind me about stagnant applications (5+ days)</span>
              </label>
            </div>
          </form>
        </div>

        {/* 4. SECURITY SETTINGS */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            🔒 Security Configurations
          </h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="form-label" htmlFor="currentPassword">Current Password</label>
              <input type="password" id="currentPassword" className="form-input" placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="newPassword">New Password</label>
              <input type="password" id="newPassword" className="form-input" placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="confirmNewPassword">Confirm New Password</label>
              <input type="password" id="confirmNewPassword" className="form-input" placeholder="••••••••" />
            </div>
          </form>
        </div>
      </div>

      <div style={{ marginTop: '2.5rem', textAlign: 'right' }}>
        <button className="btn btn-primary" style={{ cursor: 'not-allowed', opacity: 0.6 }} title="Save configurations disabled in Module 1.2 mockup">
          Save Settings (Mocked)
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .settings-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Settings;
