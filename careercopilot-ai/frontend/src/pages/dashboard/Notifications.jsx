import React from 'react';
import PageHeader from '../../components/PageHeader';
import NotificationCard from '../../components/NotificationCard';

function Notifications() {
  const notifications = [
    { id: 1, type: 'info', text: 'Interview Tomorrow: Technical screening with Google scheduled for tomorrow at 10:00 AM PST.', date: 'Today, 2 hours ago' },
    { id: 2, type: 'success', text: 'Application Updated: Stripe status successfully promoted from "Applied" to "Interviewing".', date: 'Yesterday' },
    { id: 3, type: 'warning', text: 'Reminder: Stripe application has been stagnant for 5 days. Consider checking in with your referral.', date: '2 days ago' },
    { id: 4, type: 'success', text: 'Resume Analysis Complete: Resume scanned successfully. ATS match score is 78% for targeted engineer role.', date: '3 days ago' }
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Notification Center" 
        description="Follow-up alerts, status changes, and recommendations calculated by the platform." 
        actions={
          <button className="btn btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', cursor: 'not-allowed', opacity: 0.6 }} disabled>
            Clear All Alerts
          </button>
        }
      />

      <div className="card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map((notif) => (
            <NotificationCard 
              key={notif.id}
              id={notif.id}
              type={notif.type}
              text={notif.text}
              date={notif.date}
              actionLabel="View Details"
              onActionClick={() => console.log('Mock notification action clicked for', notif.id)}
              onDismiss={(id) => console.log('Mock dismiss notification', id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
