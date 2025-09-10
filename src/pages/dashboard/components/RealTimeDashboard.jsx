import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { expenseService, accountService, budgetService, investmentService } from '../../../services/supabaseService'
import { generateFinancialInsights } from '../../../services/openaiService'
import Icon from '../../../components/AppIcon'
import Button from '../../../components/ui/Button'
import QuickAddExpense from '../../../components/ui/QuickAddExpense'
import QuickAddInvestment from '../../../components/ui/QuickAddInvestment'
import SalaryBalanceCard from '../../../components/ui/SalaryBalanceCard'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import voiceService from '../../../services/voiceService'

const RealTimeDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [expenses, setExpenses] = useState([])
  const [accounts, setAccounts] = useState([])
  const [budgets, setBudgets] = useState([])
  const [investments, setInvestments] = useState([])
  const [aiInsights, setAiInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  
  // Voice command states
  const [isListening, setIsListening] = useState(false)
  const [voiceError, setVoiceError] = useState(null)
  const [voiceInfo, setVoiceInfo] = useState('')

  const generateAIInsights = useCallback(async (expensesData, accountsData, investmentsData) => {
    try {
      const insights = await generateFinancialInsights({
        expenses: expensesData,
        accounts: accountsData,
        investments: investmentsData,
        userGoals: user?.user_metadata?.financial_goals || []
      })
      setAiInsights(insights)
    } catch (err) {
      console.error('Error generating AI insights:', err)
    }
  }, [user])

  const loadDashboardData = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Load all dashboard data in parallel
      const [expensesData, accountsData, budgetsData, investmentsData] = await Promise.all([
        expenseService.getExpenses(),
        accountService.getAccounts(),
        budgetService.getBudgets(),
        investmentService.getInvestments()
      ])

      setExpenses(expensesData)
      setAccounts(accountsData)
      setBudgets(budgetsData)
      setInvestments(investmentsData)

      // Generate AI insights
      await generateAIInsights(expensesData, accountsData, investmentsData)

      setLastUpdated(new Date().toISOString())
    } catch (err) {
      console.error('Error loading dashboard data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user, generateAIInsights])

  // Load dashboard data
  useEffect(() => {
    loadDashboardData()
  }, [user, loadDashboardData])

  // Calculate portfolio totals
  const portfolioTotals = investments.reduce((totals, investment) => {
    totals.totalValue += investment.current_value || 0
    totals.totalInvested += investment.invested_amount || 0
    totals.totalGainLoss += (investment.current_value || 0) - (investment.invested_amount || 0)
    return totals
  }, {
    totalValue: 0,
    totalInvested: 0,
    totalGainLoss: 0
  })

  portfolioTotals.totalGainLossPercent = portfolioTotals.totalInvested > 0 
    ? (portfolioTotals.totalGainLoss / portfolioTotals.totalInvested) * 100 
    : 0

  // Voice command handler
  const handleVoiceCommand = () => {
    setVoiceError(null)
    setVoiceInfo('')
    
    if (!voiceService.isSupported()) {
      setVoiceError('Voice recognition is not supported in this browser.')
      return
    }
    
    const rec = voiceService.createRecognition({ continuous: false, interimResults: false })
    if (!rec) return

    setIsListening(true)

    rec.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || ''
      handleVoiceTranscript(transcript)
    }
    
    rec.onerror = () => {
      setVoiceError('Could not capture voice. Please try again.')
    }
    
    rec.onend = () => setIsListening(false)
    rec.start()
  }

  const handleVoiceTranscript = (text) => {
    const lower = text.toLowerCase().trim()
    
    // Navigation commands
    if (/go to|navigate to|open|show/.test(lower)) {
      if (/expense|spending/.test(lower)) {
        navigate('/expense-tracking')
        setVoiceInfo('Navigating to expense tracking...')
      } else if (/investment|portfolio/.test(lower)) {
        navigate('/investment-portfolio')
        setVoiceInfo('Navigating to investment portfolio...')
      } else if (/report|analytics/.test(lower)) {
        navigate('/reports-analytics')
        setVoiceInfo('Navigating to reports...')
      } else if (/product|search|shop/.test(lower)) {
        navigate('/product-search')
        setVoiceInfo('Navigating to product search...')
      } else if (/dashboard|home/.test(lower)) {
        navigate('/dashboard')
        setVoiceInfo('Navigating to dashboard...')
      }
    }
    // Quick actions
    else if (/add expense|spent|bought/.test(lower)) {
      navigate('/expense-tracking')
      setVoiceInfo('Opening expense tracker to add expense...')
    }
    else if (/add investment|invest/.test(lower)) {
      navigate('/investment-portfolio')
      setVoiceInfo('Opening investment portfolio...')
    }
    else if (/search product|find product|buy/.test(lower)) {
      navigate('/product-search')
      setVoiceInfo('Opening product search...')
    }
    // General queries
    else if (/how much|total|balance|summary/.test(lower)) {
      const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
      const totalInvestments = investments.reduce((sum, i) => sum + (i.current_value || 0), 0)
      setVoiceInfo(`Total expenses: ₹${totalExpenses.toLocaleString()}, Investments: ₹${totalInvestments.toLocaleString()}`)
    }
    else {
      setVoiceInfo(`I heard: "${text}". Try saying "go to expense tracking" or "add expense"`)
    }
  }

  // Auto-refresh disabled for better performance
  // useEffect(() => {
  //   if (user) {
  //     const interval = setInterval(() => {
  //       loadDashboardData()
  //     }, 2 * 60 * 1000) // 2 minutes

  //     return () => clearInterval(interval)
  //   }
  // }, [user])

  // Calculate spending trends for charts
  const getSpendingTrends = () => {
    const last30Days = []
    const today = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayExpenses = expenses.filter(expense => 
        expense.date === dateStr
      )
      
      const totalAmount = dayExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)
      
      last30Days.push({
        date: dateStr,
        amount: totalAmount,
        count: dayExpenses.length
      })
    }
    
    return last30Days
  }

  // Get expense categories for pie chart
  const getExpenseCategories = () => {
    const categoryTotals = {}
    
    expenses.forEach(expense => {
      const category = expense.category || 'Other'
      categoryTotals[category] = (categoryTotals[category] || 0) + (expense.amount || 0)
    })
    
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount
    }))
  }

  // Get payment method distribution
  const getPaymentMethods = () => {
    const methodTotals = {}
    
    expenses.forEach(expense => {
      const method = expense.payment_method || 'Other'
      methodTotals[method] = (methodTotals[method] || 0) + (expense.amount || 0)
    })
    
    return Object.entries(methodTotals).map(([method, amount]) => ({
      name: method.replace('-', ' ').toUpperCase(),
      value: amount
    }))
  }

  // Calculate financial health score
  const calculateFinancialHealthScore = () => {
    let score = 0
    let factors = 0

    // Emergency fund (20 points)
    const emergencyFund = accounts.find(acc => acc.type === 'savings')?.balance || 0
    const monthlyExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0) / 30
    const emergencyFundMonths = monthlyExpenses > 0 ? emergencyFund / (monthlyExpenses * 30) : 0
    
    if (emergencyFundMonths >= 6) score += 20
    else if (emergencyFundMonths >= 3) score += 15
    else if (emergencyFundMonths >= 1) score += 10
    factors++

    // Investment ratio (20 points)
    const totalInvestments = investments.reduce((sum, inv) => sum + (inv.current_value || 0), 0)
    const totalAssets = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0) + totalInvestments
    const investmentRatio = totalAssets > 0 ? totalInvestments / totalAssets : 0
    
    if (investmentRatio >= 0.3) score += 20
    else if (investmentRatio >= 0.2) score += 15
    else if (investmentRatio >= 0.1) score += 10
    factors++

    // Spending control (20 points)
    const totalBudget = budgets.reduce((sum, budget) => sum + (budget.amount || 0), 0)
    const totalSpent = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)
    const spendingRatio = totalBudget > 0 ? totalSpent / totalBudget : 0
    
    if (spendingRatio <= 0.8) score += 20
    else if (spendingRatio <= 1.0) score += 15
    else if (spendingRatio <= 1.2) score += 10
    factors++

    // Debt management (20 points)
    const debtAccounts = accounts.filter(acc => acc.type === 'credit' || acc.type === 'loan')
    const totalDebt = debtAccounts.reduce((sum, acc) => sum + Math.abs(acc.balance || 0), 0)
    const debtToIncomeRatio = totalAssets > 0 ? totalDebt / totalAssets : 0
    
    if (debtToIncomeRatio <= 0.2) score += 20
    else if (debtToIncomeRatio <= 0.3) score += 15
    else if (debtToIncomeRatio <= 0.4) score += 10
    factors++

    // Savings rate (20 points)
    const monthlyIncome = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0) / 12
    const monthlySavings = monthlyIncome - (totalSpent / 30)
    const savingsRate = monthlyIncome > 0 ? monthlySavings / monthlyIncome : 0
    
    if (savingsRate >= 0.2) score += 20
    else if (savingsRate >= 0.15) score += 15
    else if (savingsRate >= 0.1) score += 10
    factors++

    return Math.round(score / factors)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatPercent = (percent) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`
  }

  const getHealthScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getHealthScoreBg = (score) => {
    if (score >= 80) return 'bg-green-50'
    if (score >= 60) return 'bg-yellow-50'
    if (score >= 40) return 'bg-orange-50'
    return 'bg-red-50'
  }

  const spendingTrends = getSpendingTrends()
  const expenseCategories = getExpenseCategories()
  const paymentMethods = getPaymentMethods()
  const financialHealthScore = calculateFinancialHealthScore()

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Icon name="User" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Please log in</h3>
          <p className="text-muted-foreground">You need to be logged in to view your financial dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financial Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.user_metadata?.full_name || user?.email}!
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Last updated</p>
            <p className="text-sm font-medium">
              {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never'}
            </p>
          </div>
          <QuickAddExpense onExpenseAdded={loadDashboardData} />
          <QuickAddInvestment onInvestmentAdded={loadDashboardData} />
          <Button
            onClick={handleVoiceCommand}
            variant="default"
            size="sm"
            iconName={isListening ? "Mic" : "Mic"}
            iconPosition="left"
            className={`${isListening ? 'bg-green-600 hover:bg-green-700' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'} text-white border-0`}
            loading={isListening}
          >
            {isListening ? 'Listening...' : 'Voice Commands'}
          </Button>
          <Button
            onClick={() => navigate('/product-search')}
            variant="default"
            size="sm"
            iconName="Search"
            iconPosition="left"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
          >
            Search Products with AI
          </Button>
          <Button
            onClick={loadDashboardData}
            loading={loading}
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Voice Command Feedback */}
      {(voiceError || voiceInfo) && (
        <div className={`border rounded-lg p-4 ${voiceError ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
          <div className="flex items-center space-x-2">
            <Icon name={voiceError ? "AlertCircle" : "Mic"} size={16} className={voiceError ? "text-red-600" : "text-blue-600"} />
            <p className={`text-sm ${voiceError ? 'text-red-700' : 'text-blue-700'}`}>
              {voiceError || voiceInfo}
            </p>
            <Button
              onClick={() => {
                setVoiceError(null)
                setVoiceInfo('')
              }}
              variant="ghost"
              size="sm"
              iconName="X"
            />
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Salary Balance */}
        <SalaryBalanceCard onRefresh={lastUpdated} />

        {/* Total Assets */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Assets</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(
                  accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0) +
                  investments.reduce((sum, inv) => sum + (inv.current_value || 0), 0)
                )}
              </p>
            </div>
            <Icon name="Wallet" size={24} className="text-primary" />
          </div>
        </div>

        {/* Investment Value */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Investments</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(portfolioTotals.totalValue)}
              </p>
              <p className={`text-sm ${portfolioTotals.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(portfolioTotals.totalGainLoss)} ({formatPercent(portfolioTotals.totalGainLossPercent)})
              </p>
            </div>
            <Icon name="TrendingUp" size={24} className="text-secondary" />
          </div>
        </div>

        {/* Monthly Spending */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(
                  expenses
                    .filter(exp => {
                      const expDate = new Date(exp.date)
                      const now = new Date()
                      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear()
                    })
                    .reduce((sum, exp) => sum + (exp.amount || 0), 0)
                )}
              </p>
            </div>
            <Icon name="CreditCard" size={24} className="text-accent" />
          </div>
        </div>

        {/* Financial Health Score */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Health Score</p>
              <p className={`text-2xl font-bold ${getHealthScoreColor(financialHealthScore)}`}>
                {financialHealthScore}/100
              </p>
            </div>
            <Icon name="Heart" size={24} className="text-warning" />
          </div>
        </div>

        {/* Product Search with AI */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6 cursor-pointer hover:shadow-lg transition-all duration-200" onClick={() => navigate('/product-search')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Smart Shopping</p>
              <p className="text-lg font-bold text-blue-900">Find Deals</p>
              <p className="text-xs text-blue-600 mt-1">Compare prices across platforms</p>
            </div>
            <div className="flex flex-col items-center">
              <Icon name="Search" size={24} className="text-blue-600 mb-1" />
              <Icon name="Sparkles" size={16} className="text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Trends */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Spending Trends (30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={spendingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
              />
              <YAxis tickFormatter={(value) => `₹${value}`} />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), 'Amount']}
                labelFormatter={(value) => new Date(value).toLocaleDateString('en-IN')}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Categories */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Expense Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [formatCurrency(value), 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Methods & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Payment Methods</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentMethods}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `₹${value}`} />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Amount']} />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insights */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">AI Financial Insights</h3>
          {aiInsights ? (
            <div className="space-y-4">
              {aiInsights.savingsRecommendations && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Icon name="Lightbulb" size={16} className="text-green-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-green-800">Savings Opportunities</h4>
                      <p className="text-sm text-green-700 mt-1">{aiInsights.savingsRecommendations}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {aiInsights.expenseOptimization && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Icon name="Target" size={16} className="text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-blue-800">Expense Optimization</h4>
                      <p className="text-sm text-blue-700 mt-1">{aiInsights.expenseOptimization}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {aiInsights.investmentAdvice && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Icon name="TrendingUp" size={16} className="text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-purple-800">Investment Advice</h4>
                      <p className="text-sm text-purple-700 mt-1">{aiInsights.investmentAdvice}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <Icon name="Brain" size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Generating AI insights...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {expenses.slice(0, 5).map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="CreditCard" size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-card-foreground">{expense.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {expense.category} • {new Date(expense.date).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-card-foreground">{formatCurrency(expense.amount)}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {expense.payment_method?.replace('-', ' ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RealTimeDashboard
