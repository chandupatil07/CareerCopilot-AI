import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import userAvatar from '../assets/user_avatar.png';
import { useAuth } from '../context/AuthContext';

function Sidebar({ mobileMenuOpen, setMobileMenuOpen, handleLogout, isCollapsed, setIsCollapsed }) {
  const { user } = useAuth();
  const userName = user?.name || 'Candidate User';
  const userEmail = user?.email || 'email@profile.com';
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Resume Center', path: '/dashboard/resumes', icon: '📄' },
    { label: 'Applications', path: '/dashboard/applications', icon: '📈' },
    { label: 'Interviews', path: '/dashboard/interviews', icon: '🗓️' },
    { label: 'AI Career Assistant', path: '/dashboard/assistant', icon: '🤖' },
    { label: 'Cold Email Generator', path: '/dashboard/cold-email', icon: '✉️' },
    { label: 'LinkedIn Generator', path: '/dashboard/linkedin-generator', icon: '💬' },
    { label: 'Career Analytics', path: '/dashboard/analytics', icon: '📉' },
    { label: 'Notifications', path: '/dashboard/notifications', icon: '🔔' },
    { label: 'Profile', path: '/dashboard/profile', icon: '👤' },
    { label: 'Settings', path: '/dashboard/settings', icon: '⚙️' },
    { label: 'Support', path: '/dashboard/support', icon: '❓' }
  ];

  const sidebarStyle = {
    width: isCollapsed ? '70px' : '260px',
    backgroundColor: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden'
  };

  const navItemStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: isCollapsed ? 'center' : 'flex-start',
    gap: isCollapsed ? '0px' : '12px',
    padding: isCollapsed ? '0.85rem 0' : '0.85rem 1.25rem',
    borderRadius: 'var(--border-radius-md)',
    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
    backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
    fontWeight: isActive ? 600 : 500,
    borderLeft: !isCollapsed && isActive ? '4px solid var(--color-accent)' : '4px solid transparent',
    marginBottom: '0.4rem',
    transition: 'all 0.2s ease-in-out',
    boxShadow: isActive ? '0 2px 8px rgba(56, 189, 248, 0.05)' : 'none',
    width: '100%',
    textAlign: 'center'
  });

  return (
    <aside style={sidebarStyle} className="dashboard-sidebar">
      {/* Brand Logo Header & Collapse Button */}
      <div style={{ 
        padding: isCollapsed ? '1rem 0' : '1.5rem', 
        borderBottom: '1px solid var(--border-color)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: isCollapsed ? 'center' : 'space-between',
        flexDirection: isCollapsed ? 'column' : 'row',
        gap: isCollapsed ? '10px' : '0px'
      }}>
        <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center' }}>
          <Logo width="30" height="30" showText={!isCollapsed} />
        </Link>
        
        {/* Toggle Collapse Button (hidden on mobile) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '0.85rem',
            transition: 'all 0.2s ease'
          }}
          className="hide-on-mobile hover-glow"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? '⟩' : '⟨'}
        </button>
      </div>
      
      {/* Navigation Links */}
      <nav style={{ padding: isCollapsed ? '1rem 0.35rem' : '1.5rem 1rem', flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={index} 
              to={item.path} 
              style={navItemStyle(isActive)}
              onClick={() => setMobileMenuOpen(false)}
              className="hover-glow"
              title={isCollapsed ? item.label : ''} // Tooltip helper when collapsed
            >
              <span style={{ fontSize: '1.2rem', display: 'inline-block' }}>{item.icon}</span>
              {!isCollapsed && <span style={{ transition: 'opacity 0.2s ease' }}>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Profile Card */}
      <div style={{ 
        padding: isCollapsed ? '1rem 0' : '1rem', 
        borderTop: '1px solid var(--border-color)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        gap: '10px' 
      }}>
        <img 
          src={userAvatar} 
          alt="User avatar" 
          style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            border: '1px solid var(--border-color)', 
            objectFit: 'cover',
            margin: isCollapsed ? '0 auto' : '0'
          }}
          title={isCollapsed ? `${userName} (${userEmail})` : ''}
        />
        {!isCollapsed && (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{userName}</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', display: 'block' }}>{userEmail}</span>
          </div>
        )}
      </div>

      {/* Logout Action */}
      <div style={{ padding: isCollapsed ? '0.5rem 0.25rem' : '1rem', borderTop: '1px solid var(--border-color)' }}>
        <button 
          className="btn btn-secondary" 
          style={{ 
            width: '100%', 
            padding: '0.5rem 1rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: isCollapsed ? '0px' : '8px', 
            fontSize: '0.85rem' 
          }}
          onClick={handleLogout}
          title={isCollapsed ? 'Sign Out' : ''}
        >
          <span>🚪</span>
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
