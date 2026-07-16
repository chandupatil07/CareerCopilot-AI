import React from 'react';

/**
 * Spinner inside button tags when submitting form actions.
 */
export function ButtonLoader() {
  const spinnerStyle = {
    display: 'inline-block',
    width: '18px',
    height: '18px',
    border: '2.5px solid rgba(255, 255, 255, 0.25)',
    borderTop: '2.5px solid #FFFFFF',
    borderRadius: '50%',
    animation: 'btn-spin 0.75s linear infinite',
    marginRight: '8px',
    verticalAlign: 'middle'
  };

  return (
    <>
      <span style={spinnerStyle}></span>
      <span>Processing...</span>
      <style>{`
        @keyframes btn-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

export default ButtonLoader;
