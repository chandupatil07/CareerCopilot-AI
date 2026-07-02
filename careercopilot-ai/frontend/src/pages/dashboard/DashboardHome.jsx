import React from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import PageHeader from '../../components/PageHeader';

function DashboardHome() {
  const stats = [
    { label: 'Total Applications', value: '24', icon: '📊', color: 'var(--color-accent)' },
    { label: 'Active Applications', value: '12', icon: '📈', color: 'var(--color-info)' },
    { label: 'Interviews Scheduled', value: '3', icon: '🗓️', color: 'var(--color-accent-purple)' },
    { label: 'Offers Received', value: '1', icon: '🎉', color: 'var(--color-success)' },
    { label: 'Response Rate', value: '50%', icon: '🎯', color: 'var(--color-warning)' }
  ];

  const activities = [
    { text: 'Tailored resume draft for Software Engineer at Stripe', time: '2 hours ago', icon: '📄' },
    { text: 'Scheduled technical screening with Google recruit team', time: '1 day ago', icon: '🗓️' },
    { text: 'Mock Interview practice: completed behavioral package', time: '2 days ago', icon: '🤖' },
    { text: 'Generated LinkedIn outbound pitch for hiring manager at Vercel', time: '3 days ago', icon: '💬' }
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Welcome Back, Jane" 
        description="Here is your AI career search optimization overview for this week." 
      />

      {/* STATS CARDS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }} className="stats-grid-5">
        {stats.map((stat, index) => (
          <StatCard 
            key={index} 
            label={stat.label} 
            value={stat.value} 
            icon={stat.icon} 
            color={stat.color} 
          />
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

      <style>{`
        @media (max-width: 1200px) {
          .stats-grid-5 {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .stats-grid-5 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .stats-grid-5 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default DashboardHome;
