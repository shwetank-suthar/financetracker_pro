import { supabase } from '../lib/supabase.js'

// Investment Data Service - Multiple API providers
class InvestmentDataService {
  constructor() {
    // API configurations - you can switch between providers
    this.apis = {
      alphaVantage: {
        baseUrl: 'https://www.alphavantage.co/query',
        apiKey: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY,
        rateLimit: 5, // requests per minute for free tier
        lastRequest: 0
      },
      financialModelingPrep: {
        baseUrl: 'https://financialmodelingprep.com/api/v3',
        apiKey: import.meta.env.VITE_FMP_API_KEY,
        rateLimit: 250, // requests per day for free tier
        lastRequest: 0
      },
      twelveData: {
        baseUrl: 'https://api.twelvedata.com',
        apiKey: import.meta.env.VITE_TWELVE_DATA_API_KEY,
        rateLimit: 8, // requests per minute for free tier
        lastRequest: 0
      }
    }
    
    this.currentProvider = 'alphaVantage' // Default provider
  }

  // Rate limiting helper
  async checkRateLimit(provider) {
    const config = this.apis[provider]
    const now = Date.now()
    const timeSinceLastRequest = now - config.lastRequest
    const minInterval = 60000 / config.rateLimit // Convert to milliseconds
    
    if (timeSinceLastRequest < minInterval) {
      const waitTime = minInterval - timeSinceLastRequest
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
    
    config.lastRequest = Date.now()
  }

  // Get stock quote
  async getStockQuote(symbol) {
    try {
      await this.checkRateLimit(this.currentProvider)
      
      switch (this.currentProvider) {
        case 'alphaVantage':
          return await this.getStockQuoteAlphaVantage(symbol)
        case 'financialModelingPrep':
          return await this.getStockQuoteFMP(symbol)
        case 'twelveData':
          return await this.getStockQuoteTwelveData(symbol)
        default:
          throw new Error('Invalid provider')
      }
    } catch (error) {
      console.error('Error getting stock quote:', error)
      throw error
    }
  }

  // Alpha Vantage implementation
  async getStockQuoteAlphaVantage(symbol) {
    const url = `${this.apis.alphaVantage.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apis.alphaVantage.apiKey}`
    
    const response = await fetch(url)
    const data = await response.json()
    
    if (data['Error Message']) {
      throw new Error(data['Error Message'])
    }
    
    if (data['Note']) {
      throw new Error('API rate limit exceeded. Please try again later.')
    }
    
    const quote = data['Global Quote']
    if (!quote) {
      throw new Error('No data found for symbol')
    }
    
    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      open: parseFloat(quote['02. open']),
      previousClose: parseFloat(quote['08. previous close']),
      timestamp: new Date().toISOString()
    }
  }

  // Financial Modeling Prep implementation
  async getStockQuoteFMP(symbol) {
    const url = `${this.apis.financialModelingPrep.baseUrl}/quote/${symbol}?apikey=${this.apis.financialModelingPrep.apiKey}`
    
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }
    
    if (!data || data.length === 0) {
      throw new Error('No data found for symbol')
    }
    
    const quote = data[0]
    return {
      symbol: quote.symbol,
      price: quote.price,
      change: quote.change,
      changePercent: quote.changesPercentage,
      volume: quote.volume,
      high: quote.dayHigh,
      low: quote.dayLow,
      open: quote.open,
      previousClose: quote.previousClose,
      timestamp: new Date().toISOString()
    }
  }

  // Twelve Data implementation
  async getStockQuoteTwelveData(symbol) {
    const url = `${this.apis.twelveData.baseUrl}/quote?symbol=${symbol}&apikey=${this.apis.twelveData.apiKey}`
    
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.status === 'error') {
      throw new Error(data.message)
    }
    
    return {
      symbol: data.symbol,
      price: parseFloat(data.close),
      change: parseFloat(data.change),
      changePercent: parseFloat(data.percent_change),
      volume: parseInt(data.volume),
      high: parseFloat(data.high),
      low: parseFloat(data.low),
      open: parseFloat(data.open),
      previousClose: parseFloat(data.previous_close),
      timestamp: new Date().toISOString()
    }
  }

  // Get mutual fund data
  async getMutualFundData(symbol) {
    try {
      await this.checkRateLimit(this.currentProvider)
      
      switch (this.currentProvider) {
        case 'financialModelingPrep':
          return await this.getMutualFundFMP(symbol)
        case 'twelveData':
          return await this.getMutualFundTwelveData(symbol)
        default:
          // Fallback to stock quote for mutual funds
          return await this.getStockQuote(symbol)
      }
    } catch (error) {
      console.error('Error getting mutual fund data:', error)
      throw error
    }
  }

  // Financial Modeling Prep mutual fund implementation
  async getMutualFundFMP(symbol) {
    const url = `${this.apis.financialModelingPrep.baseUrl}/quote/${symbol}?apikey=${this.apis.financialModelingPrep.apiKey}`
    
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }
    
    if (!data || data.length === 0) {
      throw new Error('No data found for mutual fund')
    }
    
    const fund = data[0]
    return {
      symbol: fund.symbol,
      name: fund.name,
      price: fund.price, // NAV for mutual funds
      change: fund.change,
      changePercent: fund.changesPercentage,
      volume: fund.volume,
      high: fund.dayHigh,
      low: fund.dayLow,
      open: fund.open,
      previousClose: fund.previousClose,
      timestamp: new Date().toISOString(),
      type: 'mutual_fund'
    }
  }

  // Twelve Data mutual fund implementation
  async getMutualFundTwelveData(symbol) {
    const url = `${this.apis.twelveData.baseUrl}/quote?symbol=${symbol}&apikey=${this.apis.twelveData.apiKey}`
    
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.status === 'error') {
      throw new Error(data.message)
    }
    
    return {
      symbol: data.symbol,
      name: data.name,
      price: parseFloat(data.close),
      change: parseFloat(data.change),
      changePercent: parseFloat(data.percent_change),
      volume: parseInt(data.volume),
      high: parseFloat(data.high),
      low: parseFloat(data.low),
      open: parseFloat(data.open),
      previousClose: parseFloat(data.previous_close),
      timestamp: new Date().toISOString(),
      type: 'mutual_fund'
    }
  }

  // Get multiple quotes at once
  async getMultipleQuotes(symbols) {
    const quotes = []
    
    for (const symbol of symbols) {
      try {
        const quote = await this.getStockQuote(symbol)
        quotes.push(quote)
      } catch (error) {
        console.error(`Error getting quote for ${symbol}:`, error)
        // Continue with other symbols even if one fails
      }
    }
    
    return quotes
  }

  // Update investment prices in database
  async updateInvestmentPrices() {
    try {
      const user = await this.getCurrentUser()
      if (!user) throw new Error('User not authenticated')
      
      // Get all investments for the user
      const { data: investments, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id)
      
      if (error) throw error
      
      const updatedInvestments = []
      
      for (const investment of investments) {
        try {
          let quote
          
          if (investment.type === 'mutual-fund') {
            quote = await this.getMutualFundData(investment.symbol)
          } else {
            quote = await this.getStockQuote(investment.symbol)
          }
          
          // Calculate new values
          const newCurrentValue = investment.quantity * quote.price
          const gainLoss = newCurrentValue - investment.invested_amount
          const changePercent = (gainLoss / investment.invested_amount) * 100
          
          // Update investment in database
          const { data: updatedInvestment, error: updateError } = await supabase
            .from('investments')
            .update({
              current_value: newCurrentValue,
              current_price: quote.price,
              updated_at: new Date().toISOString()
            })
            .eq('id', investment.id)
            .select()
            .single()
          
          if (updateError) throw updateError
          
          updatedInvestments.push({
            ...updatedInvestment,
            gain_loss: gainLoss,
            change_percent: changePercent,
            market_data: quote
          })
          
        } catch (error) {
          console.error(`Error updating investment ${investment.symbol}:`, error)
          // Continue with other investments
        }
      }
      
      return updatedInvestments
      
    } catch (error) {
      console.error('Error updating investment prices:', error)
      throw error
    }
  }

  // Get market data for dashboard
  async getMarketOverview() {
    try {
      // Get popular indices and stocks for overview
      const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'] // Popular stocks
      const quotes = await this.getMultipleQuotes(symbols)
      
      return {
        stocks: quotes,
        lastUpdated: new Date().toISOString(),
        provider: this.currentProvider
      }
    } catch (error) {
      console.error('Error getting market overview:', error)
      throw error
    }
  }

  // Search for securities
  async searchSecurities(query) {
    try {
      await this.checkRateLimit(this.currentProvider)
      
      if (this.currentProvider === 'financialModelingPrep') {
        return await this.searchSecuritiesFMP(query)
      } else {
        // Fallback search - you can implement for other providers
        throw new Error('Search not implemented for current provider')
      }
    } catch (error) {
      console.error('Error searching securities:', error)
      throw error
    }
  }

  // Financial Modeling Prep search implementation
  async searchSecuritiesFMP(query) {
    const url = `${this.apis.financialModelingPrep.baseUrl}/search?query=${encodeURIComponent(query)}&limit=10&apikey=${this.apis.financialModelingPrep.apiKey}`
    
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }
    
    return data.map(item => ({
      symbol: item.symbol,
      name: item.name,
      exchange: item.exchange,
      type: item.type
    }))
  }

  // Helper method to get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }

  // Switch API provider
  setProvider(provider) {
    if (this.apis[provider]) {
      this.currentProvider = provider
      console.log(`Switched to ${provider} provider`)
    } else {
      throw new Error('Invalid provider')
    }
  }

  // Get current provider
  getCurrentProvider() {
    return this.currentProvider
  }

  // Get available providers
  getAvailableProviders() {
    return Object.keys(this.apis)
  }
}

// Create singleton instance
export const investmentDataService = new InvestmentDataService()

// Export individual methods for convenience
export const {
  getStockQuote,
  getMutualFundData,
  getMultipleQuotes,
  updateInvestmentPrices,
  getMarketOverview,
  searchSecurities,
  setProvider,
  getCurrentProvider,
  getAvailableProviders
} = investmentDataService
