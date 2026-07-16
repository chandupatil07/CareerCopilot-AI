/**
 * File Explanation: DashboardHome.jsx
 * 
 * Production-grade Candidate Dashboard control center. Fetches active metrics,
 * recent event alerts feed, active resume score logs, and scheduled interview cards
 * from backend databases. Integrates loading spinners, error boundaries, and empty state guides.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import PageHeader from '../../components/PageHeader';
import PageLoader from '../../components/PageLoader';
import { useAuth } from '../../context/AuthContext';
import { applicationsService } from '../../services/applications';
import { interviewsService } from '../../services/interviews';
import { notificationsService } from '../../services/notifications';
import { resumeService } from '../../services/resume';
import { ROUTES } from '../../constants/routes';

function DashboardHome() {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeResume, setActiveResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch application metrics, recent interviews, activities, and resumes in parallel
        const [statsRes, interviewsRes, activitiesRes, resumesRes] = await Promise.all([
          applicationsService.getStatistics(),
          interviewsService.listInterviews({ limit: 3 }),
          notificationsService.listNotifications({ limit: 5 }),
          resumeService.listResumes()
        ]);

        setStatsData(statsRes);
        setInterviews(interviewsRes);
        setActivities(activitiesRes);

        // Extract active resume version
        const active = resumesRes.find(r => r.is_active === true);
        if (active) {
          // If active, try fetching its ATS score details
          try {
            const atsRes = await resumeService.getAtsScore(active.id);
            setActiveResume({ ...active, ats_score: atsRes.ats_score });
          } catch (atsError) {
            setActiveResume({ ...active, ats_score: null });
          }
        } else {
          setActiveResume(null);
        }
      } catch (err) {
        console.error('Error fetching dashboard statistics:', err);
        setError('Unable to load dashboard details. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="card text-center" style={{ padding: '3rem 1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.02)' }}>
        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>⚠️</span>
        <h3 style={{ fontSize: '1.25rem', color: '#EF4444', marginBottom: '0.75rem' }}>Failed to Load Dashboard</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
          {error}
        </p>
        <button onClick={() => window.location.reload()} className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>
          Retry Request
        </button>
      </div>
    );
  }

  // Map stats data safely with defaults
  const stats = [
    { label: 'Total Applications', value: statsData?.total_applications ?? 0, icon: '📊', color: 'var(--color-accent)' },
    { label: 'Active Applications', value: (statsData?.applied_count ?? 0) + (statsData?.interviewing_count ?? 0), icon: '📈', color: 'var(--color-info)' },
    { label: 'Interviews Scheduled', value: statsData?.interviewing_count ?? 0, icon: '🗓️', color: 'var(--color-accent-purple)' },
    { label: 'Offers Received', value: statsData?.offers_count ?? 0, icon: '🎉', color: 'var(--color-success)' },
    { label: 'Response Rate', value: statsData ? `${Math.round(statsData.response_rate * 100)}%` : '0%', icon: '🎯', color: 'var(--color-warning)' }
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title={`Welcome Back, ${user?.name || 'Candidate'}`} 
        description="Here is your live AI career search optimization overview for this week." 
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

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }} className="dashboard-layout-main">
        {/* LEFT COLUMN: ACTIVITY & INTERVIEWS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* RECENT ACTIVITY TIMELINE */}
          <div className="card" style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Activities</h3>
              <Link to={ROUTES.DASHBOARD.NOTIFICATIONS} style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 500 }}>
                View All
              </Link>
            </div>
            
            {activities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <span style={{ fontSize: '1.85rem', display: 'block', marginBottom: '0.5rem' }}>🔔</span>
                <strong style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'block', marginBottom: '0.25rem' }}>Your timeline is empty</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Perform actions like uploading resumes or tracking jobs to generate activities.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {activities.map((act) => {
                  const dateText = new Date(act.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <span style={{ fontSize: '1.25rem', marginTop: '2px' }}>
                        {act.notification_type === 'success' ? '🎉' : act.notification_type === 'warning' ? '⚠️' : '📄'}
                      </span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>{act.title}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>{act.message}</p>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{dateText}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* UPCOMING INTERVIEWS */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Upcoming Interviews</h3>
              <Link to={ROUTES.DASHBOARD.INTERVIEWS} style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 500 }}>
                Open Calendar
              </Link>
            </div>

            {interviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <span style={{ fontSize: '1.85rem', display: 'block', marginBottom: '0.5rem' }}>🗓️</span>
                <strong style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'block', marginBottom: '0.25rem' }}>No interviews scheduled</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Track a job screening or coding test round to stay organized.</span>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }} className="interviews-subgrid">
                {interviews.map((item) => {
                  const dateObj = new Date(item.scheduled_at);
                  const formattedDate = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                  const formattedTime = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div key={item.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>{item.interview_type}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formattedDate}</span>
                      </div>
                      <h4 style={{ fontSize: '0.875rem', color: 'var(--text-primary)', margin: 0, fontWeight: 600 }}>{item.company_name}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>Role: {item.job_role}</p>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-accent)', marginTop: '6px' }}>⏰ {formattedTime}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE RESUME & QUICK ACTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* ACTIVE RESUME & ATS SCORE */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', fontWeight: 700 }}>
              Active Profile Resume
            </h3>

            {!activeResume ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>📄</span>
                <strong style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>No Resume Uploaded</strong>
                <Link to={ROUTES.DASHBOARD.RESUMES} className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', display: 'inline-block' }}>
                  Upload PDF Resume
                </Link>
              </div>
            ) : (
              <div>
                <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', backgroundColor: 'rgba(255,255,255,0.01)', marginBottom: '1.25rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.25rem' }}>📄</span>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '0.85rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', display: 'block' }} title={activeResume.filename}>
                    {activeResume.filename}
                  </strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Uploaded {new Date(activeResume.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                {activeResume.ats_score !== null ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '60px', 
                      height: '60px', 
                      borderRadius: '50%', 
                      border: '3.5px solid var(--color-accent)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '1.15rem', 
                      fontWeight: 'bold', 
                      color: '#FFFFFF' 
                    }}>
                      {activeResume.ats_score}%
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', margin: 0, fontWeight: 600 }}>ATS Rating Index</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Computed using direct rule evaluations.</p>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <Link to={ROUTES.DASHBOARD.RESUMES} className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', width: '100%' }}>
                      Run ATS Parsing Scan
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* QUICK ACTION CO-PILOT CHEAT */}
          <div className="card card-accent-purple">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', fontWeight: 700 }}>
              🚀 Quick Operations
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
              Perform actions immediately across your career development pipeline workspace.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to={ROUTES.DASHBOARD.RESUMES} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', textAlign: 'center' }}>
                📁 Upload PDF Resume
              </Link>
              <Link to={ROUTES.DASHBOARD.APPLICATIONS} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', textAlign: 'center' }}>
                ➕ Track Job Application
              </Link>
              <Link to={ROUTES.DASHBOARD.INTERVIEWS} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', textAlign: 'center' }}>
                🗓️ Schedule Interview Slot
              </Link>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 1200px) {
          .stats-grid-5 {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 960px) {
          .dashboard-layout-main {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .stats-grid-5 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .interviews-subgrid {
            grid-template-columns: 1fr !important;
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
