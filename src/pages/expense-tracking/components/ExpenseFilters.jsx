import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ExpenseFilters = ({ onFiltersChange, totalExpenses }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
    tags: ''
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'bills', label: 'Bills & Utilities' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'groceries', label: 'Groceries' },
    { value: 'travel', label: 'Travel' },
    { value: 'other', label: 'Other' }
  ];

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: '',
      tags: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Filter Expenses</h3>
          <span className="text-sm text-muted-foreground">({totalExpenses} total)</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            iconName="X"
            iconPosition="left"
          >
            Clear All
          </Button>
        )}
      </div>
      <div className="space-y-4">
        <Input
          label="Search"
          type="search"
          placeholder="Search by description..."
          value={filters?.search}
          onChange={(e) => handleFilterChange('search', e?.target?.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            label="Category"
            options={categories}
            value={filters?.category}
            onChange={(value) => handleFilterChange('category', value)}
            description=""
            error=""
            id="category-filter"
            name="category"
          />

          <Input
            label="From Date"
            type="date"
            value={filters?.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
          />

          <Input
            label="To Date"
            type="date"
            value={filters?.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Min Amount"
            type="number"
            placeholder="0.00"
            value={filters?.minAmount}
            onChange={(e) => handleFilterChange('minAmount', e?.target?.value)}
            min="0"
            step="0.01"
          />

          <Input
            label="Max Amount"
            type="number"
            placeholder="1000.00"
            value={filters?.maxAmount}
            onChange={(e) => handleFilterChange('maxAmount', e?.target?.value)}
            min="0"
            step="0.01"
          />

          <Input
            label="Tags"
            type="text"
            placeholder="Filter by tags..."
            value={filters?.tags}
            onChange={(e) => handleFilterChange('tags', e?.target?.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseFilters;