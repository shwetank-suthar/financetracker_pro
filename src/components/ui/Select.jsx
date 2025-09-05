import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const Select = ({
  label,
  description,
  error,
  placeholder = 'Select an option',
  options = [],
  value,
  onChange,
  disabled = false,
  required = false,
  loading = false,
  multiple = false,
  searchable = false,
  clearable = false,
  id,
  name,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);

  const filteredOptions = searchable && searchTerm
    ? options?.filter(option =>
        option?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef?.current && !selectRef?.current?.contains(event?.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef?.current) {
      searchInputRef?.current?.focus();
    }
  }, [isOpen, searchable]);

  const handleToggle = () => {
    if (!disabled && !loading) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (optionValue) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues?.includes(optionValue)
        ? currentValues?.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e?.stopPropagation();
    onChange(multiple ? [] : '');
  };

  const getDisplayValue = () => {
    if (multiple) {
      const selectedOptions = options?.filter(option => 
        Array.isArray(value) && value?.includes(option?.value)
      );
      if (selectedOptions?.length === 0) return placeholder;
      if (selectedOptions?.length === 1) return selectedOptions?.[0]?.label;
      return `${selectedOptions?.length} selected`;
    } else {
      const selectedOption = options?.find(option => option?.value === value);
      return selectedOption ? selectedOption?.label : placeholder;
    }
  };

  const hasValue = multiple 
    ? Array.isArray(value) && value?.length > 0
    : value !== '' && value !== null && value !== undefined;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <div className="relative" ref={selectRef}>
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled || loading}
          className={`
            relative w-full flex items-center justify-between px-3 py-2 text-left
            bg-input border border-border rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring
            disabled:cursor-not-allowed disabled:opacity-50
            ${error ? 'border-destructive focus:ring-destructive focus:border-destructive' : ''}
            ${isOpen ? 'ring-2 ring-ring border-ring' : ''}
          `}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          id={id}
          name={name}
        >
          <span className={`block truncate ${!hasValue ? 'text-muted-foreground' : 'text-foreground'}`}>
            {loading ? 'Loading...' : getDisplayValue()}
          </span>
          
          <div className="flex items-center space-x-1">
            {clearable && hasValue && !disabled && !loading && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-muted rounded"
                aria-label="Clear selection"
              >
                <Icon name="X" size={14} />
              </button>
            )}
            
            {loading ? (
              <Icon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            )}
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-hidden">
            {searchable && (
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search options..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e?.target?.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-input border border-border rounded focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
            )}
            
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions?.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {searchTerm ? 'No options found' : 'No options available'}
                </div>
              ) : (
                filteredOptions?.map((option) => {
                  const isSelected = multiple
                    ? Array.isArray(value) && value?.includes(option?.value)
                    : value === option?.value;
                  
                  return (
                    <button
                      key={option?.value}
                      type="button"
                      onClick={() => handleOptionClick(option?.value)}
                      disabled={option?.disabled}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 text-left text-sm
                        hover:bg-muted focus:bg-muted focus:outline-none
                        disabled:cursor-not-allowed disabled:opacity-50
                        ${isSelected ? 'bg-primary/10 text-primary' : 'text-popover-foreground'}
                      `}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{option?.label}</div>
                        {option?.description && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {option?.description}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <Icon name="Check" size={16} className="text-primary" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-sm text-destructive flex items-center space-x-1">
          <Icon name="AlertCircle" size={14} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default Select;