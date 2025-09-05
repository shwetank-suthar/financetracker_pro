import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { expenseService } from '../../../services/supabaseService';

const ExpenseForm = ({ onAddExpense }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date()?.toISOString()?.split('T')?.[0],
    tags: '',
    paymentMethod: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState('');

  const categories = [
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

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'credit-card', label: 'Credit Card' },
    { value: 'debit-card', label: 'Debit Card' },
    { value: 'upi', label: 'UPI' },
    { value: 'net-banking', label: 'Net Banking' },
    { value: 'wallet', label: 'Digital Wallet' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // AI-powered category suggestion based on description
    if (field === 'description' && value?.length > 3) {
      const description = value?.toLowerCase();
      let suggested = '';
      
      if (description?.includes('restaurant') || description?.includes('food') || description?.includes('lunch') || description?.includes('dinner')) {
        suggested = 'food';
      } else if (description?.includes('gas') || description?.includes('uber') || description?.includes('taxi') || description?.includes('bus')) {
        suggested = 'transportation';
      } else if (description?.includes('grocery') || description?.includes('supermarket') || description?.includes('walmart')) {
        suggested = 'groceries';
      } else if (description?.includes('movie') || description?.includes('concert') || description?.includes('game')) {
        suggested = 'entertainment';
      } else if (description?.includes('electric') || description?.includes('water') || description?.includes('internet') || description?.includes('phone')) {
        suggested = 'bills';
      }
      
      setSuggestedCategory(suggested);
    }
  };

  const applySuggestedCategory = () => {
    if (suggestedCategory) {
      setFormData(prev => ({ ...prev, category: suggestedCategory }));
      setSuggestedCategory('');
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);

    try {
      const newExpense = {
        amount: parseFloat(formData?.amount),
        category: formData?.category,
        description: formData?.description,
        date: formData?.date,
        tags: formData?.tags?.split(',')?.map(tag => tag?.trim())?.filter(tag => tag),
        payment_method: formData?.paymentMethod
      };

      const createdExpense = await expenseService.createExpense(newExpense);
      onAddExpense(createdExpense);

      // Reset form
      setFormData({
        amount: '',
        category: '',
        description: '',
        date: new Date()?.toISOString()?.split('T')?.[0],
        tags: '',
        paymentMethod: ''
      });
      setSuggestedCategory('');
    } catch (error) {
      console.error('Error adding expense:', error);
      // You could add error handling UI here
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData?.amount && formData?.category && formData?.description && formData?.paymentMethod;

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Plus" size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-card-foreground">Add New Expense</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <Input
            label="Date"
            type="date"
            value={formData?.date}
            onChange={(e) => handleInputChange('date', e?.target?.value)}
            required
          />
        </div>

        <Input
          label="Description"
          type="text"
          placeholder="What did you spend on?"
          value={formData?.description}
          onChange={(e) => handleInputChange('description', e?.target?.value)}
          required
        />

        {suggestedCategory && (
          <div className="flex items-center space-x-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <Icon name="Lightbulb" size={16} className="text-primary" />
            <span className="text-sm text-primary">
              AI suggests category: <strong>{categories?.find(c => c?.value === suggestedCategory)?.label}</strong>
            </span>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={applySuggestedCategory}
            >
              Apply
            </Button>
          </div>
        )}

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

        <Select
          label="Payment Method"
          placeholder="How did you pay?"
          options={paymentMethods}
          value={formData?.paymentMethod}
          onChange={(value) => handleInputChange('paymentMethod', value)}
          required
          id="paymentMethod"
          name="paymentMethod"
          description="Select the payment method used for this expense"
          error=""
        />

        <Input
          label="Tags"
          type="text"
          placeholder="Enter tags separated by commas (optional)"
          value={formData?.tags}
          onChange={(e) => handleInputChange('tags', e?.target?.value)}
          description="Use tags for better organization (e.g., work, personal, urgent)"
        />

        <Button
          type="submit"
          variant="default"
          loading={isSubmitting}
          disabled={!isFormValid}
          iconName="Plus"
          iconPosition="left"
          className="w-full md:w-auto"
        >
          Add Expense
        </Button>
      </form>
    </div>
  );
};

export default ExpenseForm;