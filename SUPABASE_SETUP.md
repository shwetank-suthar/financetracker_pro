# Supabase Integration Setup Guide

This guide will help you set up Supabase for your FinanceTracker Pro application.

## 🚀 Quick Setup Steps

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `financetracker-pro`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

### 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **Anon/Public Key** (starts with `eyJ`)

### 3. Set Up Environment Variables

1. Create a `.env` file in your project root:
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# OpenAI Configuration (existing)
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

2. Replace the placeholder values with your actual Supabase credentials

### 4. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the entire contents of `supabase-schema.sql` file
4. Click "Run" to execute the schema

This will create:
- ✅ User profiles table
- ✅ Expenses table with payment methods
- ✅ Categories and payment methods tables
- ✅ Investments table
- ✅ Accounts table
- ✅ Budgets table
- ✅ Row Level Security (RLS) policies
- ✅ Default categories and payment methods

### 5. Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:

#### Site URL
- Set to `http://localhost:4028` for development
- Set to your production domain for production

#### Redirect URLs
- Add `http://localhost:4028/dashboard` for development
- Add your production dashboard URL for production

#### Email Templates (Optional)
- Customize the email templates for signup, password reset, etc.

### 6. Test the Integration

1. Start your development server:
```bash
npm start
```

2. Navigate to `http://localhost:4028/register`
3. Create a new account
4. Try adding an expense
5. Check your Supabase dashboard to see the data

## 📊 Database Schema Overview

### Core Tables

#### `users`
- Extends Supabase auth.users
- Stores user profile information
- Linked to all user data via RLS

#### `expenses`
- Stores all expense transactions
- Includes payment method tracking
- Supports tags and categorization
- Links to accounts for balance tracking

#### `accounts`
- Bank accounts, wallets, cash
- Tracks balances and account types
- Used for expense attribution

#### `investments`
- Investment portfolio tracking
- Supports stocks, mutual funds, FDs
- Calculates gains/losses automatically

#### `budgets`
- Budget planning and tracking
- Category-based or general budgets
- Tracks spending against limits

### Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Authentication**: Secure user management via Supabase Auth
- **Data Validation**: Database-level constraints and validation
- **Automatic Timestamps**: Created/updated timestamps on all records

## 🔧 Advanced Configuration

### Custom Categories and Payment Methods

The schema includes default categories and payment methods, but users can create custom ones:

```sql
-- Add custom category
INSERT INTO categories (name, type, icon, color, user_id) 
VALUES ('Custom Category', 'other', 'IconName', 'text-color', 'user-uuid');

-- Add custom payment method
INSERT INTO payment_methods (name, type, icon, color, user_id) 
VALUES ('Custom Payment', 'other', 'IconName', 'text-color', 'user-uuid');
```

### Account Balance Tracking

The system automatically tracks account balances when expenses are added:

```sql
-- Create account balance update function
CREATE OR REPLACE FUNCTION update_account_balance(account_id UUID, amount_change DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE accounts 
  SET balance = balance + amount_change,
      updated_at = NOW()
  WHERE id = account_id;
END;
$$ LANGUAGE plpgsql;
```

### Real-time Subscriptions

You can set up real-time updates for live data:

```javascript
// Subscribe to expense changes
const subscription = supabase
  .channel('expenses')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'expenses' },
    (payload) => {
      console.log('Expense changed:', payload)
      // Update your UI
    }
  )
  .subscribe()
```

## 🚨 Troubleshooting

### Common Issues

#### 1. "Invalid API key" Error
- Check your `.env` file has the correct Supabase URL and key
- Ensure the keys are not wrapped in quotes
- Restart your development server after changing `.env`

#### 2. "Row Level Security" Errors
- Make sure you're authenticated before making database calls
- Check that RLS policies are properly set up
- Verify the user ID matches in your queries

#### 3. "Table doesn't exist" Error
- Run the schema SQL in your Supabase SQL Editor
- Check that all tables were created successfully
- Verify you're using the correct table names

#### 4. Authentication Issues
- Check your Site URL and Redirect URLs in Supabase settings
- Ensure email confirmation is disabled for development
- Check browser console for detailed error messages

### Getting Help

1. **Supabase Documentation**: [docs.supabase.com](https://docs.supabase.com)
2. **Community Forum**: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
3. **Discord**: [discord.supabase.com](https://discord.supabase.com)

## 🔄 Migration from Mock Data

The application has been updated to use Supabase instead of mock data:

### What Changed
- ✅ Authentication now uses Supabase Auth
- ✅ Expenses are stored in Supabase database
- ✅ Payment methods are tracked in database
- ✅ User profiles are managed by Supabase
- ✅ All CRUD operations use Supabase services

### Data Migration
If you have existing mock data you want to migrate:

1. Export your mock data to JSON
2. Use the Supabase service functions to import data
3. Update user IDs to match your Supabase auth users

## 🎯 Next Steps

After completing the setup:

1. **Test all features**: Create accounts, add expenses, test filtering
2. **Customize categories**: Add your own expense categories
3. **Set up accounts**: Create bank accounts and wallets
4. **Configure budgets**: Set up monthly budgets
5. **Add investments**: Track your investment portfolio
6. **Deploy**: Set up production environment with your domain

## 📈 Performance Tips

1. **Indexes**: The schema includes optimized indexes for common queries
2. **Pagination**: Use Supabase's built-in pagination for large datasets
3. **Caching**: Consider implementing client-side caching for frequently accessed data
4. **Real-time**: Use Supabase real-time features for live updates

Your FinanceTracker Pro is now powered by Supabase! 🎉
