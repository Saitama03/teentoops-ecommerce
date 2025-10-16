import React, { useState } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/App';

const ProductCard = ({ product, onProductClick }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();
  const { t, lang } = useLanguage();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    // Get the first available variant
    const firstVariant = product.variants?.[0];
    if (firstVariant) {
      addToCart(product, firstVariant, 1);
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getImageUrl = () => {
    if (product.main_image_url && !imageError) {
      return product.main_image_url;
    }
    return null;
  };

  return (
    <div 
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-gray-200"
      onClick={() => onProductClick(product)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {getImageUrl() ? (
          <img
            src={getImageUrl()}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto flex items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {product.name.charAt(0)}
                </span>
              </div>
              <p className="text-xs text-gray-500">No Image</p>
            </div>
          </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300">
          <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              variant="secondary"
              className="w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white shadow-lg"
              onClick={handleLike}
            >
              <Heart 
                className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
              />
            </Button>
          </div>
          
          {/* Quick Add to Cart */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg"
              disabled={!product.variants || product.variants.length === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {t('quick_add')}
            </Button>
          </div>
        </div>

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {t('featured_badge')}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {product[`category_name_${lang}`] || product.category_name}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {product.min_price === product.max_price ? (
              <p className="text-lg font-bold text-gray-900">
                {formatPrice(product.min_price)}
              </p>
            ) : (
              <p className="text-lg font-bold text-gray-900">
                {formatPrice(product.min_price)} - {formatPrice(product.max_price)}
              </p>
            )}
          </div>
          
          {/* Rating */}
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">4.5</span>
          </div>
        </div>

        {/* Available Sizes Preview */}
        {product.available_sizes && product.available_sizes.length > 0 && (
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500">Sizes:</span>
            <div className="flex space-x-1">
              {product.available_sizes.slice(0, 4).map((size, index) => (
                <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {size}
                </span>
              ))}
              {product.available_sizes.length > 4 && (
                <span className="text-xs text-gray-500">+{product.available_sizes.length - 4}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
