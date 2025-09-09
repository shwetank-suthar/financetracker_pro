import React from 'react';
import Button from '../../../components/ui/Button';

const ProductCard = ({ product, isSelected, onSelect }) => {
  const {
    id,
    title,
    price,
    originalPrice,
    discount,
    image,
    platform,
    rating,
    reviews,
    deliveryTime,
    isDeal,
    isFastDelivery,
    isTopRated,
    features = []
  } = product;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getPlatformColor = (platform) => {
    const colors = {
      'amazon': 'bg-orange-100 text-orange-800',
      'flipkart': 'bg-blue-100 text-blue-800',
      'myntra': 'bg-pink-100 text-pink-800',
      'nykaa': 'bg-purple-100 text-purple-800',
      'snapdeal': 'bg-red-100 text-red-800',
      'paytm': 'bg-yellow-100 text-yellow-800'
    };
    return colors[platform.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getPlatformLogo = (platform) => {
    const logos = {
      'amazon': '🛒',
      'flipkart': '🛍️',
      'myntra': '👗',
      'nykaa': '💄',
      'snapdeal': '📦',
      'paytm': '💰'
    };
    return logos[platform.toLowerCase()] || '🛒';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg ${
      isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
    }`}>
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/assets/images/no_image.png';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {isDeal && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              🔥 Deal
            </span>
          )}
          {isFastDelivery && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              ⚡ Fast
            </span>
          )}
          {isTopRated && (
            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              ⭐ Top
            </span>
          )}
        </div>

        {/* Platform Badge */}
        <div className="absolute top-2 right-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPlatformColor(platform)}`}>
            {getPlatformLogo(platform)} {platform}
          </span>
        </div>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute bottom-2 right-2">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              {discount}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-1">
              {Number(rating).toFixed(2)} ({reviews} reviews)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(price)}
            </span>
            {originalPrice > price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          {discount > 0 && (
            <p className="text-xs text-green-600 font-medium">
              You save {formatPrice(originalPrice - price)}
            </p>
          )}
        </div>

        {/* Delivery Info */}
        <div className="mb-3">
          <div className="flex items-center text-xs text-gray-600">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Delivery in {deliveryTime}</span>
          </div>
        </div>

        {/* Key Features */}
        {features.length > 0 && (
          <div className="mb-3">
            <div className="text-xs text-gray-600">
              {features.slice(0, 2).map((feature, index) => (
                <span key={index}>
                  • {feature}
                  {index < Math.min(features.length, 2) - 1 && ' '}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={onSelect}
            className={`flex-1 text-sm py-2 ${
              isSelected
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isSelected ? '✓ Selected' : 'Compare'}
          </Button>
          
          <Button
            onClick={() => window.open(product.url, '_blank')}
            className="flex-1 text-sm py-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            View Deal
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
