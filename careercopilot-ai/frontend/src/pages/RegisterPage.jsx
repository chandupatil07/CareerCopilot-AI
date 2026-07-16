/**
 * File Explanation: RegisterPage.jsx (Upgraded Split-Screen)
 * 
 * 1. What is it?
 *    RegisterPage.jsx renders the account registration form inside a 50/50 split-screen container.
 * 
 * 2. Why is it needed?
 *    Matching the visual format of the Login page maintains design consistency across onboarding flows,
 *    creating a polished SaaS look.
 * 
 * 3. How does it work?
 *    It divides the screen into two columns on desktop, showcasing the form next to the vertical `auth_banner.png`
 *    and verifying password parameters before routing to `/dashboard`.
 * 
 * 4. Real-world example
 *    Standard registration views in SaaS portals use split designs to keep decorative media next to form inputs.
 * 
 * 5. Advantages
 *    - Consistent visual layout.
 *    - Validates passwords before navigating.
 *    - Mobile-responsive (stacks vertically and hides background art on mobile devices).
 * 
 * 6. Limitations
 *    - Registration state updates are simulated.
 * 
 * 7. Interview questions
 *    - Why is visual symmetry important in SaaS onboarding designs?
 * 
 * 8. Interview answers
 *    - Answer: Symmetrical layouts build brand trust, lower user cognitive friction, and ensure structural elements
 *      behave consistently across sign-in and sign-up states.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authBanner from '../assets/auth_banner.png';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import ButtonLoader from '../components/ButtonLoader';
import { ROUTES } from '../constants/routes';

function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [localError, setLocalError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLocalError('');
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await register(formData.email, formData.name, formData.password);
      setSuccess(true);
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      // Backend error is set in AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const activeError = localError || error;

  return (
    <div style={splitScreenStyle} className="animate-fade-in register-split-viewport">
      {/* LEFT COLUMN: FORM */}
      <div style={formColumnStyle}>
        <div style={{ maxWidth: '380px', width: '100%', margin: '0 auto' }}>
          
          {/* Logo linkage */}
          <div style={{ marginBottom: '2rem' }}>
            <Link to="/" onClick={() => setError(null)}>
              <Logo width="36" height="36" showText={true} />
            </Link>
          </div>

          {success ? (
            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', fontWeight: 800 }}>Account Created!</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                Your candidate workspace was registered successfully. You can now log in with your email address.
              </p>
              <Link to={ROUTES.LOGIN} onClick={() => setError(null)} className="btn btn-primary" style={{ display: 'block', padding: '0.8rem', textAlign: 'center' }}>
                Go to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem', fontWeight: 800 }}>Create Account</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Set up your career tracking dashboard workspace.
                </p>
              </div>

              {activeError && (
                <div style={{
                  padding: '0.8rem',
                  borderRadius: 'var(--border-radius-sm)',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#EF4444',
                  marginBottom: '1.5rem',
                  fontSize: '0.85rem',
                  textAlign: 'center'
                }}>
                  ⚠️ {activeError}
                </div>
              )}

              <form onSubmit={handleRegister}>
                <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                  <label className="form-label" htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    className="form-input" 
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe" 
                    required 
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    className="form-input" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com" 
                    required 
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                  <label className="form-label" htmlFor="password">Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    name="password"
                    className="form-input" 
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••" 
                    required 
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword"
                    className="form-input" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••" 
                    required 
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                  <input type="checkbox" id="terms" style={{ accentColor: 'var(--color-accent)', marginTop: '4px' }} required />
                  <label htmlFor="terms" style={{ cursor: 'pointer', userSelect: 'none' }}>
                    I agree to the <a href="#terms" style={{ color: 'var(--color-accent)' }}>Terms of Service</a> and <a href="#privacy" style={{ color: 'var(--color-accent)' }}>Privacy Policy</a>.
                  </label>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }} disabled={submitting}>
                  {submitting ? <ButtonLoader /> : 'Register Workspace'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
                <Link to={ROUTES.LOGIN} onClick={() => setError(null)} style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Sign In</Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: BRAND COVER */}
      <div style={artColumnStyle} className="register-art-column">
        <img 
          src={authBanner} 
          alt="Auth cover banner" 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1, filter: 'brightness(0.6)' }}
        />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '450px' }}>
          <span className="badge badge-purple" style={{ marginBottom: '1.5rem' }}>CareerCopilot AI Workspace</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem', lineHeight: '1.2' }}>
            Enforce strict approval controls over automation
          </h2>
          <p style={{ color: '#E2E8F0', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Under our strict User Control Rule, the platform acts as your copilot. You review and verify every draft, schedule, and transaction.
          </p>
        </div>
      </div>

      {/* Media Queries */}
      <style>{`
        @media (max-width: 960px) {
          .register-art-column {
            display: none !important;
          }
          .register-split-viewport > div {
            flex: 1 1 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

export default RegisterPage;

