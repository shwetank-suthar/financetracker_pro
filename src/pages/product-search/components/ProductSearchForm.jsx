import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProductSearchForm = ({ onSearch, isLoading }) => {
  const [formData, setFormData] = useState({
    zipCode: '',
    query: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required';
    } else if (!/^\d{6}$/.test(formData.zipCode.trim())) {
      newErrors.zipCode = 'Please enter a valid 6-digit Indian zip code';
    }
    
    if (!formData.query.trim()) {
      newErrors.query = 'Product description is required';
    } else if (formData.query.trim().length < 3) {
      newErrors.query = 'Please provide a more detailed product description';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSearch({
        zipCode: formData.zipCode.trim(),
        query: formData.query.trim()
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const exampleQueries = [
    "I want to order a trimmer",
    "Looking for a smartphone under ₹20000",
    "Need a laptop for work",
    "Want to buy wireless headphones",
    "Looking for kitchen appliances"
  ];

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Zip Code Input */}
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Zip Code *
            </label>
            <Input
              id="zipCode"
              type="text"
              placeholder="Enter 6-digit zip code (e.g., 110001)"
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              error={errors.zipCode}
              maxLength={6}
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500">
              We'll show delivery estimates for your location
            </p>
          </div>

          {/* Product Query Input */}
          <div>
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
              What are you looking for? *
            </label>
            <Input
              id="query"
              type="text"
              placeholder="e.g., I want to order a trimmer"
              value={formData.query}
              onChange={(e) => handleInputChange('query', e.target.value)}
              error={errors.query}
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500">
              Be specific for better results
            </p>
          </div>
        </div>

        {/* Example Queries */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Example searches:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleInputChange('query', example)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Searching...
              </div>
            ) : (
              'Find Best Deals'
            )}
          </Button>
        </div>
      </form>

      {/* Features Info */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="w-8 h-8 mx-auto mb-2 text-blue-600">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-medium text-gray-900">Best Deals</h3>
          <p className="text-sm text-gray-600">Find products on sale and special offers</p>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="w-8 h-8 mx-auto mb-2 text-green-600">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="font-medium text-gray-900">Price Comparison</h3>
          <p className="text-sm text-gray-600">Compare prices across multiple platforms</p>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="w-8 h-8 mx-auto mb-2 text-purple-600">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-medium text-gray-900">Delivery Info</h3>
          <p className="text-sm text-gray-600">Get accurate delivery estimates</p>
        </div>
      </div>
    </div>
  );
};

export default ProductSearchForm;
