/**
 * File Explanation: AppLayout.jsx
 * 
 * 1. What is it?
 *    AppLayout.jsx is a layout wrapper component defining the global structural layout (Header, Footer, Navigation)
 *    shared by multiple pages in the app.
 * 
 * 
 * 2. Why is it needed?
 *    It guarantees a consistent UX by wrapping pages with a shared header, sidebar, and footer. It prevents code duplication
 *    since we don't have to define headers and footers on every single page view.
 * 
 * 3. How does it work?
 *    It uses React Router's `<Outlet />` component. When a user navigates to a route, the router matches the parent layout,
 *    renders it, and injects the specific page component (like Home or About) inside the `<Outlet />` placeholder.
 * 
 * 4. Real-world example
 *    Dashboards like HubSpot or GitHub have static headers and sidebars. When clicking links, only the main panel content changes.
 *    This is done using layout components.
 * 
 * 5. Advantages
 *    - DRY (Don't Repeat Yourself) principle.
 *    - Allows centralized changes to headers, navigation menus, and global states.
 *    - Enables page transition animations and consistent structure.
 * 
 * 6. Limitations
 *    - Requires structured routing hierarchies; mixing pages that need different layouts (like marketing landing pages
 *      vs internal dashboards) requires creating multiple distinct layouts.
 * 
 * 7. Interview questions
 *    - What is the `<Outlet />` component in React Router, and how is it used in layouts?
 *    - How do you pass state or shared data down from a Layout component to nested child page views?
 * 
 * 8. Interview answers
 *    - Answer: The `<Outlet />` acts as a placeholder that renders the active child route component. It is placed inside
 *      the Layout component's markup where page content should go.
 *    - Answer: React Router allows passing a `context` prop to the `<Outlet />` (e.g., `<Outlet context={{ user }} />`),
 *      which child pages can access using the `useOutletContext()` hook.
 */

import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Logo from '../components/Logo';

function AppLayout() {
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-color)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)'
  };

  const navListStyle = {
    display: 'flex',
    listStyle: 'none',
    gap: '2rem',
    alignItems: 'center'
  };

  const linkStyle = {
    color: 'var(--text-secondary)',
    fontWeight: 500,
    fontFamily: 'var(--font-headers)',
    transition: 'color 0.2s ease-in-out'
  };

  const footerStyle = {
    backgroundColor: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border-color)',
    padding: '2rem 1.5rem',
    textAlign: 'center',
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    flexShrink: 0
  };

  const warningBadgeStyle = {
    display: 'inline-block',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    color: 'var(--color-warning)',
    padding: '0.25rem 0.75rem',
    borderRadius: '50px',
    fontSize: '0.75rem',
    fontWeight: 600,
    marginBottom: '1rem',
    border: '1px solid rgba(245, 158, 11, 0.2)'
  };

  return (
    <div className="app-container">
      {/* HEADER NAVIGATION */}
      <header style={headerStyle}>
        <Link to="/">
          <Logo width="36" height="36" />
        </Link>
        <nav>
          <ul style={navListStyle}>
            <li>
              <Link to="/" style={linkStyle} className="hover-glow">Home</Link>
            </li>
            <li>
              <Link to="/about" style={linkStyle} className="hover-glow">Branding</Link>
            </li>
            <li>
              <Link to="/about" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                Launch App
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* MAIN VIEWPORT CONTAINER */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer style={footerStyle}>
        <div style={warningBadgeStyle}>
          ⚠️ USER CONTROL RULE: Human approval mandatory for all AI operations.
        </div>
        <p style={{ marginBottom: '0.5rem' }}>
          &copy; {new Date().getFullYear()} CareerCopilot AI. All rights reserved.
        </p>
        <p style={{ opacity: 0.6, fontSize: '0.75rem' }}>
          Built with React + Vite + Vanilla CSS. Designed for tech career acceleration.
        </p>
      </footer>
    </div>
  );
}

export default AppLayout;
