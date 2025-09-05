-- Fix get_salary_summary function
-- Run this SQL in your Supabase SQL Editor

-- Drop and recreate the function with fixed type handling
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
    CASE 
      WHEN s.pay_frequency = 'monthly' THEN
        CASE 
          WHEN EXTRACT(DAY FROM CURRENT_DATE) < s.pay_day THEN
            -- Next pay date is this month
            (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day' + INTERVAL '1 day' * s.pay_day)::DATE
          ELSE
            -- Next pay date is next month
            (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '2 months' - INTERVAL '1 day' + INTERVAL '1 day' * s.pay_day)::DATE
        END
      WHEN s.pay_frequency = 'weekly' THEN
        (CURRENT_DATE + INTERVAL '7 days')::DATE
      WHEN s.pay_frequency = 'bi-weekly' THEN
        (CURRENT_DATE + INTERVAL '14 days')::DATE
      WHEN s.pay_frequency = 'quarterly' THEN
        (CURRENT_DATE + INTERVAL '3 months')::DATE
      WHEN s.pay_frequency = 'yearly' THEN
        (CURRENT_DATE + INTERVAL '1 year')::DATE
      ELSE 
        s.pay_date
    END as next_pay_date,
    CASE 
      WHEN s.pay_frequency = 'monthly' THEN
        CASE 
          WHEN EXTRACT(DAY FROM CURRENT_DATE) < s.pay_day THEN
            -- Days until pay this month
            s.pay_day - EXTRACT(DAY FROM CURRENT_DATE)::INTEGER
          ELSE
            -- Days until pay next month
            EXTRACT(DAY FROM (
              (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '2 months' - INTERVAL '1 day' + INTERVAL '1 day' * s.pay_day) - CURRENT_DATE
            ))::INTEGER
        END
      WHEN s.pay_frequency = 'weekly' THEN
        7
      WHEN s.pay_frequency = 'bi-weekly' THEN
        14
      WHEN s.pay_frequency = 'quarterly' THEN
        EXTRACT(DAY FROM (CURRENT_DATE + INTERVAL '3 months' - CURRENT_DATE))::INTEGER
      WHEN s.pay_frequency = 'yearly' THEN
        EXTRACT(DAY FROM (CURRENT_DATE + INTERVAL '1 year' - CURRENT_DATE))::INTEGER
      ELSE 
        (s.pay_date - CURRENT_DATE)::INTEGER
    END as days_until_pay
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
