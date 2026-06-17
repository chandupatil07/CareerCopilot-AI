/**
 * File Explanation: DashboardLayout.jsx (Upgraded Active States)
 * 
 * 1. What is it?
 *    DashboardLayout.jsx is the dashboard layout wrapper containing the collapsible navigation sidebar
 *    and top status indicators.
 * 
 * 2. Why is it needed?
 *    It makes the user's current route obvious by highlighting active sidebar items and provides profile
 *    avatar assets, replacing generic icons with high-end graphic elements.
 * 
 * 3. How does it work?
 *    It imports `user_avatar.png` and renders it inside image components, while utilizing React Router's
 *    `useLocation` to append border-left markers to the active sidebar link.
 * 
 * 4. Real-world example
 *    Standard SaaS dashboard shells (like Notion or Slack) show highlighted states on active channels and render
 *    custom user photos in corners.
 * 
 * 5. Advantages
 *    - Modern side-navigation drawer styling.
 *    - Real-life people assets (user avatar photo) enhance startup professionalism.
 * 
 * 6. Limitations
 *    - Modifying menu structures requires updates to the routing configuration.
 */

import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import userAvatar from '../assets/user_avatar.png';

function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  // Menu config
  const menuItems = [
    { label: 'Overview', path: '/dashboard', icon: '📊' },
    { label: 'Resume Center', path: '/dashboard/resumes', icon: '📄' },
    { label: 'Applications', path: '/dashboard/applications', icon: '📈' },
    { label: 'Interviews & Prep', path: '/dashboard/interviews', icon: '🗓️' },
    { label: 'AI Outreach Creator', path: '/dashboard/outreach', icon: '💬' },
    { label: 'Notifications', path: '/dashboard/notifications', icon: '🔔' },
    { label: 'User Profile', path: '/dashboard/profile', icon: '👤' },
    { label: 'Settings', path: '/dashboard/settings', icon: '⚙️' }
  ];

  // Inline styling parameters
  const layoutWrapperStyle = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-primary)'
  };

  const sidebarStyle = {
    width: '260px',
    backgroundColor: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 100,
    transition: 'transform 0.3s ease-in-out'
  };

  const mainPanelStyle = {
    flex: 1,
    marginLeft: '260px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  };

  const topbarStyle = {
    height: '70px',
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    position: 'sticky',
    top: 0,
    zIndex: 90
  };

  const contentWrapperStyle = {
    padding: '2rem',
    flex: 1,
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto'
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
    <div style={layoutWrapperStyle}>
      {/* 1. SIDEBAR */}
      <aside 
        style={{
          ...sidebarStyle,
          transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(0)' /* Override on desktop */
        }}
        className="dashboard-sidebar"
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex' }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            <Logo width="30" height="30" />
          </Link>
        </div>
        
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

      {/* 2. MAIN VIEWPORT */}
      <div style={mainPanelStyle} className="dashboard-main-panel">
        
        {/* Top bar */}
        <header style={topbarStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ fontSize: '1.5rem', color: 'var(--text-primary)', display: 'none' }}
            >
              ☰
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link to="/dashboard/notifications" style={{ position: 'relative', fontSize: '1.25rem' }}>
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
        </header>

        {/* Subviews Container */}
        <main style={contentWrapperStyle}>
          <div className="badge badge-purple" style={{ marginBottom: '1.5rem' }}>
            🔒 SaaS Mock Environment: No data will be written to remote servers.
          </div>
          <Outlet />
        </main>
      </div>

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 1024px) {
          .dashboard-sidebar {
            transform: translateX(-260px) !important;
          }
          .dashboard-main-panel {
            margin-left: 0 !important;
          }
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
    </div>
  );
}

export default DashboardLayout;
