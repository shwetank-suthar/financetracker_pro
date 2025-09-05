# Indian Investment APIs Setup Guide

This guide will help you set up real-time investment tracking for Indian markets using various APIs.

## 🚀 Available APIs

### **1. Zerodha Kite Connect API**
- **Best for**: Real-time stock quotes, order management
- **Coverage**: NSE, BSE, NFO, CDS, MCX
- **Rate Limit**: 3 requests per second
- **Cost**: Free for personal use

### **2. CAMS (Computer Age Manageme
nt Services)**
- **Best for**: Mutual fund NAV data
- **Coverage**: All CAMS-serviced mutual funds
- **Rate Limit**: 10 requests per minute
- **Cost**: Contact CAMS for pricing

### **3. KARVY**
- **Best for**: Mutual fund NAV data
- **Coverage**: All KARVY-serviced mutual funds
- **Rate Limit**: 10 requests per minute
- **Cost**: Contact KARVY for pricing

### **4. NSE India API**
- **Best for**: NSE stock quotes, indices
- **Coverage**: NSE stocks and indices
- **Rate Limit**: 2 requests per second
- **Cost**: Free

### **5. BSE India API**
- **Best for**: BSE stock quotes
- **Coverage**: BSE stocks
- **Rate Limit**: 2 requests per second
- **Cost**: Free

### **6. MoneyControl API**
- **Best for**: Mutual fund data, stock quotes
- **Coverage**: Comprehensive Indian market data
- **Rate Limit**: 5 requests per second
- **Cost**: Free with limitations

## 🔧 Setup Instructions

### **Step 1: Zerodha Kite Connect Setup**

1. **Create Zerodha Account**
   - Go to [zerodha.com](https://zerodha.com)
   - Open a trading account
   - Complete KYC verification

2. **Get API Credentials**
   - Go to [kite.trade](https://kite.trade)
   - Login with your Zerodha credentials
   - Go to "API" section
   - Generate API key and access token

3. **Add to Environment Variables**
   ```bash
   VITE_ZERODHA_API_KEY=your_api_key_here
   VITE_ZERODHA_ACCESS_TOKEN=your_access_token_here
   ```

### **Step 2: CAMS API Setup**

1. **Contact CAMS**
   - Email: api@camsonline.com
   - Request API access for mutual fund data
   - Provide your business requirements

2. **Get API Key**
   - CAMS will provide API documentation
   - Get your API key and base URL

3. **Add to Environment Variables**
   ```bash
   VITE_CAMS_API_KEY=your_cams_api_key_here
   ```

### **Step 3: KARVY API Setup**

1. **Contact KARVY**
   - Email: api@karvy.com
   - Request API access for mutual fund data
   - Provide your business requirements

2. **Get API Key**
   - KARVY will provide API documentation
   - Get your API key and base URL

3. **Add to Environment Variables**
   ```bash
   VITE_KARVY_API_KEY=your_karvy_api_key_here
   ```

### **Step 4: Update Your .env File**

Add all the API keys to your `.env` file:

```bash
# Supabase Configuration (existing)
VITE_SUPABASE_URL=https://ltugmvcjktiqpaiytzfy.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI Configuration (existing)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Indian Investment APIs
VITE_ZERODHA_API_KEY=your_zerodha_api_key_here
VITE_ZERODHA_ACCESS_TOKEN=your_zerodha_access_token_here
VITE_CAMS_API_KEY=your_cams_api_key_here
VITE_KARVY_API_KEY=your_karvy_api_key_here
```

## 📊 Supported Data Types

### **Stocks**
- **NSE Stocks**: All NSE-listed stocks
- **BSE Stocks**: All BSE-listed stocks
- **Real-time Quotes**: Live price, volume, high/low
- **Historical Data**: Price history and charts

### **Mutual Funds**
- **NAV Data**: Net Asset Value updates
- **Fund Information**: Scheme details, categories
- **Performance Metrics**: Returns, risk measures
- **Holdings**: Portfolio composition

### **Indices**
- **NSE Indices**: NIFTY 50, NIFTY BANK, NIFTY IT, etc.
- **BSE Indices**: SENSEX, BSE 100, etc.
- **Sector Indices**: Banking, IT, Pharma, etc.

## 🎯 Usage Examples

### **Get NSE Stock Quote**
```javascript
import { indianInvestmentDataService } from './services/indianInvestmentDataService'

// Get Reliance Industries quote
const quote = await indianInvestmentDataService.getNSEStockQuote('RELIANCE')
console.log(quote)
```

### **Get Mutual Fund NAV**
```javascript
// Get HDFC Top 100 Fund NAV
const nav = await indianInvestmentDataService.getCAMSMutualFundNAV('120503')
console.log(nav)
```

### **Get Market Indices**
```javascript
// Get all major indices
const indices = await indianInvestmentDataService.getIndianMarketIndices()
console.log(indices)
```

## 🔄 Real-time Updates

The system supports real-time updates with configurable intervals:

- **Stock Prices**: Every 30 seconds
- **Mutual Fund NAV**: Daily (after market close)
- **Market Indices**: Every 30 seconds
- **Portfolio Updates**: Every 2 minutes

## 🛡️ Rate Limiting

Each API has built-in rate limiting:

- **Zerodha**: 3 requests/second
- **CAMS**: 10 requests/minute
- **KARVY**: 10 requests/minute
- **NSE**: 2 requests/second
- **BSE**: 2 requests/second

## 📱 Integration with Your App

### **1. Add to Investment Portfolio Page**
```jsx
import IndianInvestmentTracker from '../components/investment/IndianInvestmentTracker'

// In your investment portfolio page
<IndianInvestmentTracker />
```

### **2. Use in Dashboard**
```jsx
import { useIndianInvestmentPortfolio } from '../hooks/useIndianInvestmentData'

// In your dashboard component
const { investments, portfolioTotals, refreshPrices } = useIndianInvestmentPortfolio()
```

### **3. Real-time Price Updates**
```jsx
import { useRealTimeIndianPrices } from '../hooks/useIndianInvestmentData'

// For specific symbols
const { prices, loading, error } = useRealTimeIndianPrices(['RELIANCE', 'TCS', 'HDFCBANK'])
```

## 🚨 Important Notes

### **API Keys Security**
- Never commit API keys to version control
- Use environment variables for all keys
- Rotate keys regularly
- Monitor API usage

### **Rate Limiting**
- Respect API rate limits
- Implement proper error handling
- Use exponential backoff for retries
- Cache data when possible

### **Data Accuracy**
- Mutual fund NAV is updated daily after market close
- Stock prices are real-time during market hours
- Historical data may have delays
- Always verify critical data

### **Compliance**
- Ensure compliance with SEBI regulations
- Follow API provider terms of service
- Implement proper data retention policies
- Respect user privacy

## 🔧 Troubleshooting

### **Common Issues**

1. **"API rate limit exceeded"**
   - Reduce request frequency
   - Implement proper rate limiting
   - Use caching for frequently accessed data

2. **"Invalid API key"**
   - Check API key format
   - Verify key is active
   - Ensure proper authentication headers

3. **"No data found"**
   - Verify symbol/scheme code
   - Check if market is open
   - Try alternative API provider

4. **"Network error"**
   - Check internet connection
   - Verify API endpoint URLs
   - Implement retry logic

### **Getting Help**

1. **Zerodha Support**: [support.zerodha.com](https://support.zerodha.com)
2. **CAMS Support**: api@camsonline.com
3. **KARVY Support**: api@karvy.com
4. **NSE Support**: [nseindia.com/contact](https://nseindia.com/contact)

## 🎉 Ready to Use!

Once you've set up the APIs, your FinanceTracker Pro will have:

- ✅ Real-time Indian stock quotes
- ✅ Live mutual fund NAV updates
- ✅ Market indices tracking
- ✅ Portfolio performance monitoring
- ✅ Investment search functionality
- ✅ Automated price updates

Your Indian investment tracking is now fully functional! 🇮🇳📈
