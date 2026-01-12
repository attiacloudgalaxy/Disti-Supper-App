import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Image from '../AppImage';
import { useAuth } from '../../contexts/AuthContext';

const UserProfileDropdown = ({ user: propUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, userProfile, signOut } = useAuth();

  const currentUser = {
    name: userProfile?.full_name || user?.email?.split('@')?.[0] || 'User',
    email: user?.email || 'user@example.com',
    role: userProfile?.role || 'User',
    avatar: userProfile?.avatar_url || propUser?.avatar || null
  };

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

  const handleLogout = async () => {
    setIsOpen(false);
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    {
      label: 'My Profile',
      icon: 'User',
      path: '/profile',
      onClick: () => setIsOpen(false)
    },
    {
      label: 'Settings',
      icon: 'Settings',
      path: '/settings',
      onClick: () => setIsOpen(false)
    },
    {
      label: 'Help & Support',
      icon: 'HelpCircle',
      path: '/support',
      onClick: () => setIsOpen(false)
    },
    {
      label: 'Logout',
      icon: 'LogOut',
      onClick: handleLogout,
      variant: 'danger'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted transition-smooth focus-ring"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User profile menu"
      >
        <div className="relative">
          <Image
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-border"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-card rounded-full" />
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-foreground">
            {currentUser?.name}
          </div>
          <div className="caption text-muted-foreground">
            {currentUser?.role}
          </div>
        </div>
        <Icon 
          name={isOpen ? 'ChevronUp' : 'ChevronDown'} 
          size={16} 
          className="text-muted-foreground"
        />
      </button>
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-elevation-lg z-[200]"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="p-4 border-b border-border">
            <div className="font-medium text-foreground">{currentUser?.name}</div>
            <div className="caption text-muted-foreground mt-1">
              {currentUser?.email}
            </div>
          </div>

          <div className="py-2">
            {menuItems?.map((item, index) => (
              <React.Fragment key={item?.label}>
                {item?.path ? (
                  <Link
                    to={item?.path}
                    onClick={item?.onClick}
                    className={`flex items-center px-4 py-3 hover:bg-muted transition-smooth ${
                      item?.variant === 'danger' ? 'text-error' : 'text-foreground'
                    }`}
                    role="menuitem"
                  >
                    <Icon name={item?.icon} size={18} className="mr-3" />
                    <span className="text-sm font-medium">{item?.label}</span>
                  </Link>
                ) : (
                  <button
                    onClick={item?.onClick}
                    className={`w-full flex items-center px-4 py-3 hover:bg-muted transition-smooth ${
                      item?.variant === 'danger' ? 'text-error' : 'text-foreground'
                    }`}
                    role="menuitem"
                  >
                    <Icon name={item?.icon} size={18} className="mr-3" />
                    <span className="text-sm font-medium">{item?.label}</span>
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;