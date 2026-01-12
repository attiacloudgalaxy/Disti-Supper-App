import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PartnerDetailsModal = ({ partner, onClose }) => {
  if (!partner) return null;

  const getTierBadgeColor = (tier) => {
    const colorMap = {
      platinum: 'bg-primary/10 text-primary border-primary/20',
      gold: 'bg-warning/10 text-warning border-warning/20',
      silver: 'bg-muted text-muted-foreground border-border',
      bronze: 'bg-accent/10 text-accent border-accent/20'
    };
    return colorMap?.[tier?.toLowerCase()] || colorMap?.silver;
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-elevation-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">
            Partner Details
          </h2>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <Image
                  src={partner?.logo}
                  alt={partner?.logoAlt}
                  className="w-24 h-24 mx-auto rounded-lg object-cover border-2 border-border mb-4"
                />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {partner?.companyName}
                </h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTierBadgeColor(partner?.tier)}`}>
                  {partner?.tier} Partner
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="caption text-muted-foreground mb-1">Partner ID</div>
                  <div className="text-sm font-medium text-foreground">{partner?.partnerId}</div>
                </div>
                <div>
                  <div className="caption text-muted-foreground mb-1">Member Since</div>
                  <div className="text-sm font-medium text-foreground">{partner?.memberSince}</div>
                </div>
                <div>
                  <div className="caption text-muted-foreground mb-1">Last Activity</div>
                  <div className="text-sm font-medium text-foreground">{partner?.lastActivity}</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-4">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="caption text-muted-foreground mb-1">Primary Contact</div>
                    <div className="text-sm font-medium text-foreground">{partner?.contactName}</div>
                  </div>
                  <div>
                    <div className="caption text-muted-foreground mb-1">Email</div>
                    <div className="text-sm font-medium text-foreground">{partner?.email}</div>
                  </div>
                  <div>
                    <div className="caption text-muted-foreground mb-1">Phone</div>
                    <div className="text-sm font-medium text-foreground">{partner?.phone}</div>
                  </div>
                  <div>
                    <div className="caption text-muted-foreground mb-1">Website</div>
                    <div className="text-sm font-medium text-primary">{partner?.website}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-foreground mb-4">Territory & Region</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="caption text-muted-foreground mb-1">Region</div>
                    <div className="text-sm font-medium text-foreground">{partner?.region}</div>
                  </div>
                  <div>
                    <div className="caption text-muted-foreground mb-1">Territory</div>
                    <div className="text-sm font-medium text-foreground">{partner?.territory}</div>
                  </div>
                  <div>
                    <div className="caption text-muted-foreground mb-1">Address</div>
                    <div className="text-sm font-medium text-foreground">{partner?.address}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-foreground mb-4">Performance Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="caption text-muted-foreground mb-1">Performance</div>
                    <div className="text-xl font-semibold text-success">{partner?.performanceScore}%</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="caption text-muted-foreground mb-1">Revenue</div>
                    <div className="text-xl font-semibold text-foreground">${partner?.revenue?.toLocaleString()}</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="caption text-muted-foreground mb-1">Active Deals</div>
                    <div className="text-xl font-semibold text-foreground">{partner?.activeDealCount}</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="caption text-muted-foreground mb-1">Certifications</div>
                    <div className="text-xl font-semibold text-foreground">{partner?.certifications}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-foreground mb-4">Certifications & Training</h4>
                <div className="space-y-3">
                  {partner?.certificationDetails?.map((cert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="Award" size={20} className="text-primary" />
                        <div>
                          <div className="text-sm font-medium text-foreground">{cert?.name}</div>
                          <div className="caption text-muted-foreground">{cert?.issueDate}</div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${cert?.status === 'Valid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                        {cert?.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="default" iconName="Edit">
            Edit Partner
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PartnerDetailsModal;