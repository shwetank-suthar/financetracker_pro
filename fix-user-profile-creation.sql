-- Fix user profile creation issue
-- This script ensures that user profiles are created properly

-- First, let's check if the trigger function exists and works
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into public.users table
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

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to sync existing users
CREATE OR REPLACE FUNCTION public.sync_existing_users()
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
  WHERE pu.id IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the sync function to fix existing users
SELECT public.sync_existing_users();

-- Also create a function to ensure user profile exists before operations
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
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
