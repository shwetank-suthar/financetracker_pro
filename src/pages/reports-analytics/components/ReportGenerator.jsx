import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ReportGenerator = () => {
  const [reportConfig, setReportConfig] = useState({
    name: '',
    dateRange: 'last_month',
    startDate: '',
    endDate: '',
    categories: [],
    accounts: [],
    format: 'pdf',
    includeCharts: true,
    includeTransactions: true,
    includeAnalysis: true
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const dateRangeOptions = [
    { value: 'last_week', label: 'Last Week' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'last_quarter', label: 'Last Quarter' },
    { value: 'last_year', label: 'Last Year' },
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
    { value: 'income', label: 'Income' }
  ];

  const accountOptions = [
    { value: 'checking', label: 'Checking Account' },
    { value: 'savings', label: 'Savings Account' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'investment', label: 'Investment Account' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'csv', label: 'CSV Spreadsheet' },
    { value: 'excel', label: 'Excel Workbook' }
  ];

  const handleInputChange = (field, value) => {
    setReportConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Report generated:', reportConfig);
      // Here you would typically trigger a download
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const savedReports = [
    {
      id: 1,
      name: 'Monthly Expense Summary',
      date: '2025-01-05',
      format: 'PDF',
      size: '2.4 MB'
    },
    {
      id: 2,
      name: 'Q4 Investment Performance',
      date: '2025-01-02',
      format: 'Excel',
      size: '1.8 MB'
    },
    {
      id: 3,
      name: 'Tax Preparation Data',
      date: '2024-12-28',
      format: 'CSV',
      size: '856 KB'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name="FileText" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Report Generator</h3>
            <p className="text-sm text-muted-foreground">Create custom financial reports</p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Report Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Report Name"
            placeholder="Enter report name"
            value={reportConfig?.name}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
          />

          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={reportConfig?.dateRange}
            onChange={(value) => handleInputChange('dateRange', value)}
            id="dateRange"
            name="dateRange"
            description=""
            error=""
          />

          {reportConfig?.dateRange === 'custom' && (
            <>
              <Input
                label="Start Date"
                type="date"
                value={reportConfig?.startDate}
                onChange={(e) => handleInputChange('startDate', e?.target?.value)}
              />
              <Input
                label="End Date"
                type="date"
                value={reportConfig?.endDate}
                onChange={(e) => handleInputChange('endDate', e?.target?.value)}
              />
            </>
          )}

          <Select
            label="Categories"
            options={categoryOptions}
            value={reportConfig?.categories}
            onChange={(value) => handleInputChange('categories', value)}
            multiple
            searchable
            placeholder="Select categories"
            id="categories"
            name="categories"
            description=""
            error=""
          />

          <Select
            label="Accounts"
            options={accountOptions}
            value={reportConfig?.accounts}
            onChange={(value) => handleInputChange('accounts', value)}
            multiple
            placeholder="Select accounts"
            id="accounts"
            name="accounts"
            description=""
            error=""
          />

          <Select
            label="Export Format"
            options={formatOptions}
            value={reportConfig?.format}
            onChange={(value) => handleInputChange('format', value)}
            id="format"
            name="format"
            description=""
            error=""
          />
        </div>

        {/* Report Options */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Include in Report</h4>
          <div className="space-y-3">
            <Checkbox
              label="Charts and Visualizations"
              checked={reportConfig?.includeCharts}
              onChange={(e) => handleInputChange('includeCharts', e?.target?.checked)}
              id="includeCharts"
              name="includeCharts"
              value={reportConfig?.includeCharts}
              description=""
              error=""
            />
            <Checkbox
              label="Transaction Details"
              checked={reportConfig?.includeTransactions}
              onChange={(e) => handleInputChange('includeTransactions', e?.target?.checked)}
              id="includeTransactions"
              name="includeTransactions"
              value={reportConfig?.includeTransactions}
              description=""
              error=""
            />
            <Checkbox
              label="AI Analysis and Insights"
              checked={reportConfig?.includeAnalysis}
              onChange={(e) => handleInputChange('includeAnalysis', e?.target?.checked)}
              id="includeAnalysis"
              name="includeAnalysis"
              value={reportConfig?.includeAnalysis}
              description=""
              error=""
            />
          </div>
        </div>

        {/* Generate Button */}
        <Button
          variant="default"
          onClick={handleGenerateReport}
          loading={isGenerating}
          iconName="Download"
          iconPosition="left"
          fullWidth
        >
          {isGenerating ? 'Generating Report...' : 'Generate Report'}
        </Button>
      </div>
      {/* Saved Reports */}
      <div className="border-t border-border">
        <div className="p-6">
          <h4 className="text-sm font-medium text-foreground mb-4">Recent Reports</h4>
          <div className="space-y-3">
            {savedReports?.map((report) => (
              <div key={report?.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name="FileText" size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{report?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {report?.date} • {report?.format} • {report?.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" iconName="Download" />
                  <Button variant="ghost" size="sm" iconName="Share" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;