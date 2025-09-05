-- Check SIP Investments
-- Run this SQL in your Supabase SQL Editor to see your SIP data

-- 1. Check if SIP tables exist
SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('investments', 'sip_entries') THEN 'SIP Tables'
    ELSE 'Other Tables'
  END as table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('investments', 'sip_entries', 'expenses', 'accounts')
ORDER BY table_name;

-- 2. Check all investments (including SIPs)
SELECT 
  id,
  name,
  type,
  invested_amount,
  current_value,
  sip_amount,
  sip_frequency,
  sip_duration_months,
  sip_start_date,
  created_at
FROM public.investments 
ORDER BY created_at DESC;

-- 3. Check SIP entries (if table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sip_entries') THEN
        RAISE NOTICE 'SIP entries table exists';
    ELSE
        RAISE NOTICE 'SIP entries table does NOT exist - you need to run sip-database-schema.sql';
    END IF;
END $$;

-- 4. If SIP entries table exists, show the data
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sip_entries') THEN
        PERFORM * FROM public.sip_entries LIMIT 1;
        RAISE NOTICE 'SIP entries found: %', (SELECT COUNT(*) FROM public.sip_entries);
    END IF;
END $$;

-- 5. Show investment summary
SELECT 
  COUNT(*) as total_investments,
  SUM(invested_amount) as total_invested,
  SUM(current_value) as total_current_value,
  COUNT(CASE WHEN sip_amount IS NOT NULL THEN 1 END) as sip_investments
FROM public.investments;
