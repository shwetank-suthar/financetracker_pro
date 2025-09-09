import React from 'react';
import Button from '../../../components/ui/Button';

const ProductComparison = ({ products, onRemoveProduct }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getBestDeal = () => {
    return products.reduce((best, current) => 
      current.price < best.price ? current : best
    );
  };

  const getFastestDelivery = () => {
    return products.reduce((fastest, current) => {
      // Extract number from delivery time string (e.g., "2 days" -> 2)
      const currentDays = parseInt(current.deliveryTime?.match(/\d+/)?.[0] || '999');
      const fastestDays = parseInt(fastest.deliveryTime?.match(/\d+/)?.[0] || '999');
      return currentDays < fastestDays ? current : fastest;
    });
  };

  const getHighestRated = () => {
    return products.reduce((highest, current) => 
      current.rating > highest.rating ? current : highest
    );
  };

  const bestDeal = getBestDeal();
  const fastestDelivery = getFastestDelivery();
  const highestRated = getHighestRated();

  return (
    <div className="bg-white rounded-lg shadow-md p-6" data-comparison-section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Product Comparison
        </h2>
        <div className="text-sm text-gray-600">
          {products.length} product{products.length > 1 ? 's' : ''} selected
        </div>
      </div>

      {/* Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">💰</span>
            </div>
            <h3 className="font-medium text-green-900">Best Price</h3>
          </div>
          <p className="text-sm text-green-700 mb-2">
            {bestDeal.title.substring(0, 50)}...
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-green-900">
              {formatPrice(bestDeal.price)}
            </span>
            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
              {bestDeal.platform}
            </span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">⚡</span>
            </div>
            <h3 className="font-medium text-blue-900">Fastest Delivery</h3>
          </div>
          <p className="text-sm text-blue-700 mb-2">
            {fastestDelivery.title.substring(0, 50)}...
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-blue-900">
              {fastestDelivery.deliveryTime}
            </span>
            <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
              {fastestDelivery.platform}
            </span>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">⭐</span>
            </div>
            <h3 className="font-medium text-purple-900">Top Rated</h3>
          </div>
          <p className="text-sm text-purple-700 mb-2">
            {highestRated.title.substring(0, 50)}...
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-purple-900">
              {Number(highestRated.rating).toFixed(2)}★
            </span>
            <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
              {highestRated.platform}
            </span>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Platform</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Rating</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Delivery</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <img
                      src={product.image || '/assets/images/no_image.png'}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded mr-3"
                      onError={(e) => {
                        e.target.src = '/assets/images/no_image.png';
                      }}
                    />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {product.title.substring(0, 40)}...
                      </p>
                      {product.discount > 0 && (
                        <span className="text-xs text-red-600 font-medium">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm font-medium text-gray-900">
                    {product.platform}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <span className="font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <div className="text-xs text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-1">
                      {Number(product.rating).toFixed(2)}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-900">
                    {product.deliveryTime}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => window.open(product.url, '_blank')}
                      className="text-xs px-3 py-1 bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Buy Now
                    </Button>
                    <Button
                      onClick={() => onRemoveProduct(product.id)}
                      className="text-xs px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      Remove
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Price Range:</span>
            <span className="ml-2 font-medium">
              {formatPrice(Math.min(...products.map(p => p.price)))} - {formatPrice(Math.max(...products.map(p => p.price)))}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Delivery Range:</span>
            <span className="ml-2 font-medium">
              {Math.min(...products.map(p => parseInt(p.deliveryTime?.match(/\d+/)?.[0] || '999')))} - {Math.max(...products.map(p => parseInt(p.deliveryTime?.match(/\d+/)?.[0] || '999')))} days
            </span>
          </div>
          <div>
            <span className="text-gray-600">Rating Range:</span>
            <span className="ml-2 font-medium">
              {Math.min(...products.map(p => Number(p.rating))).toFixed(2)} - {Math.max(...products.map(p => Number(p.rating))).toFixed(2)}★
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductComparison;
