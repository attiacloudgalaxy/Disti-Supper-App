import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CertificationStatusCard = ({ certifications }) => {
  const getStatusColor = (status) => {
    const colors = {
      active: 'var(--color-success)',
      expiring: 'var(--color-warning)',
      expired: 'var(--color-error)',
      'in-progress': 'var(--color-primary)'
    };
    return colors?.[status] || 'var(--color-primary)';
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: 'CheckCircle2',
      expiring: 'AlertCircle',
      expired: 'XCircle',
      'in-progress': 'Clock'
    };
    return icons?.[status] || 'Award';
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Active',
      expiring: 'Expiring Soon',
      expired: 'Expired',
      'in-progress': 'In Progress'
    };
    return labels?.[status] || 'Unknown';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-sm">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-semibold text-foreground">Certifications</h3>
        <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">
          Add New
        </Button>
      </div>
      <div className="space-y-4">
        {certifications?.map((cert) => (
          <div key={cert?.id} className="p-4 rounded-lg border border-border hover:border-primary transition-smooth">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <div 
                  className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${getStatusColor(cert?.status)}15` }}
                >
                  <Icon 
                    name="Award" 
                    size={24} 
                    color={getStatusColor(cert?.status)}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm md:text-base font-semibold text-foreground mb-1 line-clamp-1">
                    {cert?.name}
                  </h4>
                  <p className="caption text-muted-foreground">
                    {cert?.issuer}
                  </p>
                </div>
              </div>
              <div 
                className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2"
                style={{ 
                  backgroundColor: `${getStatusColor(cert?.status)}20`,
                  color: getStatusColor(cert?.status)
                }}
              >
                <Icon name={getStatusIcon(cert?.status)} size={12} />
                <span>{getStatusLabel(cert?.status)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="caption text-muted-foreground mb-1">Issue Date</p>
                <p className="text-sm font-medium text-foreground">{cert?.issueDate}</p>
              </div>
              <div>
                <p className="caption text-muted-foreground mb-1">Expiry Date</p>
                <p className="text-sm font-medium text-foreground">{cert?.expiryDate}</p>
              </div>
            </div>

            {cert?.status === 'in-progress' && cert?.progress !== undefined && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="caption text-muted-foreground">Completion</span>
                  <span className="caption font-medium text-foreground">{cert?.progress}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${cert?.progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              {cert?.status === 'active' && (
                <Button variant="outline" size="sm" fullWidth iconName="Download" iconPosition="left">
                  Download Certificate
                </Button>
              )}
              {cert?.status === 'expiring' && (
                <Button variant="default" size="sm" fullWidth iconName="RefreshCw" iconPosition="left">
                  Renew Now
                </Button>
              )}
              {cert?.status === 'expired' && (
                <Button variant="destructive" size="sm" fullWidth iconName="RefreshCw" iconPosition="left">
                  Recertify
                </Button>
              )}
              {cert?.status === 'in-progress' && (
                <Button variant="default" size="sm" fullWidth iconName="PlayCircle" iconPosition="left">
                  Continue
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationStatusCard;