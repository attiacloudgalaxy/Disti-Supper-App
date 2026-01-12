import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'deal',
      title: 'New Deal Approved',
      message: 'Deal #2847 with TechCorp has been approved',
      timestamp: '5 minutes ago',
      read: false,
      icon: 'Briefcase',
      color: 'success'
    },
    {
      id: 2,
      type: 'compliance',
      title: 'Compliance Alert',
      message: 'Quarterly audit documentation due in 3 days',
      timestamp: '1 hour ago',
      read: false,
      icon: 'Shield',
      color: 'warning'
    },
    {
      id: 3,
      type: 'partner',
      title: 'Partner Registration',
      message: 'New partner GlobalTech Solutions registered',
      timestamp: '2 hours ago',
      read: false,
      icon: 'Users',
      color: 'primary'
    },
    {
      id: 4,
      type: 'inventory',
      title: 'Low Stock Alert',
      message: 'Product SKU-4521 inventory below threshold',
      timestamp: '3 hours ago',
      read: true,
      icon: 'Package',
      color: 'error'
    },
    {
      id: 5,
      type: 'quote',
      title: 'Quote Requested',
      message: 'Partner ABC Corp requested quote for 50 units',
      timestamp: '5 hours ago',
      read: true,
      icon: 'FileText',
      color: 'primary'
    }
  ]);

  const dropdownRef = useRef(null);
  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event?.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = (id) => {
    setNotifications(notifications?.map(n => 
      n?.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications?.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getIconColor = (color) => {
    const colorMap = {
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      error: 'var(--color-error)',
      primary: 'var(--color-primary)'
    };
    return colorMap?.[color] || 'var(--color-primary)';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-lg hover:bg-muted transition-smooth focus-ring"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <Icon name="Bell" size={22} className="text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-error rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-96 bg-popover border border-border rounded-lg shadow-elevation-xl z-[200] max-h-[600px] flex flex-col"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">
              Notifications
            </h3>
            {notifications?.length > 0 && (
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="caption text-primary hover:text-primary/80 transition-smooth"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={handleClearAll}
                  className="caption text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {notifications?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Icon name="Bell" size={48} className="text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No notifications yet
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications?.map((notification) => (
                  <div
                    key={notification?.id}
                    className={`p-4 hover:bg-muted transition-smooth cursor-pointer ${
                      !notification?.read ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => handleMarkAsRead(notification?.id)}
                    role="menuitem"
                  >
                    <div className="flex items-start space-x-3">
                      <div 
                        className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${getIconColor(notification?.color)}15` }}
                      >
                        <Icon 
                          name={notification?.icon} 
                          size={20} 
                          color={getIconColor(notification?.color)}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium text-foreground">
                            {notification?.title}
                          </p>
                          {!notification?.read && (
                            <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full ml-2 mt-1" />
                          )}
                        </div>
                        <p className="caption text-muted-foreground mt-1">
                          {notification?.message}
                        </p>
                        <p className="caption text-muted-foreground mt-2">
                          {notification?.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications?.length > 0 && (
            <div className="p-3 border-t border-border">
              <button className="w-full py-2 text-sm font-medium text-primary hover:text-primary/80 transition-smooth">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;