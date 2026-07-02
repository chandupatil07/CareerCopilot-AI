import React from 'react';

function NotificationCard({ id, type, text, date, actionLabel, onActionClick, onDismiss }) {
  const getBorderColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'warning': return 'var(--color-warning)';
      case 'success': return 'var(--color-success)';
      case 'danger': return 'var(--color-danger)';
      default: return 'var(--color-accent)';
    }
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '1rem',
        padding: '1.25rem', 
        backgroundColor: 'rgba(255,255,255,0.01)',
        border: '1px solid var(--border-color)', 
        borderLeft: `4px solid ${getBorderColor(type)}`,
        borderRadius: 'var(--border-radius-md)',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{text}</p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>{date}</span>
        </div>
        {onDismiss && (
          <button 
            onClick={() => onDismiss(id)}
            style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: 'bold', lineHeight: 1 }}
            className="hover-glow"
          >
            ×
          </button>
        )}
      </div>

      {actionLabel && onActionClick && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onActionClick} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}

export default NotificationCard;
