import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProductSearchForm from './components/ProductSearchForm';
import ProductResults from './components/ProductResults';
import ProductComparison from './components/ProductComparison';
import productSearchService from '../../services/productSearchService';

const ProductSearchPage = () => {
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Test the service on component mount
  React.useEffect(() => {
    console.log('Testing product search service...');
    const testResult = productSearchService.testService();
    console.log('Service test result:', testResult);
  }, []);

  const handleSearch = async (searchData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await productSearchService.searchProducts(searchData);
      setSearchResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        const newSelection = prev.filter(p => p.id !== product.id);
        console.log('Product deselected:', product.title, 'New selection:', newSelection.length);
        return newSelection;
      }
      const newSelection = [...prev, product];
      console.log('Product selected:', product.title, 'Total selected:', newSelection.length);
      return newSelection;
    });
  };

  const handleClearAll = () => {
    setSelectedProducts([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Smart Product Search
            </h1>
            <p className="text-gray-600">
              Find the best deals and compare prices across Indian e-commerce platforms
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <ProductSearchForm 
              onSearch={handleSearch}
              isLoading={isLoading}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Search Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Searching for the best deals...</p>
            </div>
          )}

          {/* Search Results */}
          {searchResults && !isLoading && (
            <div className="space-y-8">
              <ProductResults 
                results={searchResults}
                onProductSelect={handleProductSelect}
                selectedProducts={selectedProducts}
                onClearAll={handleClearAll}
              />
              
              {selectedProducts.length > 0 && (
                <ProductComparison 
                  products={selectedProducts}
                  onRemoveProduct={(productId) => {
                    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
                  }}
                />
              )}
            </div>
          )}

          {/* Sticky Comparison Button */}
          {selectedProducts.length > 0 && (
            <div className="fixed bottom-6 right-6 z-50">
              <button
                onClick={() => {
                  const comparisonElement = document.querySelector('[data-comparison-section]');
                  if (comparisonElement) {
                    comparisonElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
              >
                <span className="text-lg">🔍</span>
                <span className="font-medium">Compare {selectedProducts.length} Product{selectedProducts.length > 1 ? 's' : ''}</span>
              </button>
            </div>
          )}

          {/* Empty State */}
          {!searchResults && !isLoading && !error && (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Ready to find great deals?
              </h3>
              <p className="text-gray-600 mb-4">
                Enter your zip code and describe what you're looking for to get started.
              </p>
              
              {/* Quick Test Button */}
              <div className="mt-6">
                <button
                  onClick={() => handleSearch({ zipCode: '110001', query: 'I want to order a trimmer' })}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Test Search (Trimmer)
                </button>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};


export default ProductSearchPage;
