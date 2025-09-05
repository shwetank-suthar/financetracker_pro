-- SIP Database Schema Updates
-- Run this script in your Supabase SQL Editor

-- 1. Add SIP-specific columns to investments table
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS sip_amount DECIMAL(10,2);
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS sip_frequency VARCHAR(20);
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS sip_duration_months INTEGER;
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS sip_start_date DATE;

-- 2. Create SIP entries table
CREATE TABLE IF NOT EXISTS public.sip_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sip_id UUID REFERENCES public.investments(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS on sip_entries table
ALTER TABLE public.sip_entries ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for sip_entries
CREATE POLICY "Users can manage own SIP entries" ON public.sip_entries
  FOR ALL USING (auth.uid() = user_id);

-- 5. Create trigger for updated_at on sip_entries
CREATE TRIGGER update_sip_entries_updated_at BEFORE UPDATE ON public.sip_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sip_entries_user_id ON public.sip_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_sip_entries_sip_id ON public.sip_entries(sip_id);
CREATE INDEX IF NOT EXISTS idx_sip_entries_date ON public.sip_entries(date);
CREATE INDEX IF NOT EXISTS idx_sip_entries_status ON public.sip_entries(status);

-- 7. Create a function to get SIP progress
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create a function to get upcoming SIP dates
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create a view for SIP summary
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

-- 10. Grant permissions
GRANT SELECT ON public.sip_summary TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_sip_progress(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_upcoming_sips(UUID) TO authenticated;
