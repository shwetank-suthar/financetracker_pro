import React from 'react';
import ProductCard from './ProductCard';

const ProductResults = ({ results, onProductSelect, selectedProducts, onClearAll }) => {
  const { products, totalResults, searchQuery, zipCode } = results;

  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-600">
          Try adjusting your search terms or check back later for new deals.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Search Results
            </h2>
            <p className="text-gray-600 mt-1">
              Found {totalResults} products for "{searchQuery}" in {zipCode}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Best Deals</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span>Top Rated</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isSelected={selectedProducts.some(p => p.id === product.id)}
            onSelect={() => onProductSelect(product)}
          />
        ))}
      </div>

      {/* Comparison CTA */}
      {selectedProducts.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-lg font-bold">
                  {selectedProducts.length}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  {selectedProducts.length} Product{selectedProducts.length > 1 ? 's' : ''} Selected for Comparison
                </h3>
                <p className="text-sm text-blue-700">
                  Compare prices, features, and delivery options
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                🔍 View Comparison
              </button>
              <button
                onClick={onClearAll}
                className="px-4 py-3 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load More Button */}
      {products.length < totalResults && (
        <div className="text-center">
          <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductResults;
