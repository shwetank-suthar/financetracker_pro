-- Add missing columns to investments table
-- Run this in your Supabase SQL Editor

-- Add the missing columns that the application needs
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS purchase_date DATE;
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS broker VARCHAR(100);

-- Add SIP-specific columns
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS sip_amount DECIMAL(10,2);
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS sip_frequency VARCHAR(20);
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS sip_duration_months INTEGER;
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS sip_start_date DATE;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'investments' 
AND table_schema = 'public'
ORDER BY ordinal_position;
