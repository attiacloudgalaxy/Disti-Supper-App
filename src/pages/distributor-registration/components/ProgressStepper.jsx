import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressStepper = ({ currentStep, steps }) => {
    return (
        <div className="w-full mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;
                    const isLast = index === steps.length - 1;

                    return (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                                            ? 'bg-success text-success-foreground'
                                            : isCurrent
                                                ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                                                : 'bg-muted text-muted-foreground'
                                        }`}
                                >
                                    {isCompleted ? (
                                        <Icon name="Check" size={20} />
                                    ) : (
                                        <span className="font-semibold">{stepNumber}</span>
                                    )}
                                </div>
                                <span
                                    className={`mt-2 text-sm font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground'
                                        }`}
                                >
                                    {step.label}
                                </span>
                            </div>
                            {!isLast && (
                                <div
                                    className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${isCompleted ? 'bg-success' : 'bg-muted'
                                        }`}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressStepper;
