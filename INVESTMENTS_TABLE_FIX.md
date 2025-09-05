# Fix: Investments Table Schema Issues

## 🚨 **Problem**
```
Could not find the 'amount' column of 'investments' in the schema cache
```

This error occurs because the `investments` table schema doesn't match what the application expects.

## 🔧 **Solution**

### **Step 1: Run Database Schema Fix**

Execute this SQL in your Supabase SQL Editor:

```sql
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
```

### **Step 2: Verify the Fix**

After running the SQL, verify the investments table structure:

```sql
-- Check investments table columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'investments' 
AND table_schema = 'public'
ORDER BY ordinal_position;
```

## 📋 **What Was Fixed**

### **Database Schema Issues:**
- ✅ **Missing `amount` column** - Fixed by using `invested_amount` instead
- ✅ **Missing SIP columns** - Added `sip_amount`, `sip_frequency`, `sip_duration_months`, `sip_start_date`
- ✅ **Missing utility columns** - Added `purchase_date`, `broker`, `notes`
- ✅ **Missing SIP entries table** - Created `sip_entries` table for SIP tracking

### **Application Code Issues:**
- ✅ **Column mapping** - Fixed `amount` → `invested_amount` mapping
- ✅ **SIP field handling** - Proper handling of SIP-specific fields
- ✅ **Error handling** - Better error handling for missing columns

## 🎯 **Current Investments Table Structure**

After the fix, your `investments` table will have:

### **Core Columns:**
- `id` - Primary key
- `name` - Investment name
- `symbol` - Investment symbol (optional)
- `type` - Investment type
- `current_value` - Current market value
- `invested_amount` - Total amount invested
- `quantity` - Number of units/shares
- `current_price` - Current price per unit
- `gain_loss` - Calculated gain/loss
- `change_percent` - Calculated percentage change

### **SIP Columns (NEW):**
- `sip_amount` - Monthly SIP amount
- `sip_frequency` - SIP frequency (monthly/quarterly/yearly)
- `sip_duration_months` - SIP duration in months
- `sip_start_date` - SIP start date

### **Utility Columns (NEW):**
- `purchase_date` - When investment was made
- `broker` - Broker/platform used
- `notes` - Additional notes

### **System Columns:**
- `user_id` - User who owns the investment
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## 🚀 **How It Works Now**

### **Regular Investment Creation:**
1. **User fills form** → Investment data collected
2. **System maps fields** → `amount` → `invested_amount`
3. **Database insert** → Uses correct column names
4. **Success** → Investment created without errors

### **SIP Investment Creation:**
1. **User fills SIP form** → SIP data collected
2. **System creates investment** → With SIP-specific fields
3. **System creates SIP entries** → Individual installment records
4. **Success** → SIP plan created with automatic entries

## ✅ **Expected Results**

After applying this fix:

- ✅ **No more "amount column not found" errors**
- ✅ **Investment creation works perfectly**
- ✅ **SIP creation works with automatic entries**
- ✅ **All investment types supported**
- ✅ **Proper data storage in Supabase**

## 🧪 **Testing**

### **Test Regular Investment:**
1. Go to dashboard
2. Click "Add Investment"
3. Select any investment type (except SIP)
4. Fill out the form
5. Submit - should work without errors

### **Test SIP Investment:**
1. Go to dashboard
2. Click "Add Investment"
3. Select "SIP (Systematic Investment Plan)"
4. Fill out SIP details
5. Submit - should create SIP with automatic entries

Your investment module should now work perfectly! 🎉
