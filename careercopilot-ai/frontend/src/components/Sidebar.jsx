import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import userAvatar from '../assets/user_avatar.png';

function Sidebar({ mobileMenuOpen, setMobileMenuOpen, handleLogout }) {
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Profile', path: '/dashboard/profile', icon: '👤' },
    { label: 'Resume Center', path: '/dashboard/resumes', icon: '📄' },
    { label: 'Applications', path: '/dashboard/applications', icon: '📈' },
    { label: 'Interviews', path: '/dashboard/interviews', icon: '🗓️' },
    { label: 'Notifications', path: '/dashboard/notifications', icon: '🔔' },
    { label: 'Settings', path: '/dashboard/settings', icon: '⚙️' }
  ];

  const sidebarStyle = {
    width: '260px',
    backgroundColor: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition: 'transform 0.3s ease-in-out'
  };

  const navItemStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0.85rem 1.25rem',
    borderRadius: 'var(--border-radius-md)',
    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
    backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
    fontWeight: isActive ? 600 : 500,
    borderLeft: isActive ? '4px solid var(--color-accent)' : '4px solid transparent',
    marginBottom: '0.5rem',
    transition: 'all 0.2s ease-in-out',
    boxShadow: isActive ? '0 2px 8px rgba(56, 189, 248, 0.05)' : 'none'
  });

  return (
    <aside style={sidebarStyle} className="dashboard-sidebar">
      {/* Brand Logo Header */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
        <Link to="/" onClick={() => setMobileMenuOpen(false)}>
          <Logo width="30" height="30" showText={true} />
        </Link>
      </div>
      
      {/* Navigation Links */}
      <nav style={{ padding: '1.5rem 1rem', flex: 1, overflowY: 'auto' }}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={index} 
              to={item.path} 
              style={navItemStyle(isActive)}
              onClick={() => setMobileMenuOpen(false)}
              className="hover-glow"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Profile Card */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img 
          src={userAvatar} 
          alt="User avatar" 
          style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border-color)', objectFit: 'cover' }}
        />
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>Jane Doe</h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>developer@profile</span>
        </div>
      </div>

      {/* Logout Action */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <button 
          className="btn btn-secondary" 
          style={{ width: '100%', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem' }}
          onClick={handleLogout}
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
