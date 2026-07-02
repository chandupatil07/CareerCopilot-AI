import React from 'react';

function StatCard({ label, value, icon, color }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
      <span style={{ fontSize: '2.25rem', backgroundColor: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: 'var(--border-radius-md)' }}>
        {icon}
      </span>
      <div>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{label}</span>
        <h3 style={{ fontSize: '1.75rem', color: color || 'var(--text-primary)', fontWeight: 700, marginTop: '2px' }}>{value}</h3>
      </div>
    </div>
  );
}

export default StatCard;
