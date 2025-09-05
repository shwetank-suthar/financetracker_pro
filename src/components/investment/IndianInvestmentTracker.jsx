import React, { useState, useEffect } from 'react'
import { useIndianInvestmentData, useRealTimeIndianPrices, useIndianInvestmentPortfolio } from '../../hooks/useIndianInvestmentData'
import Icon from '../AppIcon'
import Button from '../ui/Button'

const IndianInvestmentTracker = () => {
  const { 
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
    clearError 
  } = useIndianInvestmentData()

  const { 
    investments, 
    loading: portfolioLoading, 
    error: portfolioError, 
    lastUpdated: portfolioLastUpdated,
    portfolioTotals,
    refreshPrices 
  } = useIndianInvestmentPortfolio()

  const [selectedSymbol, setSelectedSymbol] = useState('')
  const [selectedExchange, setSelectedExchange] = useState('NSE')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [searchType, setSearchType] = useState('stocks') // 'stocks' or 'mutual-funds'

  // Load market overview on component mount
  useEffect(() => {
    getIndianMarketOverview()
  }, [getIndianMarketOverview])

  // Auto-refresh every 30 seconds if enabled
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      getIndianMarketOverview()
      refreshPrices()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, getIndianMarketOverview, refreshPrices])

  const handleGetQuote = async () => {
    if (!selectedSymbol.trim()) return

    try {
      clearError()
      let quote
      
      if (selectedExchange === 'NSE') {
        quote = await getNSEStockQuote(selectedSymbol.toUpperCase())
      } else {
        quote = await getBSEStockQuote(selectedSymbol.toUpperCase())
      }
      
      setSelectedQuote(quote)
    } catch (error) {
      console.error('Error getting quote:', error)
    }
  }

  const handleGetMutualFund = async () => {
    if (!selectedSymbol.trim()) return

    try {
      clearError()
      let fundData
      
      // Try CAMS first, then KARVY, then MoneyControl
      try {
        fundData = await getCAMSMutualFundNAV(selectedSymbol)
      } catch (camsError) {
        try {
          fundData = await getKarvyMutualFundNAV(selectedSymbol)
        } catch (karvyError) {
          fundData = await getMoneyControlMutualFund(selectedSymbol)
        }
      }
      
      setSelectedQuote(fundData)
    } catch (error) {
      console.error('Error getting mutual fund data:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      clearError()
      let results
      
      if (searchType === 'stocks') {
        results = await searchIndianStocks(searchQuery)
      } else {
        results = await searchMutualFunds(searchQuery)
      }
      
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching securities:', error)
    }
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

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getChangeBgColor = (change) => {
    return change >= 0 ? 'bg-green-50' : 'bg-red-50'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Indian Investment Tracker</h2>
          <p className="text-muted-foreground">
            Track your Indian investments with real-time NSE, BSE, and mutual fund data
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoRefresh"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-border"
            />
            <label htmlFor="autoRefresh" className="text-sm text-muted-foreground">
              Auto-refresh
            </label>
          </div>
          <Button
            onClick={refreshPrices}
            loading={portfolioLoading}
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
              onClick={clearError}
              variant="ghost"
              size="sm"
              iconName="X"
            />
          </div>
        </div>
      )}

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={16} className="text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Total Value</span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">
            {formatCurrency(portfolioTotals.totalValue)}
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-2">
            <Icon name="DollarSign" size={16} className="text-secondary" />
            <span className="text-sm font-medium text-muted-foreground">Total Invested</span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">
            {formatCurrency(portfolioTotals.totalInvested)}
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-2">
            <Icon name="BarChart3" size={16} className="text-accent" />
            <span className="text-sm font-medium text-muted-foreground">Gain/Loss</span>
          </div>
          <p className={`text-2xl font-bold mt-1 ${getChangeColor(portfolioTotals.totalGainLoss)}`}>
            {formatCurrency(portfolioTotals.totalGainLoss)}
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Percent" size={16} className="text-warning" />
            <span className="text-sm font-medium text-muted-foreground">Return %</span>
          </div>
          <p className={`text-2xl font-bold mt-1 ${getChangeColor(portfolioTotals.totalGainLossPercent)}`}>
            {formatPercent(portfolioTotals.totalGainLossPercent)}
          </p>
        </div>
      </div>

      {/* Indian Market Indices */}
      {marketData && marketData.indices && (
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">Indian Market Indices</h3>
            <span className="text-sm text-muted-foreground">
              Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketData.indices.map((index) => (
              <div key={index.symbol} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-card-foreground">{index.symbol}</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${getChangeBgColor(index.change)} ${getChangeColor(index.change)}`}>
                    {formatPercent(index.changePercent)}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(index.price)}</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(index.change)} ({formatPercent(index.changePercent)})
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quote Lookup */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Quote Lookup</h3>
        
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Enter symbol (e.g., RELIANCE, TCS, HDFCBANK)"
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="flex-1 px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <select
            value={selectedExchange}
            onChange={(e) => setSelectedExchange(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="NSE">NSE</option>
            <option value="BSE">BSE</option>
          </select>
          <Button
            onClick={handleGetQuote}
            loading={loading}
            variant="default"
            iconName="Search"
            iconPosition="left"
          >
            Get Stock Quote
          </Button>
          <Button
            onClick={handleGetMutualFund}
            loading={loading}
            variant="outline"
            iconName="PieChart"
            iconPosition="left"
          >
            Get Mutual Fund
          </Button>
        </div>

        {selectedQuote && (
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold text-card-foreground">
                  {selectedQuote.symbol || selectedQuote.schemeCode}
                </h4>
                <p className="text-muted-foreground">
                  {selectedQuote.name || selectedQuote.schemeName}
                </p>
                {selectedQuote.exchange && (
                  <p className="text-sm text-muted-foreground">Exchange: {selectedQuote.exchange}</p>
                )}
                {selectedQuote.provider && (
                  <p className="text-sm text-muted-foreground">Provider: {selectedQuote.provider}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(selectedQuote.price || selectedQuote.nav)}
                </p>
                <p className={`text-sm ${getChangeColor(selectedQuote.change)}`}>
                  {formatCurrency(selectedQuote.change)} ({formatPercent(selectedQuote.changePercent)})
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Open:</span>
                <p className="font-medium">{formatCurrency(selectedQuote.open)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">High:</span>
                <p className="font-medium">{formatCurrency(selectedQuote.high)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Low:</span>
                <p className="font-medium">{formatCurrency(selectedQuote.low)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Volume:</span>
                <p className="font-medium">{selectedQuote.volume?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Security Search */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Search Indian Securities</h3>
        
        <div className="flex space-x-4 mb-4">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="stocks">Stocks</option>
            <option value="mutual-funds">Mutual Funds</option>
          </select>
          <input
            type="text"
            placeholder={searchType === 'stocks' ? 'Search for Indian stocks...' : 'Search for mutual funds...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            onClick={handleSearch}
            loading={loading}
            variant="default"
            iconName="Search"
            iconPosition="left"
          >
            Search
          </Button>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-card-foreground">Search Results:</h4>
            {searchResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-card-foreground">
                    {result.symbol || result.schemeCode}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {result.name || result.schemeName}
                  </p>
                </div>
                <div className="text-right">
                  {result.exchange && (
                    <p className="text-sm text-muted-foreground">{result.exchange}</p>
                  )}
                  {result.category && (
                    <p className="text-sm text-muted-foreground">{result.category}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Last Updated Info */}
      <div className="text-center text-sm text-muted-foreground">
        Portfolio last updated: {portfolioLastUpdated ? new Date(portfolioLastUpdated).toLocaleString() : 'Never'}
      </div>
    </div>
  )
}

export default IndianInvestmentTracker
