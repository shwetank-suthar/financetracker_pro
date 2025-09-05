-- Add 'sip' to investment_type enum
-- Run this in your Supabase SQL Editor

-- Add 'sip' to the investment_type enum
ALTER TYPE investment_type ADD VALUE 'sip';

-- Verify the enum values
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (
  SELECT oid 
  FROM pg_type 
  WHERE typname = 'investment_type'
)
ORDER BY enumsortorder;
