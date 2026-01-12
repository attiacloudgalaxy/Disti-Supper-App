import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TrainingModuleCard = ({ module, onEnroll, onContinue }) => {
  const getStatusColor = (status) => {
    const colors = {
      completed: 'var(--color-success)',
      'in-progress': 'var(--color-warning)',
      available: 'var(--color-primary)',
      locked: 'var(--color-muted-foreground)'
    };
    return colors?.[status] || 'var(--color-primary)';
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: 'CheckCircle2',
      'in-progress': 'Clock',
      available: 'PlayCircle',
      locked: 'Lock'
    };
    return icons?.[status] || 'PlayCircle';
  };

  const getStatusLabel = (status) => {
    const labels = {
      completed: 'Completed',
      'in-progress': 'In Progress',
      available: 'Available',
      locked: 'Locked'
    };
    return labels?.[status] || 'Available';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-elevation-md transition-smooth">
      <div className="relative h-40 md:h-48 overflow-hidden">
        <Image
          src={module.thumbnail}
          alt={module.thumbnailAlt}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <div 
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: `${getStatusColor(module.status)}20`,
              color: getStatusColor(module.status)
            }}
          >
            <Icon name={getStatusIcon(module.status)} size={14} />
            <span>{getStatusLabel(module.status)}</span>
          </div>
        </div>
        {module.duration && (
          <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <div className="flex items-center space-x-1 text-xs font-medium text-foreground">
              <Icon name="Clock" size={14} />
              <span>{module.duration}</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="text-base md:text-lg font-semibold text-foreground mb-1 line-clamp-1">
              {module.title}
            </h4>
            <p className="caption text-muted-foreground line-clamp-2">
              {module.description}
            </p>
          </div>
        </div>

        {module.progress !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="caption text-muted-foreground">Progress</span>
              <span className="caption font-medium text-foreground">{module.progress}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${module.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 caption text-muted-foreground">
              <Icon name="BookOpen" size={14} />
              <span>{module.lessons} lessons</span>
            </div>
            {module.certificate && (
              <div className="flex items-center space-x-1 caption text-success">
                <Icon name="Award" size={14} />
                <span>Certificate</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          {module.status === 'completed' ? (
            <Button variant="outline" fullWidth iconName="Award" iconPosition="left">
              View Certificate
            </Button>
          ) : module.status === 'in-progress' ? (
            <Button variant="default" fullWidth iconName="PlayCircle" iconPosition="left" onClick={onContinue}>
              Continue Learning
            </Button>
          ) : module.status === 'available' ? (
            <Button variant="default" fullWidth iconName="PlayCircle" iconPosition="left" onClick={onEnroll}>
              Start Module
            </Button>
          ) : (
            <Button variant="outline" fullWidth disabled iconName="Lock" iconPosition="left">
              Complete Prerequisites
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingModuleCard;