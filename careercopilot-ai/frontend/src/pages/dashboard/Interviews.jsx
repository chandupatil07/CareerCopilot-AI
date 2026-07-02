import React from 'react';
import PageHeader from '../../components/PageHeader';
import Badge from '../../components/Badge';

function Interviews() {
  const upcomingInterviews = [
    { id: 1, company: 'Google', date: '2026-06-20', time: '10:00 AM PST', mode: 'Google Meet (Virtual)', notes: 'System Design focus, brush up on React rendering cycles.' },
    { id: 2, company: 'Stripe', date: '2026-06-23', time: '02:30 PM PST', mode: 'Zoom (Virtual)', notes: 'Technical coding screening with lead frontend engineer.' }
  ];

  const pastInterviews = [
    { id: 3, company: 'Netflix', date: '2026-06-15', time: '11:00 AM PST', mode: 'In-Person (Los Gatos)', notes: 'UI Architecture round. Deep dive into styling engines and rendering performance.' },
    { id: 4, company: 'Amazon', date: '2026-06-08', time: '09:00 AM PST', mode: 'Amazon Chime', notes: 'Data structures & algorithms. Practiced whiteboard graph traversals.' }
  ];

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
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
        <thead>
          <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <th style={tableHeaderStyle}>Company</th>
            <th style={tableHeaderStyle}>Date</th>
            <th style={tableHeaderStyle}>Time</th>
            <th style={tableHeaderStyle}>Mode</th>
            <th style={tableHeaderStyle}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id} style={{ transition: 'background-color 0.2s' }} className="table-row-hover">
              <td style={{ ...tableCellStyle, color: 'var(--text-primary)', fontWeight: 600 }}>{session.company}</td>
              <td style={tableCellStyle}>{session.date}</td>
              <td style={tableCellStyle}>{session.time}</td>
              <td style={tableCellStyle}>
                <Badge type="cyan">{session.mode}</Badge>
              </td>
              <td style={{ ...tableCellStyle, maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={session.notes}>
                {session.notes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Interviews & Sessions" 
        description="Schedule mock sessions and monitor your upcoming and past recruiter interviews." 
        actions={
          <button className="btn btn-primary" style={{ cursor: 'not-allowed', opacity: 0.6 }} disabled>
            ＋ Log Interview
          </button>
        }
      />

      {/* UPCOMING INTERVIEWS */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🗓️</span>
          <span>Upcoming Interviews</span>
        </h3>
        {renderInterviewTable(upcomingInterviews)}
      </div>

      {/* PAST INTERVIEWS */}
      <div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>✅</span>
          <span>Past Interviews</span>
        </h3>
        {renderInterviewTable(pastInterviews)}
      </div>

      <style>{`
        .table-row-hover:hover {
          background-color: rgba(255, 255, 255, 0.015);
        }
      `}</style>
    </div>
  );
}

export default Interviews;
