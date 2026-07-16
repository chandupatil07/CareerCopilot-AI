/**
 * File Explanation: LoginPage.jsx (Upgraded Split-Screen)
 * 
 * 1. What is it?
 *    LoginPage.jsx renders the login page, featuring a split-screen container.
 * 
 * 2. Why is it needed?
 *    Modern SaaS products use split-screen layouts for onboarding views. Placing forms next to high-fidelity brand art
 *    improves the sign-in experience.
 * 
 * 3. How does it work?
 *    It uses a flex row configuration to divide the screen 50/50 on desktop. It imports `auth_banner.png`
 *    for the cover art panel and routes programmatically to `/dashboard` upon form submission.
 * 
 * 4. Real-world example
 *    Portals like Supabase, Vercel, and Clerk split sign-in screens between forms and branding art.
 * 
 * 5. Advantages
 *    - Modern, responsive split design (collapses to single column on mobile).
 *    - Reuses design system variables.
 *    - Aligns form fields with screen height.
 * 
 * 6. Limitations
 *    - Authentication is simulated locally.
 * 
 * 7. Interview questions
 *    - What is a split-screen layout and how is it styled responsively using CSS?
 * 
 * 8. Interview answers
 *    - Answer: It splits viewports into distinct columns using Flexbox or Grid. We apply `@media` rules
 *      to stack the columns vertically (`flex-direction: column`) on mobile and hide decorative banners to optimize viewports.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authBanner from '../assets/auth_banner.png';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import ButtonLoader from '../components/ButtonLoader';
import { ROUTES } from '../constants/routes';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(ROUTES.DASHBOARD.HOME);
    } catch (err) {
      // Error details populated inside AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const splitScreenStyle = {
    display: 'flex',
    minHeight: '100vh',
    width: '100vw',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 200,
    backgroundColor: 'var(--bg-primary)'
  };

  const formColumnStyle = {
    flex: '1 1 50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '3rem',
    backgroundColor: 'var(--bg-primary)'
  };

  const artColumnStyle = {
    flex: '1 1 50%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '4rem',
    overflow: 'hidden'
  };

  return (
    <div style={splitScreenStyle} className="animate-fade-in login-split-viewport">
      {/* LEFT COLUMN: FORM */}
      <div style={formColumnStyle}>
        <div style={{ maxWidth: '380px', width: '100%', margin: '0 auto' }}>
          
          {/* Logo linkage */}
          <div style={{ marginBottom: '2.5rem' }}>
            <Link to="/" onClick={() => setError(null)}>
              <Logo width="36" height="36" showText={true} />
            </Link>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 800 }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Sign in to manage your career tracking dashboard.
            </p>
          </div>

          {error && (
            <div style={{
              padding: '0.8rem',
              borderRadius: 'var(--border-radius-sm)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#EF4444',
              marginBottom: '1.5rem',
              fontSize: '0.85rem'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="form-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" 
                required 
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label" htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                className="form-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: 'var(--color-accent)' }} />
                <span>Remember me</span>
              </label>
              <a href="#forgot" style={{ color: 'var(--color-accent)' }}>Forgot password?</a>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }} disabled={submitting}>
              {submitting ? <ButtonLoader /> : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Don't have an account? </span>
            <Link to={ROUTES.REGISTER} onClick={() => setError(null)} style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Create Account</Link>
          </div>
        </div>
      </div>


      {/* RIGHT COLUMN: BRAND GRAPHICS COVER */}
      <div style={artColumnStyle} className="login-art-column">
        {/* Absolute Banner Cover */}
        <img 
          src={authBanner} 
          alt="Auth cover banner" 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1, filter: 'brightness(0.6)' }}
        />
        {/* Overlay texts */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '450px' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '1.5rem' }}>CareerCopilot AI Workspace</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem', lineHeight: '1.2' }}>
            Accelerate your career search with telemetry co-pilots
          </h2>
          <p style={{ color: '#E2E8F0', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Build custom cold templates, score ATS compatibility scores, and prep mock system design interviews in minutes.
          </p>
        </div>
      </div>

      {/* Media Queries */}
      <style>{`
        @media (max-width: 960px) {
          .login-art-column {
            display: none !important;
          }
          .login-split-viewport > div {
            flex: 1 1 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

export default LoginPage;
