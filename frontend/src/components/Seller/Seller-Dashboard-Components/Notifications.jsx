import React, { useState } from "react";
import './Notifications.css';
import "./seller.css";

function NotificationsComponent() {
    // Sample notifications data
    const notificationsData = [
        {
            id: 1,
            type: 'order',
            title: 'Order Delivered Successfully',
            message: 'Your order #ORD-2025-1234 from Campus Bites has been delivered to Block A, Room 205.',
            time: '2 minutes ago',
            isRead: false,
            icon: 'fa-box',
            iconColor: '#10b981',
            actionButton: 'Rate Order'
        },
        {
            id: 2,
            type: 'promotion',
            title: 'Weekend Special Offer!',
            message: '🎉 Get 25% off on all food items this weekend. Use code: WEEKEND25',
            time: '1 hour ago',
            isRead: false,
            icon: 'fa-tag',
            iconColor: '#f59e0b',
            actionButton: 'Shop Now'
        },
        {
            id: 3,
            type: 'order',
            title: 'Payment Confirmed',
            message: 'Payment of ₹850 for order #ORD-2025-1233 has been processed successfully.',
            time: '3 hours ago',
            isRead: true,
            icon: 'fa-credit-card',
            iconColor: '#10b981',
            actionButton: 'View Receipt'
        },
        {
            id: 4,
            type: 'system',
            title: 'New Seller Joined',
            message: 'Healthy Kitchen has joined LocalMart! Check out their fresh salads and smoothies.',
            time: '5 hours ago',
            isRead: false,
            icon: 'fa-store',
            iconColor: '#8b5cf6',
            actionButton: 'Visit Shop'
        },
        {
            id: 5,
            type: 'order',
            title: 'Order Out for Delivery',
            message: 'Your order from Tech Hub is out for delivery. Expected delivery: 15-20 minutes.',
            time: '1 day ago',
            isRead: true,
            icon: 'fa-truck',
            iconColor: '#3b82f6',
            actionButton: 'Track Order'
        }
    ];

    // State management
    const [notifications, setNotifications] = useState(notificationsData);
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    // Calculate notification counts
    const notificationCounts = {
        all: notifications.length,
        unread: notifications.filter(n => !n.isRead).length,
        order: notifications.filter(n => n.type === 'order').length,
        promotion: notifications.filter(n => n.type === 'promotion').length,
        system: notifications.filter(n => n.type === 'system' || n.type === 'reminder' || n.type === 'review').length
    };

    // Filter notifications based on active filter
    const filteredNotifications = notifications.filter(notification => {
        switch (activeFilter) {
            case 'unread':
                return !notification.isRead;
            case 'order':
                return notification.type === 'order';
            case 'promotion':
                return notification.type === 'promotion';
            case 'system':
                return ['system', 'reminder', 'review'].includes(notification.type);
            default:
                return true;
        }
    });

    // Event handlers
    const handleMarkAsRead = (notificationId) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === notificationId
                    ? { ...notification, isRead: true }
                    : notification
            )
        );
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, isRead: true }))
        );
    };

    const handleDeleteSelected = () => {
        setNotifications(prev =>
            prev.filter(notification => !selectedNotifications.includes(notification.id))
        );
        setSelectedNotifications([]);
        setSelectAll(false);
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedNotifications([]);
        } else {
            setSelectedNotifications(filteredNotifications.map(n => n.id));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectNotification = (notificationId) => {
        setSelectedNotifications(prev => {
            if (prev.includes(notificationId)) {
                return prev.filter(id => id !== notificationId);
            } else {
                return [...prev, notificationId];
            }
        });
    };

    const handleAction = (notification) => {
        console.log(`Action clicked for notification: ${notification.title}`);
        // Handle different action types based on notification type
    };

    // Notification Item Component (inline)
    const NotificationItem = ({ notification, onMarkAsRead, onAction }) => {
        const handleMarkAsRead = () => {
            if (!notification.isRead) {
                onMarkAsRead(notification.id);
            }
        };

        const handleAction = () => {
            onAction(notification);
        };

        return (
            <div className={`notification-item ${!notification.isRead ? 'unread' : ''}`}>
                <div className="notification-icon-wrapper">
                    <div 
                        className="notification-icon" 
                        style={{ backgroundColor: notification.iconColor + '20', color: notification.iconColor }}
                    >
                        <i className={`fa-solid ${notification.icon}`}></i>
                    </div>
                    {!notification.isRead && <div className="unread-indicator"></div>}
                </div>
                
                <div className="notification-content">
                    <div className="notification-header">
                        <h3 className="notification-title">{notification.title}</h3>
                        <div className="notification-meta">
                            <span className="notification-time">{notification.time}</span>
                            {!notification.isRead && (
                                <button 
                                    className="mark-read-btn"
                                    onClick={handleMarkAsRead}
                                    title="Mark as read"
                                >
                                    <i className="fa-solid fa-check"></i>
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <p className="notification-message">{notification.message}</p>
                    
                    <div className="notification-actions">
                        <button className="notification-action-btn" onClick={handleAction}>
                            {notification.actionButton}
                        </button>
                        
                    </div>
                </div>
            </div>
        );
    };

    // Filter Tabs Component (inline)
    const NotificationFilters = ({ activeFilter, setActiveFilter, notificationCounts }) => {
        const filters = [
            { key: 'all', label: 'All', count: notificationCounts.all },
            { key: 'unread', label: 'Unread', count: notificationCounts.unread },
            { key: 'order', label: 'Orders', count: notificationCounts.order },
            { key: 'promotion', label: 'Promotions', count: notificationCounts.promotion },
            { key: 'system', label: 'System', count: notificationCounts.system }
        ];

        return (
            <div className="notification-filters">
                {filters.map(filter => (
                    <button
                        key={filter.key}
                        className={`filter-tab ${activeFilter === filter.key ? 'active' : ''}`}
                        onClick={() => setActiveFilter(filter.key)}
                    >
                        {filter.label}
                        {filter.count > 0 && (
                            <span className="filter-count">{filter.count}</span>
                        )}
                    </button>
                ))}
            </div>
        );
    };

    // Empty state check
    if (notifications.length === 0) {
        return (
            <div className="notifications-content">
                <div className="notifications-header">
                    <h1 className="notifications-title">Notifications</h1>
                </div>
                <div className="empty-notifications">
                    <i className="fa-solid fa-bell-slash empty-notifications-icon"></i>
                    <h3>No notifications yet</h3>
                    <p>When you have new updates, they'll appear here.</p>
                </div>
            </div>
        );
    }

    // Main component return
    return (
    <div className="notifications-content">
        {/* Header */}
        <div className="notifications-header">
            <div>
                <h1 className="notifications-title">Notifications</h1>
                <p className="notifications-subtitle">
                    {notificationCounts.unread > 0 
                        ? `${notificationCounts.unread} unread notifications`
                        : 'All caught up!'}
                </p>
            </div>
            <div className="notifications-actions">
                {notificationCounts.unread > 0 && (
                    <button className="mark-all-read-btn" onClick={handleMarkAllAsRead}>
                        <i className="fa-solid fa-check-double"></i>
                        Mark all as read
                    </button>
                )}
                {selectedNotifications.length > 0 && (
                    <button className="delete-selected-btn" onClick={handleDeleteSelected}>
                        <i className="fa-solid fa-trash"></i>
                        Delete ({selectedNotifications.length})
                    </button>
                )}
            </div>
        </div>

        {/* Filters */}
        <NotificationFilters 
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            notificationCounts={notificationCounts}
        />

        {/* List Header */}
        <div className="notifications-list-header">
            <div className="bulk-actions">
                <label className="select-all-wrapper">
                    <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="select-all-checkbox"
                    />
                    <span>Select all ({filteredNotifications.length})</span>
                </label>
            </div>
            <div className="notifications-count">
                Showing {filteredNotifications.length} notifications
            </div>
        </div>

        {/* Notifications List */}
        <div className="notifications-list">
            {filteredNotifications.map(notification => (
                <div key={notification.id} className="notification-wrapper">
                    <label className="notification-checkbox-wrapper">
                        <input
                            type="checkbox"
                            checked={selectedNotifications.includes(notification.id)}
                            onChange={() => handleSelectNotification(notification.id)}
                            className="notification-checkbox"
                        />
                    </label>
                    <NotificationItem
                        notification={notification}
                        onMarkAsRead={handleMarkAsRead}
                        onAction={handleAction}
                    />
                </div>
            ))}
        </div>

        {/* No Notifications State */}
        {filteredNotifications.length === 0 && (
            <div className="no-notifications">
                <i className="fa-solid fa-filter no-notifications-icon"></i>
                <h3>No notifications found</h3>
                <p>Try adjusting your filter to see more notifications.</p>
            </div>
        )}
    </div>
);
}

export default NotificationsComponent;