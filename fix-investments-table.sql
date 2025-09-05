-- Fix investments table schema
-- Run this script in your Supabase SQL Editor

-- 1. Add SIP-specific columns to investments table
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS sip_amount DECIMAL(10,2);
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS sip_frequency VARCHAR(20);
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS sip_duration_months INTEGER;
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS sip_start_date DATE;

-- 2. Add other missing columns that might be needed
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS purchase_date DATE;
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS broker VARCHAR(100);
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS notes TEXT;

-- 3. Create SIP entries table if it doesn't exist
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

-- 4. Enable RLS on sip_entries table
ALTER TABLE public.sip_entries ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for sip_entries
CREATE POLICY "Users can manage own SIP entries" ON public.sip_entries
  FOR ALL USING (auth.uid() = user_id);

-- 6. Create trigger for updated_at on sip_entries
CREATE TRIGGER update_sip_entries_updated_at BEFORE UPDATE ON public.sip_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sip_entries_user_id ON public.sip_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_sip_entries_sip_id ON public.sip_entries(sip_id);
CREATE INDEX IF NOT EXISTS idx_sip_entries_date ON public.sip_entries(date);
CREATE INDEX IF NOT EXISTS idx_sip_entries_status ON public.sip_entries(status);

-- 8. Verify the investments table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'investments' 
AND table_schema = 'public'
ORDER BY ordinal_position;
