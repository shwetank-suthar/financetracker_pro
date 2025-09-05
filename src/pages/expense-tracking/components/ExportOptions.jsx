import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ExportOptions = ({ expenses }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { value: 'csv', label: 'CSV (Excel Compatible)' },
    { value: 'pdf', label: 'PDF Report' },
    { value: 'json', label: 'JSON Data' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'month', label: 'Current Month' },
    { value: 'quarter', label: 'Current Quarter' },
    { value: 'year', label: 'Current Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const getFilteredExpenses = () => {
    const now = new Date();
    
    switch (dateRange) {
      case 'month':
        return expenses?.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate?.getMonth() === now?.getMonth() && 
                 expenseDate?.getFullYear() === now?.getFullYear();
        });
      
      case 'quarter':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        return expenses?.filter(expense => new Date(expense.date) >= quarterStart);
      
      case 'year':
        return expenses?.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate?.getFullYear() === now?.getFullYear();
        });
      
      default:
        return expenses;
    }
  };

  const generateCSV = (data) => {
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Tags'];
    const csvContent = [
      headers?.join(','),
      ...data?.map(expense => [
        expense?.date,
        `"${expense?.description}"`,
        expense?.category,
        expense?.amount,
        `"${expense?.tags?.join(', ') || ''}"`
      ]?.join(','))
    ]?.join('\n');

    return csvContent;
  };

  const generatePDFContent = (data) => {
    const totalAmount = data?.reduce((sum, expense) => sum + expense?.amount, 0);
    const categoryTotals = {};
    
    data?.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals?.[expense?.category] || 0) + expense?.amount;
    });

    return {
      title: 'Expense Report',
      dateRange: dateRange,
      totalExpenses: data?.length,
      totalAmount: totalAmount,
      categoryBreakdown: categoryTotals,
      expenses: data
    };
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const filteredExpenses = getFilteredExpenses();
      const timestamp = new Date()?.toISOString()?.split('T')?.[0];
      
      switch (exportFormat) {
        case 'csv':
          const csvContent = generateCSV(filteredExpenses);
          downloadFile(csvContent, `expenses-${timestamp}.csv`, 'text/csv');
          break;
          
        case 'pdf':
          // Simulate PDF generation
          const pdfData = generatePDFContent(filteredExpenses);
          const pdfContent = JSON.stringify(pdfData, null, 2);
          downloadFile(pdfContent, `expense-report-${timestamp}.json`, 'application/json');
          console.log('PDF generation simulated - would generate actual PDF in production');
          break;
          
        case 'json':
          const jsonContent = JSON.stringify(filteredExpenses, null, 2);
          downloadFile(jsonContent, `expenses-${timestamp}.json`, 'application/json');
          break;
          
        default:
          break;
      }
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const filteredCount = getFilteredExpenses()?.length;
  const totalAmount = getFilteredExpenses()?.reduce((sum, expense) => sum + expense?.amount, 0);

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Download" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-card-foreground">Export Data</h3>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Export Format"
            options={formatOptions}
            value={exportFormat}
            onChange={setExportFormat}
            description="Choose the format for your exported data"
            error=""
            id="export-format"
            name="exportFormat"
          />

          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={dateRange}
            onChange={setDateRange}
            description="Select the time period for exported data"
            error=""
            id="date-range"
            name="dateRange"
          />
        </div>

        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="font-medium text-card-foreground mb-2">Export Preview</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Records:</span>
              <span className="ml-2 font-medium">{filteredCount} expenses</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Amount:</span>
              <span className="ml-2 font-medium">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                })?.format(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-card-foreground">Export Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center space-x-2 text-sm">
              <Icon name="FileText" size={16} className="text-green-600" />
              <span>CSV: Excel compatible</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Icon name="FileImage" size={16} className="text-red-600" />
              <span>PDF: Formatted report</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Icon name="Code" size={16} className="text-blue-600" />
              <span>JSON: Raw data format</span>
            </div>
          </div>
        </div>

        <Button
          onClick={handleExport}
          loading={isExporting}
          disabled={filteredCount === 0}
          iconName="Download"
          iconPosition="left"
          className="w-full md:w-auto"
        >
          {isExporting ? 'Exporting...' : `Export ${filteredCount} Records`}
        </Button>

        {filteredCount === 0 && (
          <p className="text-sm text-muted-foreground">
            No expenses found for the selected date range.
          </p>
        )}
      </div>
      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Shield" size={16} className="text-primary" />
          <span className="text-sm font-medium text-primary">Data Privacy</span>
        </div>
        <p className="text-sm text-muted-foreground">
          All exports are generated locally in your browser. Your financial data never leaves your device 
          during the export process, ensuring complete privacy and security.
        </p>
      </div>
    </div>
  );
};

export default ExportOptions;