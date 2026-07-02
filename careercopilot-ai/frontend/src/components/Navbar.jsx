import React from 'react';
import { Link } from 'react-router-dom';
import userAvatar from '../assets/user_avatar.png';

function Navbar({ currentLabel, mobileMenuOpen, setMobileMenuOpen }) {
  const topbarStyle = {
    height: '70px',
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    width: '100%'
  };

  return (
    <header style={topbarStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ fontSize: '1.5rem', color: 'var(--text-primary)', display: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ☰
        </button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          {currentLabel}
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/dashboard/notifications" style={{ position: 'relative', fontSize: '1.25rem', display: 'flex', alignItems: 'center' }}>
          <span>🔔</span>
          <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: 'var(--color-accent-purple)', width: '8px', height: '8px', borderRadius: '50%' }}></span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src={userAvatar} 
            alt="User Profile" 
            style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--color-accent)', objectFit: 'cover' }}
          />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }} className="desktop-only">Jane Doe</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .mobile-toggle-btn {
            display: block !important;
          }
        }
        .desktop-only {
          display: block;
        }
        @media (max-width: 640px) {
          .desktop-only {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}

export default Navbar;
