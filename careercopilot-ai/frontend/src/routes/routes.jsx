/**
 * File Explanation: routes.jsx
 * 
 * 1. What is it?
 *    routes.jsx is the application's client-side routing configuration file mapping URLs to pages.
 * 
 * 2. Why is it needed?
 *    Single Page Applications require a mechanism to update the viewport based on the URL path.
 *    This file defines which components display when a user visits `/`, `/about`, or undefined paths.
 * 
 * 3. How does it work?
 *    It uses React Router DOM's `createBrowserRouter`. It exports a router instance mapping layout routes
 *    and child page components (like LandingPage and BrandingPage) to specific paths.
 * 
 * 4. Real-world example
 *    E-commerce sites configure routes like `/` for the homepage, `/products/:id` for details,
 *    and `/cart` for purchasing, allowing instant client-side transitions.
 * 
 * 5. Advantages
 *    - Centralized route registry makes it easy to add new modules.
 *    - Natively supports nested routing (rendering pages inside layout shells).
 *    - Allows code-splitting (lazy loading pages) to optimize initial download sizes.
 * 
 * 6. Limitations
 *    - Broken paths default to blank screens unless a fallback catch-all route (404) is registered.
 * 
 * 7. Interview questions
 *    - What is a dynamic route, and how is it defined in React Router?
 *    - What is the difference between `Link` and standard anchor `<a>` tags in single-page apps?
 * 
 * 8. Interview answers
 *    - Answer: A dynamic route contains parameters (e.g. `/jobs/:jobId`) that act as wildcards, allowing
 *      the page component to extract the specific ID using React Router's `useParams()` hook.
 *    - Answer: Standard anchor `<a>` tags force the browser to trigger a full page refresh from the server,
 *      wiping out React state. The `Link` component intercepts the click, updates the URL locally, and swaps
 *      the rendering component instantly without reloading.
 */

import React from 'react';
import { createBrowserRouter, Link } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import Logo from '../components/Logo';

// ==========================================================================
// 1. HOME/LANDING PAGE VIEW (MOCKING SAAS FEATURES)
// ==========================================================================
function LandingPage() {
  const heroStyle = {
    textAlign: 'center',
    padding: '4rem 1rem',
    maxWidth: '800px',
    margin: '0 auto'
  };

  const badgeStyle = {
    display: 'inline-block',
    backgroundColor: 'rgba(0, 180, 216, 0.1)',
    color: 'var(--color-accent)',
    padding: '0.5rem 1rem',
    borderRadius: '50px',
    fontSize: '0.875rem',
    fontWeight: 600,
    marginBottom: '1.5rem',
    fontFamily: 'var(--font-headers)',
    letterSpacing: '1px'
  };

  const featuresStyle = {
    marginTop: '3rem'
  };

  return (
    <div>
      <div style={heroStyle}>
        <span style={badgeStyle}>MODULE 1.1: ARCHITECTURE SCATTER SCAFFOLD</span>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: 800 }}>
          Your AI-Powered <br />
          <span style={{ color: 'var(--color-accent)' }}>Career Acceleration</span> Hub
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', color: 'var(--text-secondary)' }}>
          Tailor resumes, track application pipelines, draft custom LinkedIn outbounds, and mock interviews with AI. All with mandatory human confirmation.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/about" className="btn btn-primary">
            Explore Brand Design
          </Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="btn btn-secondary">
            View Docs (README)
          </a>
        </div>
      </div>

      <div style={featuresStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '2.5rem', fontSize: '2rem' }}>Planned Startup SaaS Modules</h2>
        <div className="grid-cols-2">
          {/* Card 1 */}
          <div className="card">
            <h3 style={{ color: 'var(--color-accent)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📄</span> Resume Tailwind & Analysis
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Scan resume bullet points against targeted job descriptions, identify keyword gaps, and receive structural formatting recommendations.
            </p>
          </div>
          {/* Card 2 */}
          <div className="card">
            <h3 style={{ color: 'var(--color-accent)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📈</span> Application & Pipeline Tracker
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Track applications across various stages (Applied, Interviewing, Offer, Rejected). Set alerts for manual email followups.
            </p>
          </div>
          {/* Card 3 */}
          <div className="card">
            <h3 style={{ color: 'var(--color-accent)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📨</span> Outbound Email & Messaging
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Generate cold emails and tailored LinkedIn connection pitches based on recruiter profiles, with human confirmation required before sending.
            </p>
          </div>
          {/* Card 4 */}
          <div className="card">
            <h3 style={{ color: 'var(--color-accent)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🤖</span> AI Interview Prep Coach
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Interact with custom-tailored behavioral and technical interview questions, receiving feedback matching senior engineering expectations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================================================
// 2. BRANDING/DESIGN INFO VIEW
// ==========================================================================
function BrandingPage() {
  const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem 0'
  };

  const blockStyle = {
    marginBottom: '3rem'
  };

  const colorSwatchStyle = (colorHex) => ({
    width: '100%',
    height: '80px',
    backgroundColor: colorHex,
    borderRadius: 'var(--border-radius-md)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colorHex === '#FFFFFF' ? '#000' : '#FFF',
    fontFamily: 'var(--font-headers)',
    fontWeight: 'bold',
    fontSize: '0.875rem'
  });

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Brand Specifications</h1>
      <p style={{ fontSize: '1.125rem', marginBottom: '3rem', color: 'var(--text-secondary)' }}>
        This page details the design system elements implemented for CareerCopilot AI under Module 1.1.
      </p>

      {/* Colors section */}
      <div style={blockStyle}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          Color Tokens
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
          <div>
            <div style={colorSwatchStyle('#0A1128')}>#0A1128</div>
            <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.875rem' }}>Primary Background</p>
          </div>
          <div>
            <div style={colorSwatchStyle('#1C2541')}>#1C2541</div>
            <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.875rem' }}>Card Background</p>
          </div>
          <div>
            <div style={colorSwatchStyle('#00B4D8')}>#00B4D8</div>
            <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.875rem' }}>Electric Cyan Accent</p>
          </div>
          <div>
            <div style={colorSwatchStyle('#FFFFFF')}>#FFFFFF</div>
            <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.875rem' }}>White Text</p>
          </div>
        </div>
      </div>

      {/* Logo Construction */}
      <div style={blockStyle}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          Logo Concept: SVG Rendered
        </h2>
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
          <Logo width="120" height="120" showText={true} />
        </div>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
          The logo marks the union of standard professional navigation elements (<strong>Compass Ring</strong>), target acceleration paths (<strong>Ascending Career Arrow</strong>), and machine computation grids (<strong>AI Circuit nodes</strong>).
        </p>
      </div>

      {/* Typography section */}
      <div style={blockStyle}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          Typography System
        </h2>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600 }}>FONT FAMILY: OUTFIT (HEADERS)</span>
            <p style={{ fontFamily: 'var(--font-headers)', fontSize: '2rem', fontWeight: 700 }}>
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>
          <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)' }} />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600 }}>FONT FAMILY: INTER (BODY/TEXT)</span>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.125rem', color: 'var(--text-secondary)' }}>
              The quick brown fox jumps over the lazy dog. React client-side rendering uses lightweight fonts to ensure swift loading times.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================================================
// 3. 404 PAGE NOT FOUND VIEW
// ==========================================================================
function NotFoundPage() {
  const containerStyle = {
    textAlign: 'center',
    padding: '5rem 1rem'
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '6rem', color: 'var(--color-accent)', marginBottom: '1rem', fontFamily: 'var(--font-headers)' }}>404</h1>
      <h2 style={{ marginBottom: '1.5rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        The route you are looking for does not exist or is still under construction.
      </p>
      <Link to="/" className="btn btn-primary">
        Return Home
      </Link>
    </div>
  );
}

// ==========================================================================
// 4. ROUTER INSTANCE EXPORT
// ==========================================================================
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/about',
        element: <BrandingPage />
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);
