import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const QuoteTemplates = ({ onSelectTemplate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: 'standard',
      name: 'Standard Quote',
      description: 'Professional quote with company branding and standard terms',
      icon: 'FileText',
      color: 'primary',
      features: ['Company logo', 'Standard terms', 'Payment details', 'Contact information']
    },
    {
      id: 'detailed',
      name: 'Detailed Technical Quote',
      description: 'Comprehensive quote with technical specifications and diagrams',
      icon: 'FileCode',
      color: 'secondary',
      features: ['Technical specs', 'Product diagrams', 'Implementation timeline', 'Support details']
    },
    {
      id: 'executive',
      name: 'Executive Summary',
      description: 'High-level overview focused on business value and ROI',
      icon: 'Briefcase',
      color: 'accent',
      features: ['ROI analysis', 'Business benefits', 'Executive summary', 'Competitive comparison']
    },
    {
      id: 'partner',
      name: 'Partner Co-Branded',
      description: 'Joint quote with partner branding and collaboration details',
      icon: 'Users',
      color: 'success',
      features: ['Dual branding', 'Partner details', 'Joint support', 'Collaboration terms']
    }
  ];

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template?.id);
    onSelectTemplate(template);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-sm">
      <div className="p-4 md:p-6 border-b border-border">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground">Quote Templates</h2>
        <p className="caption text-muted-foreground mt-1">
          Choose a template for your quote presentation
        </p>
      </div>
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {templates?.map((template) => (
            <div
              key={template?.id}
              className={`bg-surface border-2 rounded-lg p-4 md:p-6 cursor-pointer transition-smooth hover:shadow-elevation-md ${
                selectedTemplate === template?.id
                  ? 'border-primary shadow-elevation-sm'
                  : 'border-border'
              }`}
              onClick={() => handleSelectTemplate(template)}
            >
              <div className="flex items-start space-x-4 mb-4">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `var(--color-${template?.color})`, opacity: 0.1 }}
                >
                  <Icon
                    name={template?.icon}
                    size={24}
                    color={`var(--color-${template?.color})`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">
                    {template?.name}
                  </h3>
                  <p className="caption text-muted-foreground">
                    {template?.description}
                  </p>
                </div>
                {selectedTemplate === template?.id && (
                  <Icon name="CheckCircle2" size={24} className="text-primary flex-shrink-0" />
                )}
              </div>

              <div className="space-y-2">
                <p className="caption font-medium text-foreground">Includes:</p>
                <ul className="space-y-1">
                  {template?.features?.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Icon name="Check" size={14} className="text-success flex-shrink-0" />
                      <span className="caption text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-muted/50 border border-border rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Template Customization</h4>
              <p className="caption text-muted-foreground">
                All templates can be customized with your company branding, custom terms, and additional sections after generation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteTemplates;