import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../buyer.css';

function NotificationsComponent() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'read', 'unread'

  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5000/api/notifications', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch notifications');
        const result = await response.json();
        setNotifications(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to mark as read');
      setNotifications(prev => prev.map(n => (n._id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    if (unreadNotifications.length === 0) {
      alert('No unread notifications to mark as read');
      return;
    }

    if (!window.confirm(`Mark ${unreadNotifications.length} notifications as read?`)) return;

    try {
      const response = await fetch('http://localhost:5000/api/notifications/read-all', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to mark all as read');
      
      // Update all notifications to read status
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      alert('All notifications marked as read successfully!');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedNotifications.length === 0) return;
    if (!window.confirm(`Delete ${selectedNotifications.length} notifications?`)) return;

    try {
      const response = await fetch('http://localhost:5000/api/notifications/delete-selected', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedNotifications }),
      });
      if (!response.ok) throw new Error('Failed to delete notifications');
      setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n._id)));
      setSelectedNotifications([]);
      setSelectAll(false);
      alert('Selected notifications deleted successfully!');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleSelectAll = () => {
    const filteredNotifications = getFilteredNotifications();
    if (selectAll) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectNotification = (id) => {
    setSelectedNotifications(prev =>
      prev.includes(id) ? prev.filter(selId => selId !== id) : [...prev, id]
    );
  };

  // Filter notifications based on read status
  const getFilteredNotifications = () => {
    switch (filter) {
      case 'read':
        return notifications.filter(n => n.isRead);
      case 'unread':
        return notifications.filter(n => !n.isRead);
      default:
        return notifications;
    }
  };

  // Get counts for different notification states
  const getNotificationCounts = () => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.isRead).length;
    const read = notifications.filter(n => n.isRead).length;
    return { total, unread, read };
  };

  const NotificationItem = ({ notification }) => (
    <div className={`buyer-notification-item ${!notification.isRead ? 'unread' : ''}`}>
      <div className="buyer-notification-icon-wrapper">
        <div
          className="buyer-notification-icon"
          style={{ backgroundColor: notification.iconColor + '20', color: notification.iconColor }}
        >
          <i className={`fa-solid ${notification.icon}`}></i>
        </div>
        {!notification.isRead && <div className="buyer-unread-indicator"></div>}
      </div>

      <div className="buyer-notification-content">
        <div className="buyer-notification-header">
          <h3 className="buyer-notification-title">{notification.title}</h3>
          <div className="buyer-notification-meta">
            <span className="buyer-notification-time">
              {new Date(notification.createdAt).toLocaleString()}
            </span>
            {!notification.isRead && (
              <button
                className="buyer-mark-read-btn"
                onClick={() => handleMarkAsRead(notification._id)}
                title="Mark as read"
              >
                <i className="fa-solid fa-check"></i>
              </button>
            )}
          </div>
        </div>

        <p className="buyer-notification-message">{notification.message}</p>

        <div className="buyer-notification-actions">
          <span className={`notification-type-badge ${notification.type}`}>
            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
          </span>
          <span className={`notification-status-badge ${notification.isRead ? 'read' : 'unread'}`}>
            {notification.isRead ? 'Read' : 'Unread'}
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="loading">Loading notifications...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const counts = getNotificationCounts();
  const filteredNotifications = getFilteredNotifications();

  if (notifications.length === 0) {
    return (
      <div className="buyer-empty-notifications">
        <i className="fa-solid fa-bell-slash buyer-empty-notifications-icon"></i>
        <h3>No notifications yet</h3>
        <p>When you have new updates, they'll appear here.</p>
      </div>
    );
  }

  return (
    <div className="buyer-notifications-content">
      {/* Header */}
      <div className="buyer-notifications-header">
        <div>
          <h1 className="buyer-notifications-title">Notifications</h1>
          <p className="buyer-notifications-subtitle">
            {counts.unread > 0
              ? `${counts.unread} unread notification${counts.unread > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        <div className="buyer-notifications-actions">
          {counts.unread > 0 && (
            <button 
              className="buyer-mark-all-read-btn" 
              onClick={handleMarkAllAsRead}
              title={`Mark ${counts.unread} notifications as read`}
            >
              <i className="fa-solid fa-check-double"></i> 
              Mark all as read ({counts.unread})
            </button>
          )}
          {selectedNotifications.length > 0 && (
            <button className="buyer-delete-selected-btn" onClick={handleDeleteSelected}>
              <i className="fa-solid fa-trash"></i> Delete ({selectedNotifications.length})
            </button>
          )}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="buyer-notifications-filter">
        <style jsx>{`
          .buyer-notifications-filter {
            margin-bottom: 20px;
          }

          .buyer-filter-buttons {
            display: flex;
            gap: 10px;
          }

          .buyer-filter-btn {
            padding: 8px 16px;
            border: 2px solid #ffa500;
            background: #ffa500;
            color: white;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            font-weight: 500;
          }

          .buyer-filter-btn.active {
            background: #48bb78;
            border-color: #48bb78;
          }

          .buyer-filter-btn:hover {
            background: #48bb78;
            border-color: #48bb78;
          }

          .notification-status-badge {
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            margin-left: 8px;
          }

          .notification-status-badge.unread {
            background: #fef3c7;
            color: #d97706;
          }

          .notification-status-badge.read {
            background: #dcfce7;
            color: #16a34a;
          }

          .buyer-notifications-summary {
            margin-top: 20px;
            padding: 16px;
            background: #f9fafb;
            border-radius: 8px;
            border-top: 1px solid #e5e7eb;
          }

          .buyer-summary-stats {
            display: flex;
            gap: 20px;
            justify-content: center;
          }

          .buyer-stat {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 14px;
            font-weight: 500;
          }

          .buyer-stat.unread {
            color: #d97706;
          }

          .buyer-stat.read {
            color: #16a34a;
          }

          .buyer-empty-filtered-notifications {
            text-align: center;
            padding: 40px;
            color: #6b7280;
          }

          .buyer-empty-filter-icon {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.5;
          }

          .buyer-filter-indicator {
            font-style: italic;
            color: #6b7280;
          }
        `}</style>
        <div className="buyer-filter-buttons">
          <button
            className={`buyer-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => {
              setFilter('all');
              setSelectedNotifications([]);
              setSelectAll(false);
            }}
          >
            <i className="fa-solid fa-list"></i>
            All ({counts.total})
          </button>
          <button
            className={`buyer-filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => {
              setFilter('unread');
              setSelectedNotifications([]);
              setSelectAll(false);
            }}
          >
            <i className="fa-solid fa-envelope"></i>
            Unread ({counts.unread})
          </button>
          <button
            className={`buyer-filter-btn ${filter === 'read' ? 'active' : ''}`}
            onClick={() => {
              setFilter('read');
              setSelectedNotifications([]);
              setSelectAll(false);
            }}
          >
            <i className="fa-solid fa-envelope-open"></i>
            Read ({counts.read})
          </button>
        </div>
      </div>

      {/* List Header */}
      <div className="buyer-notifications-list-header">
        <div className="buyer-bulk-actions">
          <label className="buyer-select-all-wrapper">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="buyer-select-all-checkbox"
            />
            <span>Select all ({filteredNotifications.length})</span>
          </label>
        </div>
        <div className="buyer-notifications-count">
          Showing {filteredNotifications.length} of {counts.total} notifications
          {filter !== 'all' && (
            <span className="buyer-filter-indicator">
              • Filtered by {filter}
            </span>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="buyer-empty-filtered-notifications">
          <i className="fa-solid fa-filter buyer-empty-filter-icon"></i>
          <h3>No {filter} notifications</h3>
          <p>
            {filter === 'unread' 
              ? "You don't have any unread notifications." 
              : "You don't have any read notifications."}
          </p>
        </div>
      ) : (
        <div className="buyer-notifications-list">
          {filteredNotifications.map(notification => (
            <div key={notification._id} className="buyer-notification-wrapper">
              <label className="buyer-notification-checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={selectedNotifications.includes(notification._id)}
                  onChange={() => handleSelectNotification(notification._id)}
                  className="buyer-notification-checkbox"
                />
              </label>
              <NotificationItem notification={notification} />
            </div>
          ))}
        </div>
      )}
      
      {/* Summary Footer */}
      <div className="buyer-notifications-summary">
        <div className="buyer-summary-stats">
          <span className="buyer-stat">
            <i className="fa-solid fa-bell"></i>
            Total: {counts.total}
          </span>
          <span className="buyer-stat unread">
            <i className="fa-solid fa-envelope"></i>
            Unread: {counts.unread}
          </span>
          <span className="buyer-stat read">
            <i className="fa-solid fa-envelope-open"></i>
            Read: {counts.read}
          </span>
        </div>
      </div>
    </div>
  );
}

export default NotificationsComponent;