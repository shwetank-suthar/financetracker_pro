import openai from './openaiClient';


/**
 * Generates structured financial recommendations.
 * @param {Object} userProfile - User's financial profile
 * @param {Array} goals - User's financial goals
 * @returns {Promise<Object>} Structured recommendations
 */
export async function getStructuredFinancialRecommendations(userProfile, goals = []) {
  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5',
      messages: [
        { 
          role: 'system', 
          content: 'You are a financial advisor that provides structured, actionable recommendations based on user profiles and goals. Be specific and prioritize recommendations.' 
        },
        { 
          role: 'user', 
          content: `Based on my profile: ${JSON.stringify(userProfile)} and goals: ${JSON.stringify(goals)}, provide financial recommendations.` 
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'financial_recommendations',
          schema: {
            type: 'object',
            properties: {
              summary: { type: 'string', description: 'Brief summary of financial situation' },
              recommendations: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    category: { type: 'string', enum: ['spending', 'saving', 'investing', 'budgeting', 'debt'] },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    priority: { type: 'string', enum: ['high', 'medium', 'low'] },
                    timeframe: { type: 'string' },
                    potential_impact: { type: 'string' }
                  },
                  required: ['category', 'title', 'description', 'priority']
                }
              },
              risk_assessment: { type: 'string' },
              confidence_score: { type: 'number', minimum: 0, maximum: 1 }
            },
            required: ['summary', 'recommendations', 'risk_assessment', 'confidence_score'],
            additionalProperties: false,
          },
        },
      },
      reasoning_effort: 'high',
      verbosity: 'medium',
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error generating structured recommendations:', error);
    throw error;
  }
}

/**
 * Generates expense categorization suggestions.
 * @param {Array} transactions - Array of transaction objects
 * @returns {Promise<Array>} Categorized transactions with AI suggestions
 */
export async function categorizeExpenses(transactions) {
  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5-mini', // Fast model for categorization
      messages: [
        { 
          role: 'system', 
          content: 'You are an expense categorization expert. Analyze transactions and suggest appropriate categories based on description and amount. Use standard categories like Food & Dining, Transportation, Shopping, Entertainment, Bills & Utilities, Health & Fitness, Travel, etc.' 
        },
        { 
          role: 'user', 
          content: `Categorize these transactions: ${JSON.stringify(transactions)}` 
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'categorized_transactions',
          schema: {
            type: 'object',
            properties: {
              categorized_transactions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    transaction_id: { type: 'string' },
                    suggested_category: { type: 'string' },
                    confidence: { type: 'number', minimum: 0, maximum: 1 },
                    reasoning: { type: 'string' }
                  },
                  required: ['transaction_id', 'suggested_category', 'confidence']
                }
              }
            },
            required: ['categorized_transactions'],
            additionalProperties: false,
          },
        },
      },
      reasoning_effort: 'minimal',
      verbosity: 'low',
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error categorizing expenses:', error);
    throw error;
  }
}

/**
 * Generates investment analysis and suggestions.
 * @param {Object} portfolio - User's investment portfolio
 * @param {Object} riskProfile - User's risk tolerance and preferences
 * @returns {Promise<Object>} Investment analysis and recommendations
 */
export async function analyzeInvestmentPortfolio(portfolio, riskProfile) {
  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5',
      messages: [
        { 
          role: 'system', 
          content: 'You are an investment advisor. Analyze portfolios for diversification, risk assessment, performance evaluation, and provide specific investment recommendations based on user risk profile.' 
        },
        { 
          role: 'user', 
          content: `Analyze my investment portfolio: ${JSON.stringify(portfolio)} with risk profile: ${JSON.stringify(riskProfile)}` 
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'investment_analysis',
          schema: {
            type: 'object',
            properties: {
              portfolio_health: { type: 'string', enum: ['excellent', 'good', 'fair', 'needs_improvement'] },
              diversification_score: { type: 'number', minimum: 0, maximum: 100 },
              risk_analysis: { type: 'string' },
              performance_summary: { type: 'string' },
              recommendations: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    type: { type: 'string', enum: ['rebalance', 'add_position', 'reduce_position', 'new_investment'] },
                    description: { type: 'string' },
                    rationale: { type: 'string' },
                    priority: { type: 'string', enum: ['high', 'medium', 'low'] }
                  },
                  required: ['type', 'description', 'rationale', 'priority']
                }
              },
              suggested_allocations: {
                type: 'object',
                properties: {
                  stocks: { type: 'number' },
                  bonds: { type: 'number' },
                  commodities: { type: 'number' },
                  cash: { type: 'number' }
                }
              }
            },
            required: ['portfolio_health', 'diversification_score', 'risk_analysis', 'performance_summary', 'recommendations'],
            additionalProperties: false,
          },
        },
      },
      reasoning_effort: 'high',
      verbosity: 'medium',
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error analyzing investment portfolio:', error);
    throw error;
  }
}

/**
 * Generates personalized budget recommendations.
 * @param {Object} income - User's income information
 * @param {Object} expenses - User's expense data
 * @param {Array} goals - User's financial goals
 * @returns {Promise<Object>} Budget recommendations
 */
export async function generateBudgetPlan(income, expenses, goals = []) {
  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5',
      messages: [
        { 
          role: 'system', 
          content: 'You are a budgeting expert. Create realistic, personalized budget plans that help users achieve their financial goals while maintaining a reasonable lifestyle. Use the 50/30/20 rule as a baseline but adjust based on individual circumstances.' 
        },
        { 
          role: 'user', 
          content: `Create a budget plan based on income: ${JSON.stringify(income)}, current expenses: ${JSON.stringify(expenses)}, and goals: ${JSON.stringify(goals)}` 
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'budget_plan',
          schema: {
            type: 'object',
            properties: {
              monthly_budget: {
                type: 'object',
                properties: {
                  total_income: { type: 'number' },
                  needs: { type: 'number' },
                  wants: { type: 'number' },
                  savings: { type: 'number' },
                  emergency_fund: { type: 'number' }
                },
                required: ['total_income', 'needs', 'wants', 'savings']
              },
              category_allocations: {
                type: 'object',
                properties: {
                  housing: { type: 'number' },
                  food: { type: 'number' },
                  transportation: { type: 'number' },
                  utilities: { type: 'number' },
                  entertainment: { type: 'number' },
                  healthcare: { type: 'number' },
                  miscellaneous: { type: 'number' }
                }
              },
              recommendations: {
                type: 'array',
                items: { type: 'string' }
              },
              goal_timeline: { type: 'string' },
              savings_rate: { type: 'number' }
            },
            required: ['monthly_budget', 'category_allocations', 'recommendations', 'savings_rate'],
            additionalProperties: false,
          },
        },
      },
      reasoning_effort: 'medium',
      verbosity: 'medium',
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error generating budget plan:', error);
    throw error;
  }
}

/**
 * Generates financial chat responses for user queries.
 * @param {string} userMessage - User's financial question
 * @param {Object} context - User's financial context (optional)
 * @returns {Promise<string>} AI assistant's response
 */
export async function getFinancialChatResponse(userMessage, context = {}) {
  try {
    const contextMessage = Object.keys(context)?.length > 0 
      ? `Here's my financial context: ${JSON.stringify(context)}. Question: ${userMessage}`
      : userMessage;

    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5-mini', // Fast response for chat
      messages: [
        { 
          role: 'system', 
          content: 'You are a friendly, knowledgeable financial advisor assistant. Provide helpful, accurate financial advice while being conversational and easy to understand. Always consider the user\'s context when available.' 
        },
        { role: 'user', content: contextMessage },
      ],
      reasoning_effort: 'medium',
      verbosity: 'medium',
    });

    return response?.choices?.[0]?.message?.content;
  } catch (error) {
    console.error('Error getting financial chat response:', error);
    throw error;
  }
}

/**
 * Streams financial analysis responses for real-time feedback.
 * @param {string} userMessage - User's request for analysis
 * @param {Object} financialData - User's financial data
 * @param {Function} onChunk - Callback for each response chunk
 */
export async function streamFinancialAnalysis(userMessage, financialData, onChunk) {
  try {
    const stream = await openai?.chat?.completions?.create({
      model: 'gpt-5-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a financial analyst providing real-time insights. Be thorough but concise in your analysis.' 
        },
        { 
          role: 'user', 
          content: `${userMessage}. Financial data: ${JSON.stringify(financialData)}` 
        },
      ],
      stream: true,
      reasoning_effort: 'minimal', // For faster streaming
    });

    for await (const chunk of stream) {
      const content = chunk?.choices?.[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.error('Error streaming financial analysis:', error);
    throw error;
  }
}

/**
 * Generates comprehensive financial insights for dashboard.
 * @param {Object} data - User's financial data (expenses, accounts, investments, goals)
 * @returns {Promise<Object>} AI-generated insights
 */
export async function generateFinancialInsights(data) {
  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o-mini', // Using available model
      messages: [
        { 
          role: 'system', 
          content: 'You are a financial advisor providing comprehensive insights. Analyze spending patterns, identify savings opportunities, suggest expense optimizations, and provide investment advice. Be specific and actionable.' 
        },
        { 
          role: 'user', 
          content: `Analyze my financial data and provide insights: ${JSON.stringify(data)}` 
        },
      ],
    });

    const insights = response?.choices?.[0]?.message?.content;
    
    // Parse and structure the insights
    return {
      savingsRecommendations: extractSavingsRecommendations(insights),
      expenseOptimization: extractExpenseOptimization(insights),
      investmentAdvice: extractInvestmentAdvice(insights),
      fullInsights: insights,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating financial insights:', error);
    // Return fallback insights
    return {
      savingsRecommendations: "Consider reviewing your monthly subscriptions and dining expenses for potential savings.",
      expenseOptimization: "Track your spending patterns to identify areas where you can reduce costs.",
      investmentAdvice: "Diversify your portfolio across different asset classes for better risk management.",
      fullInsights: "AI insights temporarily unavailable. Please try again later.",
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Generates daily expense insights.
 * @param {Object} data - Daily expense data
 * @returns {Promise<Object>} Daily insights
 */
export async function generateDailyExpenseInsights(data) {
  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a daily expense analyst. Provide insights on spending patterns, suggest savings tips, and give budget recommendations for the day.' 
        },
        { 
          role: 'user', 
          content: `Analyze my daily expenses: ${JSON.stringify(data)}` 
        },
      ],
    });

    const insights = response?.choices?.[0]?.message?.content;
    
    return {
      spendingAnalysis: extractSpendingAnalysis(insights),
      savingsTips: extractSavingsTips(insights),
      budgetRecommendations: extractBudgetRecommendations(insights),
      fullInsights: insights,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating daily expense insights:', error);
    return {
      spendingAnalysis: "Review your daily spending patterns to identify trends.",
      savingsTips: "Consider setting daily spending limits for better control.",
      budgetRecommendations: "Track all expenses to maintain budget discipline.",
      fullInsights: "Daily insights temporarily unavailable.",
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Generates investment planning advice.
 * @param {Object} portfolio - Investment portfolio data
 * @param {Array} goals - Financial goals
 * @returns {Promise<Object>} Investment planning advice
 */
export async function generateInvestmentPlanningAdvice(portfolio, goals = []) {
  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are an investment planning advisor. Provide specific advice on portfolio optimization, goal-based investing, and future financial planning.' 
        },
        { 
          role: 'user', 
          content: `Provide investment planning advice for portfolio: ${JSON.stringify(portfolio)} and goals: ${JSON.stringify(goals)}` 
        },
      ],
    });

    const advice = response?.choices?.[0]?.message?.content;
    
    return {
      portfolioOptimization: extractPortfolioOptimization(advice),
      goalBasedAdvice: extractGoalBasedAdvice(advice),
      futurePlanning: extractFuturePlanning(advice),
      fullAdvice: advice,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating investment planning advice:', error);
    return {
      portfolioOptimization: "Consider rebalancing your portfolio based on your risk tolerance.",
      goalBasedAdvice: "Align your investments with your specific financial goals.",
      futurePlanning: "Plan for long-term financial security through diversified investments.",
      fullAdvice: "Investment advice temporarily unavailable.",
      timestamp: new Date().toISOString()
    };
  }
}

// Helper functions to extract specific insights
function extractSavingsRecommendations(insights) {
  // Simple extraction - in production, use more sophisticated parsing
  if (insights.includes('save') || insights.includes('savings')) {
    return insights.substring(0, 200) + '...';
  }
  return "Review your spending patterns to identify potential savings opportunities.";
}

function extractExpenseOptimization(insights) {
  if (insights.includes('expense') || insights.includes('spending')) {
    return insights.substring(0, 200) + '...';
  }
  return "Optimize your expenses by tracking and categorizing your spending.";
}

function extractInvestmentAdvice(insights) {
  if (insights.includes('invest') || insights.includes('portfolio')) {
    return insights.substring(0, 200) + '...';
  }
  return "Consider diversifying your investment portfolio for better returns.";
}

function extractSpendingAnalysis(insights) {
  if (insights.includes('spending') || insights.includes('expense')) {
    return insights.substring(0, 150) + '...';
  }
  return "Analyze your daily spending to identify patterns and opportunities.";
}

function extractSavingsTips(insights) {
  if (insights.includes('save') || insights.includes('tip')) {
    return insights.substring(0, 150) + '...';
  }
  return "Set daily spending limits and track all expenses for better savings.";
}

function extractBudgetRecommendations(insights) {
  if (insights.includes('budget') || insights.includes('recommend')) {
    return insights.substring(0, 150) + '...';
  }
  return "Create a realistic budget based on your income and expenses.";
}

function extractPortfolioOptimization(advice) {
  if (advice.includes('portfolio') || advice.includes('optimize')) {
    return advice.substring(0, 150) + '...';
  }
  return "Optimize your portfolio allocation based on your risk tolerance.";
}

function extractGoalBasedAdvice(advice) {
  if (advice.includes('goal') || advice.includes('target')) {
    return advice.substring(0, 150) + '...';
  }
  return "Align your investments with your specific financial goals.";
}

function extractFuturePlanning(advice) {
  if (advice.includes('future') || advice.includes('plan')) {
    return advice.substring(0, 150) + '...';
  }
  return "Plan for long-term financial security through strategic investing.";
}

/**
 * Moderates financial content for inappropriate or harmful advice.
 * @param {string} content - Content to moderate
 * @returns {Promise<Object>} Moderation results
 */
export async function moderateFinancialContent(content) {
  try {
    const response = await openai?.moderations?.create({
      model: 'text-moderation-latest',
      input: content,
    });

    return {
      flagged: response?.results?.[0]?.flagged,
      categories: response?.results?.[0]?.categories,
      category_scores: response?.results?.[0]?.category_scores,
    };
  } catch (error) {
    console.error('Error moderating financial content:', error);
    throw error;
  }
}