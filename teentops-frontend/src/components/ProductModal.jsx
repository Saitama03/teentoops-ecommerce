import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart, Heart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import apiService from '@/lib/api';
import { useLanguage } from '@/App';

const ProductModal = ({ product, isOpen, onClose, onProceed }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { t, lang } = useLanguage();

  useEffect(() => {
    if (product && isOpen) {
      loadProductDetails();
    }
  }, [product, isOpen]);

  useEffect(() => {
    if (productDetails && selectedSize && selectedColor) {
      const variant = productDetails.variants?.find(
        v => v.size === selectedSize && v.color === selectedColor
      );
      setSelectedVariant(variant || null);
    }
  }, [selectedSize, selectedColor, productDetails]);

  // Reset image index when color changes
  useEffect(() => {
    if (selectedColor) {
      setCurrentImageIndex(0);
    }
  }, [selectedColor]);

  const loadProductDetails = async () => {
    if (!product?.slug) return;
    
    try {
      setLoading(true);
      const details = await apiService.getProduct(product.slug);
      setProductDetails(details);
      
      // Set default selections
      if (details.available_sizes?.length > 0) {
        setSelectedSize(details.available_sizes[0]);
      }
      if (details.available_colors?.length > 0) {
        setSelectedColor(details.available_colors[0]);
      }
    } catch (error) {
      console.error('Error loading product details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter images based on selected color
  const getFilteredImages = () => {
    if (!productDetails?.images) return [];
    
    if (selectedColor) {
      // Return images for the selected color or images without color specified
      return productDetails.images.filter(
        image => image.color === selectedColor || !image.color
      );
    }
    
    // If no color selected, show all images
    return productDetails.images;
  };

  const handleProceed = () => {
    if (selectedVariant && productDetails) {
      if (onProceed) {
        onProceed({ product: productDetails, variant: selectedVariant, quantity });
      } else {
        addToCart(productDetails, selectedVariant, quantity);
      }
      onClose();
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getAvailableColors = () => {
    if (!productDetails?.variants) return [];
    return productDetails.variants
      .filter(v => v.size === selectedSize)
      .map(v => v.color)
      .filter((color, index, self) => self.indexOf(color) === index);
  };

  const getAvailableSizes = () => {
    if (!productDetails?.variants) return [];
    return productDetails.variants
      .filter(v => v.color === selectedColor)
      .map(v => v.size)
      .filter((size, index, self) => self.indexOf(size) === index);
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-3 sm:p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto sm:overflow-hidden">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white rounded-full p-2"
          >
            <X className="h-5 w-5" />
          </Button>

          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-0 h-full">
              {/* Product Images */}
              <div className="relative bg-gray-50">
                <div className="aspect-square">
                  {(() => {
                    const filteredImages = getFilteredImages();
                    return filteredImages.length > 0 ? (
                      <img
                        src={filteredImages[currentImageIndex]?.image_url || filteredImages[currentImageIndex]?.image}
                        alt={productDetails.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className="text-center space-y-4">
                          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">
                              {(productDetails?.name || product.name || t('product_name_default')).charAt(0)}
                            </span>
                          </div>
                          <p className="text-gray-500">{t('no_image_available')}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                
                {/* Navigation Arrows */}
                {(() => {
                  const filteredImages = getFilteredImages();
                  return filteredImages.length > 1 ? (
                    <>
                      {/* Previous Button */}
                      <button
                        onClick={() => setCurrentImageIndex(prev => 
                          prev === 0 ? filteredImages.length - 1 : prev - 1
                        )}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      {/* Next Button */}
                      <button
                        onClick={() => setCurrentImageIndex(prev => 
                          prev === filteredImages.length - 1 ? 0 : prev + 1
                        )}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  ) : null;
                })()}

                {/* Image Thumbnails */}
                {(() => {
                  const filteredImages = getFilteredImages();
                  return filteredImages.length > 0 ? (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex space-x-2 overflow-x-auto">
                        {filteredImages.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                              currentImageIndex === index ? 'border-blue-600 ring-2 ring-blue-200' : 'border-white hover:border-gray-300'
                            }`}
                          >
                            <img
                              src={image.image_url || image.image}
                              alt={`${productDetails.name} ${image.color ? image.color : index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Product Details */}
              <div className="p-4 sm:p-6 sm:overflow-y-auto sm:max-h-[calc(90vh-80px)]">
                <div className="space-y-6">
                  {/* Product Info */}
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {productDetails?.name || product.name || t('product_name_default')}
                    </h1>
                    <p className="text-gray-600 mb-4">
                      {productDetails?.category?.[`name_${lang}`] || productDetails?.category?.name || product.category_name || t('product_category_default')}
                    </p>
                    
                    {/* Price */}
                    <div className="text-3xl font-bold text-gray-900 mb-4">
                      {selectedVariant ? (
                        formatPrice(selectedVariant.price)
                      ) : productDetails && productDetails?.min_price === productDetails?.max_price ? (
                        formatPrice(productDetails.min_price)
                      ) : productDetails ? (
                        `${formatPrice(productDetails?.min_price)} - ${formatPrice(productDetails?.max_price)}`
                      ) : (
                        t('loading_text')
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-gray-600">(4.5) • 24 {t('reviews_count')}</span>
                    </div>
                  </div>

                  {/* Description */}
                  {productDetails?.description && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{t('description_heading')}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {productDetails.description}
                      </p>
                    </div>
                  )}

                  {/* Size Selection */}
                  {productDetails?.available_sizes?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">{t('size_heading')}</h3>
                      <div className="flex flex-wrap gap-2">
                        {productDetails.available_sizes.map((size, index) => (
                          <button
                            key={`size-${size}-${index}`}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                              selectedSize === size
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Color Selection */}
                  {productDetails?.available_colors?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">{t('color_heading')}</h3>
                      <div className="flex flex-wrap gap-2">
                        {productDetails.available_colors.map((color, index) => (
                          <button
                            key={`color-${color}-${index}`}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 border rounded-lg font-medium capitalize transition-colors ${
                              selectedColor === color
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">{t('quantity_heading')}</h3>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="h-10 w-10 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-medium w-12 text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                        className="h-10 w-10 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Stock Status */}
                  {selectedVariant && (
                    <div className="text-sm">
                      {selectedVariant.stock_quantity > 0 ? (
                        <span className="text-green-600 font-medium">
                          {t('in_stock_message')}{selectedVariant.stock_quantity} {t('available_text')}
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          {t('out_of_stock_message')}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleProceed}
                      disabled={!selectedVariant || selectedVariant.stock_quantity === 0}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {t('proceed_to_order_button')}
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Heart className="h-5 w-5 mr-2" />
                      {t('add_to_wishlist_button')}
                    </Button>
                  </div>

                  {/* Features */}
                  <div className="border-t pt-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <Truck className="h-5 w-5 text-blue-600" />
                        <span>{t('free_delivery_message')}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <span>{t('cod_available_message')}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <RotateCcw className="h-5 w-5 text-blue-600" />
                        <span>{t('return_policy_message')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
