/**
 * File Explanation: LandingPage.jsx (Upgraded Symmetric Grids)
 * 
 * 1. What is it?
 *    LandingPage.jsx defines the landing page layout, using symmetric 3-column grids and clamped card images.
 * 
 * 2. Why is it needed?
 *    Visual alignment is critical for SaaS homepages. Redesigning sections to use symmetric 3-column grids of identical
 *    height cards removes layout clutter and prevents text-overlap issues.
 * 
 * 3. How does it work?
 *    It maps 6 equal-size feature cards, 3 step cards, and 3 testimonial cards to standard `grid-3` layouts
 *    defined inside our design system.
 * 
 * 4. Real-world example
 *    Startup websites align marketing cards side-by-side in equal-size columns (e.g. 3 cards per row)
 *    to keep vertical grids balanced and legible.
 * 
 * 5. Advantages
 *    - Symmetric column alignments.
 *    - Image viewports are clamped inside card borders.
 * 
 * 6. Limitations
 *    - Interactive elements (FAQs accordions) are controlled client-side.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Import Assets
import heroPreview from '../assets/hero_preview.png';
import interviewPractice from '../assets/interview_practice.png';
import userAvatar from '../assets/user_avatar.png';

function LandingPage() {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How does the AI Resume Analysis work?",
      answer: "Upload your resume in PDF format. CareerCopilot scans the text, compares it against the job description keyword requirements, and suggests bullet-point revisions to bypass automated applicant tracking systems."
    },
    {
      question: "Are my outreach emails sent automatically?",
      answer: "No. Under our strict User Control Rule, the platform will only generate the templates for cold emails or LinkedIn messages. You must explicitly review, modify, and copy/approve them. Human confirmation is mandatory."
    },
    {
      question: "Is there a limit to the number of applications I can track?",
      answer: "No, our pipeline tracker allows you to manage an unlimited number of jobs, interviews, and follow-up schedules under your free dashboard shell."
    },
    {
      question: "Can I practice specific technical interview questions?",
      answer: "Yes, our prep coach allows you to customize mock sessions by role (Frontend, Backend, AI) and seniority level, generating tailored coding and behavioral scenarios."
    }
  ];

  const sectionStyle = {
    padding: '5rem 0',
    borderBottom: '1px solid var(--border-color)'
  };

  const sectionHeaderStyle = {
    textAlign: 'center',
    maxWidth: '650px',
    margin: '0 auto 3.5rem auto'
  };

  return (
    <div className="animate-fade-in">
      {/* ==========================================
          1. HERO SECTION (BROWSER WINDOW SHELL)
          ========================================== */}
      <section style={{ ...sectionStyle, padding: '4rem 0 5rem 0', textAlign: 'center' }}>
        <span className="badge badge-cyan animate-slide-up">
          🚀 AI-Powered Career Navigator
        </span>
        <h1 
          className="animate-slide-up delay-100" 
          style={{ fontSize: '3.75rem', marginTop: '1.5rem', marginBottom: '1.5rem', fontWeight: 800 }}
        >
          Navigate Your Career Path <br />
          With <span style={{ color: 'var(--color-accent)' }}>Predictive AI Intelligence</span>
        </h1>
        <p 
          className="animate-slide-up delay-200" 
          style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto 2.5rem auto' }}
        >
          Optimize your resumes, organize application stages, generate verified outbounds, and train with interactive interview coaches. Take charge of your career path with absolute approval controls.
        </p>
        <div 
          className="animate-slide-up delay-300" 
          style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}
        >
          <Link to="/register" className="btn btn-primary">
            Get Started Free
          </Link>
          <Link to="/about" className="btn btn-secondary">
            Learn Our Vision
          </Link>
        </div>

        {/* Browser Window Frame (Perfect alignment & image boundaries) */}
        <div 
          className="animate-slide-up delay-400 browser-window-shell" 
          style={{ 
            marginTop: '4.5rem', 
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), var(--shadow-glow)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Browser Header Bar */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '0.75rem 1.25rem', 
              backgroundColor: '#070C1B',
              borderBottom: '1px solid var(--border-color)'
            }}
          >
            {/* Window control dots */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-danger)' }}></span>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-warning)' }}></span>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></span>
            </div>
            {/* Center mock URL input bar */}
            <div 
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.03)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '6px',
                padding: '0.25rem 4rem',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                fontFamily: 'monospace',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🔒</span>
              <span>https://app.careercopilot.ai/dashboard</span>
            </div>
            {/* Spacer */}
            <div style={{ width: '48px' }}></div>
          </div>

          {/* Browser Content Image - CLAMPED HEIGHT TO PREVENT BLEEDING */}
          <div style={{ overflow: 'hidden', maxHeight: '450px' }}>
            <img 
              src={heroPreview} 
              alt="CareerCopilot AI Dashboard Workspace" 
              style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', objectPosition: 'top' }}
            />
          </div>
        </div>
      </section>

      {/* ==========================================
          2. SYMMETRIC FEATURES GRID (3 columns side-by-side)
          ========================================== */}
      {/* ==========================================
          2. SYMMETRIC FEATURES GRID (Unified Feature Hub with Square Cards)
          ========================================== */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <span className="badge badge-purple">Modules</span>
          <h2 style={{ fontSize: '2.25rem', marginTop: '0.75rem', marginBottom: '1rem' }}>SaaS Platform Features</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Six comprehensive AI tools built to structure and accelerate your career progression, organized in a unified grid.
          </p>
        </div>

        {/* ONE BIG DIV (Unified Hub Container) */}
        <div style={{
          background: 'rgba(11, 17, 36, 0.5)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius-xl)',
          padding: '2.5rem',
          boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.02), var(--shadow-glow)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="grid-adaptive">
            {/* Card 1: Resume Analysis */}
            <div className="card card-accent-cyan" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              aspectRatio: '1 / 1', 
              justifyContent: 'center', 
              padding: '2rem',
              textAlign: 'center',
              background: 'var(--bg-primary)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              height: 'auto',
              maxWidth: '280px',
              margin: '0 auto',
              width: '100%'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.25rem' }}>📄</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Resume Analysis</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Score resumes against targeted roles. Spot missing keywords, formatting traps, and soft skill improvements instantly.
              </p>
            </div>

            {/* Card 2: Pipeline Tracking */}
            <div className="card card-accent-cyan" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              aspectRatio: '1 / 1', 
              justifyContent: 'center', 
              padding: '2rem',
              textAlign: 'center',
              background: 'var(--bg-primary)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              height: 'auto',
              maxWidth: '280px',
              margin: '0 auto',
              width: '100%'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.25rem' }}>📈</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Pipeline Tracking</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                A visual Kanban pipeline board to log job applications, track interviews, organize contacts, and trigger followups.
              </p>
            </div>

            {/* Card 3: LinkedIn Outbounds */}
            <div className="card card-accent-cyan" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              aspectRatio: '1 / 1', 
              justifyContent: 'center', 
              padding: '2rem',
              textAlign: 'center',
              background: 'var(--bg-primary)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              height: 'auto',
              maxWidth: '280px',
              margin: '0 auto',
              width: '100%'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.25rem' }}>💬</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>LinkedIn Outbounds</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Generate connection pitches matching a recruiter's profile, increasing outbound response rates.
              </p>
            </div>

            {/* Card 4: AI Prep Coach */}
            <div className="card card-accent-purple" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              aspectRatio: '1 / 1', 
              justifyContent: 'center', 
              padding: '2rem',
              textAlign: 'center',
              background: 'var(--bg-primary)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              height: 'auto',
              maxWidth: '280px',
              margin: '0 auto',
              width: '100%'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.25rem' }}>🤖</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>AI Prep Coach</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Practice mock behaviorals and role-specific coding questions, receiving evaluations and coaching suggestions.
              </p>
            </div>

            {/* Card 5: Cold Email Builder */}
            <div className="card card-accent-purple" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              aspectRatio: '1 / 1', 
              justifyContent: 'center', 
              padding: '2rem',
              textAlign: 'center',
              background: 'var(--bg-primary)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              height: 'auto',
              maxWidth: '280px',
              margin: '0 auto',
              width: '100%'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.25rem' }}>✉️</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Cold Email Builder</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Craft hyper-personalized outreach emails targeting hiring managers, matching company cultural tones.
              </p>
            </div>

            {/* Card 6: Smart Reminders */}
            <div className="card card-accent-purple" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              aspectRatio: '1 / 1', 
              justifyContent: 'center', 
              padding: '2rem',
              textAlign: 'center',
              background: 'var(--bg-primary)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              height: 'auto',
              maxWidth: '280px',
              margin: '0 auto',
              width: '100%'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.25rem' }}>🔔</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Smart Reminders</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                System-generated notifications reminding you to check back on stagnant applications and prep for interviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. HOW IT WORKS SECTION (Unified Step Hub with Square Cards)
          ========================================== */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>Three Simple Steps</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            How CareerCopilot AI structures your job search pipeline.
          </p>
        </div>

        {/* ONE BIG DIV (Unified Steps Container) */}
        <div style={{
          background: 'rgba(11, 17, 36, 0.5)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius-xl)',
          padding: '2.5rem',
          boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.02), var(--shadow-glow-purple)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="grid-adaptive">
            {/* Step 1 */}
            <div className="card" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              aspectRatio: '1 / 1', 
              justifyContent: 'center', 
              padding: '2rem',
              textAlign: 'center',
              background: 'var(--bg-primary)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              height: 'auto',
              maxWidth: '280px',
              margin: '0 auto',
              width: '100%'
            }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'var(--font-headers)', margin: '0 auto 1.25rem auto' }}>
                1
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Upload Profile</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                Submit your experience profile and targeted job titles to set up your baseline metrics.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              aspectRatio: '1 / 1', 
              justifyContent: 'center', 
              padding: '2rem',
              textAlign: 'center',
              background: 'var(--bg-primary)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              height: 'auto',
              maxWidth: '280px',
              margin: '0 auto',
              width: '100%'
            }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'var(--font-headers)', margin: '0 auto 1.25rem auto' }}>
                2
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Scan & Draft</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                Analyze skills mismatches and auto-draft outreach templates customized to target listings.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              aspectRatio: '1 / 1', 
              justifyContent: 'center', 
              padding: '2rem',
              textAlign: 'center',
              background: 'var(--bg-primary)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              height: 'auto',
              maxWidth: '280px',
              margin: '0 auto',
              width: '100%'
            }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'var(--font-headers)', margin: '0 auto 1.25rem auto' }}>
                3
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Verify & Send</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                Approve parsed items, customize recommendations, copy templates, and track response updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. BENEFITS SECTION (STRETCHED COLUMN HEIGHTS ALIGN)
          ========================================== */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>Engineered for Results</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Why leading tech professionals manage their pipeline using CareerCopilot.
          </p>
        </div>

        <div className="grid-2" style={{ alignItems: 'stretch', gap: '3rem' }}>
          {/* Left: Flex list container */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'space-between' }}>
            <div className="card" style={{ flex: 1, display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <div style={{ fontSize: '2rem' }}>⚡</div>
              <div>
                <h3>Save Hours of Tailoring</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Stop rewrite-fatigue. Swap bullet points in seconds based on direct algorithmic feedback.
                </p>
              </div>
            </div>
            <div className="card" style={{ flex: 1, display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <div style={{ fontSize: '2rem' }}>🔒</div>
              <div>
                <h3>Absolute Privacy Control</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Your resumes and search records remain yours. The AI assists, but you hold full verification keys.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Height-stretched image card wrapper */}
          <div style={{ borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-glow)', height: '330px', width: '100%' }}>
            <img 
              src={interviewPractice} 
              alt="Candidate practicing interview" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      </section>

      {/* ==========================================
          5. TESTIMONIALS SECTION (3 columns side-by-side)
          ========================================== */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>User Testimonials</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Hear from job seekers who unlocked their potential.
          </p>
        </div>

        <div className="grid-3" style={{ alignItems: 'stretch' }}>
          {/* Testimonial 1 */}
          <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <p style={{ fontSize: '1.05rem', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: '1.5' }}>
              "The resume tailoring module completely changed my approach. I went from getting zero responses to securing three interviews in two weeks."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '1.5rem' }}>
              <img 
                src={userAvatar} 
                alt="Jane Doe profile headshot" 
                style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1px solid var(--color-accent-purple)', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ fontSize: '0.95rem' }}>Jane Doe</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Software Engineer @ Stripe</p>
              </div>
            </div>
          </div>
          {/* Testimonial 2 */}
          <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <p style={{ fontSize: '1.05rem', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: '1.5' }}>
              "Maintaining my pipeline in one hub kept me focused. The cold outreach drafts are highly tailored and professional."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '1.5rem' }}>
              <img 
                src={userAvatar} 
                alt="Marc Smith profile headshot" 
                style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1px solid var(--color-accent)', objectFit: 'cover', filter: 'hue-rotate(140deg)' }}
              />
              <div>
                <h4 style={{ fontSize: '0.95rem' }}>Marc Smith</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Product Architect</p>
              </div>
            </div>
          </div>
          {/* Testimonial 3 */}
          <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <p style={{ fontSize: '1.05rem', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: '1.5' }}>
              "Securing executive-level referrals is tough, but the customized LinkedIn messages hit the perfect professional tone."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '1.5rem' }}>
              <img 
                src={userAvatar} 
                alt="Alex Johnson profile headshot" 
                style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1px solid var(--color-accent-purple)', objectFit: 'cover', filter: 'grayscale(100%)' }}
              />
              <div>
                <h4 style={{ fontSize: '0.95rem' }}>Alex Johnson</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>UX Consultant @ Adobe</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          6. FAQ SECTION
          ========================================== */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>Frequently Asked Questions</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Find answers to commonly asked questions about the platform.
          </p>
        </div>

        <div style={{ maxWidth: '750px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index} 
                style={{ 
                  backgroundColor: 'var(--bg-secondary)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--border-radius-md)', 
                  overflow: 'hidden',
                  transition: 'all 0.25s ease'
                }}
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  style={{ 
                    width: '100%', 
                    padding: '1.25rem 1.5rem', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '1rem',
                    fontFamily: 'var(--font-headers)'
                  }}
                >
                  <span>{faq.question}</span>
                  <span style={{ color: 'var(--color-accent)', fontSize: '1.25rem', transition: 'transform 0.2s', transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }}>
                    ＋
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 1.5rem 1.25rem 1.5rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255, 255, 255, 0.03)', fontSize: '0.95rem' }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ==========================================
          7. CTA CONVERSION BANNER
          ========================================== */}
      <section style={{ ...sectionStyle, borderBottom: 'none', padding: '6rem 0' }}>
        <div 
          className="card" 
          style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem', 
            background: 'linear-gradient(135deg, rgba(11, 17, 36, 0.9) 0%, rgba(139, 92, 246, 0.05) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.2)'
          }}
        >
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Ready to Accelerate Your Career?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Join professionals optimization dashboard. Sign up for your workspace shell today.
          </p>
          <Link to="/register" className="btn btn-primary">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
