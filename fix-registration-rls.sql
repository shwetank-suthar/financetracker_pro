-- Fix RLS policies for user registration
-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

-- Create a new policy that allows users to insert their own profile
-- This policy allows insertion when the user ID matches the authenticated user
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Alternative: If the above still doesn't work, we can temporarily disable RLS for inserts
-- and handle security at the application level
-- ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS (uncomment if you disabled it above)
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create a function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'fullName'),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
