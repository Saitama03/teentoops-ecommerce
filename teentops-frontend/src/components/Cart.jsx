import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/App';

const Cart = ({ isOpen, onClose, onCheckout }) => {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { t } = useLanguage();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleQuantityChange = (variantId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(variantId);
    } else {
      updateQuantity(variantId, newQuantity);
    }
  };

  const handleCheckout = () => {
    onCheckout(items);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('shopping_cart_title')}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('your_cart_is_empty')}</h3>
                <p className="text-gray-500 mb-6">{t('add_products_to_get_started')}</p>
                <Button onClick={onClose} className="px-6">
                  {t('continue_shopping_button')}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.variant.id} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                    {/* Product Image */}
                    <div className="h-16 w-16 flex-shrink-0 rounded-md bg-gray-200 overflow-hidden">
                      {item.product.main_image ? (
                        <img
                          src={item.product.main_image}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
                          <span className="text-white font-bold text-sm">
                            {item.product.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {item.variant.size} • {item.variant.color}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.variant.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.variant.id, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.variant.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.variant.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {/* Clear Cart Button */}
                {items.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearCart}
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    >
                      {t('clear_cart_button')}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4 space-y-4">
              {/* Total */}
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>{t('total_label')}</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold"
              >
                {t('proceed_to_checkout_button')}
              </Button>

              {/* Continue Shopping */}
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full"
              >
                {t('continue_shopping_button')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
