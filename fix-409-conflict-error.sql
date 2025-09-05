-- Fix 409 Conflict Error for User Profile Creation
-- This script updates the database trigger to handle duplicate user creation gracefully

-- Update the trigger function to handle conflicts properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into public.users table with conflict handling
  INSERT INTO public.users (id, email, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'fullName', 'User'),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the ensure_user_profile function to handle conflicts
CREATE OR REPLACE FUNCTION public.ensure_user_profile(user_id UUID)
RETURNS void AS $$
BEGIN
  -- Check if user exists in public.users, if not create it
  INSERT INTO public.users (id, email, full_name, created_at, updated_at)
  SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'fullName', 'User'),
    au.created_at,
    NOW()
  FROM auth.users au
  WHERE au.id = user_id
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to safely sync existing users without conflicts
CREATE OR REPLACE FUNCTION public.sync_existing_users_safe()
RETURNS void AS $$
BEGIN
  -- Insert missing users from auth.users to public.users
  INSERT INTO public.users (id, email, full_name, created_at, updated_at)
  SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'fullName', 'User'),
    au.created_at,
    NOW()
  FROM auth.users au
  LEFT JOIN public.users pu ON au.id = pu.id
  WHERE pu.id IS NULL
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the safe sync function
SELECT public.sync_existing_users_safe();

-- Verify the fix
SELECT 
  'Users in auth.users' as table_name,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Users in public.users' as table_name,
  COUNT(*) as count
FROM public.users;
