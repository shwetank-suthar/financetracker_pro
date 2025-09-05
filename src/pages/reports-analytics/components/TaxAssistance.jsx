import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';

const TaxAssistance = () => {
  const [taxYear, setTaxYear] = useState('2024');
  const [filingStatus, setFilingStatus] = useState('single');
  const [isCalculating, setIsCalculating] = useState(false);

  const taxYearOptions = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' }
  ];

  const filingStatusOptions = [
    { value: 'single', label: 'Single' },
    { value: 'married_joint', label: 'Married Filing Jointly' },
    { value: 'married_separate', label: 'Married Filing Separately' },
    { value: 'head_household', label: 'Head of Household' }
  ];

  const taxSummary = {
    totalIncome: 85000,
    taxableIncome: 72000,
    federalTax: 12480,
    stateTax: 3600,
    effectiveRate: 18.9,
    marginalRate: 22,
    refundEstimate: 1250
  };

  const deductions = [
    { category: 'Charitable Donations', amount: 2400, eligible: true },
    { category: 'Medical Expenses', amount: 1800, eligible: true },
    { category: 'State & Local Taxes', amount: 10000, eligible: true, note: 'SALT cap applies' },
    { category: 'Mortgage Interest', amount: 8500, eligible: true },
    { category: 'Business Expenses', amount: 3200, eligible: true },
    { category: 'Education Expenses', amount: 1500, eligible: false, note: 'Exceeds limit' }
  ];

  const taxDocuments = [
    { name: 'W-2 Forms', status: 'ready', count: 1 },
    { name: '1099-INT (Interest)', status: 'ready', count: 2 },
    { name: '1099-DIV (Dividends)', status: 'ready', count: 3 },
    { name: '1099-B (Brokerage)', status: 'pending', count: 1 },
    { name: 'Charitable Receipts', status: 'ready', count: 8 },
    { name: 'Medical Receipts', status: 'incomplete', count: 12 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready':
        return 'text-success';
      case 'pending':
        return 'text-warning';
      case 'incomplete':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready':
        return 'CheckCircle';
      case 'pending':
        return 'Clock';
      case 'incomplete':
        return 'AlertCircle';
      default:
        return 'Circle';
    }
  };

  const handleCalculateTax = async () => {
    setIsCalculating(true);
    try {
      // Simulate tax calculation
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Tax calculation completed');
    } catch (error) {
      console.error('Error calculating tax:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name="Calculator" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Tax Assistance</h3>
            <p className="text-sm text-muted-foreground">Preliminary tax calculations and document preparation</p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-8">
        {/* Tax Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Tax Year"
            options={taxYearOptions}
            value={taxYear}
            onChange={setTaxYear}
            id="tax-year"
            name="tax-year"
            description="Select the tax year for calculations"
            error=""
          />
          <Select
            label="Filing Status"
            options={filingStatusOptions}
            value={filingStatus}
            onChange={setFilingStatus}
            id="filing-status"
            name="filing-status"
            description="Select your filing status"
            error=""
          />
          <div className="flex items-end">
            <Button
              variant="default"
              onClick={handleCalculateTax}
              loading={isCalculating}
              iconName="Calculator"
              iconPosition="left"
              fullWidth
            >
              Calculate Tax
            </Button>
          </div>
        </div>

        {/* Tax Summary */}
        <div>
          <h4 className="text-md font-semibold text-foreground mb-4">Tax Summary ({taxYear})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Icon name="DollarSign" size={24} className="mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold text-foreground">${taxSummary?.totalIncome?.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Income</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Icon name="Receipt" size={24} className="mx-auto text-warning mb-2" />
              <div className="text-2xl font-bold text-foreground">${taxSummary?.federalTax?.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Federal Tax</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Icon name="Percent" size={24} className="mx-auto text-secondary mb-2" />
              <div className="text-2xl font-bold text-foreground">{taxSummary?.effectiveRate}%</div>
              <div className="text-sm text-muted-foreground">Effective Rate</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Icon name="RefreshCw" size={24} className="mx-auto text-success mb-2" />
              <div className="text-2xl font-bold text-success">${taxSummary?.refundEstimate?.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Est. Refund</div>
            </div>
          </div>
        </div>

        {/* Deductions */}
        <div>
          <h4 className="text-md font-semibold text-foreground mb-4">Deductions & Credits</h4>
          <div className="bg-muted/50 rounded-lg p-6">
            <div className="space-y-4">
              {deductions?.map((deduction, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={deduction?.eligible ? 'CheckCircle' : 'XCircle'} 
                      size={16} 
                      className={deduction?.eligible ? 'text-success' : 'text-destructive'} 
                    />
                    <div>
                      <span className="text-sm font-medium text-foreground">{deduction?.category}</span>
                      {deduction?.note && (
                        <div className="text-xs text-muted-foreground">{deduction?.note}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-foreground">${deduction?.amount?.toLocaleString()}</div>
                    <div className={`text-xs ${deduction?.eligible ? 'text-success' : 'text-destructive'}`}>
                      {deduction?.eligible ? 'Eligible' : 'Not Eligible'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-md font-semibold text-foreground">Total Eligible Deductions</span>
                <span className="text-lg font-bold text-success">
                  ${deductions?.filter(d => d?.eligible)?.reduce((sum, d) => sum + d?.amount, 0)?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Document Checklist */}
        <div>
          <h4 className="text-md font-semibold text-foreground mb-4">Document Checklist</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taxDocuments?.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={getStatusIcon(doc?.status)} 
                    size={20} 
                    className={getStatusColor(doc?.status)} 
                  />
                  <div>
                    <div className="text-sm font-medium text-foreground">{doc?.name}</div>
                    <div className="text-xs text-muted-foreground">{doc?.count} document(s)</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-medium capitalize ${getStatusColor(doc?.status)}`}>
                    {doc?.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <Button variant="default" iconName="Download" iconPosition="left">
            Export Tax Summary
          </Button>
          <Button variant="outline" iconName="FileText" iconPosition="left">
            Generate Tax Report
          </Button>
          <Button variant="outline" iconName="Calendar" iconPosition="left">
            Schedule Tax Consultation
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
            <div>
              <h5 className="text-sm font-semibold text-warning mb-1">Important Disclaimer</h5>
              <p className="text-sm text-muted-foreground">
                These calculations are preliminary estimates based on your financial data. 
                Please consult with a qualified tax professional for accurate tax preparation and filing. 
                Tax laws are complex and subject to change.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxAssistance;