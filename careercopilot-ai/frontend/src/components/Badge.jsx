import React from 'react';

function Badge({ children, type }) {
  const getBadgeClass = (type) => {
    switch (type?.toLowerCase()) {
      case 'cyan':
      case 'interested':
      case 'applied':
      case 'accepted':
        return 'badge badge-cyan';
      case 'purple':
      case 'assessment':
      case 'interview scheduled':
      case 'interview completed':
      case 'offer received':
        return 'badge badge-purple';
      default:
        return 'badge'; // uses inline overrides for other states
    }
  };

  const getCustomStyle = (type) => {
    switch (type?.toLowerCase()) {
      case 'rejected':
        return { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.2)' };
      case 'warning':
        return { backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)', border: '1px solid rgba(245, 158, 11, 0.2)' };
      case 'success':
        return { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', border: '1px solid rgba(16, 185, 129, 0.2)' };
      default:
        return {};
    }
  };

  return (
    <span className={getBadgeClass(type)} style={getCustomStyle(type)}>
      {children}
    </span>
  );
}

export default Badge;
