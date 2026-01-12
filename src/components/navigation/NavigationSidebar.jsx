import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { useAuth } from '../../contexts/AuthContext';

const NavigationSidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/executive-dashboard',
      icon: 'LayoutDashboard',
      description: 'Executive performance overview'
    },
    {
      label: 'Deals',
      path: '/deal-management',
      icon: 'Briefcase',
      description: 'Deal lifecycle management',
      subItems: [
        { label: 'Deal Management', path: '/deal-management' },
        { label: 'Quote Generation', path: '/quote-generation' }
      ]
    },
    {
      label: 'Partners',
      path: '/partner-portal',
      icon: 'Users',
      description: 'Partner relationship management',
      subItems: [
        { label: 'Partner Portal', path: '/partner-portal' },
        { label: 'Partner Management', path: '/partner-management' }
      ]
    },
    {
      label: 'Inventory',
      path: '/inventory-management',
      icon: 'Package',
      description: 'Stock visibility and allocation'
    },
    {
      label: 'Compliance',
      path: '/compliance-tracking',
      icon: 'Shield',
      description: 'Regulatory tracking and audit'
    },
    {
      label: 'Analytics',
      path: '/analytics-and-reporting',
      icon: 'BarChart3',
      description: 'Business intelligence reporting'
    }
  ];

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  const isParentActive = (item) => {
    if (item?.subItems) {
      return item?.subItems?.some(subItem => location?.pathname === subItem?.path);
    }
    return false;
  };

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Get display name or fallback to email
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <>
      <button
        onClick={handleMobileToggle}
        className="mobile-menu-button"
        aria-label="Toggle mobile menu"
      >
        <Icon name={isMobileOpen ? 'X' : 'Menu'} size={24} />
      </button>
      {isMobileOpen && (
        <div
          className="mobile-overlay"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
      <aside
        className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'block' : 'hidden lg:block'}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img
              src="/src/assets/logo.png"
              alt="Logo"
              className="w-10 h-10 object-contain"
            />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="sidebar-logo-text text-sm truncate">Ultimate Distribution</span>
              <span className="text-xs text-muted-foreground truncate">Welcome, {displayName}</span>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar py-6">
          <ul className="space-y-1">
            {navigationItems?.map((item) => {
              const isActive = isActiveRoute(item?.path) || isParentActive(item);

              return (
                <li key={item?.path}>
                  <Link
                    to={item?.path}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                    title={isCollapsed ? item?.label : ''}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="nav-item-icon">
                      <Icon name={item?.icon} size={20} />
                    </span>
                    {!isCollapsed && (
                      <span className="nav-item-text">{item?.label}</span>
                    )}
                  </Link>
                  {!isCollapsed && item?.subItems && isParentActive(item) && (
                    <ul className="ml-12 mt-1 space-y-1">
                      {item?.subItems?.map((subItem) => (
                        <li key={subItem?.path}>
                          <Link
                            to={subItem?.path}
                            className={`nav-item py-2 ${isActiveRoute(subItem?.path) ? 'active' : ''}`}
                            onClick={closeMobileMenu}
                            aria-current={isActiveRoute(subItem?.path) ? 'page' : undefined}
                          >
                            <span className="nav-item-text text-sm">
                              {subItem?.label}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {!isCollapsed && (
          <div className="border-t border-border p-4">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
            >
              <Icon name="LogOut" size={18} />
              Sign Out
            </button>
            <div className="mt-4 caption text-muted-foreground text-center text-xs">
              © 2026 Ultimate Dist.
            </div>
          </div>
        )}

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute -right-3 top-20 bg-card border border-border rounded-full p-1.5 shadow-elevation-md hover:shadow-elevation-lg transition-smooth"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon
              name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'}
              size={16}
            />
          </button>
        )}
      </aside>
    </>
  );
};

export default NavigationSidebar;