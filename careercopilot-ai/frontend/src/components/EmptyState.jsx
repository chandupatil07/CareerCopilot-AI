import React from 'react';

function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{ padding: '3rem 2rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {icon && <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</span>}
      <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.25rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem auto', lineHeight: '1.5' }}>{description}</p>
      {action && action}
    </div>
  );
}

export default EmptyState;
