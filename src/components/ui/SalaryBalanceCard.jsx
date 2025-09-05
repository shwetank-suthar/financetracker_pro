import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { incomeService } from '../../services/incomeService'
import Icon from '../AppIcon'

const SalaryBalanceCard = ({ onRefresh }) => {
  const { user } = useAuth()
  const [salarySummary, setSalarySummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadSalarySummary = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const summary = await incomeService.getSalarySummary()
      setSalarySummary(summary)
    } catch (err) {
      console.error('Error loading salary summary:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSalarySummary()
  }, [user])

  useEffect(() => {
    if (onRefresh) {
      loadSalarySummary()
    }
  }, [onRefresh])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (!user) return null

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Salary Balance</p>
            <p className="text-2xl font-bold text-foreground">Loading...</p>
          </div>
          <Icon name="Wallet" size={24} className="text-primary animate-pulse" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Salary Balance</p>
            <p className="text-sm text-red-600">Error loading salary data</p>
          </div>
          <Icon name="AlertCircle" size={24} className="text-red-500" />
        </div>
      </div>
    )
  }

  if (!salarySummary) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Salary Balance</p>
            <p className="text-sm text-muted-foreground">No salary data found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add your salary to start tracking
            </p>
          </div>
          <Icon name="Wallet" size={24} className="text-muted-foreground" />
        </div>
      </div>
    )
  }

  const { current_balance, total_received, total_deducted, next_pay_date, days_until_pay } = salarySummary

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">Salary Balance</p>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(current_balance)}
          </p>
          
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Total Received:</span>
              <span className="text-green-600">{formatCurrency(total_received)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Total Deducted:</span>
              <span className="text-red-600">{formatCurrency(total_deducted)}</span>
            </div>
          </div>

          {next_pay_date && (
            <div className="mt-3 pt-2 border-t border-border">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Next Pay:</span>
                <span className="text-foreground">{formatDate(next_pay_date)}</span>
              </div>
              {days_until_pay !== null && (
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-muted-foreground">Days until pay:</span>
                  <span className={`font-medium ${days_until_pay <= 3 ? 'text-orange-600' : 'text-foreground'}`}>
                    {days_until_pay} days
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="ml-4">
          <Icon 
            name="Wallet" 
            size={24} 
            className={current_balance > 0 ? "text-green-600" : "text-red-600"} 
          />
        </div>
      </div>
    </div>
  )
}

export default SalaryBalanceCard
