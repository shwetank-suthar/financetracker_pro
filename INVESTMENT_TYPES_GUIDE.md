# Investment Types Guide

## 🎯 **Supported Investment Types**

The "Add Investment" module supports the following investment types:

### **📈 Market-Linked Investments**

#### **1. Mutual Funds**
- **Description**: Pooled investment funds managed by professional fund managers
- **Fields**: Name, Amount, Quantity (Units), Purchase Price per Unit, Broker
- **Examples**: HDFC Top 100 Fund, SBI Bluechip Fund, Axis Long Term Equity Fund
- **Brokers**: Zerodha, Upstox, Angel Broking, ICICI Direct, etc.

#### **2. Stocks**
- **Description**: Individual company shares traded on stock exchanges
- **Fields**: Name, Amount, Quantity (Shares), Purchase Price per Share, Broker
- **Examples**: Reliance Industries, TCS, Infosys, HDFC Bank
- **Brokers**: Zerodha, Upstox, Angel Broking, ICICI Direct, etc.

#### **3. Exchange Traded Funds (ETF)**
- **Description**: Funds that track an index and trade like stocks
- **Fields**: Name, Amount, Quantity (Units), Purchase Price per Unit, Broker
- **Examples**: Nifty 50 ETF, Bank Nifty ETF, Gold ETF
- **Brokers**: Zerodha, Upstox, Angel Broking, ICICI Direct, etc.

#### **4. Cryptocurrency**
- **Description**: Digital currencies and tokens
- **Fields**: Name, Amount, Quantity (Coins), Purchase Price per Coin, Platform
- **Examples**: Bitcoin, Ethereum, Binance Coin, Cardano
- **Platforms**: WazirX, CoinDCX, ZebPay, etc.

### **🏦 Fixed Income Investments**

#### **5. Fixed Deposit (FD)**
- **Description**: Bank deposits with fixed interest rates and maturity periods
- **Fields**: Name, Amount, Purchase Date, Notes
- **Examples**: SBI FD, HDFC FD, ICICI FD
- **Banks**: SBI, HDFC, ICICI, Axis, Kotak, etc.

#### **6. Recurring Deposit (RD)**
- **Description**: Regular monthly deposits with fixed interest rates
- **Fields**: Name, Amount, Purchase Date, Notes
- **Examples**: SBI RD, HDFC RD, Post Office RD
- **Banks**: SBI, HDFC, ICICI, Post Office, etc.

#### **7. Public Provident Fund (PPF)**
- **Description**: Government-backed long-term savings scheme
- **Fields**: Name, Amount, Purchase Date, Notes
- **Examples**: SBI PPF, HDFC PPF, Post Office PPF
- **Banks**: SBI, HDFC, ICICI, Post Office, etc.

#### **8. National Pension System (NPS)**
- **Description**: Government pension scheme for retirement planning
- **Fields**: Name, Amount, Purchase Date, Notes
- **Examples**: SBI NPS, HDFC NPS, ICICI NPS
- **Banks**: SBI, HDFC, ICICI, etc.

#### **9. Bonds**
- **Description**: Fixed income securities issued by governments or corporations
- **Fields**: Name, Amount, Quantity, Purchase Price, Broker
- **Examples**: Government Bonds, Corporate Bonds, Tax-Free Bonds
- **Brokers**: Zerodha, Upstox, Angel Broking, etc.

### **🏠 Alternative Investments**

#### **10. Gold**
- **Description**: Physical gold, gold ETFs, or gold mutual funds
- **Fields**: Name, Amount, Quantity (Grams), Purchase Price per Gram, Notes
- **Examples**: Physical Gold, Gold ETF, Gold Mutual Fund
- **Platforms**: Banks, Jewelers, Brokers, etc.

#### **11. Real Estate**
- **Description**: Property investments including land, apartments, commercial spaces
- **Fields**: Name, Amount, Purchase Date, Notes
- **Examples**: Residential Property, Commercial Property, Land
- **Platforms**: Direct purchase, Real estate platforms, etc.

#### **12. Other**
- **Description**: Any other investment type not covered above
- **Fields**: Name, Amount, Purchase Date, Notes
- **Examples**: Commodities, Art, Collectibles, etc.

## 🎨 **Form Features**

### **Dynamic Form Fields**
- **Base Fields**: Name, Type, Amount, Purchase Date, Notes
- **Market-Linked Fields**: Quantity, Purchase Price, Broker (for stocks, mutual funds, ETFs, crypto, bonds)
- **Fixed Income Fields**: Only base fields (for FD, RD, PPF, NPS, real estate)

### **Smart Validation**
- **Required Fields**: Name, Type, Amount, Purchase Date
- **Conditional Fields**: Quantity and Purchase Price for market-linked investments
- **Number Validation**: Amount, Quantity, and Price fields with proper decimal handling

### **User Experience**
- **Responsive Design**: Works on desktop and mobile
- **Modal Interface**: Clean, focused form experience
- **Error Handling**: Clear error messages and validation
- **Auto-save**: Form data persists during session

## 📊 **Data Structure**

### **Investment Record Fields**
```javascript
{
  id: "uuid",
  user_id: "uuid",
  name: "string",           // Investment name
  type: "string",           // Investment type
  amount: "number",         // Total investment amount
  quantity: "number",       // Number of units/shares (for market-linked)
  purchase_price: "number", // Price per unit/share (for market-linked)
  purchase_date: "date",    // When investment was made
  broker: "string",         // Broker/platform used
  notes: "string",          // Additional notes
  current_value: "number",  // Current market value
  current_price: "number",  // Current price per unit
  invested_amount: "number", // Total amount invested
  created_at: "timestamp",
  updated_at: "timestamp"
}
```

## 🚀 **Usage Instructions**

### **Adding an Investment**
1. **Click "Add Investment"** button on dashboard
2. **Select Investment Type** from dropdown
3. **Fill Required Fields** based on investment type
4. **Add Optional Details** like broker, notes
5. **Submit Form** to save investment

### **Investment Types by Complexity**
- **Simple**: FD, RD, PPF, NPS, Real Estate (only basic fields)
- **Medium**: Gold (quantity and price)
- **Complex**: Mutual Funds, Stocks, ETFs, Crypto, Bonds (quantity, price, broker)

## 🔄 **Integration with Dashboard**

### **Real-time Updates**
- **Portfolio Value**: Automatically updates total investment value
- **Investment Breakdown**: Shows by type and individual investments
- **Performance Tracking**: Calculates gains/losses
- **Charts**: Visual representation of investment distribution

### **AI Insights**
- **Portfolio Analysis**: AI analyzes investment mix and performance
- **Recommendations**: Suggests portfolio rebalancing
- **Risk Assessment**: Evaluates investment risk profile
- **Goal Tracking**: Monitors progress toward financial goals

## 📱 **Mobile Experience**

### **Floating Action Button**
- **Position**: Bottom-right corner (below Add Expense FAB)
- **Icon**: TrendingUp icon
- **Color**: Secondary theme color
- **Accessibility**: Proper ARIA labels

### **Responsive Form**
- **Modal**: Full-screen on mobile, centered on desktop
- **Scrolling**: Form scrolls if content exceeds screen height
- **Touch-friendly**: Large touch targets and proper spacing

Your investment tracking is now comprehensive and user-friendly! 🎉
