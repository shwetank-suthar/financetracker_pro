-- Simple Reset - Delete Only Existing Tables
-- This script only deletes data from tables that actually exist
-- Run this SQL in your Supabase SQL Editor

-- ⚠️ WARNING: This will delete ALL data from existing tables!

-- Delete from existing tables only
DELETE FROM public.expenses;
DELETE FROM public.investments;
DELETE FROM public.budgets;
DELETE FROM public.accounts;
DELETE FROM public.transactions;
DELETE FROM public.payment_methods;
DELETE FROM public.categories;
DELETE FROM public.users;

-- Show what was deleted
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

-- Confirmation
SELECT 'Reset complete! All existing tables are now empty.' as status;
