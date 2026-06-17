/**
 * File Explanation: AppLayout.jsx (Upgraded Active Navs)
 * 
 * 1. What is it?
 *    AppLayout.jsx defines the public page shell. It binds together the glassmorphic header, active menu highlights,
 *    and disclaimer footer layouts.
 * 
 * 2. Why is it needed?
 *    Visual navigation cues (active link underlines) orient the user in Single Page Applications (SPAs) where
 *    the page changes without reloading.
 * 
 * 3. How does it work?
 *    It uses React Router DOM's `useLocation` hook to read the active path, conditionally applying active text colors
 *    and a bottom-border underline highlight.
 * 
 * 4. Real-world example
 *    Portals like Vercel and Stripe display distinct underline marks under active sections (e.g., Docs, Pricing)
 *    so users understand their dashboard coordinates.
 * 
 * 5. Advantages
 *    - Eliminates navigation ambiguity (the "Where am I?" problem).
 *    - Smooth border CSS transitions look modern.
 * 
 * 6. Limitations
 *    - Relies on React Router's runtime history context, which requires standard Link tags to match correctly.
 * 
 * 7. Interview questions
 *    - How do you implement active page highlights inside navigation bars in React Router?
 * 
 * 8. Interview answers
 *    - Answer: By retrieving the browser's current path using the `useLocation()` hook and checking if it matches
 *      the link target. If it matches, we conditionally append styling classes or inline active parameters.
 */

import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';

function AppLayout() {
  const location = useLocation();

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 2rem',
    backgroundColor: 'rgba(5, 8, 22, 0.75)',
    borderBottom: '1px solid var(--border-color)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)'
  };

  const navListStyle = {
    display: 'flex',
    listStyle: 'none',
    gap: '2.5rem',
    alignItems: 'center'
  };

  const linkStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
      fontWeight: isActive ? 600 : 500,
      fontSize: '0.95rem',
      fontFamily: 'var(--font-headers)',
      transition: 'all 0.2s ease-in-out',
      borderBottom: isActive ? '2.5px solid var(--color-accent)' : '2.5px solid transparent',
      paddingBottom: '6px',
      textShadow: isActive ? '0 0 8px rgba(56, 189, 248, 0.4)' : 'none'
    };
  };

  const footerStyle = {
    backgroundColor: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border-color)',
    padding: '3rem 1.5rem',
    textAlign: 'center',
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    flexShrink: 0
  };

  const footerNavStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap'
  };

  const warningBadgeStyle = {
    display: 'inline-block',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    color: 'var(--color-warning)',
    padding: '0.25rem 0.75rem',
    borderRadius: '50px',
    fontSize: '0.75rem',
    fontWeight: 600,
    marginBottom: '1.25rem',
    border: '1px solid rgba(245, 158, 11, 0.2)'
  };

  return (
    <div className="app-container">
      {/* HEADER */}
      <header style={headerStyle}>
        <Link to="/">
          <Logo width="34" height="34" showText={true} />
        </Link>
        <nav className="desktop-only-nav">
          <ul style={navListStyle}>
            <li>
              <Link to="/" style={linkStyle('/')} className="hover-glow">Home</Link>
            </li>
            <li>
              <Link to="/about" style={linkStyle('/about')} className="hover-glow">About Us</Link>
            </li>
            <li>
              <Link to="/contact" style={linkStyle('/contact')} className="hover-glow">Contact</Link>
            </li>
            <li>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.45rem 1.15rem', fontSize: '0.85rem' }}>
                Sign In
              </Link>
            </li>
            <li>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.45rem 1.15rem', fontSize: '0.85rem' }}>
                Launch Workspace
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* OUTLET VIEWPORT */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer style={footerStyle}>
        <div style={warningBadgeStyle}>
          ⚠️ USER CONTROL RULE: Human confirmation required for all outbound AI actions.
        </div>
        
        <nav style={footerNavStyle}>
          <Link to="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
          <Link to="/about" style={{ color: 'var(--text-secondary)' }}>About Us</Link>
          <Link to="/contact" style={{ color: 'var(--text-secondary)' }}>Contact Us</Link>
          <a href="#privacy" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</a>
          <a href="#terms" style={{ color: 'var(--text-secondary)' }}>Terms of Service</a>
        </nav>

        <p style={{ marginBottom: '0.5rem' }}>
          &copy; {new Date().getFullYear()} CareerCopilot AI. All rights reserved.
        </p>
        <p style={{ opacity: 0.6, fontSize: '0.75rem' }}>
          Providing safe, controlled career acceleration tools for modern technical professionals.
        </p>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .desktop-only-nav {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default AppLayout;
