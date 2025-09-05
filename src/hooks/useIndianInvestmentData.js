import { useState, useEffect, useCallback } from 'react'
import { indianInvestmentDataService } from '../services/indianInvestmentDataService'

// Custom hook for managing Indian investment data
export const useIndianInvestmentData = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [marketData, setMarketData] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Get NSE stock quote
  const getNSEStockQuote = useCallback(async (symbol) => {
    setLoading(true)
    setError(null)
    
    try {
      const quote = await indianInvestmentDataService.getNSEStockQuote(symbol)
      return quote
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Get BSE stock quote
  const getBSEStockQuote = useCallback(async (symbol) => {
    setLoading(true)
    setError(null)
    
    try {
      const quote = await indianInvestmentDataService.getBSEStockQuote(symbol)
      return quote
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Get mutual fund NAV from CAMS
  const getCAMSMutualFundNAV = useCallback(async (schemeCode) => {
    setLoading(true)
    setError(null)
    
    try {
      const nav = await indianInvestmentDataService.getCAMSMutualFundNAV(schemeCode)
      return nav
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Get mutual fund NAV from KARVY
  const getKarvyMutualFundNAV = useCallback(async (schemeCode) => {
    setLoading(true)
    setError(null)
    
    try {
      const nav = await indianInvestmentDataService.getKarvyMutualFundNAV(schemeCode)
      return nav
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Get mutual fund data from MoneyControl
  const getMoneyControlMutualFund = useCallback(async (schemeCode) => {
    setLoading(true)
    setError(null)
    
    try {
      const fundData = await indianInvestmentDataService.getMoneyControlMutualFund(schemeCode)
      return fundData
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Get Indian market indices
  const getIndianMarketIndices = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const indices = await indianInvestmentDataService.getIndianMarketIndices()
      return indices
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Search Indian stocks
  const searchIndianStocks = useCallback(async (query) => {
    setLoading(true)
    setError(null)
    
    try {
      const results = await indianInvestmentDataService.searchIndianStocks(query)
      return results
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Search mutual funds
  const searchMutualFunds = useCallback(async (query) => {
    setLoading(true)
    setError(null)
    
    try {
      const results = await indianInvestmentDataService.searchMutualFunds(query)
      return results
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Update Indian investment prices
  const updateIndianInvestmentPrices = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const updatedInvestments = await indianInvestmentDataService.updateIndianInvestmentPrices()
      setLastUpdated(new Date().toISOString())
      return updatedInvestments
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Get Indian market overview
  const getIndianMarketOverview = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const overview = await indianInvestmentDataService.getIndianMarketOverview()
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

  // Auto-refresh disabled for better performance
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     getIndianMarketOverview().catch(console.error)
  //   }, 5 * 60 * 1000) // 5 minutes

  //   return () => clearInterval(interval)
  // }, [getIndianMarketOverview])

  return {
    loading,
    error,
    marketData,
    lastUpdated,
    getNSEStockQuote,
    getBSEStockQuote,
    getCAMSMutualFundNAV,
    getKarvyMutualFundNAV,
    getMoneyControlMutualFund,
    getIndianMarketIndices,
    searchIndianStocks,
    searchMutualFunds,
    updateIndianInvestmentPrices,
    getIndianMarketOverview,
    clearError: () => setError(null)
  }
}

// Hook for real-time Indian market prices
export const useRealTimeIndianPrices = (symbols, interval = 30000) => {
  const [prices, setPrices] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updatePrices = useCallback(async () => {
    if (!symbols || symbols.length === 0) return

    setLoading(true)
    setError(null)

    try {
      const quotes = []
      
      for (const symbol of symbols) {
        try {
          // Try NSE first, then BSE
          let quote
          try {
            quote = await indianInvestmentDataService.getNSEStockQuote(symbol)
          } catch (nseError) {
            quote = await indianInvestmentDataService.getBSEStockQuote(symbol)
          }
          quotes.push(quote)
        } catch (error) {
          console.error(`Error getting quote for ${symbol}:`, error)
        }
      }
      
      const priceMap = {}
      quotes.forEach(quote => {
        priceMap[quote.symbol] = {
          price: quote.price,
          change: quote.change,
          changePercent: quote.changePercent,
          timestamp: quote.timestamp,
          exchange: quote.exchange
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

// Hook for Indian investment portfolio with real-time data
export const useIndianInvestmentPortfolio = (user = null) => {
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const loadInvestments = useCallback(async () => {
    // Don't load if user is not authenticated
    if (!user) {
      setInvestments([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const updatedInvestments = await indianInvestmentDataService.updateIndianInvestmentPrices()
      setInvestments(updatedInvestments)
      setLastUpdated(new Date().toISOString())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  const refreshPrices = useCallback(async () => {
    await loadInvestments()
  }, [loadInvestments])

  // Load investments once when user changes, no auto-refresh
  useEffect(() => {
    if (user) {
      loadInvestments()
    } else {
      // Clear investments if user is not authenticated
      setInvestments([])
      setError(null)
    }
  }, [loadInvestments, user])

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
