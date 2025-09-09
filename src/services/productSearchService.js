// Product Search Service for Indian E-commerce Platforms
// This service will integrate with various Indian e-commerce APIs

class ProductSearchService {
  constructor() {
    this.baseUrls = {
      amazon: 'https://www.amazon.in',
      flipkart: 'https://www.flipkart.com',
      myntra: 'https://www.myntra.com',
      nykaa: 'https://www.nykaa.com',
      snapdeal: 'https://www.snapdeal.com',
      paytm: 'https://paytm.com'
    };
    
    // Mock data for demonstration - in real implementation, these would be API calls
    this.mockProducts = this.generateMockProducts();
    console.log('ProductSearchService initialized with', this.mockProducts.length, 'mock products');
  }

  // Main search function
  async searchProducts(searchData) {
    const { zipCode, query } = searchData;
    
    try {
      // In a real implementation, you would make API calls to various platforms
      // For now, we'll use mock data and simulate API responses
      const products = await this.simulateProductSearch(query, zipCode);
      
      return {
        products: products,
        totalResults: products.length,
        searchQuery: query,
        zipCode: zipCode,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Product search error:', error);
      throw new Error('Failed to search products. Please try again.');
    }
  }

  // Simulate product search across multiple platforms
  async simulateProductSearch(query, zipCode) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Extract keywords from query for better matching
    const queryKeywords = this.extractKeywords(query);
    console.log('Search query:', query);
    console.log('Extracted keywords:', queryKeywords);
    console.log('Total mock products:', this.mockProducts.length);
    
    // Filter mock products based on query with improved matching
    const filteredProducts = this.mockProducts.filter(product => {
      const titleMatch = product.title.toLowerCase().includes(query.toLowerCase()) ||
        queryKeywords.some(keyword => product.title.toLowerCase().includes(keyword));
      
      const categoryMatch = product.category.toLowerCase().includes(query.toLowerCase()) ||
        queryKeywords.some(keyword => product.category.toLowerCase().includes(keyword));
      
      const featureMatch = product.features.some(feature => 
        feature.toLowerCase().includes(query.toLowerCase()) ||
        queryKeywords.some(keyword => feature.toLowerCase().includes(keyword))
      );
      
      // Also check for common product synonyms
      const synonymMatch = this.checkProductSynonyms(query, product);
      
      return titleMatch || categoryMatch || featureMatch || synonymMatch;
    });

    console.log('Filtered products:', filteredProducts.length);

    // If no products found, return some popular products as fallback
    if (filteredProducts.length === 0) {
      console.log('No products found, returning popular products');
      const popularProducts = this.mockProducts
        .filter(p => p.isDeal || p.isTopRated)
        .slice(0, 6);
      
      const productsWithDelivery = popularProducts.map(product => ({
        ...product,
        deliveryTime: this.calculateDeliveryTime(zipCode, product.platform),
        deliveryEstimate: this.getDeliveryEstimate(zipCode, product.platform)
      }));
      
      return productsWithDelivery;
    }

    // Add delivery time based on zip code
    const productsWithDelivery = filteredProducts.map(product => ({
      ...product,
      deliveryTime: this.calculateDeliveryTime(zipCode, product.platform),
      deliveryEstimate: this.getDeliveryEstimate(zipCode, product.platform)
    }));

    // Sort by relevance (deals first, then by rating, then by price)
    return productsWithDelivery.sort((a, b) => {
      if (a.isDeal && !b.isDeal) return -1;
      if (!a.isDeal && b.isDeal) return 1;
      if (a.rating !== b.rating) return b.rating - a.rating;
      return a.price - b.price;
    });
  }

  // Extract keywords from search query
  extractKeywords(query) {
    const commonWords = ['i', 'want', 'to', 'order', 'buy', 'looking', 'for', 'need', 'get', 'find', 'a', 'an', 'the', 'is', 'are', 'in', 'on', 'at', 'with', 'and', 'or', 'but'];
    
    return query.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word))
      .map(word => word.replace(/[^\w]/g, '')); // Remove special characters
  }

  // Check for product synonyms and related terms
  checkProductSynonyms(query, product) {
    const synonyms = {
      'trimmer': ['hair trimmer', 'beard trimmer', 'electric trimmer', 'grooming', 'shaver'],
      'phone': ['smartphone', 'mobile', 'cell phone', 'android', 'iphone'],
      'laptop': ['notebook', 'computer', 'pc', 'macbook'],
      'headphones': ['earphones', 'earbuds', 'wireless headphones', 'bluetooth'],
      'watch': ['smartwatch', 'fitness tracker', 'wristwatch'],
      'shoes': ['sneakers', 'footwear', 'running shoes', 'sports shoes'],
      'bag': ['handbag', 'backpack', 'purse', 'tote'],
      'cream': ['moisturizer', 'lotion', 'face cream', 'skincare'],
      'oil': ['hair oil', 'coconut oil', 'essential oil'],
      'mat': ['yoga mat', 'exercise mat', 'fitness mat'],
      'dumbbells': ['weights', 'gym equipment', 'fitness equipment']
    };

    const queryLower = query.toLowerCase();
    
    // Check if any synonym matches the product
    for (const [key, values] of Object.entries(synonyms)) {
      if (queryLower.includes(key) || values.some(synonym => queryLower.includes(synonym))) {
        // Check if product title or category contains related terms
        const productText = (product.title + ' ' + product.category).toLowerCase();
        if (productText.includes(key) || values.some(synonym => productText.includes(synonym))) {
          return true;
        }
      }
    }
    
    return false;
  }

  // Calculate delivery time based on zip code and platform
  calculateDeliveryTime(zipCode, platform) {
    const deliveryTimes = {
      amazon: { min: 1, max: 3 },
      flipkart: { min: 2, max: 4 },
      myntra: { min: 1, max: 2 },
      nykaa: { min: 2, max: 3 },
      snapdeal: { min: 3, max: 5 },
      paytm: { min: 2, max: 4 }
    };

    const range = deliveryTimes[platform] || { min: 2, max: 4 };
    const days = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    
    return `${days} day${days > 1 ? 's' : ''}`;
  }

  // Get delivery estimate message
  getDeliveryEstimate(zipCode, platform) {
    const estimates = {
      amazon: "Fast delivery with Prime",
      flipkart: "Quick delivery available",
      myntra: "Express delivery option",
      nykaa: "Standard delivery",
      snapdeal: "Regular delivery",
      paytm: "Quick delivery"
    };
    
    return estimates[platform] || "Standard delivery";
  }

  // Generate mock product data for demonstration
  generateMockProducts() {
    const categories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports'];
    const platforms = ['amazon', 'flipkart', 'myntra', 'nykaa', 'snapdeal', 'paytm'];
    
    const products = [];
    
    // Generate products for different categories
    categories.forEach(category => {
      const categoryProducts = this.generateCategoryProducts(category, platforms);
      products.push(...categoryProducts);
    });

    return products;
  }

  generateCategoryProducts(category, platforms) {
    const productTemplates = {
      'Electronics': [
        { name: 'Wireless Bluetooth Headphones', basePrice: 2000, features: ['Noise Cancellation', '12hr Battery'] },
        { name: 'Smartphone', basePrice: 15000, features: ['64MP Camera', '128GB Storage'] },
        { name: 'Laptop', basePrice: 45000, features: ['8GB RAM', '512GB SSD'] },
        { name: 'Smart Watch', basePrice: 8000, features: ['Heart Rate Monitor', 'Water Resistant'] },
        { name: 'Trimmer', basePrice: 1500, features: ['Cordless', '2hr Battery'] },
        { name: 'Power Bank', basePrice: 1200, features: ['20000mAh', 'Fast Charging'] }
      ],
      'Fashion': [
        { name: 'Cotton T-Shirt', basePrice: 500, features: ['100% Cotton', 'Machine Washable'] },
        { name: 'Jeans', basePrice: 1200, features: ['Slim Fit', 'Stretchable'] },
        { name: 'Sneakers', basePrice: 2500, features: ['Comfortable', 'Durable'] },
        { name: 'Handbag', basePrice: 800, features: ['Leather', 'Multiple Compartments'] }
      ],
      'Home & Kitchen': [
        { name: 'Non-Stick Cookware Set', basePrice: 3000, features: ['5 Piece Set', 'Easy Clean'] },
        { name: 'Air Fryer', basePrice: 5000, features: ['4L Capacity', 'Digital Display'] },
        { name: 'Water Purifier', basePrice: 12000, features: ['RO+UV', '7L Storage'] }
      ],
      'Beauty': [
        { name: 'Face Cream', basePrice: 400, features: ['Anti-Aging', 'SPF 30'] },
        { name: 'Lipstick Set', basePrice: 600, features: ['Long Lasting', 'Matte Finish'] },
        { name: 'Hair Oil', basePrice: 200, features: ['Natural Ingredients', 'Hair Growth'] }
      ],
      'Sports': [
        { name: 'Yoga Mat', basePrice: 800, features: ['Non-Slip', 'Eco-Friendly'] },
        { name: 'Dumbbells Set', basePrice: 2000, features: ['Adjustable', 'Rubber Coated'] },
        { name: 'Running Shoes', basePrice: 3000, features: ['Lightweight', 'Breathable'] }
      ]
    };

    const templates = productTemplates[category] || [];
    const products = [];

    templates.forEach(template => {
      platforms.forEach(platform => {
        const priceVariation = 0.8 + Math.random() * 0.4; // 80% to 120% of base price
        const price = Math.round(template.basePrice * priceVariation);
        const originalPrice = Math.round(price * (1.1 + Math.random() * 0.3)); // 10-40% markup
        
        const product = {
          id: `${platform}-${template.name.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 9)}`,
          title: template.name,
          price: price,
          originalPrice: originalPrice,
          discount: Math.round(((originalPrice - price) / originalPrice) * 100),
          image: this.getRandomProductImage(category),
          platform: platform,
          category: category,
          rating: 3.5 + Math.random() * 1.5, // 3.5 to 5.0
          reviews: Math.floor(Math.random() * 5000) + 100,
          features: template.features,
          url: `${this.baseUrls[platform]}/product/${template.name.toLowerCase().replace(/\s+/g, '-')}`,
          isDeal: Math.random() > 0.7, // 30% chance of being a deal
          isFastDelivery: Math.random() > 0.6, // 40% chance of fast delivery
          isTopRated: Math.random() > 0.8, // 20% chance of being top rated
          inStock: Math.random() > 0.1, // 90% chance of being in stock
          seller: this.getRandomSeller(platform)
        };

        products.push(product);
      });
    });

    return products;
  }

  getRandomProductImage(category) {
    const imageUrls = {
      'Electronics': [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300',
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300'
      ],
      'Fashion': [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300',
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300'
      ],
      'Home & Kitchen': [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300'
      ],
      'Beauty': [
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300'
      ],
      'Sports': [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
        'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=300',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300'
      ]
    };

    const images = imageUrls[category] || imageUrls['Electronics'];
    return images[Math.floor(Math.random() * images.length)];
  }

  getRandomSeller(platform) {
    const sellers = {
      amazon: ['Amazon', 'Cloudtail', 'Appario', 'RetailNet'],
      flipkart: ['Flipkart', 'WS Retail', 'RetailNet', 'Cloudtail'],
      myntra: ['Myntra', 'Roadster', 'HRX', 'Puma'],
      nykaa: ['Nykaa', 'Lakme', 'Maybelline', 'L\'Oreal'],
      snapdeal: ['Snapdeal', 'RetailNet', 'Cloudtail', 'Appario'],
      paytm: ['Paytm', 'RetailNet', 'Cloudtail', 'Appario']
    };

    const platformSellers = sellers[platform] || ['Retailer'];
    return platformSellers[Math.floor(Math.random() * platformSellers.length)];
  }

  // Get product details by ID
  async getProductDetails(productId) {
    const product = this.mockProducts.find(p => p.id === productId);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  // Get similar products
  async getSimilarProducts(productId, limit = 4) {
    const product = await this.getProductDetails(productId);
    const similar = this.mockProducts
      .filter(p => p.id !== productId && p.category === product.category)
      .slice(0, limit);
    
    return similar;
  }

  // Get trending products
  async getTrendingProducts(limit = 8) {
    return this.mockProducts
      .filter(p => p.isTopRated || p.isDeal)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  // Test method to verify service is working
  testService() {
    console.log('Testing ProductSearchService...');
    console.log('Total products:', this.mockProducts.length);
    console.log('Sample products:', this.mockProducts.slice(0, 3).map(p => p.title));
    
    // Test search for trimmer
    const trimmerResults = this.mockProducts.filter(p => 
      p.title.toLowerCase().includes('trimmer')
    );
    console.log('Trimmer products found:', trimmerResults.length);
    
    return {
      totalProducts: this.mockProducts.length,
      trimmerProducts: trimmerResults.length,
      sampleProducts: this.mockProducts.slice(0, 3).map(p => p.title)
    };
  }
}

// Create and export a singleton instance
const productSearchService = new ProductSearchService();
export default productSearchService;
