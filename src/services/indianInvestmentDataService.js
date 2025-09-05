import { supabase } from '../lib/supabase.js'

// Indian Investment Data Service
class IndianInvestmentDataService {
  constructor() {
    // Indian API configurations
    this.apis = {
      zerodha: {
        baseUrl: 'https://api.kite.trade',
        apiKey: import.meta.env.VITE_ZERODHA_API_KEY,
        accessToken: import.meta.env.VITE_ZERODHA_ACCESS_TOKEN,
        rateLimit: 3, // requests per second
        lastRequest: 0
      },
      cams: {
        baseUrl: 'https://api.camsonline.com',
        apiKey: import.meta.env.VITE_CAMS_API_KEY,
        rateLimit: 10, // requests per minute
        lastRequest: 0
      },
      karvy: {
        baseUrl: 'https://api.karvy.com',
        apiKey: import.meta.env.VITE_KARVY_API_KEY,
        rateLimit: 10, // requests per minute
        lastRequest: 0
      },
      moneyControl: {
        baseUrl: 'https://priceapi.moneycontrol.com',
        rateLimit: 5, // requests per second
        lastRequest: 0
      },
      nseIndia: {
        baseUrl: 'https://www.nseindia.com/api',
        rateLimit: 2, // requests per second
        lastRequest: 0
      },
      bseIndia: {
        baseUrl: 'https://api.bseindia.com',
        rateLimit: 2, // requests per second
        lastRequest: 0
      }
    }
    
    this.currentProvider = 'zerodha' // Default provider
  }

  // Rate limiting helper
  async checkRateLimit(provider) {
    const config = this.apis[provider]
    const now = Date.now()
    const timeSinceLastRequest = now - config.lastRequest
    const minInterval = 1000 / config.rateLimit // Convert to milliseconds
    
    if (timeSinceLastRequest < minInterval) {
      const waitTime = minInterval - timeSinceLastRequest
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
    
    config.lastRequest = Date.now()
  }

  // Get NSE stock quote
  async getNSEStockQuote(symbol) {
    try {
      await this.checkRateLimit('nseIndia')
      
      // NSE India API endpoint
      const url = `${this.apis.nseIndia.baseUrl}/quote-equity?symbol=${symbol}`
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      })
      
      if (!response.ok) {
        throw new Error(`NSE API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.info && data.info.error) {
        throw new Error(data.info.error)
      }
      
      const quote = data.priceInfo
      return {
        symbol: data.info.symbol,
        name: data.info.companyName,
        price: quote.lastPrice,
        change: quote.change,
        changePercent: quote.pChange,
        volume: quote.totalTradedVolume,
        high: quote.intraDayHighLow.max,
        low: quote.intraDayHighLow.min,
        open: quote.open,
        previousClose: quote.previousClose,
        timestamp: new Date().toISOString(),
        exchange: 'NSE'
      }
    } catch (error) {
      console.error('Error getting NSE stock quote:', error)
      throw error
    }
  }

  // Get BSE stock quote
  async getBSEStockQuote(symbol) {
    try {
      await this.checkRateLimit('bseIndia')
      
      // BSE India API endpoint
      const url = `${this.apis.bseIndia.baseUrl}/BseIndiaAPI/api/StockReachGraph/w?scripcode=${symbol}&flag=0&fromdate=&todate=&seriesid=`
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`BSE API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      return {
        symbol: symbol,
        name: data.companyName || symbol,
        price: data.currentPrice,
        change: data.change,
        changePercent: data.changePercent,
        volume: data.volume,
        high: data.high,
        low: data.low,
        open: data.open,
        previousClose: data.previousClose,
        timestamp: new Date().toISOString(),
        exchange: 'BSE'
      }
    } catch (error) {
      console.error('Error getting BSE stock quote:', error)
      throw error
    }
  }

  // Get Zerodha Kite Connect quote
  async getZerodhaQuote(instrumentToken) {
    try {
      await this.checkRateLimit('zerodha')
      
      const url = `${this.apis.zerodha.baseUrl}/quote?i=${instrumentToken}`
      
      const response = await fetch(url, {
        headers: {
          'X-Kite-Version': '3',
          'Authorization': `token ${this.apis.zerodha.apiKey}:${this.apis.zerodha.accessToken}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`Zerodha API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.status === 'error') {
        throw new Error(data.message)
      }
      
      const quote = data.data[instrumentToken]
      return {
        symbol: quote.instrument_token,
        name: quote.name,
        price: quote.last_price,
        change: quote.change,
        changePercent: quote.change_percent,
        volume: quote.volume,
        high: quote.ohlc.high,
        low: quote.ohlc.low,
        open: quote.ohlc.open,
        previousClose: quote.ohlc.close,
        timestamp: new Date().toISOString(),
        exchange: quote.exchange
      }
    } catch (error) {
      console.error('Error getting Zerodha quote:', error)
      throw error
    }
  }

  // Get mutual fund NAV from CAMS
  async getCAMSMutualFundNAV(schemeCode) {
    try {
      await this.checkRateLimit('cams')
      
      const url = `${this.apis.cams.baseUrl}/api/v1/mutual-funds/${schemeCode}/nav`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apis.cams.apiKey}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`CAMS API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      return {
        schemeCode: data.schemeCode,
        schemeName: data.schemeName,
        nav: data.nav,
        date: data.date,
        change: data.change,
        changePercent: data.changePercent,
        timestamp: new Date().toISOString(),
        provider: 'CAMS'
      }
    } catch (error) {
      console.error('Error getting CAMS mutual fund NAV:', error)
      throw error
    }
  }

  // Get mutual fund NAV from KARVY
  async getKarvyMutualFundNAV(schemeCode) {
    try {
      await this.checkRateLimit('karvy')
      
      const url = `${this.apis.karvy.baseUrl}/api/v1/mutual-funds/${schemeCode}/nav`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apis.karvy.apiKey}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`KARVY API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      return {
        schemeCode: data.schemeCode,
        schemeName: data.schemeName,
        nav: data.nav,
        date: data.date,
        change: data.change,
        changePercent: data.changePercent,
        timestamp: new Date().toISOString(),
        provider: 'KARVY'
      }
    } catch (error) {
      console.error('Error getting KARVY mutual fund NAV:', error)
      throw error
    }
  }

  // Get mutual fund data from MoneyControl
  async getMoneyControlMutualFund(schemeCode) {
    try {
      await this.checkRateLimit('moneyControl')
      
      const url = `${this.apis.moneyControl.baseUrl}/priceapi/mf/price?scode=${schemeCode}`
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`MoneyControl API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      return {
        schemeCode: data.schemeCode,
        schemeName: data.schemeName,
        nav: data.nav,
        date: data.date,
        change: data.change,
        changePercent: data.changePercent,
        timestamp: new Date().toISOString(),
        provider: 'MoneyControl'
      }
    } catch (error) {
      console.error('Error getting MoneyControl mutual fund data:', error)
      throw error
    }
  }

  // Get Indian market indices
  async getIndianMarketIndices() {
    try {
      const indices = [
        { symbol: 'NIFTY 50', token: '256265' },
        { symbol: 'NIFTY BANK', token: '260105' },
        { symbol: 'NIFTY IT', token: '256265' },
        { symbol: 'SENSEX', token: '1' }
      ]
      
      const indexData = []
      
      for (const index of indices) {
        try {
          const quote = await this.getNSEStockQuote(index.symbol)
          indexData.push({
            ...quote,
            type: 'index'
          })
        } catch (error) {
          console.error(`Error getting ${index.symbol}:`, error)
        }
      }
      
      return indexData
    } catch (error) {
      console.error('Error getting Indian market indices:', error)
      throw error
    }
  }

  // Search Indian stocks
  async searchIndianStocks(query) {
    try {
      // This would typically use Zerodha's instruments API
      // For now, we'll use a mock implementation
      const mockResults = [
        { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', exchange: 'NSE' },
        { symbol: 'TCS', name: 'Tata Consultancy Services Ltd', exchange: 'NSE' },
        { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', exchange: 'NSE' },
        { symbol: 'INFY', name: 'Infosys Ltd', exchange: 'NSE' },
        { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', exchange: 'NSE' }
      ]
      
      return mockResults.filter(stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
      )
    } catch (error) {
      console.error('Error searching Indian stocks:', error)
      throw error
    }
  }

  // Search mutual funds
  async searchMutualFunds(query) {
    try {
      // Mock implementation - in real scenario, you'd use CAMS/KARVY APIs
      const mockFunds = [
        { schemeCode: '120503', schemeName: 'HDFC Top 100 Fund', category: 'Large Cap' },
        { schemeCode: '120504', schemeName: 'SBI Bluechip Fund', category: 'Large Cap' },
        { schemeCode: '120505', schemeName: 'ICICI Prudential Value Discovery Fund', category: 'Value' },
        { schemeCode: '120506', schemeName: 'Axis Midcap Fund', category: 'Mid Cap' },
        { schemeCode: '120507', schemeName: 'Mirae Asset Emerging Bluechip Fund', category: 'Large & Mid Cap' }
      ]
      
      return mockFunds.filter(fund => 
        fund.schemeName.toLowerCase().includes(query.toLowerCase()) ||
        fund.category.toLowerCase().includes(query.toLowerCase())
      )
    } catch (error) {
      console.error('Error searching mutual funds:', error)
      throw error
    }
  }

  // Update investment prices for Indian investments
  async updateIndianInvestmentPrices() {
    try {
      const user = await this.getCurrentUser()
      if (!user) {
        console.warn('User not authenticated, returning empty investments')
        return []
      }
      
      // Get all investments for the user
      const { data: investments, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id)
      
      if (error) throw error
      
      // API calls disabled for faster loading
      console.log('Indian investment APIs disabled for faster loading')
      
      // Return investments with mock price updates (no external API calls)
      const updatedInvestments = investments.map(investment => {
        // Simulate small price changes for demo purposes
        const randomChange = (Math.random() - 0.5) * 0.02 // ±1% change
        const currentPrice = investment.current_price || (investment.invested_amount / (investment.quantity || 1))
        const newPrice = currentPrice * (1 + randomChange)
        const newValue = newPrice * (investment.quantity || 1)
        const gainLoss = newValue - investment.invested_amount
        const changePercent = (gainLoss / investment.invested_amount) * 100
        
        return {
          ...investment,
          current_price: newPrice,
          current_value: newValue,
          gain_loss: gainLoss,
          change_percent: changePercent
        }
      })
      
      return updatedInvestments
      
    } catch (error) {
      console.error('Error updating Indian investment prices:', error)
      throw error
    }
  }

  // Get Indian market overview
  async getIndianMarketOverview() {
    try {
      const indices = await this.getIndianMarketIndices()
      
      return {
        indices,
        lastUpdated: new Date().toISOString(),
        provider: 'Indian Markets'
      }
    } catch (error) {
      console.error('Error getting Indian market overview:', error)
      throw error
    }
  }

  // Helper method to get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        console.warn('Authentication error:', error.message)
        return null
      }
      return user
    } catch (error) {
      console.warn('Error getting current user:', error.message)
      return null
    }
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
export const indianInvestmentDataService = new IndianInvestmentDataService()

// Export individual methods for convenience
export const {
  getNSEStockQuote,
  getBSEStockQuote,
  getZerodhaQuote,
  getCAMSMutualFundNAV,
  getKarvyMutualFundNAV,
  getMoneyControlMutualFund,
  getIndianMarketIndices,
  searchIndianStocks,
  searchMutualFunds,
  updateIndianInvestmentPrices,
  getIndianMarketOverview,
  setProvider,
  getCurrentProvider,
  getAvailableProviders
} = indianInvestmentDataService
