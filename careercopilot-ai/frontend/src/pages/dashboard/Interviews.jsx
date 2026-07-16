/**
 * File Explanation: Interviews.jsx
 * 
 * Live Interview Scheduler. Connects calendar slots to job application cards,
 * automatically promoting application stages on the backend. Supports scheduling,
 * editing, and deleting interview sessions.
 */

import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import Badge from '../../components/Badge';
import PageLoader from '../../components/PageLoader';
import ButtonLoader from '../../components/ButtonLoader';
import { interviewsService } from '../../services/interviews';
import { applicationsService } from '../../services/applications';

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [appMap, setAppMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Modals & Forms
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);

  const [formData, setFormData] = useState({
    application_id: '',
    interview_date: new Date().toISOString().split('T')[0],
    interview_time: '',
    mode: 'Google Meet',
    meeting_link: '',
    interviewer_name: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);

      // Fetch interviews and applications in parallel
      const [interviewsList, appsList] = await Promise.all([
        interviewsService.listInterviews(),
        applicationsService.listApplications({ archived: false })
      ]);

      setInterviews(interviewsList);
      setApplications(appsList);

      // Create lookup dictionary for mapping application_id -> application metadata
      const dictionary = {};
      appsList.forEach(app => {
        dictionary[app.id] = app;
      });
      setAppMap(dictionary);
    } catch (err) {
      console.error('Error fetching calendar details:', err);
      setError('Unable to load scheduled interviews from database.');
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenSchedule = () => {
    setIsEditMode(false);
    setFormData({
      application_id: applications.length > 0 ? applications[0].id.toString() : '',
      interview_date: new Date().toISOString().split('T')[0],
      interview_time: '',
      mode: 'Google Meet',
      meeting_link: '',
      interviewer_name: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (session) => {
    setIsEditMode(true);
    setSelectedInterviewId(session.id);
    setFormData({
      application_id: session.application_id.toString(),
      interview_date: session.interview_date,
      interview_time: session.interview_time || '',
      mode: session.mode || 'Google Meet',
      meeting_link: session.meeting_link || '',
      interviewer_name: session.interviewer_name || '',
      notes: session.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        application_id: parseInt(formData.application_id)
      };

      if (isEditMode) {
        await interviewsService.updateInterview(selectedInterviewId, payload);
      } else {
        await interviewsService.createInterview(payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Failed to save interview:', err);
      alert('Failed to schedule interview. Verify that the parent application exists.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel and delete this interview slot?')) return;

    try {
      await interviewsService.deleteInterview(id);
      fetchData();
    } catch (err) {
      console.error('Delete interview failed:', err);
      alert('Failed to delete interview schedule.');
    }
  };

  // Divide interviews into upcoming and past sessions
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingInterviews = interviews.filter(item => item.interview_date >= todayStr);
  const pastInterviews = interviews.filter(item => item.interview_date < todayStr);

  const tableHeaderStyle = {
    padding: '1rem',
    textAlign: 'left',
    borderBottom: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    fontWeight: 600,
    fontSize: '0.9rem'
  };

  const tableCellStyle = {
    padding: '1.25rem 1rem',
    borderBottom: '1px solid var(--border-color)',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)'
  };

  const renderInterviewTable = (sessions) => (
    <div style={{ width: '100%', overflowX: 'auto', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-color)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
        <thead>
          <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <th style={tableHeaderStyle}>Company</th>
            <th style={tableHeaderStyle}>Role</th>
            <th style={tableHeaderStyle}>Date & Time</th>
            <th style={tableHeaderStyle}>Mode</th>
            <th style={tableHeaderStyle}>Notes</th>
            <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => {
            const appDetails = appMap[session.application_id];
            const company = appDetails?.company_name || 'Unknown Company';
            const role = appDetails?.job_role || 'Developer';

            return (
              <tr key={session.id} style={{ transition: 'background-color 0.2s' }} className="table-row-hover">
                <td style={{ ...tableCellStyle, color: 'var(--text-primary)', fontWeight: 700 }}>{company}</td>
                <td style={tableCellStyle}>{role}</td>
                <td style={tableCellStyle}>
                  <div style={{ fontWeight: 500 }}>{session.interview_date}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)' }}>⏰ {session.interview_time || 'All Day'}</span>
                </td>
                <td style={tableCellStyle}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Badge type="cyan">{session.mode}</Badge>
                    {session.meeting_link && (
                      <a href={session.meeting_link} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textDecoration: 'none' }}>
                        🔗 Open Meeting Link
                      </a>
                    )}
                  </div>
                </td>
                <td style={{ ...tableCellStyle, maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={session.notes || 'No notes'}>
                  {session.notes || 'No notes'}
                </td>
                <td style={{ ...tableCellStyle, textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleOpenEdit(session)} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(session.id)} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Interviews & Calendar" 
        description="Schedule technical screenings, whiteboard codings, or HR rounds linked to tracked applications." 
        actions={
          <button 
            onClick={handleOpenSchedule} 
            className="btn btn-primary" 
            style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
            disabled={applications.length === 0}
            title={applications.length === 0 ? 'Please track a job application first before scheduling interviews.' : ''}
          >
            ＋ Schedule Interview
          </button>
        }
      />

      {error && (
        <div style={{ padding: '0.8rem', borderRadius: 'var(--border-radius-sm)', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444', marginBottom: '1.5rem', fontSize: '0.85rem', textAlign: 'center' }}>
          ⚠️ {error}
        </div>
      )}

      {applications.length === 0 && (
        <div className="card text-center" style={{ padding: '2rem 1rem', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>⚠️</span>
          <strong style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>Tracked Job Application Required</strong>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '1rem' }}>
            You need at least one tracked job card inside the Applications Tracker to schedule interviews.
          </span>
          <Link to={ROUTES.DASHBOARD.APPLICATIONS} className="btn btn-primary" style={{ padding: '0.4rem 1.2rem', fontSize: '0.8rem', display: 'inline-block' }}>
            Go Track Job Card
          </Link>
        </div>
      )}

      {/* UPCOMING INTERVIEWS */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
          <span>🗓️</span>
          <span>Upcoming Interviews</span>
        </h3>
        {upcomingInterviews.length === 0 ? (
          <div className="card text-center" style={{ padding: '3rem 1.5rem' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🎉</span>
            <strong style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'block' }}>No upcoming interviews scheduled</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Apply to jobs or log screening calls to display calendar slots.</span>
          </div>
        ) : (
          renderInterviewTable(upcomingInterviews)
        )}
      </div>

      {/* PAST INTERVIEWS */}
      <div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
          <span>✅</span>
          <span>Past Interviews History</span>
        </h3>
        {pastInterviews.length === 0 ? (
          <div className="card text-center" style={{ padding: '3rem 1.5rem' }}>
            <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>📚</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No completed past interviews registered in history log.</span>
          </div>
        ) : (
          renderInterviewTable(pastInterviews)
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* SCHEDULE / EDIT INTERVIEW MODAL */}
      {/* ---------------------------------------------------- */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', fontWeight: 700 }}>
              {isEditMode ? '✏️ Reschedule Interview' : '🗓️ Schedule Interview Round'}
            </h3>
            <form onSubmit={handleSubmit}>
              
              <div className="form-group">
                <label className="form-label">Select Tracked Application *</label>
                <select 
                  name="application_id" 
                  value={formData.application_id} 
                  onChange={handleInputChange} 
                  className="form-input"
                  required
                  disabled={isEditMode}
                >
                  {applications.map(app => (
                    <option key={app.id} value={app.id}>
                      {app.company_name} - {app.job_role} ({app.current_stage})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Interview Date *</label>
                  <input type="date" name="interview_date" value={formData.interview_date} onChange={handleInputChange} className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Interview Time (e.g. 10:00 AM)</label>
                  <input type="text" name="interview_time" value={formData.interview_time} onChange={handleInputChange} className="form-input" placeholder="10:00 AM PST" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Interview Mode</label>
                  <select name="mode" value={formData.mode} onChange={handleInputChange} className="form-input">
                    <option value="Google Meet">Google Meet (Virtual)</option>
                    <option value="Zoom">Zoom (Virtual)</option>
                    <option value="Slack Huddle">Slack Huddle</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                    <option value="Phone Interview">Phone Interview</option>
                    <option value="In Person">In Person</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Interviewer Name</label>
                  <input type="text" name="interviewer_name" value={formData.interviewer_name} onChange={handleInputChange} className="form-input" placeholder="Jane Recruiter" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Meeting URL Link</label>
                <input type="url" name="meeting_link" value={formData.meeting_link} onChange={handleInputChange} className="form-input" placeholder="https://meet.google.com/abc-defg-hij" />
              </div>

              <div className="form-group">
                <label className="form-label">Preparation Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="form-input" rows="3" placeholder="algorithmic checks, brush up on design patterns..." />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? <ButtonLoader /> : 'Save Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .table-row-hover:hover {
          background-color: rgba(255, 255, 255, 0.015);
        }
      `}</style>
    </div>
  );
}

export default Interviews;
