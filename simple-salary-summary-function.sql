-- Simple get_salary_summary function (less prone to type errors)
-- Run this SQL in your Supabase SQL Editor

-- Drop and recreate the function with simpler logic
DROP FUNCTION IF EXISTS public.get_salary_summary(UUID);

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
    s.pay_date as next_pay_date,
    (s.pay_date - CURRENT_DATE)::INTEGER as days_until_pay
  FROM public.salaries s
  WHERE s.user_id = user_uuid
    AND s.is_recurring = true
    AND (s.end_date IS NULL OR s.end_date >= CURRENT_DATE)
  ORDER BY s.pay_date DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_salary_summary(UUID) TO authenticated;
