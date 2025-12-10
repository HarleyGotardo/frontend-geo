import React from 'react';
import Icon from './Icon';

const Alert = ({ 
  children, 
  variant = 'info', 
  className = '',
  ...props 
}) => {
  const baseClasses = 'p-4 rounded-md';
  
  const variants = {
    info: 'bg-blue-50 border border-blue-200',
    success: 'bg-green-50 border border-green-200',
    warning: 'bg-yellow-50 border border-yellow-200',
    error: 'bg-red-50 border border-red-200',
  };

  const iconVariants = {
    info: 'text-blue-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
  };

  const textVariants = {
    info: 'text-blue-800',
    success: 'text-green-800',
    warning: 'text-yellow-800',
    error: 'text-red-800',
  };

  const icons = {
    info: <Icon name="info" size="sm" />,
    success: <Icon name="success" size="sm" />,
    warning: <Icon name="exclamation" size="sm" />,
    error: <Icon name="error" size="sm" />,
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <div className={classes} {...props}>
      <div className="flex">
        <div className="flex-shrink-0">
          <div className={iconVariants[variant]}>
            {icons[variant]}
          </div>
        </div>
        <div className="ml-3">
          <div className={`text-sm ${textVariants[variant]}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
