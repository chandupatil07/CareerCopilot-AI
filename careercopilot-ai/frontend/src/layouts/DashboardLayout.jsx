import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const menuLabels = {
    '/dashboard': 'Dashboard',
    '/dashboard/profile': 'Profile',
    '/dashboard/resumes': 'Resume Center',
    '/dashboard/applications': 'Applications',
    '/dashboard/interviews': 'Interviews',
    '/dashboard/notifications': 'Notifications',
    '/dashboard/settings': 'Settings'
  };

  const currentLabel = menuLabels[location.pathname] || 'Dashboard';

  const layoutWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-primary)'
  };

  const mainSectionStyle = {
    display: 'flex',
    flex: 1,
    position: 'relative'
  };

  const contentAreaStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0 /* Prevent flex item overflow */
  };

  const contentWrapperStyle = {
    padding: '2rem',
    flex: 1,
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto'
  };

  const footerStyle = {
    padding: '1.5rem',
    textAlign: 'center',
    borderTop: '1px solid var(--border-color)',
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
    backgroundColor: 'var(--bg-secondary)'
  };

  return (
    <div style={layoutWrapperStyle}>
      {/* 1. TOP NAVBAR */}
      <Navbar 
        currentLabel={currentLabel} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />

      <div style={mainSectionStyle}>
        {/* 2. SIDEBAR */}
        <div 
          className={`sidebar-container ${mobileMenuOpen ? 'mobile-open' : ''}`}
        >
          <Sidebar 
            mobileMenuOpen={mobileMenuOpen} 
            setMobileMenuOpen={setMobileMenuOpen} 
            handleLogout={handleLogout} 
          />
        </div>

        {/* 3. CONTENT AREA */}
        <div style={contentAreaStyle}>
          <main style={contentWrapperStyle}>
            <div className="badge badge-purple" style={{ marginBottom: '1.5rem' }}>
              🔒 SaaS Mock Environment: No data will be written to remote servers.
            </div>
            <Outlet />
          </main>

          {/* 4. FOOTER */}
          <footer style={footerStyle}>
            &copy; {new Date().getFullYear()} CareerCopilot AI. Dedicated Career Acceleration Shell.
          </footer>
        </div>
      </div>

      {/* Sidebar layouts styling rules */}
      <style>{`
        .sidebar-container {
          width: 260px;
          flex-shrink: 0;
          height: calc(100vh - 70px);
          position: sticky;
          top: 70px;
          z-index: 100;
          transition: transform 0.3s ease-in-out;
        }
        @media (max-width: 1024px) {
          .sidebar-container {
            position: fixed;
            top: 70px;
            bottom: 0;
            left: 0;
            height: calc(100vh - 70px);
            transform: translateX(-260px);
          }
          .sidebar-container.mobile-open {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

export default DashboardLayout;
