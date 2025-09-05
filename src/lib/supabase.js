import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database table names
export const TABLES = {
  USERS: 'users',
  EXPENSES: 'expenses',
  CATEGORIES: 'categories',
  PAYMENT_METHODS: 'payment_methods',
  INVESTMENTS: 'investments',
  BUDGETS: 'budgets',
  ACCOUNTS: 'accounts',
  SIP_ENTRIES: 'sip_entries',
  INCOME_SOURCES: 'income_sources',
  SALARIES: 'salaries',
  SALARY_DEDUCTIONS: 'salary_deductions'
}

// Helper function to handle Supabase errors
export const handleSupabaseError = (error, operation = 'operation') => {
  console.error(`Supabase ${operation} error:`, error)
  throw new Error(error.message || `Failed to ${operation}`)
}

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    handleSupabaseError(error, 'get current user')
  }
  return user
}

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}
