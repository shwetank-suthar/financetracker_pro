import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { investmentService } from '../../services/supabaseService';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';
import Select from './Select';

const QuickAddInvestment = ({ onInvestmentAdded }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'mutual-fund',
    amount: '',
    quantity: '',
    purchase_price: '',
    purchase_date: new Date().toISOString().split('T')[0],
    broker: '',
    notes: '',
    // SIP-specific fields
    sip_amount: '',
    sip_duration_months: '',
    sip_frequency: 'monthly',
    sip_start_date: new Date().toISOString().split('T')[0],
    custom_duration_months: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const investmentTypes = [
    { value: 'mutual-fund', label: 'Mutual Fund' },
    { value: 'sip', label: 'SIP (Systematic Investment Plan)' }, // Will be stored as 'mutual-fund' type
    { value: 'stock', label: 'Stocks' },
    { value: 'fixed-deposit', label: 'Fixed Deposit (FD)' },
    { value: 'crypto', label: 'Cryptocurrency' },
    { value: 'bonds', label: 'Bonds' },
    { value: 'etf', label: 'Exchange Traded Fund (ETF)' },
    { value: 'other', label: 'Other' }
  ];

  const brokers = [
    { value: 'zerodha', label: 'Zerodha' },
    { value: 'upstox', label: 'Upstox' },
    { value: 'angel-broking', label: 'Angel Broking' },
    { value: 'icici-direct', label: 'ICICI Direct' },
    { value: 'hdfc-securities', label: 'HDFC Securities' },
    { value: 'kotak-securities', label: 'Kotak Securities' },
    { value: 'sbi-securities', label: 'SBI Securities' },
    { value: 'axis-direct', label: 'Axis Direct' },
    { value: 'bank', label: 'Bank' },
    { value: 'post-office', label: 'Post Office' },
    { value: 'other', label: 'Other' }
  ];

  const sipFrequencies = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const sipDurations = [
    { value: '6', label: '6 Months' },
    { value: '12', label: '1 Year' },
    { value: '18', label: '1.5 Years' },
    { value: '24', label: '2 Years' },
    { value: '36', label: '3 Years' },
    { value: '48', label: '4 Years' },
    { value: '60', label: '5 Years' },
    { value: '120', label: '10 Years' },
    { value: '240', label: '20 Years' },
    { value: 'custom', label: 'Custom Duration' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getFormFields = () => {
    const baseFields = [
      {
        type: 'input',
        field: 'name',
        label: 'Investment Name',
        placeholder: 'e.g., HDFC Top 100 Fund, Reliance Industries, SBI FD',
        required: true
      },
      {
        type: 'select',
        field: 'type',
        label: 'Investment Type',
        options: investmentTypes,
        required: true
      }
    ];

    // SIP-specific fields
    if (formData.type === 'sip') {
      baseFields.push(
        {
          type: 'input',
          field: 'sip_amount',
          label: 'SIP Amount (₹)',
          inputType: 'number',
          placeholder: '0.00',
          required: true,
          min: '0',
          step: '0.01'
        },
        {
          type: 'select',
          field: 'sip_frequency',
          label: 'SIP Frequency',
          options: sipFrequencies,
          required: true
        },
        {
          type: 'select',
          field: 'sip_duration_months',
          label: 'SIP Duration',
          options: sipDurations,
          required: true
        },
        {
          type: 'input',
          field: 'sip_start_date',
          label: 'SIP Start Date',
          inputType: 'date',
          required: true
        }
      );

      // Add custom duration field if custom is selected
      if (formData.sip_duration_months === 'custom') {
        baseFields.push({
          type: 'input',
          field: 'custom_duration_months',
          label: 'Custom Duration (Months)',
          inputType: 'number',
          placeholder: 'Enter number of months',
          required: true,
          min: '1',
          step: '1'
        });
      }
    } else {
      // Regular investment amount field
      baseFields.push({
        type: 'input',
        field: 'amount',
        label: 'Investment Amount (₹)',
        inputType: 'number',
        placeholder: '0.00',
        required: true,
        min: '0',
        step: '0.01'
      });
    }

    // Add type-specific fields
    if (['mutual-fund', 'stocks', 'etf', 'crypto'].includes(formData.type)) {
      baseFields.push(
        {
          type: 'input',
          field: 'quantity',
          label: 'Quantity/Units',
          inputType: 'number',
          placeholder: '0',
          required: true,
          min: '0',
          step: '0.01'
        },
        {
          type: 'input',
          field: 'purchase_price',
          label: 'Purchase Price per Unit (₹)',
          inputType: 'number',
          placeholder: '0.00',
          required: true,
          min: '0',
          step: '0.01'
        }
      );
    }

    if (['mutual-fund', 'stocks', 'etf', 'crypto', 'bonds'].includes(formData.type)) {
      baseFields.push({
        type: 'select',
        field: 'broker',
        label: 'Broker/Platform',
        options: brokers,
        required: false
      });
    }

    baseFields.push(
      {
        type: 'input',
        field: 'purchase_date',
        label: 'Purchase Date',
        inputType: 'date',
        required: true
      },
      {
        type: 'input',
        field: 'notes',
        label: 'Notes (Optional)',
        inputType: 'text',
        placeholder: 'Additional details about this investment'
      }
    );

    return baseFields;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('You must be logged in to add investments');
      }

      if (formData.type === 'sip') {
        // Handle SIP creation
        await createSIPInvestment();
      } else {
        // Handle regular investment
        await createRegularInvestment();
      }
      
      // Reset form
      setFormData({
        name: '',
        type: 'mutual-fund',
        amount: '',
        quantity: '',
        purchase_price: '',
        purchase_date: new Date().toISOString().split('T')[0],
        broker: '',
        notes: '',
        sip_amount: '',
        sip_duration_months: '',
        sip_frequency: 'monthly',
        sip_start_date: new Date().toISOString().split('T')[0],
        custom_duration_months: ''
      });
      
      setIsOpen(false);
      
      // Notify parent component if callback provided
      if (onInvestmentAdded) {
        onInvestmentAdded();
      }
    } catch (error) {
      console.error('Error adding investment:', error);
      setError(error.message || 'Failed to add investment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const createRegularInvestment = async () => {
    const investmentData = {
      name: formData.name,
      type: formData.type,
      amount: parseFloat(formData.amount), // This will be mapped to invested_amount
      quantity: formData.quantity ? parseFloat(formData.quantity) : null,
      purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
      purchase_date: formData.purchase_date,
      broker: formData.broker || null,
      notes: formData.notes || null,
      current_value: parseFloat(formData.amount), // Initially same as invested amount
      current_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null
    };

    const newInvestment = await investmentService.createInvestment(investmentData);
    console.log('Regular investment added:', newInvestment);
  };

  const createSIPInvestment = async () => {
    const sipAmount = parseFloat(formData.sip_amount);
    const durationMonths = formData.sip_duration_months === 'custom' 
      ? parseInt(formData.custom_duration_months)
      : parseInt(formData.sip_duration_months);
    const startDate = new Date(formData.sip_start_date);
    
    // Create SIP investment record
    const sipData = {
      name: formData.name,
      type: 'mutual-fund', // Use mutual-fund type until sip is added to enum
      amount: sipAmount * durationMonths, // Total expected amount (mapped to invested_amount)
      sip_amount: sipAmount,
      sip_frequency: formData.sip_frequency,
      sip_duration_months: durationMonths,
      sip_start_date: formData.sip_start_date,
      broker: formData.broker || null,
      notes: formData.notes || null,
      current_value: 0, // Will be updated as SIPs are made
      current_price: null
    };

    const sipInvestment = await investmentService.createInvestment(sipData);
    console.log('SIP investment created:', sipInvestment);

    // Create automatic monthly SIP entries
    await createSIPEntries(sipInvestment.id, sipAmount, durationMonths, startDate, formData.sip_frequency);
  };

  const createSIPEntries = async (sipId, amount, durationMonths, startDate, frequency) => {
    const sipEntries = [];
    const currentDate = new Date();
    
    // Calculate how many SIPs have already passed
    const monthsPassed = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24 * 30));
    const sipsToCreate = Math.min(monthsPassed + 1, durationMonths); // +1 for current month
    
    for (let i = 0; i < sipsToCreate; i++) {
      const sipDate = new Date(startDate);
      
      if (frequency === 'monthly') {
        sipDate.setMonth(sipDate.getMonth() + i);
      } else if (frequency === 'quarterly') {
        sipDate.setMonth(sipDate.getMonth() + (i * 3));
      } else if (frequency === 'yearly') {
        sipDate.setFullYear(sipDate.getFullYear() + i);
      }
      
      // Only create SIPs for dates that have passed or are today
      if (sipDate <= currentDate) {
        sipEntries.push({
          sip_id: sipId,
          amount: amount,
          date: sipDate.toISOString().split('T')[0],
          status: 'completed',
          notes: `SIP installment ${i + 1} of ${durationMonths}`
        });
      }
    }
    
    // Create all SIP entries
    if (sipEntries.length > 0) {
      await investmentService.createSIPEntries(sipEntries);
      console.log(`Created ${sipEntries.length} SIP entries`);
    }
  };

  const isFormValid = () => {
    if (!formData?.name || !formData?.type) return false;
    
    if (formData.type === 'sip') {
      const hasDuration = formData?.sip_duration_months && 
        (formData.sip_duration_months !== 'custom' || formData?.custom_duration_months);
      return formData?.sip_amount && hasDuration && formData?.sip_frequency && formData?.sip_start_date;
    } else {
      return formData?.amount;
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'input':
        return (
          <Input
            key={field.field}
            label={field.label}
            type={field.inputType || 'text'}
            placeholder={field.placeholder}
            value={formData[field.field]}
            onChange={(e) => handleInputChange(field.field, e?.target?.value)}
            required={field.required}
            min={field.min}
            step={field.step}
          />
        );
      case 'select':
        return (
          <Select
            key={field.field}
            label={field.label}
            placeholder={`Select ${field.label.toLowerCase()}`}
            options={field.options}
            value={formData[field.field]}
            onChange={(value) => handleInputChange(field.field, value)}
            required={field.required}
            id={field.field}
            name={field.field}
            description=""
            error=""
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Button
        variant="default"
        size="sm"
        onClick={() => setIsOpen(true)}
        iconName="TrendingUp"
        iconPosition="left"
        className="hidden sm:flex"
      >
        Add Investment
      </Button>
      {/* Mobile FAB */}
      <button
        onClick={() => setIsOpen(true)}
        className="sm:hidden fixed bottom-20 right-6 w-14 h-14 bg-secondary text-secondary-foreground rounded-full shadow-elevated flex items-center justify-center z-40 hover:bg-secondary/90 transition-smooth"
        aria-label="Add investment"
      >
        <Icon name="TrendingUp" size={24} />
      </button>
      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-elevated w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-card-foreground">
                Add New Investment
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
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={16} className="text-red-600" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {getFormFields().map(renderField)}

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
                  disabled={!isFormValid()}
                  fullWidth
                >
                  {formData.type === 'sip' ? 'Create SIP Plan' : 'Add Investment'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickAddInvestment;
