import React from 'react';

function PageHeader({ title, description, actions }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
      <div>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>{title}</h1>
        {description && <p style={{ color: 'var(--text-secondary)' }}>{description}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>{actions}</div>}
    </div>
  );
}

export default PageHeader;
