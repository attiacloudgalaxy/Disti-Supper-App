import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingAudits = ({ audits, onScheduleAudit, onViewAudit }) => {
  const getAuditTypeColor = (type) => {
    const colors = {
      internal: 'var(--color-primary)',
      external: 'var(--color-secondary)',
      regulatory: 'var(--color-warning)',
      security: 'var(--color-error)'
    };
    return colors?.[type] || 'var(--color-muted-foreground)';
  };

  const getDaysUntil = (date) => {
    const today = new Date();
    const auditDate = new Date(date);
    const diffTime = auditDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Upcoming Audits</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {audits?.length} scheduled audit{audits?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          iconName="Plus"
          iconPosition="left"
          onClick={onScheduleAudit}
        >
          Schedule
        </Button>
      </div>
      <div className="divide-y divide-border max-h-[400px] overflow-y-auto custom-scrollbar">
        {audits?.map((audit) => {
          const daysUntil = getDaysUntil(audit?.date);
          const isUrgent = daysUntil <= 7;

          return (
            <div
              key={audit?.id}
              className="p-4 md:p-6 hover:bg-muted/30 transition-smooth cursor-pointer"
              onClick={() => onViewAudit(audit)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${getAuditTypeColor(audit?.type)}15` }}
                  >
                    <Icon
                      name={audit?.icon}
                      size={20}
                      color={getAuditTypeColor(audit?.type)}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                      {audit?.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {audit?.description}
                    </p>
                  </div>
                </div>
                <span
                  className={`flex-shrink-0 ml-3 text-xs font-medium px-2 py-1 rounded-full ${
                    isUrgent
                      ? 'bg-error/10 text-error' :'bg-primary/10 text-primary'
                  }`}
                >
                  {audit?.typeLabel}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center space-x-2">
                  <Icon name="Calendar" size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{audit?.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{audit?.time}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="User" size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{audit?.auditor}</span>
                </div>
                <div
                  className={`text-xs font-medium ${
                    isUrgent ? 'text-error' : 'text-success'
                  }`}
                >
                  {daysUntil > 0 ? `${daysUntil} days` : daysUntil === 0 ? 'Today' : 'Overdue'}
                </div>
              </div>
              {audit?.preparationStatus && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-muted-foreground">Preparation</span>
                    <span className="font-medium text-foreground">
                      {audit?.preparationStatus}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${audit?.preparationStatus}%`,
                        backgroundColor: getAuditTypeColor(audit?.type)
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingAudits;