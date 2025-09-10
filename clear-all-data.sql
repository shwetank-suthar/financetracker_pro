-- Clear All Data Script for FinanceTracker Pro
-- This will delete ALL data and reset the database to a fresh state
-- WARNING: This will permanently delete all user data, expenses, investments, etc.

-- Disable foreign key checks temporarily
SET session_replication_role = replica;

-- Clear all user data tables (in correct order due to foreign keys)
DELETE FROM public.sip_entries;
DELETE FROM public.salary_deductions;
DELETE FROM public.salaries;
DELETE FROM public.income_sources;
DELETE FROM public.transactions;
DELETE FROM public.budgets;
DELETE FROM public.investments;
DELETE FROM public.expenses;
DELETE FROM public.accounts;
DELETE FROM public.payment_methods;
DELETE FROM public.categories;
DELETE FROM public.users;

-- Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- Reset sequences (if any)
-- Note: PostgreSQL doesn't have sequences for UUID primary keys, but if you have any serial columns, reset them here

-- Insert default categories and payment methods for fresh start
INSERT INTO public.categories (id, name, type, icon, color, user_id, created_at) VALUES
(gen_random_uuid(), 'Food & Dining', 'food', 'Utensils', '#FF6B6B', NULL, NOW()),
(gen_random_uuid(), 'Transportation', 'transportation', 'Car', '#4ECDC4', NULL, NOW()),
(gen_random_uuid(), 'Shopping', 'shopping', 'ShoppingBag', '#45B7D1', NULL, NOW()),
(gen_random_uuid(), 'Entertainment', 'entertainment', 'Film', '#96CEB4', NULL, NOW()),
(gen_random_uuid(), 'Bills & Utilities', 'bills', 'FileText', '#FFEAA7', NULL, NOW()),
(gen_random_uuid(), 'Healthcare', 'healthcare', 'Heart', '#DDA0DD', NULL, NOW()),
(gen_random_uuid(), 'Education', 'education', 'BookOpen', '#98D8C8', NULL, NOW()),
(gen_random_uuid(), 'Groceries', 'groceries', 'ShoppingCart', '#F7DC6F', NULL, NOW()),
(gen_random_uuid(), 'Travel', 'travel', 'Plane', '#BB8FCE', NULL, NOW()),
(gen_random_uuid(), 'Other', 'other', 'MoreHorizontal', '#85C1E9', NULL, NOW());

INSERT INTO public.payment_methods (id, name, type, icon, color, user_id, created_at) VALUES
(gen_random_uuid(), 'Cash', 'cash', 'Banknote', '#2ECC71', NULL, NOW()),
(gen_random_uuid(), 'Credit Card', 'credit-card', 'CreditCard', '#E74C3C', NULL, NOW()),
(gen_random_uuid(), 'Debit Card', 'debit-card', 'CreditCard', '#3498DB', NULL, NOW()),
(gen_random_uuid(), 'UPI', 'upi', 'Smartphone', '#9B59B6', NULL, NOW()),
(gen_random_uuid(), 'Net Banking', 'net-banking', 'Globe', '#1ABC9C', NULL, NOW()),
(gen_random_uuid(), 'Digital Wallet', 'wallet', 'Wallet', '#F39C12', NULL, NOW()),
(gen_random_uuid(), 'Cheque', 'cheque', 'FileText', '#34495E', NULL, NOW()),
(gen_random_uuid(), 'Other', 'other', 'MoreHorizontal', '#95A5A6', NULL, NOW());

-- Show completion message
SELECT 'All data cleared successfully! Database is now fresh and ready for new users.' as status;
