import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BreadcrumbNavigation = () => {
  const location = useLocation();

  const routeLabels = {
    '/executive-dashboard': 'Dashboard',
    '/deal-management': 'Deal Management',
    '/partner-portal': 'Partner Portal',
    '/quote-generation': 'Quote Generation',
    '/partner-management': 'Partner Management',
    '/inventory-management': 'Inventory Management',
    '/compliance-tracking': 'Compliance Tracking',
    '/analytics-and-reporting': 'Analytics & Reporting'
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location?.pathname?.split('/')?.filter(segment => segment);
    
    if (pathSegments?.length === 0 || location?.pathname === '/') {
      return [];
    }

    const breadcrumbs = [
      { label: 'Home', path: '/executive-dashboard' }
    ];

    let currentPath = '';
    pathSegments?.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = routeLabels?.[currentPath] || segment?.split('-')?.map(word => 
        word?.charAt(0)?.toUpperCase() + word?.slice(1)
      )?.join(' ');

      breadcrumbs?.push({
        label,
        path: currentPath,
        isLast: index === pathSegments?.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length <= 1) {
    return null;
  }

  return (
    <nav 
      className="flex items-center space-x-2 py-4"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((crumb, index) => (
          <li key={crumb?.path} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="text-muted-foreground mx-2"
                aria-hidden="true"
              />
            )}
            {crumb?.isLast ? (
              <span 
                className="text-sm font-medium text-foreground"
                aria-current="page"
              >
                {crumb?.label}
              </span>
            ) : (
              <Link
                to={crumb?.path}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
              >
                {crumb?.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbNavigation;