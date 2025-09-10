# 🗑️ Fresh Start Guide - Clear All Data

## ⚠️ **WARNING: This will permanently delete ALL data!**

This guide will help you completely reset your FinanceTracker Pro database to a fresh state, as if you're starting from scratch.

## 🎯 **What Gets Deleted**

- ✅ All user accounts and profiles
- ✅ All expenses and transactions
- ✅ All investments and portfolios
- ✅ All salary/income records
- ✅ All SIP entries
- ✅ All budgets and categories
- ✅ All payment methods
- ✅ All accounts and balances

## 🚀 **How to Clear All Data**

### **Option 1: Using the SQL Script (Recommended)**

1. **Open your database management tool:**
   - **Supabase**: Go to SQL Editor
   - **Local PostgreSQL**: Use pgAdmin or psql command line
   - **Other tools**: Any PostgreSQL client

2. **Run the clear script:**
```sql
   -- Copy and paste the contents of clear-all-data.sql
   -- Or run the file directly
   ```

3. **Verify the reset:**
   - Check that all tables are empty
   - Confirm default categories and payment methods are restored

### **Option 2: Manual Table Clearing**

If you prefer to clear tables manually:

```sql
-- Clear in this exact order (due to foreign key constraints)
DELETE FROM public.sip_entries;
DELETE FROM public.salary_deductions;
DELETE FROM public.salaries;
DELETE FROM public.income_sources;
DELETE FROM public.transactions;
DELETE FROM public.budgets;
DELETE FROM public.investments;
DELETE FROM public.expenses;
DELETE FROM public.accounts;
DELETE FROM public.payment_methods;
DELETE FROM public.categories;
DELETE FROM public.users;
```

### **Option 3: Drop and Recreate Database (Nuclear Option)**

If you want to completely start over:

```sql
-- Drop the entire database (if you have permissions)
DROP DATABASE financetracker_pro;

-- Recreate the database
CREATE DATABASE financetracker_pro;

-- Run the setup script again
-- Execute setup-local-postgres.sql or supabase-schema.sql
```

## ✅ **After Clearing Data**

1. **Default Data Restored:**
   - ✅ Default expense categories (Food, Transportation, etc.)
   - ✅ Default payment methods (Cash, UPI, Credit Card, etc.)

2. **Fresh Start:**
   - ✅ No user accounts exist
   - ✅ No expenses or investments
   - ✅ Clean database ready for new users

3. **Next Steps:**
   - ✅ Register a new user account
   - ✅ Start adding expenses and investments
   - ✅ Set up your financial goals

## 🔄 **Alternative: Keep Some Data**

If you want to keep some data but clear others:

```sql
-- Clear only expenses
DELETE FROM public.expenses;

-- Clear only investments
DELETE FROM public.investments;

-- Clear only specific user's data
DELETE FROM public.expenses WHERE user_id = 'your-user-id-here';
DELETE FROM public.investments WHERE user_id = 'your-user-id-here';
```

## 🛡️ **Backup Before Clearing (Recommended)**

Before clearing all data, consider creating a backup:

```sql
-- Create backup of specific tables
CREATE TABLE expenses_backup AS SELECT * FROM public.expenses;
CREATE TABLE investments_backup AS SELECT * FROM public.investments;
CREATE TABLE users_backup AS SELECT * FROM public.users;
```

## 🎉 **You're Ready for a Fresh Start!**

After running the clear script, your FinanceTracker Pro will be completely reset and ready for new users to sign up and start their financial journey from scratch.

**Remember:** This action cannot be undone, so make sure you really want to clear all data before proceeding!