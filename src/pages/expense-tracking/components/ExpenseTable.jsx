import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExpenseTable = ({ expenses, onEditExpense, onDeleteExpense, onBulkAction }) => {
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const getCategoryIcon = (category) => {
    const icons = {
      food: 'Utensils',
      transportation: 'Car',
      shopping: 'ShoppingBag',
      entertainment: 'Music',
      bills: 'Receipt',
      healthcare: 'Heart',
      education: 'BookOpen',
      groceries: 'ShoppingCart',
      travel: 'Plane',
      other: 'MoreHorizontal'
    };
    return icons?.[category] || 'MoreHorizontal';
  };

  const getCategoryColor = (category) => {
    const colors = {
      food: 'text-orange-600',
      transportation: 'text-blue-600',
      shopping: 'text-purple-600',
      entertainment: 'text-pink-600',
      bills: 'text-red-600',
      healthcare: 'text-green-600',
      education: 'text-indigo-600',
      groceries: 'text-yellow-600',
      travel: 'text-cyan-600',
      other: 'text-gray-600'
    };
    return colors?.[category] || 'text-gray-600';
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedExpenses = [...expenses]?.sort((a, b) => {
    if (sortConfig?.key === 'amount') {
      return sortConfig?.direction === 'asc' ? a?.amount - b?.amount : b?.amount - a?.amount;
    }
    if (sortConfig?.key === 'date') {
      return sortConfig?.direction === 'asc' 
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }
    const aValue = a?.[sortConfig?.key]?.toString()?.toLowerCase() || '';
    const bValue = b?.[sortConfig?.key]?.toString()?.toLowerCase() || '';
    return sortConfig?.direction === 'asc' 
      ? aValue?.localeCompare(bValue)
      : bValue?.localeCompare(aValue);
  });

  const handleSelectExpense = (expenseId) => {
    setSelectedExpenses(prev => 
      prev?.includes(expenseId)
        ? prev?.filter(id => id !== expenseId)
        : [...prev, expenseId]
    );
  };

  const handleSelectAll = () => {
    setSelectedExpenses(
      selectedExpenses?.length === expenses?.length ? [] : expenses?.map(e => e?.id)
    );
  };

  const handleBulkDelete = () => {
    onBulkAction('delete', selectedExpenses);
    setSelectedExpenses([]);
  };

  const SortButton = ({ column, children }) => (
    <button
      onClick={() => handleSort(column)}
      className="flex items-center space-x-1 text-left font-medium text-muted-foreground hover:text-foreground transition-smooth"
    >
      <span>{children}</span>
      <Icon 
        name={sortConfig?.key === column && sortConfig?.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
        size={14}
        className={sortConfig?.key === column ? 'text-primary' : 'text-muted-foreground'}
      />
    </button>
  );

  if (expenses?.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center shadow-subtle">
        <Icon name="Receipt" size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-card-foreground mb-2">No expenses found</h3>
        <p className="text-muted-foreground">Start by adding your first expense above.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-subtle overflow-hidden">
      {selectedExpenses?.length > 0 && (
        <div className="bg-primary/10 border-b border-border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary">
              {selectedExpenses?.length} expense(s) selected
            </span>
            <div className="flex space-x-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                iconName="Trash2"
                iconPosition="left"
              >
                Delete Selected
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedExpenses([])}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="p-4 text-left">
                <Checkbox
                  checked={selectedExpenses?.length === expenses?.length}
                  onChange={handleSelectAll}
                  label=""
                  description=""
                  error=""
                  id="select-all-expenses"
                  name="selectAll"
                  value="selectAll"
                />
              </th>
              <th className="p-4 text-left">
                <SortButton column="date">Date</SortButton>
              </th>
              <th className="p-4 text-left">
                <SortButton column="description">Description</SortButton>
              </th>
              <th className="p-4 text-left">
                <SortButton column="category">Category</SortButton>
              </th>
              <th className="p-4 text-left">
                <SortButton column="amount">Amount</SortButton>
              </th>
              <th className="p-4 text-left">Tags</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedExpenses?.map((expense) => (
              <tr key={expense?.id} className="border-b border-border hover:bg-muted/30 transition-smooth">
                <td className="p-4">
                  <Checkbox
                    checked={selectedExpenses?.includes(expense?.id)}
                    onChange={() => handleSelectExpense(expense?.id)}
                    label=""
                    description=""
                    error=""
                    id={`expense-${expense?.id}`}
                    name={`expense-${expense?.id}`}
                    value={expense?.id}
                  />
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {formatDate(expense?.date)}
                </td>
                <td className="p-4">
                  <div className="font-medium text-card-foreground">{expense?.description}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getCategoryIcon(expense?.category)} 
                      size={16} 
                      className={getCategoryColor(expense?.category)}
                    />
                    <span className="text-sm capitalize">{expense?.category}</span>
                  </div>
                </td>
                <td className="p-4 font-medium text-card-foreground">
                  {formatAmount(expense?.amount)}
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {expense?.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary/20 text-secondary text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditExpense(expense)}
                      iconName="Edit2"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteExpense(expense?.id)}
                      iconName="Trash2"
                      className="text-destructive hover:text-destructive"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-4">
        {sortedExpenses?.map((expense) => (
          <div key={expense?.id} className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedExpenses?.includes(expense?.id)}
                  onChange={() => handleSelectExpense(expense?.id)}
                  label=""
                  description=""
                  error=""
                  id={`mobile-expense-${expense?.id}`}
                  name={`mobile-expense-${expense?.id}`}
                  value={expense?.id}
                />
                <Icon 
                  name={getCategoryIcon(expense?.category)} 
                  size={16} 
                  className={getCategoryColor(expense?.category)}
                />
                <span className="text-sm text-muted-foreground capitalize">{expense?.category}</span>
              </div>
              <span className="text-xs text-muted-foreground">{formatDate(expense?.date)}</span>
            </div>
            
            <div>
              <h4 className="font-medium text-card-foreground">{expense?.description}</h4>
              <p className="text-lg font-semibold text-primary">{formatAmount(expense?.amount)}</p>
            </div>
            
            {expense?.tags && expense?.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {expense?.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-secondary/20 text-secondary text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditExpense(expense)}
                iconName="Edit2"
                iconPosition="left"
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteExpense(expense?.id)}
                iconName="Trash2"
                iconPosition="left"
                className="text-destructive hover:text-destructive"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseTable;