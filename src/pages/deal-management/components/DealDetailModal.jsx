import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import DealStatusBadge from './DealStatusBadge';

const DealDetailModal = ({ deal, onClose, onUpdate }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedDeal, setEditedDeal] = useState(deal);
  const [activeTab, setActiveTab] = useState('overview');

  const stageOptions = [
    { value: 'prospecting', label: 'Prospecting' },
    { value: 'qualification', label: 'Qualification' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed-won', label: 'Closed Won' },
    { value: 'closed-lost', label: 'Closed Lost' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSave = () => {
    onUpdate(editedDeal);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedDeal(deal);
    setIsEditing(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'activity', label: 'Activity', icon: 'Activity' },
    { id: 'documents', label: 'Documents', icon: 'FileText' },
    { id: 'compliance', label: 'Compliance', icon: 'Shield' }
  ];

  const activityLog = [
    {
      id: 1,
      type: 'stage-change',
      user: 'Sarah Johnson',
      action: 'moved deal from Qualification to Proposal',
      timestamp: '2026-01-10T14:30:00',
      icon: 'ArrowRight',
      color: 'primary'
    },
    {
      id: 2,
      type: 'note',
      user: 'Michael Chen',
      action: 'added a note: Client requested additional product specifications',
      timestamp: '2026-01-09T11:15:00',
      icon: 'MessageSquare',
      color: 'secondary'
    },
    {
      id: 3,
      type: 'quote',
      user: 'System',
      action: 'generated quote #Q-2847',
      timestamp: '2026-01-08T16:45:00',
      icon: 'FileText',
      color: 'accent'
    }
  ];

  const documents = [
    { id: 1, name: 'Proposal_TechCorp_2026.pdf', size: '2.4 MB', uploadedBy: 'Sarah Johnson', uploadedAt: '2026-01-10T10:00:00' },
    { id: 2, name: 'Product_Specifications.docx', size: '856 KB', uploadedBy: 'Michael Chen', uploadedAt: '2026-01-09T14:30:00' },
    { id: 3, name: 'Quote_Q-2847.pdf', size: '1.2 MB', uploadedBy: 'System', uploadedAt: '2026-01-08T16:45:00' }
  ];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-elevation-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Icon name="Briefcase" size={24} className="text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg md:text-xl font-semibold text-foreground truncate">
                {deal?.name}
              </h2>
              <p className="caption text-muted-foreground">{deal?.company}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-smooth flex-shrink-0"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="border-b border-border overflow-x-auto">
          <div className="flex space-x-1 px-4 md:px-6 min-w-max">
            {tabs?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-smooth ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={18} />
                <span className="text-sm font-medium">{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <DealStatusBadge stage={deal?.stage} size="lg" />
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Edit"
                    iconPosition="left"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Deal
                  </Button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      iconName="Save"
                      iconPosition="left"
                      onClick={handleSave}
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="caption text-muted-foreground mb-2 block">Deal Value</label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedDeal?.value}
                      onChange={(e) => setEditedDeal({ ...editedDeal, value: parseFloat(e?.target?.value) })}
                    />
                  ) : (
                    <div className="text-2xl font-semibold text-foreground">
                      {formatCurrency(deal?.value)}
                    </div>
                  )}
                </div>

                <div>
                  <label className="caption text-muted-foreground mb-2 block">Stage</label>
                  {isEditing ? (
                    <Select
                      options={stageOptions}
                      value={editedDeal?.stage}
                      onChange={(value) => setEditedDeal({ ...editedDeal, stage: value })}
                    />
                  ) : (
                    <div className="text-lg font-medium text-foreground">
                      {stageOptions?.find(s => s?.value === deal?.stage)?.label}
                    </div>
                  )}
                </div>

                <div>
                  <label className="caption text-muted-foreground mb-2 block">Partner</label>
                  <div className="text-lg font-medium text-foreground">{deal?.partner}</div>
                </div>

                <div>
                  <label className="caption text-muted-foreground mb-2 block">Probability</label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedDeal?.probability}
                      onChange={(e) => setEditedDeal({ ...editedDeal, probability: parseInt(e?.target?.value) })}
                      min="0"
                      max="100"
                    />
                  ) : (
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${deal?.probability}%` }}
                        />
                      </div>
                      <span className="text-lg font-medium text-foreground whitespace-nowrap">
                        {deal?.probability}%
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="caption text-muted-foreground mb-2 block">Expected Close Date</label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editedDeal?.closeDate}
                      onChange={(e) => setEditedDeal({ ...editedDeal, closeDate: e?.target?.value })}
                    />
                  ) : (
                    <div className="text-lg font-medium text-foreground">
                      {formatDate(deal?.closeDate)}
                    </div>
                  )}
                </div>

                <div>
                  <label className="caption text-muted-foreground mb-2 block">Weighted Value</label>
                  <div className="text-lg font-medium text-foreground">
                    {formatCurrency(deal?.value * deal?.probability / 100)}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="text-base font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    iconName="FileText"
                    iconPosition="left"
                    onClick={() => navigate('/quote-generation')}
                    fullWidth
                  >
                    Generate Quote
                  </Button>
                  <Button
                    variant="outline"
                    iconName="Users"
                    iconPosition="left"
                    onClick={() => navigate('/partner-portal')}
                    fullWidth
                  >
                    View Partner
                  </Button>
                  <Button
                    variant="outline"
                    iconName="Shield"
                    iconPosition="left"
                    onClick={() => navigate('/compliance-tracking')}
                    fullWidth
                  >
                    Check Compliance
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              {activityLog?.map(activity => (
                <div key={activity?.id} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `var(--color-${activity?.color})`, opacity: 0.1 }}
                  >
                    <Icon
                      name={activity?.icon}
                      size={20}
                      color={`var(--color-${activity?.color})`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-foreground mb-1">
                      <span className="font-medium">{activity?.user}</span> {activity?.action}
                    </div>
                    <div className="caption text-muted-foreground">
                      {formatDate(activity?.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-3">
              {documents?.map(doc => (
                <div key={doc?.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <Icon name="FileText" size={24} className="text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{doc?.name}</div>
                      <div className="caption text-muted-foreground">
                        {doc?.size} • Uploaded by {doc?.uploadedBy}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" iconName="Download" />
                </div>
              ))}
              <Button variant="outline" iconName="Upload" iconPosition="left" fullWidth>
                Upload Document
              </Button>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name="CheckCircle" size={24} className="text-success" />
                  <div>
                    <div className="text-sm font-medium text-foreground">Compliance Status</div>
                    <div className="caption text-muted-foreground">All requirements met</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="ExternalLink"
                  iconPosition="right"
                  onClick={() => navigate('/compliance-tracking')}
                >
                  View Details
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Shield" size={18} className="text-success" />
                    <span className="text-sm font-medium text-foreground">Partner Certification</span>
                  </div>
                  <div className="caption text-muted-foreground">Valid until Dec 2026</div>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="FileCheck" size={18} className="text-success" />
                    <span className="text-sm font-medium text-foreground">Documentation</span>
                  </div>
                  <div className="caption text-muted-foreground">Complete</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealDetailModal;