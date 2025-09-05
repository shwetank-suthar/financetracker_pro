import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { expenseService } from '../../../services/supabaseService'
import { generateDailyExpenseInsights } from '../../../services/openaiService'
import Icon from '../../../components/AppIcon'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const DailyExpenseTracker = () => {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [aiInsights, setAiInsights] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [quickAddExpense, setQuickAddExpense] = useState({
    amount: '',
    category: '',
    description: '',
    paymentMethod: ''
  })

  // Load expenses for selected date
  useEffect(() => {
    loadExpensesForDate()
  }, [selectedDate, user])

  const loadExpensesForDate = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const allExpenses = await expenseService.getExpenses()
      const dayExpenses = allExpenses.filter(expense => expense.date === selectedDate)
      
      setExpenses(dayExpenses)
      
      // Generate AI insights for the day
      if (dayExpenses.length > 0) {
        await generateDailyAIInsights(dayExpenses)
      }
    } catch (err) {
      console.error('Error loading expenses:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const generateDailyAIInsights = async (dayExpenses) => {
    try {
      const insights = await generateDailyExpenseInsights({
        expenses: dayExpenses,
        date: selectedDate,
        userGoals: user?.user_metadata?.financial_goals || []
      })
      setAiInsights(insights)
    } catch (err) {
      console.error('Error generating AI insights:', err)
    }
  }

  const handleQuickAddExpense = async (e) => {
    e.preventDefault()
    
    if (!quickAddExpense.amount || !quickAddExpense.category || !quickAddExpense.description) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const newExpense = {
        amount: parseFloat(quickAddExpense.amount),
        category: quickAddExpense.category,
        description: quickAddExpense.description,
        date: selectedDate,
        payment_method: quickAddExpense.paymentMethod,
        tags: []
      }

      const createdExpense = await expenseService.createExpense(newExpense)
      setExpenses(prev => [...prev, createdExpense])
      
      // Reset form
      setQuickAddExpense({
        amount: '',
        category: '',
        description: '',
        paymentMethod: ''
      })

      // Regenerate AI insights
      await generateDailyAIInsights([...expenses, createdExpense])
      
    } catch (err) {
      console.error('Error adding expense:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteExpense = async (expenseId) => {
    try {
      await expenseService.deleteExpense(expenseId)
      setExpenses(prev => prev.filter(exp => exp.id !== expenseId))
      
      // Regenerate AI insights
      const updatedExpenses = expenses.filter(exp => exp.id !== expenseId)
      await generateDailyAIInsights(updatedExpenses)
    } catch (err) {
      console.error('Error deleting expense:', err)
      setError(err.message)
    }
  }

  // Get spending trends for the week
  const getWeeklyTrends = () => {
    const trends = []
    const today = new Date(selectedDate)
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayExpenses = expenses.filter(expense => expense.date === dateStr)
      const totalAmount = dayExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)
      
      trends.push({
        date: dateStr,
        amount: totalAmount,
        count: dayExpenses.length
      })
    }
    
    return trends
  }

  // Get category breakdown for the day
  const getCategoryBreakdown = () => {
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const getTotalForDay = () => {
    return expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)
  }

  const categoryOptions = [
    { value: 'food', label: 'Food & Dining' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'bills', label: 'Bills & Utilities' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'travel', label: 'Travel' },
    { value: 'other', label: 'Other' }
  ]

  const paymentMethodOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'credit-card', label: 'Credit Card' },
    { value: 'debit-card', label: 'Debit Card' },
    { value: 'upi', label: 'UPI' },
    { value: 'net-banking', label: 'Net Banking' },
    { value: 'wallet', label: 'Digital Wallet' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'other', label: 'Other' }
  ]

  const weeklyTrends = getWeeklyTrends()
  const categoryBreakdown = getCategoryBreakdown()
  const totalForDay = getTotalForDay()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Daily Expense Tracker</h2>
          <p className="text-muted-foreground">
            Track your expenses for {new Date(selectedDate).toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            onClick={loadExpensesForDate}
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
            <Button
              onClick={() => setError(null)}
              variant="ghost"
              size="sm"
              iconName="X"
            />
          </div>
        </div>
      )}

      {/* Quick Add Expense */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Add Expense</h3>
        <form onSubmit={handleQuickAddExpense} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Amount"
            type="number"
            placeholder="0.00"
            value={quickAddExpense.amount}
            onChange={(e) => setQuickAddExpense(prev => ({ ...prev, amount: e.target.value }))}
            required
          />
          
          <Select
            label="Category"
            options={categoryOptions}
            value={quickAddExpense.category}
            onChange={(value) => setQuickAddExpense(prev => ({ ...prev, category: value }))}
            placeholder="Select category"
            required
          />
          
          <Input
            label="Description"
            type="text"
            placeholder="What did you spend on?"
            value={quickAddExpense.description}
            onChange={(e) => setQuickAddExpense(prev => ({ ...prev, description: e.target.value }))}
            required
          />
          
          <Select
            label="Payment Method"
            options={paymentMethodOptions}
            value={quickAddExpense.paymentMethod}
            onChange={(value) => setQuickAddExpense(prev => ({ ...prev, paymentMethod: value }))}
            placeholder="How did you pay?"
            required
          />
          
          <div className="md:col-span-2 lg:col-span-4">
            <Button
              type="submit"
              loading={loading}
              variant="default"
              iconName="Plus"
              iconPosition="left"
            >
              Add Expense
            </Button>
          </div>
        </form>
      </div>

      {/* Daily Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Spent Today</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalForDay)}</p>
            </div>
            <Icon name="CreditCard" size={24} className="text-primary" />
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Number of Transactions</p>
              <p className="text-2xl font-bold text-foreground">{expenses.length}</p>
            </div>
            <Icon name="Receipt" size={24} className="text-secondary" />
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average per Transaction</p>
              <p className="text-2xl font-bold text-foreground">
                {expenses.length > 0 ? formatCurrency(totalForDay / expenses.length) : formatCurrency(0)}
              </p>
            </div>
            <Icon name="Calculator" size={24} className="text-accent" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trends */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Weekly Spending Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrends}>
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

        {/* Category Breakdown */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Today's Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `₹${value}`} />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Amount']} />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      {aiInsights && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">AI Daily Insights</h3>
          <div className="space-y-4">
            {aiInsights.spendingAnalysis && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Icon name="BarChart3" size={16} className="text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-blue-800">Spending Analysis</h4>
                    <p className="text-sm text-blue-700 mt-1">{aiInsights.spendingAnalysis}</p>
                  </div>
                </div>
              </div>
            )}
            
            {aiInsights.savingsTips && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Icon name="Lightbulb" size={16} className="text-green-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-green-800">Savings Tips</h4>
                    <p className="text-sm text-green-700 mt-1">{aiInsights.savingsTips}</p>
                  </div>
                </div>
              </div>
            )}
            
            {aiInsights.budgetRecommendations && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Icon name="Target" size={16} className="text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-purple-800">Budget Recommendations</h4>
                    <p className="text-sm text-purple-700 mt-1">{aiInsights.budgetRecommendations}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Today's Expenses List */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Today's Expenses</h3>
        {expenses.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Receipt" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No expenses recorded for this day</p>
            <p className="text-sm text-muted-foreground mt-2">Add your first expense using the form above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="CreditCard" size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">{expense.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {expense.category} • {expense.payment_method?.replace('-', ' ')} • {new Date(expense.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-lg font-bold text-foreground">{formatCurrency(expense.amount)}</p>
                  <Button
                    onClick={() => handleDeleteExpense(expense.id)}
                    variant="ghost"
                    size="sm"
                    iconName="Trash2"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DailyExpenseTracker
