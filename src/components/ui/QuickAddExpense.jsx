import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';
import Select from './Select';

const QuickAddExpense = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date()?.toISOString()?.split('T')?.[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'food', label: 'Food & Dining' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'bills', label: 'Bills & Utilities' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Expense added:', formData);
      
      // Reset form
      setFormData({
        amount: '',
        category: '',
        description: '',
        date: new Date()?.toISOString()?.split('T')?.[0]
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData?.amount && formData?.category;

  return (
    <>
      <Button
        variant="default"
        size="sm"
        onClick={() => setIsOpen(true)}
        iconName="Plus"
        iconPosition="left"
        className="hidden sm:flex"
      >
        Add Expense
      </Button>
      {/* Mobile FAB */}
      <button
        onClick={() => setIsOpen(true)}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-elevated flex items-center justify-center z-40 hover:bg-primary/90 transition-smooth"
        aria-label="Add expense"
      >
        <Icon name="Plus" size={24} />
      </button>
      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-elevated w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-card-foreground">
                Add New Expense
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted rounded-lg transition-smooth"
                aria-label="Close"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input
                label="Amount"
                type="number"
                placeholder="0.00"
                value={formData?.amount}
                onChange={(e) => handleInputChange('amount', e?.target?.value)}
                required
                min="0"
                step="0.01"
              />

              <Select
                label="Category"
                placeholder="Select category"
                options={categories}
                value={formData?.category}
                onChange={(value) => handleInputChange('category', value)}
                required
                id="category"
                name="category"
                description=""
                error=""
              />

              <Input
                label="Description"
                type="text"
                placeholder="What did you spend on?"
                value={formData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
              />

              <Input
                label="Date"
                type="date"
                value={formData?.date}
                onChange={(e) => handleInputChange('date', e?.target?.value)}
                required
              />

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  loading={isSubmitting}
                  disabled={!isFormValid}
                  fullWidth
                >
                  Add Expense
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickAddExpense;