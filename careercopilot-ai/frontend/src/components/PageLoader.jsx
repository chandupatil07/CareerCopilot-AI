import React from 'react';

/**
 * Centered spinner for partial content segments or panels inside layouts.
 */
export function PageLoader() {
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 1rem',
    width: '100%'
  };

  const spinnerStyle = {
    width: '32px',
    height: '32px',
    border: '3px solid rgba(255, 255, 255, 0.05)',
    borderTop: '3px solid var(--color-accent)',
    borderRadius: '50%',
    animation: 'page-spin 0.9s linear infinite'
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
      <style>{`
        @keyframes page-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default PageLoader;
