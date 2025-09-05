import { supabase, TABLES, handleSupabaseError, getCurrentUser } from '../lib/supabase.js'

// ==================== AUTHENTICATION ====================

export const authService = {
  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      
      if (error) throw error
      
      // The user profile will be created automatically by the trigger
      // No need to manually create it here
      
      return data
    } catch (error) {
      handleSupabaseError(error, 'sign up')
    }
  },

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error, 'sign in')
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      handleSupabaseError(error, 'sign out')
    }
  },

  // Get current session
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return session
    } catch (error) {
      handleSupabaseError(error, 'get session')
    }
  },

  // Create user profile
  async createUserProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .insert([{
          id: userId,
          email: profileData.email,
          full_name: profileData.full_name || profileData.fullName,
          phone: profileData.phone,
          date_of_birth: profileData.date_of_birth || profileData.dateOfBirth
        }])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error, 'create user profile')
    }
  },

  // Get user profile
  async getUserProfile(userId = null) {
    try {
      const userIdToUse = userId || (await getCurrentUser())?.id
      if (!userIdToUse) throw new Error('No user ID provided')
      
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', userIdToUse)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error, 'get user profile')
    }
  }
}

// ==================== EXPENSES ====================

export const expenseService = {
  // Get all expenses for a user
  async getExpenses(filters = {}) {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      let query = supabase
        .from(TABLES.EXPENSES)
        .select(`
          *,
          account:accounts(name, type)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false })
      
      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      
      if (filters.payment_method) {
        query = query.eq('payment_method', filters.payment_method)
      }
      
      if (filters.dateFrom) {
        query = query.gte('date', filters.dateFrom)
      }
      
      if (filters.dateTo) {
        query = query.lte('date', filters.dateTo)
      }
      
      if (filters.minAmount) {
        query = query.gte('amount', filters.minAmount)
      }
      
      if (filters.maxAmount) {
        query = query.lte('amount', filters.maxAmount)
      }
      
      if (filters.search) {
        query = query.or(`description.ilike.%${filters.search}%,category.ilike.%${filters.search}%`)
      }
      
      const { data, error } = await query
      if (error) throw error
      
      return data || []
    } catch (error) {
      handleSupabaseError(error, 'get expenses')
    }
  },

  // Create a new expense
  async createExpense(expenseData) {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      // Ensure user profile exists in public.users table
      await this.ensureUserProfile(user.id)
      
      const { data, error } = await supabase
        .from(TABLES.EXPENSES)
        .insert([{
          ...expenseData,
          user_id: user.id,
          amount: parseFloat(expenseData.amount),
          date: expenseData.date,
          tags: expenseData.tags || []
        }])
        .select()
        .single()
      
      if (error) throw error
      
      // Update account balance if account_id is provided
      if (expenseData.account_id) {
        await this.updateAccountBalance(expenseData.account_id, -expenseData.amount)
      }
      
      return data
    } catch (error) {
      handleSupabaseError(error, 'create expense')
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
  },

  // Update an expense
  async updateExpense(expenseId, updateData) {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from(TABLES.EXPENSES)
        .update({
          ...updateData,
          amount: updateData.amount ? parseFloat(updateData.amount) : undefined,
          updated_at: new Date().toISOString()
        })
        .eq('id', expenseId)
        .eq('user_id', user.id)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error, 'update expense')
    }
  },

  // Delete an expense
  async deleteExpense(expenseId) {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      // Get expense data before deletion for account balance update
      const { data: expense } = await supabase
        .from(TABLES.EXPENSES)
        .select('account_id, amount')
        .eq('id', expenseId)
        .eq('user_id', user.id)
        .single()
      
      const { error } = await supabase
        .from(TABLES.EXPENSES)
        .delete()
        .eq('id', expenseId)
        .eq('user_id', user.id)
      
      if (error) throw error
      
      // Restore account balance if account_id was present
      if (expense?.account_id) {
        await this.updateAccountBalance(expense.account_id, expense.amount)
      }
      
      return true
    } catch (error) {
      handleSupabaseError(error, 'delete expense')
    }
  },

  // Get expense statistics
  async getExpenseStats(filters = {}) {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      let query = supabase
        .from(TABLES.EXPENSES)
        .select('amount, category, date, payment_method')
        .eq('user_id', user.id)
      
      // Apply date filters
      if (filters.dateFrom) {
        query = query.gte('date', filters.dateFrom)
      }
      
      if (filters.dateTo) {
        query = query.lte('date', filters.dateTo)
      }
      
      const { data, error } = await query
      if (error) throw error
      
      const totalExpenses = data.reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
      const categoryBreakdown = data.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount)
        return acc
      }, {})
      
      const paymentMethodBreakdown = data.reduce((acc, expense) => {
        acc[expense.payment_method] = (acc[expense.payment_method] || 0) + parseFloat(expense.amount)
        return acc
      }, {})
      
      return {
        totalExpenses,
        categoryBreakdown,
        paymentMethodBreakdown,
        transactionCount: data.length
      }
    } catch (error) {
      handleSupabaseError(error, 'get expense stats')
    }
  },

  // Update account balance helper
  async updateAccountBalance(accountId, amountChange) {
    try {
      const { data, error } = await supabase.rpc('update_account_balance', {
        account_id: accountId,
        amount_change: amountChange
      })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating account balance:', error)
    }
  }
}

// ==================== ACCOUNTS ====================

export const accountService = {
  // Get all accounts for a user
  async getAccounts() {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from(TABLES.ACCOUNTS)
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('name')
      
      if (error) throw error
      return data || []
    } catch (error) {
      handleSupabaseError(error, 'get accounts')
    }
  },

  // Create a new account
  async createAccount(accountData) {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from(TABLES.ACCOUNTS)
        .insert([{
          ...accountData,
          user_id: user.id,
          balance: parseFloat(accountData.balance || 0)
        }])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error, 'create account')
    }
  },

  // Update an account
  async updateAccount(accountId, updateData) {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from(TABLES.ACCOUNTS)
        .update({
          ...updateData,
          balance: updateData.balance ? parseFloat(updateData.balance) : undefined,
          updated_at: new Date().toISOString()
        })
        .eq('id', accountId)
        .eq('user_id', user.id)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error, 'update account')
    }
  },

  // Delete an account
  async deleteAccount(accountId) {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      const { error } = await supabase
        .from(TABLES.ACCOUNTS)
        .update({ is_active: false })
        .eq('id', accountId)
        .eq('user_id', user.id)
      
      if (error) throw error
      return true
    } catch (error) {
      handleSupabaseError(error, 'delete account')
    }
  }
}

// ==================== INVESTMENTS ====================

export const investmentService = {
  // Get all investments for a user
  async getInvestments() {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from(TABLES.INVESTMENTS)
        .select(`
          *,
          account:accounts(name, type)
        `)
        .eq('user_id', user.id)
        .order('name')
      
      if (error) throw error
      return data || []
    } catch (error) {
      handleSupabaseError(error, 'get investments')
    }
  },

  // Create a new investment
  async createInvestment(investmentData) {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      // Ensure user profile exists
      await this.ensureUserProfile(user.id)
      
      // Build insert data with only existing columns
      const insertData = {
        user_id: user.id,
        name: investmentData.name,
        type: investmentData.type,
        current_value: parseFloat(investmentData.current_value || investmentData.amount),
        invested_amount: parseFloat(investmentData.amount),
        quantity: investmentData.quantity ? parseFloat(investmentData.quantity) : null,
        current_price: investmentData.current_price ? parseFloat(investmentData.current_price) : investmentData.purchase_price ? parseFloat(investmentData.purchase_price) : null
      };

      // Add optional fields if they exist in the data
      if (investmentData.notes) insertData.notes = investmentData.notes;
      if (investmentData.purchase_date) insertData.purchase_date = investmentData.purchase_date;
      if (investmentData.broker) insertData.broker = investmentData.broker;
      if (investmentData.sip_amount) insertData.sip_amount = parseFloat(investmentData.sip_amount);
      if (investmentData.sip_frequency) insertData.sip_frequency = investmentData.sip_frequency;
      if (investmentData.sip_duration_months) insertData.sip_duration_months = investmentData.sip_duration_months;
      if (investmentData.sip_start_date) insertData.sip_start_date = investmentData.sip_start_date;

      const { data, error } = await supabase
        .from(TABLES.INVESTMENTS)
        .insert([insertData])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error, 'create investment')
    }
  },

  // Create SIP entries
  async createSIPEntries(sipEntries) {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      // Ensure user profile exists
      await this.ensureUserProfile(user.id)
      
      const { data, error } = await supabase
        .from(TABLES.SIP_ENTRIES)
        .insert(sipEntries.map(entry => ({
          ...entry,
          user_id: user.id
        })))
        .select()
      
      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error, 'create SIP entries')
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
  },

  // Update an investment
  async updateInvestment(investmentId, updateData) {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from(TABLES.INVESTMENTS)
        .update({
          ...updateData,
          current_value: updateData.current_value ? parseFloat(updateData.current_value) : undefined,
          invested_amount: updateData.invested_amount ? parseFloat(updateData.invested_amount) : undefined,
          quantity: updateData.quantity ? parseFloat(updateData.quantity) : undefined,
          current_price: updateData.current_price ? parseFloat(updateData.current_price) : undefined,
          updated_at: new Date().toISOString()
        })
        .eq('id', investmentId)
        .eq('user_id', user.id)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error, 'update investment')
    }
  },

  // Delete an investment
  async deleteInvestment(investmentId) {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      const { error } = await supabase
        .from(TABLES.INVESTMENTS)
        .delete()
        .eq('id', investmentId)
        .eq('user_id', user.id)
      
      if (error) throw error
      return true
    } catch (error) {
      handleSupabaseError(error, 'delete investment')
    }
  }
}

// ==================== BUDGETS ====================

export const budgetService = {
  // Get all budgets for a user
  async getBudgets() {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from(TABLES.BUDGETS)
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('start_date', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      handleSupabaseError(error, 'get budgets')
    }
  },

  // Create a new budget
  async createBudget(budgetData) {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from(TABLES.BUDGETS)
        .insert([{
          ...budgetData,
          user_id: user.id,
          amount: parseFloat(budgetData.amount),
          spent: parseFloat(budgetData.spent || 0)
        }])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error, 'create budget')
    }
  },

  // Update budget spent amount
  async updateBudgetSpent(budgetId, spentAmount) {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from(TABLES.BUDGETS)
        .update({
          spent: parseFloat(spentAmount),
          updated_at: new Date().toISOString()
        })
        .eq('id', budgetId)
        .eq('user_id', user.id)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error, 'update budget spent')
    }
  }
}

// ==================== DASHBOARD DATA ====================

export const dashboardService = {
  // Get dashboard summary data
  async getDashboardData() {
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      // Get current month date range
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      
      // Get accounts
      const accounts = await accountService.getAccounts()
      const totalBalance = accounts.reduce((sum, account) => sum + parseFloat(account.balance), 0)
      
      // Get monthly expenses
      const monthlyExpenses = await expenseService.getExpenseStats({
        dateFrom: startOfMonth.toISOString().split('T')[0],
        dateTo: endOfMonth.toISOString().split('T')[0]
      })
      
      // Get investments
      const investments = await investmentService.getInvestments()
      const totalInvestmentValue = investments.reduce((sum, inv) => sum + parseFloat(inv.current_value), 0)
      const totalInvestmentGain = investments.reduce((sum, inv) => sum + parseFloat(inv.gain_loss), 0)
      
      // Get budgets
      const budgets = await budgetService.getBudgets()
      
      return {
        totalBalance,
        monthlyExpenses: monthlyExpenses.totalExpenses,
        totalInvestments: totalInvestmentValue,
        investmentGain: totalInvestmentGain,
        accounts,
        investments,
        budgets,
        expenseStats: monthlyExpenses
      }
    } catch (error) {
      handleSupabaseError(error, 'get dashboard data')
    }
  }
}
