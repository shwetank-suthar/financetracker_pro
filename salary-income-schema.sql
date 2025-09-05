-- Salary/Income Tracking System
-- Run this SQL in your Supabase SQL Editor

-- 1. Create income types enum
CREATE TYPE income_type AS ENUM (
  'salary',
  'freelance',
  'business',
  'investment',
  'rental',
  'bonus',
  'other'
);

-- 2. Create income sources table
CREATE TABLE IF NOT EXISTS public.income_sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type income_type NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create salary/income table
CREATE TABLE IF NOT EXISTS public.salaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create salary deductions table (tracks what was deducted from salary)
CREATE TABLE IF NOT EXISTS public.salary_deductions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  salary_id UUID REFERENCES public.salaries(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'investment', 'transfer')),
  reference_id UUID, -- Links to expenses, investments, etc.
  reference_type TEXT, -- 'expense', 'investment', 'transfer'
  description TEXT,
  date DATE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Enable RLS on new tables
ALTER TABLE public.income_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_deductions ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies
CREATE POLICY "Users can manage own income sources" ON public.income_sources
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own salaries" ON public.salaries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own salary deductions" ON public.salary_deductions
  FOR ALL USING (auth.uid() = user_id);

-- 7. Create triggers for updated_at
CREATE TRIGGER update_income_sources_updated_at BEFORE UPDATE ON public.income_sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_salaries_updated_at BEFORE UPDATE ON public.salaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_income_sources_user_id ON public.income_sources(user_id);
CREATE INDEX IF NOT EXISTS idx_salaries_user_id ON public.salaries(user_id);
CREATE INDEX IF NOT EXISTS idx_salaries_income_source_id ON public.salaries(income_source_id);
CREATE INDEX IF NOT EXISTS idx_salaries_pay_date ON public.salaries(pay_date);
CREATE INDEX IF NOT EXISTS idx_salary_deductions_user_id ON public.salary_deductions(user_id);
CREATE INDEX IF NOT EXISTS idx_salary_deductions_salary_id ON public.salary_deductions(salary_id);
CREATE INDEX IF NOT EXISTS idx_salary_deductions_date ON public.salary_deductions(date);

-- 9. Create function to automatically deduct from salary when expense is created
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create trigger for automatic salary deduction on expense creation
DROP TRIGGER IF EXISTS trigger_deduct_from_salary_expense ON public.expenses;
CREATE TRIGGER trigger_deduct_from_salary_expense
  AFTER INSERT ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.deduct_from_salary();

-- 11. Create function to automatically deduct from salary when investment is created
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Create trigger for automatic salary deduction on investment creation
DROP TRIGGER IF EXISTS trigger_deduct_from_salary_investment ON public.investments;
CREATE TRIGGER trigger_deduct_from_salary_investment
  AFTER INSERT ON public.investments
  FOR EACH ROW EXECUTE FUNCTION public.deduct_from_salary_investment();

-- 13. Create function to get salary summary
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Grant permissions
GRANT EXECUTE ON FUNCTION public.get_salary_summary(UUID) TO authenticated;
