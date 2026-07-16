import React from 'react';

/**
 * Reusable full screen loader covering the entire viewport during session boots.
 */
export function FullScreenLoader() {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100vw',
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: 'var(--bg-primary)',
    zIndex: 9999
  };

  const spinnerStyle = {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(255, 255, 255, 0.05)',
    borderTop: '4px solid var(--color-accent)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1.5rem'
  };

  const textStyle = {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    fontWeight: 500,
    letterSpacing: '0.5px'
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
      <div style={textStyle}>Loading CareerCopilot Workspace...</div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default FullScreenLoader;
