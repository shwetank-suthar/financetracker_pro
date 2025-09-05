import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';


const AdvancedFilters = ({ onApplyFilters, onResetFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: 'last_month',
    startDate: '',
    endDate: '',
    categories: [],
    accounts: [],
    amountMin: '',
    amountMax: '',
    transactionTypes: [],
    tags: [],
    merchants: []
  });

  const [savedFilters, setSavedFilters] = useState([
    { id: 1, name: 'Monthly Dining Review', filters: { categories: ['food'], dateRange: 'last_month' } },
    { id: 2, name: 'Investment Analysis', filters: { categories: ['investments'], dateRange: 'last_quarter' } },
    { id: 3, name: 'High Value Transactions', filters: { amountMin: '500', dateRange: 'last_year' } }
  ]);

  const dateRangeOptions = [
    { value: 'last_week', label: 'Last Week' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'last_quarter', label: 'Last Quarter' },
    { value: 'last_year', label: 'Last Year' },
    { value: 'year_to_date', label: 'Year to Date' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const categoryOptions = [
    { value: 'food', label: 'Food & Dining' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'bills', label: 'Bills & Utilities' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'investments', label: 'Investments' },
    { value: 'income', label: 'Income' },
    { value: 'other', label: 'Other' }
  ];

  const accountOptions = [
    { value: 'checking', label: 'Checking Account' },
    { value: 'savings', label: 'Savings Account' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'investment', label: 'Investment Account' },
    { value: 'cash', label: 'Cash' }
  ];

  const transactionTypeOptions = [
    { value: 'expense', label: 'Expenses' },
    { value: 'income', label: 'Income' },
    { value: 'transfer', label: 'Transfers' },
    { value: 'investment', label: 'Investments' }
  ];

  const tagOptions = [
    { value: 'business', label: 'Business' },
    { value: 'personal', label: 'Personal' },
    { value: 'recurring', label: 'Recurring' },
    { value: 'one_time', label: 'One-time' },
    { value: 'tax_deductible', label: 'Tax Deductible' }
  ];

  const merchantOptions = [
    { value: 'amazon', label: 'Amazon' },
    { value: 'starbucks', label: 'Starbucks' },
    { value: 'uber', label: 'Uber' },
    { value: 'netflix', label: 'Netflix' },
    { value: 'grocery_store', label: 'Grocery Stores' }
  ];

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    setIsExpanded(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      dateRange: 'last_month',
      startDate: '',
      endDate: '',
      categories: [],
      accounts: [],
      amountMin: '',
      amountMax: '',
      transactionTypes: [],
      tags: [],
      merchants: []
    };
    setFilters(resetFilters);
    onResetFilters();
  };

  const handleSaveFilter = () => {
    const filterName = prompt('Enter a name for this filter preset:');
    if (filterName) {
      const newFilter = {
        id: Date.now(),
        name: filterName,
        filters: { ...filters }
      };
      setSavedFilters(prev => [...prev, newFilter]);
    }
  };

  const handleLoadFilter = (savedFilter) => {
    setFilters(savedFilter?.filters);
    onApplyFilters(savedFilter?.filters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters?.categories?.length > 0) count++;
    if (filters?.accounts?.length > 0) count++;
    if (filters?.amountMin || filters?.amountMax) count++;
    if (filters?.transactionTypes?.length > 0) count++;
    if (filters?.tags?.length > 0) count++;
    if (filters?.merchants?.length > 0) count++;
    if (filters?.dateRange !== 'last_month') count++;
    return count;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="Filter" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-md font-semibold text-foreground">Advanced Filters</h3>
              {getActiveFilterCount() > 0 && (
                <p className="text-sm text-muted-foreground">
                  {getActiveFilterCount()} filter(s) active
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getActiveFilterCount() > 0 && (
              <Button variant="ghost" size="sm" onClick={handleResetFilters}>
                Clear All
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
              iconPosition="right"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              id="dateRange"
              name="dateRange"
              label="Date Range"
              description=""
              error=""
              options={dateRangeOptions}
              value={filters?.dateRange}
              onChange={(value) => handleFilterChange('dateRange', value)}
            />
            {filters?.dateRange === 'custom' && (
              <>
                <Input
                  label="Start Date"
                  type="date"
                  value={filters?.startDate}
                  onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={filters?.endDate}
                  onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
                />
              </>
            )}
          </div>

          {/* Categories and Accounts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              id="categories"
              name="categories"
              label="Categories"
              description=""
              error=""
              options={categoryOptions}
              value={filters?.categories}
              onChange={(value) => handleFilterChange('categories', value)}
              multiple
              searchable
              placeholder="Select categories"
            />
            <Select
              id="accounts"
              name="accounts"
              label="Accounts"
              description=""
              error=""
              options={accountOptions}
              value={filters?.accounts}
              onChange={(value) => handleFilterChange('accounts', value)}
              multiple
              placeholder="Select accounts"
            />
          </div>

          {/* Amount Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Minimum Amount"
              type="number"
              placeholder="0.00"
              value={filters?.amountMin}
              onChange={(e) => handleFilterChange('amountMin', e?.target?.value)}
              min="0"
              step="0.01"
            />
            <Input
              label="Maximum Amount"
              type="number"
              placeholder="No limit"
              value={filters?.amountMax}
              onChange={(e) => handleFilterChange('amountMax', e?.target?.value)}
              min="0"
              step="0.01"
            />
          </div>

          {/* Transaction Types and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              id="transactionTypes"
              name="transactionTypes"
              label="Transaction Types"
              description=""
              error=""
              options={transactionTypeOptions}
              value={filters?.transactionTypes}
              onChange={(value) => handleFilterChange('transactionTypes', value)}
              multiple
              placeholder="Select transaction types"
            />
            <Select
              id="tags"
              name="tags"
              label="Tags"
              description=""
              error=""
              options={tagOptions}
              value={filters?.tags}
              onChange={(value) => handleFilterChange('tags', value)}
              multiple
              searchable
              placeholder="Select tags"
            />
          </div>

          {/* Merchants */}
          <div className="grid grid-cols-1 gap-4">
            <Select
              id="merchants"
              name="merchants"
              label="Merchants"
              description=""
              error=""
              options={merchantOptions}
              value={filters?.merchants}
              onChange={(value) => handleFilterChange('merchants', value)}
              multiple
              searchable
              placeholder="Select merchants"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-border">
            <Button
              variant="default"
              onClick={handleApplyFilters}
              iconName="Search"
              iconPosition="left"
            >
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveFilter}
              iconName="Save"
              iconPosition="left"
            >
              Save Preset
            </Button>
            <Button
              variant="ghost"
              onClick={handleResetFilters}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Reset All
            </Button>
          </div>

          {/* Saved Filter Presets */}
          {savedFilters?.length > 0 && (
            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-3">Saved Filter Presets</h4>
              <div className="flex flex-wrap gap-2">
                {savedFilters?.map((savedFilter) => (
                  <button
                    key={savedFilter?.id}
                    onClick={() => handleLoadFilter(savedFilter)}
                    className="flex items-center space-x-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium text-foreground transition-smooth"
                  >
                    <Icon name="Filter" size={14} />
                    <span>{savedFilter?.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;