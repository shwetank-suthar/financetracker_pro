# Salary/Income Tracking System Setup Guide

## 🎯 **Overview**

This system allows you to:
- ✅ **Add your salary** (e.g., ₹50,000 on 10th of every month)
- ✅ **Automatic deductions** when you add expenses or investments
- ✅ **Track remaining balance** from your salary
- ✅ **View salary summary** on dashboard
- ✅ **Monitor spending** against your salary

## 🚀 **Setup Steps**

### **Step 1: Run Database Schema**

Execute the SQL script in your Supabase SQL Editor:

```sql
-- Run the contents of salary-income-schema.sql
```

This creates:
- `income_sources` table (for different income types)
- `salaries` table (for salary records)
- `salary_deductions` table (for tracking deductions)
- Automatic triggers for expense/investment deductions

### **Step 2: Add Your Salary**

1. **Go to Dashboard**
2. **Click "Add Salary"** button in the header
3. **Fill out the form**:
   - **Income Source**: Select "Salary" (or create new)
   - **Salary Amount**: Enter your monthly salary (e.g., ₹50,000)
   - **Pay Frequency**: Select "Monthly"
   - **Pay Day**: Select "10" (for 10th of every month)
   - **Next Pay Date**: Set your next salary date
   - **Start Date**: When this salary started
4. **Click "Add Salary"**

### **Step 3: Verify Setup**

After adding salary, you should see:
- ✅ **Salary Balance Card** on dashboard showing your full salary amount
- ✅ **"Add Salary" button** in dashboard header
- ✅ **Automatic deductions** when you add expenses/investments

## 📊 **How It Works**

### **Salary Tracking:**
- **Initial Balance**: Set to your full salary amount
- **Current Balance**: Decreases as you spend/invest
- **Total Received**: Tracks total salary received
- **Total Deducted**: Tracks total amount spent/invested

### **Automatic Deductions:**
- **Expenses**: Automatically deducted from salary balance
- **Investments**: Automatically deducted from salary balance
- **Real-time Updates**: Balance updates immediately

### **Dashboard Display:**
- **Salary Balance**: Shows current remaining balance
- **Next Pay Date**: Shows when you'll receive next salary
- **Days Until Pay**: Countdown to next salary
- **Spending Summary**: Total received vs. total deducted

## 💡 **Example Usage**

### **Scenario: Monthly Salary of ₹50,000**

1. **Add Salary**: ₹50,000 on 10th of every month
2. **Initial Balance**: ₹50,000
3. **Add Expense**: ₹2,000 for groceries
   - **Balance**: ₹48,000
   - **Total Deducted**: ₹2,000
4. **Add Investment**: ₹10,000 SIP
   - **Balance**: ₹38,000
   - **Total Deducted**: ₹12,000
5. **Add Expense**: ₹1,500 for transport
   - **Balance**: ₹36,500
   - **Total Deducted**: ₹13,500

### **Dashboard Shows:**
- **Current Balance**: ₹36,500
- **Total Received**: ₹50,000
- **Total Deducted**: ₹13,500
- **Next Pay**: 10th of next month
- **Days Until Pay**: 15 days

## 🔧 **Features**

### **Salary Management:**
- ✅ **Multiple Income Sources**: Salary, freelance, business, etc.
- ✅ **Flexible Frequencies**: Monthly, weekly, quarterly, yearly
- ✅ **Custom Pay Days**: Any day of the month
- ✅ **Recurring Salaries**: Automatic tracking
- ✅ **End Dates**: Set when salary ends

### **Automatic Deductions:**
- ✅ **Expense Tracking**: All expenses deducted from salary
- ✅ **Investment Tracking**: All investments deducted from salary
- ✅ **Real-time Updates**: Balance updates immediately
- ✅ **Deduction History**: Track what was deducted when

### **Dashboard Integration:**
- ✅ **Salary Balance Card**: Prominent display of current balance
- ✅ **Quick Add Salary**: Easy salary addition
- ✅ **Spending Insights**: AI insights based on salary vs. spending
- ✅ **Budget Integration**: Compare spending against salary

## 📱 **UI Components**

### **QuickAddSalary Component:**
- **Modal Form**: Easy salary addition
- **Income Source Selection**: Choose from existing sources
- **Flexible Configuration**: Set amount, frequency, pay day
- **Validation**: Ensures all required fields are filled

### **SalaryBalanceCard Component:**
- **Current Balance**: Large display of remaining balance
- **Summary Information**: Total received, total deducted
- **Next Pay Info**: Date and countdown
- **Visual Indicators**: Color coding for balance status

## 🎯 **Benefits**

### **Financial Awareness:**
- ✅ **Real-time Balance**: Always know how much salary is left
- ✅ **Spending Control**: See impact of each expense/investment
- ✅ **Budget Planning**: Plan spending based on remaining salary
- ✅ **Goal Tracking**: Monitor progress toward financial goals

### **Automation:**
- ✅ **No Manual Tracking**: Automatic deduction calculations
- ✅ **Real-time Updates**: Instant balance updates
- ✅ **Historical Tracking**: Complete deduction history
- ✅ **Error Prevention**: No manual calculation errors

### **Integration:**
- ✅ **Seamless Workflow**: Works with existing expense/investment system
- ✅ **Dashboard Integration**: All information in one place
- ✅ **AI Insights**: Enhanced insights based on salary data
- ✅ **Mobile Friendly**: Works on all devices

## 🔄 **Workflow**

### **Monthly Cycle:**
1. **Salary Received**: Add new salary or update existing
2. **Track Expenses**: All expenses automatically deducted
3. **Track Investments**: All investments automatically deducted
4. **Monitor Balance**: Check remaining salary balance
5. **Plan Spending**: Use balance for future planning

### **Daily Usage:**
1. **Add Expense**: Use QuickAddExpense (automatically deducted)
2. **Add Investment**: Use QuickAddInvestment (automatically deducted)
3. **Check Balance**: View SalaryBalanceCard on dashboard
4. **Plan Ahead**: Use remaining balance for planning

## 🚀 **Next Steps**

After setup:
1. **Add your salary** using the "Add Salary" button
2. **Start adding expenses** - they'll be automatically deducted
3. **Start adding investments** - they'll be automatically deducted
4. **Monitor your balance** on the dashboard
5. **Use AI insights** to optimize your spending

Your salary tracking system is now ready! 🎉
