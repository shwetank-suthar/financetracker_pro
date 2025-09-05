import { useState, useEffect, useCallback } from 'react'
import { investmentDataService } from '../services/investmentDataService'

// Custom hook for managing investment data
export const useInvestmentData = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [marketData, setMarketData] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Get stock quote
  const getStockQuote = useCallback(async (symbol) => {
    setLoading(true)
    setError(null)
    
    try {
      const quote = await investmentDataService.getStockQuote(symbol)
      return quote
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Get mutual fund data
  const getMutualFundData = useCallback(async (symbol) => {
    setLoading(true)
    setError(null)
    
    try {
      const fundData = await investmentDataService.getMutualFundData(symbol)
      return fundData
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Get multiple quotes
  const getMultipleQuotes = useCallback(async (symbols) => {
    setLoading(true)
    setError(null)
    
    try {
      const quotes = await investmentDataService.getMultipleQuotes(symbols)
      return quotes
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Update investment prices
  const updateInvestmentPrices = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const updatedInvestments = await investmentDataService.updateInvestmentPrices()
      setLastUpdated(new Date().toISOString())
      return updatedInvestments
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Get market overview
  const getMarketOverview = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const overview = await investmentDataService.getMarketOverview()
      setMarketData(overview)
      setLastUpdated(overview.lastUpdated)
      return overview
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Search securities
  const searchSecurities = useCallback(async (query) => {
    setLoading(true)
    setError(null)
    
    try {
      const results = await investmentDataService.searchSecurities(query)
      return results
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-refresh disabled for better performance
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     getMarketOverview().catch(console.error)
  //   }, 5 * 60 * 1000) // 5 minutes

  //   return () => clearInterval(interval)
  // }, [getMarketOverview])

  return {
    loading,
    error,
    marketData,
    lastUpdated,
    getStockQuote,
    getMutualFundData,
    getMultipleQuotes,
    updateInvestmentPrices,
    getMarketOverview,
    searchSecurities,
    clearError: () => setError(null)
  }
}

// Hook for real-time price updates
export const useRealTimePrices = (symbols, interval = 30000) => {
  const [prices, setPrices] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updatePrices = useCallback(async () => {
    if (!symbols || symbols.length === 0) return

    setLoading(true)
    setError(null)

    try {
      const quotes = await investmentDataService.getMultipleQuotes(symbols)
      const priceMap = {}
      
      quotes.forEach(quote => {
        priceMap[quote.symbol] = {
          price: quote.price,
          change: quote.change,
          changePercent: quote.changePercent,
          timestamp: quote.timestamp
        }
      })
      
      setPrices(priceMap)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [symbols])

  useEffect(() => {
    updatePrices()
    
    const intervalId = setInterval(updatePrices, interval)
    
    return () => clearInterval(intervalId)
  }, [updatePrices, interval])

  return {
    prices,
    loading,
    error,
    updatePrices
  }
}

// Hook for investment portfolio with real-time data
export const useInvestmentPortfolio = () => {
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const loadInvestments = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const updatedInvestments = await investmentDataService.updateInvestmentPrices()
      setInvestments(updatedInvestments)
      setLastUpdated(new Date().toISOString())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshPrices = useCallback(async () => {
    await loadInvestments()
  }, [loadInvestments])

  // Load investments once, no auto-refresh
  useEffect(() => {
    loadInvestments()
  }, [loadInvestments])

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

  return {
    investments,
    loading,
    error,
    lastUpdated,
    portfolioTotals,
    refreshPrices,
    loadInvestments
  }
}
