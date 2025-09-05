import { supabase, TABLES, handleSupabaseError } from '../lib/supabase.js'

// Helper function to get current user
const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Income Service
export const incomeService = {
  // Get all income sources for a user
  async getIncomeSources() {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from(TABLES.INCOME_SOURCES)
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('name')
      
      if (error) throw error
      return data || []
    } catch (error) {
      handleSupabaseError(error, 'get income sources')
    }
  },

  // Create a new income source
  async createIncomeSource(incomeSourceData) {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from(TABLES.INCOME_SOURCES)
        .insert([{
          ...incomeSourceData,
          user_id: user.id
        }])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error, 'create income source')
    }
  },

  // Get all salaries for a user
  async getSalaries() {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from(TABLES.SALARIES)
        .select(`
          *,
          income_source:income_sources(name, type)
        `)
        .eq('user_id', user.id)
        .order('pay_date', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      handleSupabaseError(error, 'get salaries')
    }
  },

  // Get current active salary
  async getCurrentSalary() {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from(TABLES.SALARIES)
        .select(`
          *,
          income_source:income_sources(name, type)
        `)
        .eq('user_id', user.id)
        .eq('is_recurring', true)
        .lte('pay_date', new Date().toISOString().split('T')[0])
        .order('pay_date', { ascending: false })
        .limit(1)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
      return data || null
    } catch (error) {
      handleSupabaseError(error, 'get current salary')
    }
  },

  // Create a new salary
  async createSalary(salaryData) {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      // Ensure user profile exists
      await this.ensureUserProfile(user.id)
      
      const { data, error } = await supabase
        .from(TABLES.SALARIES)
        .insert([{
          ...salaryData,
          user_id: user.id,
          current_balance: salaryData.amount, // Initial balance equals salary amount
          total_received: salaryData.amount
        }])
        .select(`
          *,
          income_source:income_sources(name, type)
        `)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error, 'create salary')
    }
  },

  // Update salary
  async updateSalary(salaryId, updateData) {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from(TABLES.SALARIES)
        .update(updateData)
        .eq('id', salaryId)
        .eq('user_id', user.id)
        .select(`
          *,
          income_source:income_sources(name, type)
        `)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error, 'update salary')
    }
  },

  // Get salary summary (current balance, total received, total deducted, next pay date)
  async getSalarySummary() {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase.rpc('get_salary_summary', {
        user_uuid: user.id
      })
      
      if (error) throw error
      return data?.[0] || null
    } catch (error) {
      handleSupabaseError(error, 'get salary summary')
    }
  },

  // Get salary deductions
  async getSalaryDeductions(salaryId = null) {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      let query = supabase
        .from(TABLES.SALARY_DEDUCTIONS)
        .select(`
          *,
          salary:salaries(amount, pay_date, income_source:income_sources(name))
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false })
      
      if (salaryId) {
        query = query.eq('salary_id', salaryId)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data || []
    } catch (error) {
      handleSupabaseError(error, 'get salary deductions')
    }
  },

  // Add salary deduction manually
  async addSalaryDeduction(deductionData) {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from(TABLES.SALARY_DEDUCTIONS)
        .insert([{
          ...deductionData,
          user_id: user.id
        }])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error, 'add salary deduction')
    }
  },

  // Process salary payment (add new salary amount to balance)
  async processSalaryPayment(salaryId, amount) {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from(TABLES.SALARIES)
        .update({
          current_balance: amount,
          total_received: amount,
          total_deducted: 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', salaryId)
        .eq('user_id', user.id)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error, 'process salary payment')
    }
  },

  // Helper method to ensure user profile exists
  async ensureUserProfile(userId) {
    try {
      const { error } = await supabase.rpc('ensure_user_profile', {
        user_id: userId
      })
      
      if (error) {
        console.warn('Error ensuring user profile:', error)
        // If RPC fails, try direct insert as fallback
        await this.createUserProfileDirect(userId)
      }
    } catch (error) {
      console.warn('Error in ensureUserProfile:', error)
      // Fallback to direct profile creation
      await this.createUserProfileDirect(userId)
    }
  },

  // Fallback method to create user profile directly
  async createUserProfileDirect(userId) {
    try {
      // First check if user already exists
      const { data: existingUser } = await supabase
        .from(TABLES.USERS)
        .select('id')
        .eq('id', userId)
        .single()

      if (existingUser) {
        // User already exists, no need to create
        return
      }

      const { data: authUser } = await supabase.auth.getUser()
      if (!authUser.user || authUser.user.id !== userId) {
        throw new Error('User not found in auth')
      }

      const { error } = await supabase
        .from(TABLES.USERS)
        .insert([{
          id: userId,
          email: authUser.user.email,
          full_name: authUser.user.user_metadata?.full_name || authUser.user.user_metadata?.fullName || 'User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error && !error.message.includes('duplicate key')) {
        throw error
      }
    } catch (error) {
      console.warn('Error creating user profile directly:', error)
    }
  }
}
