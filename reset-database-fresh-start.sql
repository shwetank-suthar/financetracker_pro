-- Reset Database - Fresh Start
-- This script deletes all data from all tables while keeping the table structure
-- Run this SQL in your Supabase SQL Editor

-- ⚠️ WARNING: This will delete ALL data from your database!
-- Make sure you want to start completely fresh before running this script.

-- 1. Delete all salary deductions first (due to foreign key constraints)
-- Only delete if table exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salary_deductions') THEN
        DELETE FROM public.salary_deductions;
    END IF;
END $$;

-- 2. Delete all SIP entries
-- Only delete if table exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sip_entries') THEN
        DELETE FROM public.sip_entries;
    END IF;
END $$;

-- 3. Delete all expenses
DELETE FROM public.expenses;

-- 4. Delete all investments
DELETE FROM public.investments;

-- 5. Delete all budgets
DELETE FROM public.budgets;

-- 6. Delete all accounts
DELETE FROM public.accounts;

-- 7. Delete all transactions
DELETE FROM public.transactions;

-- 8. Delete all salaries
-- Only delete if table exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salaries') THEN
        DELETE FROM public.salaries;
    END IF;
END $$;

-- 9. Delete all income sources
-- Only delete if table exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'income_sources') THEN
        DELETE FROM public.income_sources;
    END IF;
END $$;

-- 10. Delete all payment methods
DELETE FROM public.payment_methods;

-- 11. Delete all categories
DELETE FROM public.categories;

-- 12. Delete all users from public.users (but keep auth.users for login)
DELETE FROM public.users;

-- 13. Reset any sequences if they exist
-- (This ensures new records start with ID 1)

-- 14. Verify all tables are empty
SELECT 
  'expenses' as table_name, COUNT(*) as count FROM public.expenses
UNION ALL
SELECT 
  'investments' as table_name, COUNT(*) as count FROM public.investments
UNION ALL
SELECT 
  'budgets' as table_name, COUNT(*) as count FROM public.budgets
UNION ALL
SELECT 
  'accounts' as table_name, COUNT(*) as count FROM public.accounts
UNION ALL
SELECT 
  'transactions' as table_name, COUNT(*) as count FROM public.transactions
UNION ALL
SELECT 
  'payment_methods' as table_name, COUNT(*) as count FROM public.payment_methods
UNION ALL
SELECT 
  'categories' as table_name, COUNT(*) as count FROM public.categories
UNION ALL
SELECT 
  'users' as table_name, COUNT(*) as count FROM public.users;

-- Check if salary-related tables exist and show their counts
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salary_deductions') THEN
        RAISE NOTICE 'salary_deductions table exists and has % records', (SELECT COUNT(*) FROM public.salary_deductions);
    ELSE
        RAISE NOTICE 'salary_deductions table does not exist';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salaries') THEN
        RAISE NOTICE 'salaries table exists and has % records', (SELECT COUNT(*) FROM public.salaries);
    ELSE
        RAISE NOTICE 'salaries table does not exist';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'income_sources') THEN
        RAISE NOTICE 'income_sources table exists and has % records', (SELECT COUNT(*) FROM public.income_sources);
    ELSE
        RAISE NOTICE 'income_sources table does not exist';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sip_entries') THEN
        RAISE NOTICE 'sip_entries table exists and has % records', (SELECT COUNT(*) FROM public.sip_entries);
    ELSE
        RAISE NOTICE 'sip_entries table does not exist';
    END IF;
END $$;

-- 15. Show confirmation message
SELECT 'Database reset complete! All tables are now empty and ready for fresh data.' as status;
