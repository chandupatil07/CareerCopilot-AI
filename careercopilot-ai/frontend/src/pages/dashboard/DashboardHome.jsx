/**
 * File Explanation: DashboardHome.jsx
 * 
 * 1. What is it?
 *    DashboardHome.jsx displays the main overview panels, recent logs, and statistics summary cards
 *    inside the authenticated user shell.
 * 
 * 2. Why is it needed?
 *    SaaS users expect an informative primary portal showing operational metrics (e.g. total applications sent,
 *    response rates, and next steps) upon login.
 * 
 * 3. How does it work?
 *    It aggregates mock numbers and rendering layouts inside reusable card grids, using transition classes
 *    to animate card entries.
 * 
 * 4. Real-world example
 *    Dashboards in systems (like LinkedIn Jobs or Indeed) show job matching rates and status metrics
 *    to help users manage their pipeline.
 * 
 * 5. Advantages
 *    - High-fidelity visual cards.
 *    - Summary of all subview activities in one view.
 * 
 * 6. Limitations
 *    - State is static and doesn't update dynamically from a database.
 * 
 * 7. Interview questions
 *    - Why are mock state structures useful during the product prototyping phase?
 * 
 * 8. Interview answers
 *    - Answer: They enable rapid UI testing, allow designers to evaluate visual hierarchies, and establish
 *      agreed-upon API contract shapes before backend developers begin writing code.
 */

import React from 'react';
import { Link } from 'react-router-dom';

function DashboardHome() {
  const stats = [
    { label: 'Applications Sent', value: '18', icon: '📤', color: 'var(--color-accent)' },
    { label: 'Interviews Scheduled', value: '4', icon: '🗓️', color: 'var(--color-accent-purple)' },
    { label: 'Resume Match Score', value: '84%', icon: '🎯', color: '#10B981' },
    { label: 'Pending Reminders', value: '3', icon: '⏰', color: '#F59E0B' }
  ];

  const activities = [
    { text: 'Tailored resume draft for Software Engineer at Stripe', time: '2 hours ago', icon: '📄' },
    { text: 'Scheduled technical screening with Google recruit team', time: '1 day ago', icon: '🗓️' },
    { text: 'Mock Interview practice: completed behavioral package', time: '2 days ago', icon: '🤖' },
    { text: 'Generated LinkedIn outbound pitch for hiring manager at Vercel', time: '3 days ago', icon: '💬' }
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Welcome Back, Jane</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Here is your AI career search optimization overview for this week.
        </p>
      </div>

      {/* STATS CARDS GRID */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        {stats.map((stat, index) => (
          <div key={index} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span style={{ fontSize: '2.25rem', backgroundColor: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: 'var(--border-radius-md)' }}>
              {stat.icon}
            </span>
            <div>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{stat.label}</span>
              <h3 style={{ fontSize: '1.75rem', color: stat.color, fontWeight: 700, marginTop: '2px' }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* RECENT ACTIVITY */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Recent Activities
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {activities.map((act, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.25rem' }}>{act.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{act.text}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACTION CO-PILOT CHEAT */}
        <div className="card card-accent-purple">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
            🤖 AI Co-Pilot Recommendation
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            You have an upcoming interview with Google in 2 days. We recommend launching the mock prep coach to practice algorithmic and systems design questions.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/dashboard/interviews" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              Open Interview Panel
            </Link>
            <Link to="/dashboard/resumes" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              Check Resume Score
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
