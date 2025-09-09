-- =====================================================
-- FinanceTracker Pro - Complete PostgreSQL Setup Script
-- =====================================================
-- This script sets up the complete database schema for FinanceTracker Pro
-- Run this script in your local PostgreSQL database
-- 
-- Prerequisites:
-- 1. PostgreSQL 12+ installed
-- 2. Create a database named 'financetracker' (or change the name below)
-- 3. Run this script as a superuser or database owner
-- =====================================================

-- Set the database (uncomment and modify if needed)
-- \c financetracker;

-- =====================================================
-- 1. CREATE EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 2. CREATE CUSTOM TYPES
-- =====================================================

-- Payment method types
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

-- Expense category types
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

-- Investment types (including SIP)
CREATE TYPE investment_type AS ENUM (
  'stock',
  'mutual-fund',
  'fixed-deposit',
  'bonds',
  'crypto',
  'etf',
  'sip',
  'other'
);

-- Income types
CREATE TYPE income_type AS ENUM (
  'salary',
  'freelance',
  'business',
  'investment',
  'rental',
  'bonus',
  'other'
);

-- =====================================================
-- 3. CREATE USERS TABLE (Simplified for local setup)
-- =====================================================
CREATE TABLE public.users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  date_of_birth DATE,
  password_hash TEXT, -- For local authentication
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. CREATE CATEGORIES TABLE
-- =====================================================
CREATE TABLE public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type expense_category_type NOT NULL,
  icon TEXT,
  color TEXT,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. CREATE PAYMENT METHODS TABLE
-- =====================================================
CREATE TABLE public.payment_methods (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type payment_method_type NOT NULL,
  icon TEXT,
  color TEXT,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. CREATE ACCOUNTS TABLE
-- =====================================================
CREATE TABLE public.accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'bank', 'wallet', 'cash', 'investment'
  balance DECIMAL(15,2) DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  is_active BOOLEAN DEFAULT true,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. CREATE EXPENSES TABLE
-- =====================================================
CREATE TABLE public.expenses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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

-- =====================================================
-- 8. CREATE INVESTMENTS TABLE (with SIP support)
-- =====================================================
CREATE TABLE public.investments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
  -- SIP specific columns
  sip_amount DECIMAL(10,2),
  sip_frequency VARCHAR(20),
  sip_duration_months INTEGER,
  sip_start_date DATE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. CREATE SIP ENTRIES TABLE
-- =====================================================
CREATE TABLE public.sip_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  sip_id UUID REFERENCES public.investments(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. CREATE BUDGETS TABLE
-- =====================================================
CREATE TABLE public.budgets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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

-- =====================================================
-- 11. CREATE TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  type TEXT NOT NULL, -- 'income', 'expense', 'transfer'
  description TEXT,
  reference_id UUID, -- Links to expenses, investments, etc.
  reference_type TEXT, -- 'expense', 'investment', 'transfer'
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 12. CREATE INCOME SOURCES TABLE
-- =====================================================
CREATE TABLE public.income_sources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type income_type NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 13. CREATE SALARIES TABLE
-- =====================================================
CREATE TABLE public.salaries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  income_source_id UUID REFERENCES public.income_sources(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  pay_date DATE NOT NULL,
  pay_frequency TEXT NOT NULL CHECK (pay_frequency IN ('monthly', 'weekly', 'bi-weekly', 'quarterly', 'yearly')),
  pay_day INTEGER, -- Day of month (1-31) for monthly salary
  is_recurring BOOLEAN DEFAULT true,
  start_date DATE NOT NULL,
  end_date DATE,
  current_balance DECIMAL(15,2) DEFAULT 0, -- Remaining balance after deductions
  total_received DECIMAL(15,2) DEFAULT 0, -- Total amount received
  total_deducted DECIMAL(15,2) DEFAULT 0, -- Total amount deducted for expenses/investments
  notes TEXT,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 14. CREATE SALARY DEDUCTIONS TABLE
-- =====================================================
CREATE TABLE public.salary_deductions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  salary_id UUID REFERENCES public.salaries(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'investment', 'transfer')),
  reference_id UUID, -- Links to expenses, investments, etc.
  reference_type TEXT, -- 'expense', 'investment', 'transfer'
  description TEXT,
  date DATE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 15. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_email ON public.users(email);

-- Expenses indexes
CREATE INDEX idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX idx_expenses_date ON public.expenses(date);
CREATE INDEX idx_expenses_category ON public.expenses(category);
CREATE INDEX idx_expenses_payment_method ON public.expenses(payment_method);

-- Investments indexes
CREATE INDEX idx_investments_user_id ON public.investments(user_id);
CREATE INDEX idx_investments_type ON public.investments(type);

-- Accounts indexes
CREATE INDEX idx_accounts_user_id ON public.accounts(user_id);

-- Budgets indexes
CREATE INDEX idx_budgets_user_id ON public.budgets(user_id);

-- Transactions indexes
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_account_id ON public.transactions(account_id);

-- SIP entries indexes
CREATE INDEX idx_sip_entries_user_id ON public.sip_entries(user_id);
CREATE INDEX idx_sip_entries_sip_id ON public.sip_entries(sip_id);
CREATE INDEX idx_sip_entries_date ON public.sip_entries(date);
CREATE INDEX idx_sip_entries_status ON public.sip_entries(status);

-- Income sources indexes
CREATE INDEX idx_income_sources_user_id ON public.income_sources(user_id);

-- Salaries indexes
CREATE INDEX idx_salaries_user_id ON public.salaries(user_id);
CREATE INDEX idx_salaries_income_source_id ON public.salaries(income_source_id);
CREATE INDEX idx_salaries_pay_date ON public.salaries(pay_date);

-- Salary deductions indexes
CREATE INDEX idx_salary_deductions_user_id ON public.salary_deductions(user_id);
CREATE INDEX idx_salary_deductions_salary_id ON public.salary_deductions(salary_id);
CREATE INDEX idx_salary_deductions_date ON public.salary_deductions(date);

-- =====================================================
-- 16. CREATE FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to automatically deduct from salary when expense is created
CREATE OR REPLACE FUNCTION public.deduct_from_salary()
RETURNS TRIGGER AS $$
DECLARE
  current_salary RECORD;
  deduction_amount DECIMAL(15,2);
BEGIN
  -- Get the current active salary for the user
  SELECT * INTO current_salary
  FROM public.salaries
  WHERE user_id = NEW.user_id
    AND is_recurring = true
    AND (end_date IS NULL OR end_date >= CURRENT_DATE)
    AND pay_date <= CURRENT_DATE
  ORDER BY pay_date DESC
  LIMIT 1;

  -- If no active salary found, return without error
  IF current_salary IS NULL THEN
    RETURN NEW;
  END IF;

  -- Calculate deduction amount
  deduction_amount := NEW.amount;

  -- Check if there's enough balance in salary
  IF current_salary.current_balance >= deduction_amount THEN
    -- Update salary balance
    UPDATE public.salaries
    SET 
      current_balance = current_balance - deduction_amount,
      total_deducted = total_deducted + deduction_amount,
      updated_at = NOW()
    WHERE id = current_salary.id;

    -- Create salary deduction record
    INSERT INTO public.salary_deductions (
      salary_id,
      amount,
      type,
      reference_id,
      reference_type,
      description,
      date,
      user_id
    ) VALUES (
      current_salary.id,
      deduction_amount,
      'expense',
      NEW.id,
      'expense',
      'Expense: ' || NEW.description,
      NEW.date,
      NEW.user_id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically deduct from salary when investment is created
CREATE OR REPLACE FUNCTION public.deduct_from_salary_investment()
RETURNS TRIGGER AS $$
DECLARE
  current_salary RECORD;
  deduction_amount DECIMAL(15,2);
BEGIN
  -- Get the current active salary for the user
  SELECT * INTO current_salary
  FROM public.salaries
  WHERE user_id = NEW.user_id
    AND is_recurring = true
    AND (end_date IS NULL OR end_date >= CURRENT_DATE)
    AND pay_date <= CURRENT_DATE
  ORDER BY pay_date DESC
  LIMIT 1;

  -- If no active salary found, return without error
  IF current_salary IS NULL THEN
    RETURN NEW;
  END IF;

  -- Calculate deduction amount (use invested_amount for investments)
  deduction_amount := NEW.invested_amount;

  -- Check if there's enough balance in salary
  IF current_salary.current_balance >= deduction_amount THEN
    -- Update salary balance
    UPDATE public.salaries
    SET 
      current_balance = current_balance - deduction_amount,
      total_deducted = total_deducted + deduction_amount,
      updated_at = NOW()
    WHERE id = current_salary.id;

    -- Create salary deduction record
    INSERT INTO public.salary_deductions (
      salary_id,
      amount,
      type,
      reference_id,
      reference_type,
      description,
      date,
      user_id
    ) VALUES (
      current_salary.id,
      deduction_amount,
      'investment',
      NEW.id,
      'investment',
      'Investment: ' || NEW.name,
      CURRENT_DATE,
      NEW.user_id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to get salary summary
CREATE OR REPLACE FUNCTION public.get_salary_summary(user_uuid UUID)
RETURNS TABLE (
  current_balance DECIMAL(15,2),
  total_received DECIMAL(15,2),
  total_deducted DECIMAL(15,2),
  next_pay_date DATE,
  days_until_pay INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.current_balance,
    s.total_received,
    s.total_deducted,
    CASE 
      WHEN s.pay_frequency = 'monthly' THEN
        CASE 
          WHEN EXTRACT(DAY FROM CURRENT_DATE) < s.pay_day THEN
            (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day' + INTERVAL '1 day' * s.pay_day)::DATE
          ELSE
            (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '2 months' - INTERVAL '1 day' + INTERVAL '1 day' * s.pay_day)::DATE
        END
      ELSE s.pay_date -- For other frequencies, use the next pay_date
    END as next_pay_date,
    CASE 
      WHEN s.pay_frequency = 'monthly' THEN
        CASE 
          WHEN EXTRACT(DAY FROM CURRENT_DATE) < s.pay_day THEN
            (s.pay_day - EXTRACT(DAY FROM CURRENT_DATE))::INTEGER
          ELSE
            EXTRACT(DAYS FROM ((DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '2 months' - INTERVAL '1 day' + INTERVAL '1 day' * s.pay_day) - CURRENT_DATE))::INTEGER
        END
      ELSE 
        EXTRACT(DAYS FROM (s.pay_date - CURRENT_DATE))::INTEGER
    END as days_until_pay
  FROM public.salaries s
  WHERE s.user_id = user_uuid
    AND s.is_recurring = true
    AND (s.end_date IS NULL OR s.end_date >= CURRENT_DATE)
  ORDER BY s.pay_date DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to get SIP progress
CREATE OR REPLACE FUNCTION public.get_sip_progress(sip_investment_id UUID)
RETURNS TABLE (
  total_installments INTEGER,
  completed_installments INTEGER,
  pending_installments INTEGER,
  total_invested DECIMAL(10,2),
  progress_percentage DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.sip_duration_months::INTEGER as total_installments,
    COUNT(se.id)::INTEGER as completed_installments,
    (i.sip_duration_months - COUNT(se.id))::INTEGER as pending_installments,
    COALESCE(SUM(se.amount), 0) as total_invested,
    CASE 
      WHEN i.sip_duration_months > 0 THEN 
        ROUND((COUNT(se.id)::DECIMAL / i.sip_duration_months) * 100, 2)
      ELSE 0 
    END as progress_percentage
  FROM public.investments i
  LEFT JOIN public.sip_entries se ON i.id = se.sip_id AND se.status = 'completed'
  WHERE i.id = sip_investment_id
  GROUP BY i.id, i.sip_duration_months;
END;
$$ LANGUAGE plpgsql;

-- Function to get upcoming SIP dates
CREATE OR REPLACE FUNCTION public.get_upcoming_sips(user_uuid UUID)
RETURNS TABLE (
  investment_id UUID,
  investment_name TEXT,
  sip_amount DECIMAL(10,2),
  next_sip_date DATE,
  days_until_next INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id as investment_id,
    i.name as investment_name,
    i.sip_amount,
    CASE 
      WHEN i.sip_frequency = 'monthly' THEN 
        (SELECT MAX(se.date) + INTERVAL '1 month' FROM public.sip_entries se WHERE se.sip_id = i.id)
      WHEN i.sip_frequency = 'quarterly' THEN 
        (SELECT MAX(se.date) + INTERVAL '3 months' FROM public.sip_entries se WHERE se.sip_id = i.id)
      WHEN i.sip_frequency = 'yearly' THEN 
        (SELECT MAX(se.date) + INTERVAL '1 year' FROM public.sip_entries se WHERE se.sip_id = i.id)
    END::DATE as next_sip_date,
    CASE 
      WHEN i.sip_frequency = 'monthly' THEN 
        EXTRACT(DAYS FROM ((SELECT MAX(se.date) + INTERVAL '1 month' FROM public.sip_entries se WHERE se.sip_id = i.id) - CURRENT_DATE))
      WHEN i.sip_frequency = 'quarterly' THEN 
        EXTRACT(DAYS FROM ((SELECT MAX(se.date) + INTERVAL '3 months' FROM public.sip_entries se WHERE se.sip_id = i.id) - CURRENT_DATE))
      WHEN i.sip_frequency = 'yearly' THEN 
        EXTRACT(DAYS FROM ((SELECT MAX(se.date) + INTERVAL '1 year' FROM public.sip_entries se WHERE se.sip_id = i.id) - CURRENT_DATE))
    END::INTEGER as days_until_next
  FROM public.investments i
  WHERE i.user_id = user_uuid 
    AND i.type = 'sip'
    AND i.sip_duration_months > (
      SELECT COUNT(*) FROM public.sip_entries se WHERE se.sip_id = i.id
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 17. CREATE TRIGGERS
-- =====================================================

-- Triggers for updated_at
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

CREATE TRIGGER update_income_sources_updated_at BEFORE UPDATE ON public.income_sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_salaries_updated_at BEFORE UPDATE ON public.salaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sip_entries_updated_at BEFORE UPDATE ON public.sip_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for automatic salary deduction
CREATE TRIGGER trigger_deduct_from_salary_expense
  AFTER INSERT ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.deduct_from_salary();

CREATE TRIGGER trigger_deduct_from_salary_investment
  AFTER INSERT ON public.investments
  FOR EACH ROW EXECUTE FUNCTION public.deduct_from_salary_investment();

-- =====================================================
-- 18. CREATE VIEWS
-- =====================================================

-- SIP summary view
CREATE OR REPLACE VIEW public.sip_summary AS
SELECT 
  i.id,
  i.user_id,
  i.name,
  i.sip_amount,
  i.sip_frequency,
  i.sip_duration_months,
  i.sip_start_date,
  COUNT(se.id) as completed_installments,
  (i.sip_duration_months - COUNT(se.id)) as pending_installments,
  COALESCE(SUM(se.amount), 0) as total_invested,
  CASE 
    WHEN i.sip_duration_months > 0 THEN 
      ROUND((COUNT(se.id)::DECIMAL / i.sip_duration_months) * 100, 2)
    ELSE 0 
  END as progress_percentage,
  i.current_value,
  (i.current_value - COALESCE(SUM(se.amount), 0)) as gain_loss
FROM public.investments i
LEFT JOIN public.sip_entries se ON i.id = se.sip_id AND se.status = 'completed'
WHERE i.type = 'sip'
GROUP BY i.id, i.user_id, i.name, i.sip_amount, i.sip_frequency, i.sip_duration_months, i.sip_start_date, i.current_value;

-- =====================================================
-- 19. INSERT DEFAULT DATA
-- =====================================================

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

-- =====================================================
-- 20. CREATE SAMPLE USER AND DATA (Optional)
-- =====================================================

-- Create a sample user (password: 'password123' - change this!)
INSERT INTO public.users (id, email, full_name, password_hash) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'demo@financetracker.com', 'Demo User', crypt('password123', gen_salt('bf')));

-- Create sample accounts
INSERT INTO public.accounts (name, type, balance, currency, user_id) VALUES
  ('Main Bank Account', 'bank', 50000.00, 'INR', '550e8400-e29b-41d4-a716-446655440000'),
  ('Savings Account', 'bank', 100000.00, 'INR', '550e8400-e29b-41d4-a716-446655440000'),
  ('Cash Wallet', 'cash', 5000.00, 'INR', '550e8400-e29b-41d4-a716-446655440000');

-- Create sample income source
INSERT INTO public.income_sources (name, type, description, user_id) VALUES
  ('Software Engineer Salary', 'salary', 'Monthly salary from company', '550e8400-e29b-41d4-a716-446655440000');

-- Create sample salary
INSERT INTO public.salaries (income_source_id, amount, currency, pay_date, pay_frequency, pay_day, start_date, current_balance, total_received, user_id) VALUES
  ((SELECT id FROM public.income_sources WHERE name = 'Software Engineer Salary'), 80000.00, 'INR', CURRENT_DATE, 'monthly', 1, CURRENT_DATE, 80000.00, 80000.00, '550e8400-e29b-41d4-a716-446655440000');

-- =====================================================
-- 21. GRANT PERMISSIONS
-- =====================================================

-- Create a role for the application
CREATE ROLE financetracker_app;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO financetracker_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO financetracker_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO financetracker_app;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO financetracker_app;
GRANT SELECT ON public.sip_summary TO financetracker_app;

-- =====================================================
-- 22. COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '=====================================================';
  RAISE NOTICE 'FinanceTracker Pro Database Setup Complete!';
  RAISE NOTICE '=====================================================';
  RAISE NOTICE 'Database: %', current_database();
  RAISE NOTICE 'Schema: public';
  RAISE NOTICE 'Sample User: demo@financetracker.com';
  RAISE NOTICE 'Sample Password: password123';
  RAISE NOTICE '=====================================================';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '1. Update your application connection string';
  RAISE NOTICE '2. Change the sample user password';
  RAISE NOTICE '3. Configure your application to use local PostgreSQL';
  RAISE NOTICE '=====================================================';
END $$;
