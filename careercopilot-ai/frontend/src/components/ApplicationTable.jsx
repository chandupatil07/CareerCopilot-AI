import React from 'react';
import Badge from './Badge';

function ApplicationTable({ jobs, onDelete }) {
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

  return (
    <div style={{ width: '100%', overflowX: 'auto', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-color)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
        <thead>
          <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <th style={tableHeaderStyle}>Company</th>
            <th style={tableHeaderStyle}>Role</th>
            <th style={tableHeaderStyle}>Date Applied</th>
            <th style={tableHeaderStyle}>Status</th>
            <th style={tableHeaderStyle}>Source</th>
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} style={{ transition: 'background-color 0.2s' }} className="table-row-hover">
              <td style={{ ...tableCellStyle, color: 'var(--text-primary)', fontWeight: 600 }}>{job.company}</td>
              <td style={tableCellStyle}>{job.role}</td>
              <td style={tableCellStyle}>{job.dateApplied}</td>
              <td style={tableCellStyle}>
                <Badge type={job.status}>{job.status}</Badge>
              </td>
              <td style={tableCellStyle}>{job.source || 'N/A'}</td>
              <td style={tableCellStyle}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {onDelete && (
                    <button 
                      onClick={() => onDelete(job.id)} 
                      className="btn btn-secondary" 
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--color-danger)' }}
                      title="Remove Listing"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <style>{`
        .table-row-hover:hover {
          background-color: rgba(255, 255, 255, 0.015);
        }
      `}</style>
    </div>
  );
}

export default ApplicationTable;
