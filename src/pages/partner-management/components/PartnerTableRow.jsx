import React from 'react';

import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PartnerTableRow = ({ partner, onViewDetails, onEditPartner }) => {
  const getTierBadgeColor = (tier) => {
    const colorMap = {
      platinum: 'bg-primary/10 text-primary border-primary/20',
      gold: 'bg-warning/10 text-warning border-warning/20',
      silver: 'bg-muted text-muted-foreground border-border',
      bronze: 'bg-accent/10 text-accent border-accent/20'
    };
    return colorMap?.[tier?.toLowerCase()] || colorMap?.silver;
  };

  const getStatusBadgeColor = (status) => {
    const colorMap = {
      active: 'bg-success/10 text-success border-success/20',
      pending: 'bg-warning/10 text-warning border-warning/20',
      inactive: 'bg-muted text-muted-foreground border-border',
      suspended: 'bg-error/10 text-error border-error/20'
    };
    return colorMap?.[status?.toLowerCase()] || colorMap?.inactive;
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-primary';
    if (score >= 50) return 'text-warning';
    return 'text-error';
  };

  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-smooth">
      <td className="px-4 py-4">
        <div className="flex items-center space-x-3">
          <Image
            src={partner?.logo}
            alt={partner?.logoAlt}
            className="w-10 h-10 rounded-lg object-cover border border-border"
          />
          <div className="min-w-0">
            <div className="font-medium text-foreground truncate">
              {partner?.companyName}
            </div>
            <div className="caption text-muted-foreground truncate">
              ID: {partner?.partnerId}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="text-sm text-foreground">{partner?.contactName}</div>
        <div className="caption text-muted-foreground">{partner?.email}</div>
      </td>
      <td className="px-4 py-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTierBadgeColor(partner?.tier)}`}>
          {partner?.tier}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="text-sm text-foreground">{partner?.region}</div>
        <div className="caption text-muted-foreground">{partner?.territory}</div>
      </td>
      <td className="px-4 py-4">
        <div className={`text-sm font-medium ${getPerformanceColor(partner?.performanceScore)}`}>
          {partner?.performanceScore}%
        </div>
        <div className="caption text-muted-foreground">
          ${partner?.revenue?.toLocaleString()}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="text-sm text-foreground">{partner?.certifications}</div>
        <div className="caption text-muted-foreground">
          {partner?.activeDealCount} active deals
        </div>
      </td>
      <td className="px-4 py-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(partner?.status)}`}>
          {partner?.status}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Eye"
            onClick={() => onViewDetails(partner)}
            className="hover:bg-primary/10"
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Edit"
            onClick={() => onEditPartner(partner)}
            className="hover:bg-accent/10"
          >
            Edit
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default PartnerTableRow;