import React from 'react';
import Icon from '../AppIcon';

const Checkbox = ({
  label,
  description,
  error,
  checked = false,
  onChange,
  disabled = false,
  required = false,
  indeterminate = false,
  size = 'default',
  id,
  name,
  value,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconSizes = {
    sm: 12,
    default: 14,
    lg: 16
  };

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id={id}
            name={name}
            value={value}
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            className="sr-only"
            {...props}
          />
          
          <label
            htmlFor={id}
            className={`
              relative flex items-center justify-center cursor-pointer
              ${sizeClasses?.[size]}
              border-2 rounded transition-all duration-200
              ${disabled ? 'cursor-not-allowed opacity-50' : ''}
              ${error 
                ? 'border-destructive bg-destructive/10' 
                : checked || indeterminate
                  ? 'border-primary bg-primary' :'border-border bg-input hover:border-primary/50'
              }
              focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2
            `}
          >
            {(checked || indeterminate) && (
              <Icon
                name={indeterminate ? 'Minus' : 'Check'}
                size={iconSizes?.[size]}
                className="text-primary-foreground"
              />
            )}
          </label>
        </div>

        <div className="flex-1 min-w-0">
          {label && (
            <label
              htmlFor={id}
              className={`
                block text-sm font-medium cursor-pointer
                ${disabled ? 'text-muted-foreground' : 'text-foreground'}
                ${error ? 'text-destructive' : ''}
              `}
            >
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </label>
          )}
          
          {description && !error && (
            <div className="text-sm text-muted-foreground mt-1">
              {description}
            </div>
          )}
          
          {error && (
            <div className="text-sm text-destructive flex items-center space-x-1 mt-1">
              <Icon name="AlertCircle" size={12} />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CheckboxGroup = ({ 
  label, 
  description, 
  error, 
  children, 
  className = '',
  required = false 
}) => {
  return (
    <fieldset className={`space-y-3 ${className}`}>
      {label && (
        <legend className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </legend>
      )}
      
      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      
      <div className="space-y-2">
        {children}
      </div>
      
      {error && (
        <p className="text-sm text-destructive flex items-center space-x-1">
          <Icon name="AlertCircle" size={14} />
          <span>{error}</span>
        </p>
      )}
    </fieldset>
  );
};

export { Checkbox, CheckboxGroup };