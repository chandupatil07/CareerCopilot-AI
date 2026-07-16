/**
 * File Explanation: Notifications.jsx
 * 
 * Live Notification Center. Fetches system follow-up alerts, priority messages,
 * and allows users to mark individual alerts as read, clear all read status,
 * or delete specific alert logs.
 */

import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import NotificationCard from '../../components/NotificationCard';
import PageLoader from '../../components/PageLoader';
import { notificationsService } from '../../services/notifications';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null); // Tracks row operations
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      setLoading(true);
      setError(null);

      const [list, countData] = await Promise.all([
        notificationsService.listNotifications(),
        notificationsService.getUnreadCount()
      ]);

      setNotifications(list);
      setUnreadCount(countData.unread_count);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Unable to load notification alerts from database.');
    } finally {
      setLoading(false);
    }
  }

  const handleMarkRead = async (id) => {
    try {
      setActionId(id);
      await notificationsService.markRead(id);
      
      // Update local state to avoid full reload
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
      const countData = await notificationsService.getUnreadCount();
      setUnreadCount(countData.unread_count);
      
      // Dispatch event to notify Navbar/Sidebar if needed
      window.dispatchEvent(new Event('auth:unread_notifications_changed'));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    } finally {
      setActionId(null);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setLoading(true);
      await notificationsService.markAllRead();
      
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      window.dispatchEvent(new Event('auth:unread_notifications_changed'));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      alert('Failed to clear alerts.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setActionId(id);
      await notificationsService.deleteNotification(id);
      
      // Update local state
      setNotifications(notifications.filter(n => n.id !== id));
      const countData = await notificationsService.getUnreadCount();
      setUnreadCount(countData.unread_count);
      window.dispatchEvent(new Event('auth:unread_notifications_changed'));
    } catch (err) {
      console.error('Failed to delete notification:', err);
      alert('Failed to delete alert.');
    } finally {
      setActionId(null);
    }
  };

  const handleCleanExpired = async () => {
    try {
      setLoading(true);
      const res = await notificationsService.deleteExpired();
      alert(`Cleaned up ${res.deleted_count} expired notifications.`);
      fetchNotifications();
    } catch (err) {
      console.error('Clean expired failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Notification Center" 
        description={`Follow-up alerts, status changes, and recommendations calculated by the platform. (${unreadCount} unread)`} 
        actions={
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleCleanExpired} 
              className="btn btn-secondary" 
              style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
              title="Purge expired database notifications"
            >
              🧹 Purge Expired
            </button>
            <button 
              onClick={handleMarkAllRead} 
              className="btn btn-primary" 
              style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
              disabled={unreadCount === 0}
            >
              Mark All Read
            </button>
          </div>
        }
      />

      {error && (
        <div style={{ padding: '0.8rem', borderRadius: 'var(--border-radius-sm)', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444', marginBottom: '1.5rem', fontSize: '0.85rem', textAlign: 'center' }}>
          ⚠️ {error}
        </div>
      )}

      <div className="card" style={{ padding: '1.75rem' }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>🔔</span>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>Workspace Alerts Inbox Empty</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Your event notifications box is clear. We will alert you when job statuses update.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notifications.map((notif) => {
              const isRead = notif.is_read;
              const cardDate = new Date(notif.created_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div key={notif.id} style={{ position: 'relative' }}>
                  <NotificationCard 
                    id={notif.id}
                    type={notif.notification_type}
                    text={
                      <span style={{ fontWeight: isRead ? 400 : 600 }}>
                        {notif.title}: {notif.message}
                      </span>
                    }
                    date={cardDate}
                    actionLabel={isRead ? null : (actionId === notif.id ? 'Loading...' : 'Mark Read')}
                    onActionClick={() => handleMarkRead(notif.id)}
                    onDismiss={() => handleDelete(notif.id)}
                  />
                  {!isRead && (
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      left: '8px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-accent-purple)'
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
