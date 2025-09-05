# Fix Foreign Key Constraint Error

## 🚨 **Problem**
```
insert or update on table "expenses" violates foreign key constraint "expenses_user_id_fkey"
```

This error occurs because the user exists in Supabase's `auth.users` table but not in your custom `public.users` table.

## 🔧 **Solution Steps**

### **Step 1: Run Database Fix Script**

Execute this SQL in your Supabase SQL Editor:

```sql
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
```

### **Step 2: Verify the Fix**

1. **Check if users were synced**:
   ```sql
   -- Check users in public.users table
   SELECT id, email, full_name, created_at FROM public.users;
   
   -- Check users in auth.users table
   SELECT id, email, raw_user_meta_data FROM auth.users;
   ```

2. **Test adding an expense**:
   - Go to your dashboard
   - Click "Add Expense"
   - Fill out the form and submit
   - Verify no errors occur

### **Step 3: Alternative Manual Fix (if needed)**

If the above doesn't work, you can manually create the user profile:

```sql
-- Replace 'YOUR_USER_ID' with your actual user ID from auth.users
INSERT INTO public.users (id, email, full_name, created_at, updated_at)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'fullName', 'User'),
  created_at,
  NOW()
FROM auth.users 
WHERE id = 'YOUR_USER_ID'
ON CONFLICT (id) DO NOTHING;
```

## 🎯 **What This Fix Does**

### **Database Level:**
1. **Creates/Updates Trigger**: Automatically creates user profiles when new users sign up
2. **Syncs Existing Users**: Moves existing users from `auth.users` to `public.users`
3. **Ensures Profile Exists**: Creates a function to check and create profiles before operations

### **Application Level:**
1. **Automatic Profile Creation**: The `createExpense` method now ensures user profile exists
2. **Fallback Mechanisms**: Multiple fallback methods if the primary method fails
3. **Error Handling**: Graceful handling of profile creation errors

## 🔍 **Root Cause**

The issue occurs because:
1. **Supabase Auth** creates users in `auth.users` table
2. **Your App** expects users to exist in `public.users` table
3. **Foreign Key Constraint** prevents inserting expenses without valid `user_id` in `public.users`

## ✅ **Expected Results**

After applying this fix:
- ✅ **New registrations** will automatically create profiles in `public.users`
- ✅ **Existing users** will be synced to `public.users`
- ✅ **Adding expenses** will work without foreign key errors
- ✅ **All user operations** will work properly

## 🚀 **Testing**

1. **Try adding an expense** from the dashboard
2. **Check the console** for any errors
3. **Verify the expense** appears in your dashboard
4. **Test with a new user** registration

Your expense tracking should now work perfectly! 🎉
