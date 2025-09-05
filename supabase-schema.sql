-- FinanceTracker Pro Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE payment_method_type AS ENUM (
  'cash',
  'credit-card',
  'debit-card',
  'upi',
  'net-banking',
  'wallet',
  'cheque',
  'other'
);

CREATE TYPE expense_category_type AS ENUM (
  'food',
  'transportation',
  'shopping',
  'entertainment',
  'bills',
  'healthcare',
  'education',
  'groceries',
  'travel',
  'other'
);

CREATE TYPE investment_type AS ENUM (
  'stock',
  'mutual-fund',
  'fixed-deposit',
  'bonds',
  'crypto',
  'etf',
  'other'
);

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type expense_category_type NOT NULL,
  icon TEXT,
  color TEXT,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment methods table
CREATE TABLE public.payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type payment_method_type NOT NULL,
  icon TEXT,
  color TEXT,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accounts table (bank accounts, wallets, etc.)
CREATE TABLE public.accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'bank', 'wallet', 'cash', 'investment'
  balance DECIMAL(15,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  is_active BOOLEAN DEFAULT true,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expenses table
CREATE TABLE public.expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  amount DECIMAL(15,2) NOT NULL,
  description TEXT NOT NULL,
  category expense_category_type NOT NULL,
  payment_method payment_method_type NOT NULL,
  account_id UUID REFERENCES public.accounts(id),
  date DATE NOT NULL,
  tags TEXT[],
  notes TEXT,
  receipt_url TEXT,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investments table
CREATE TABLE public.investments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  symbol TEXT,
  type investment_type NOT NULL,
  current_value DECIMAL(15,2) NOT NULL,
  invested_amount DECIMAL(15,2) NOT NULL,
  quantity DECIMAL(15,4),
  current_price DECIMAL(15,2),
  gain_loss DECIMAL(15,2) GENERATED ALWAYS AS (current_value - invested_amount) STORED,
  change_percent DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN invested_amount > 0 THEN ((current_value - invested_amount) / invested_amount) * 100
      ELSE 0
    END
  ) STORED,
  logo_url TEXT,
  account_id UUID REFERENCES public.accounts(id),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budgets table
CREATE TABLE public.budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category expense_category_type,
  amount DECIMAL(15,2) NOT NULL,
  spent DECIMAL(15,2) DEFAULT 0,
  period TEXT NOT NULL, -- 'monthly', 'weekly', 'yearly'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table (for account balance tracking)
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  type TEXT NOT NULL, -- 'income', 'expense', 'transfer'
  description TEXT,
  reference_id UUID, -- Links to expenses, investments, etc.
  reference_type TEXT, -- 'expense', 'investment', 'transfer'
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX idx_expenses_date ON public.expenses(date);
CREATE INDEX idx_expenses_category ON public.expenses(category);
CREATE INDEX idx_expenses_payment_method ON public.expenses(payment_method);
CREATE INDEX idx_investments_user_id ON public.investments(user_id);
CREATE INDEX idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX idx_budgets_user_id ON public.budgets(user_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_account_id ON public.transactions(account_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Categories policies
CREATE POLICY "Users can manage own categories" ON public.categories
  FOR ALL USING (auth.uid() = user_id);

-- Payment methods policies
CREATE POLICY "Users can manage own payment methods" ON public.payment_methods
  FOR ALL USING (auth.uid() = user_id);

-- Accounts policies
CREATE POLICY "Users can manage own accounts" ON public.accounts
  FOR ALL USING (auth.uid() = user_id);

-- Expenses policies
CREATE POLICY "Users can manage own expenses" ON public.expenses
  FOR ALL USING (auth.uid() = user_id);

-- Investments policies
CREATE POLICY "Users can manage own investments" ON public.investments
  FOR ALL USING (auth.uid() = user_id);

-- Budgets policies
CREATE POLICY "Users can manage own budgets" ON public.budgets
  FOR ALL USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can manage own transactions" ON public.transactions
  FOR ALL USING (auth.uid() = user_id);

-- Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON public.investments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON public.budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO public.categories (name, type, icon, color, user_id) VALUES
  ('Food & Dining', 'food', 'Utensils', 'text-orange-600', NULL),
  ('Transportation', 'transportation', 'Car', 'text-blue-600', NULL),
  ('Shopping', 'shopping', 'ShoppingBag', 'text-purple-600', NULL),
  ('Entertainment', 'entertainment', 'Music', 'text-pink-600', NULL),
  ('Bills & Utilities', 'bills', 'Receipt', 'text-red-600', NULL),
  ('Healthcare', 'healthcare', 'Heart', 'text-green-600', NULL),
  ('Education', 'education', 'BookOpen', 'text-indigo-600', NULL),
  ('Groceries', 'groceries', 'ShoppingCart', 'text-yellow-600', NULL),
  ('Travel', 'travel', 'Plane', 'text-cyan-600', NULL),
  ('Other', 'other', 'MoreHorizontal', 'text-gray-600', NULL);

-- Insert default payment methods
INSERT INTO public.payment_methods (name, type, icon, color, user_id) VALUES
  ('Cash', 'cash', 'Banknote', 'text-green-600', NULL),
  ('Credit Card', 'credit-card', 'CreditCard', 'text-blue-600', NULL),
  ('Debit Card', 'debit-card', 'CreditCard', 'text-indigo-600', NULL),
  ('UPI', 'upi', 'Smartphone', 'text-purple-600', NULL),
  ('Net Banking', 'net-banking', 'Monitor', 'text-cyan-600', NULL),
  ('Digital Wallet', 'wallet', 'Wallet', 'text-orange-600', NULL),
  ('Cheque', 'cheque', 'FileText', 'text-gray-600', NULL),
  ('Other', 'other', 'MoreHorizontal', 'text-gray-600', NULL);
