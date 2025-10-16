import React, { useState } from 'react';
import { X, CreditCard, Truck, MapPin, Phone, Mail, User, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import apiService from '@/lib/api';
import { useLanguage } from '@/App';

const CheckoutModal = ({ isOpen, onClose, cartItems, onOrderComplete }) => {
  const { clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: Details, 2: Review, 3: Success
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Tunisia',
    notes: ''
  });
  const [createdOrder, setCreatedOrder] = useState(null);
  const [errors, setErrors] = useState({});
  const { t, lang } = useLanguage();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.variant.price * item.quantity);
    }, 0);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!orderData.customer_name.trim()) {
      newErrors.customer_name = t('name_required_error');
    }
    
    if (!orderData.customer_phone.trim()) {
      newErrors.customer_phone = t('phone_required_error');
    }
    
    if (!orderData.address_line_1.trim()) {
      newErrors.address_line_1 = t('address_required_error');
    }
    
    if (!orderData.city.trim()) {
      newErrors.city = t('city_required_error');
    }
    
    if (!orderData.state.trim()) {
      newErrors.state = t('state_required_error');
    }
    
    if (!orderData.postal_code.trim()) {
      newErrors.postal_code = t('postal_code_required_error');
    }

    if (!orderData.country.trim()) {
      newErrors.country = t('country_required_error');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setOrderData(prev => ({
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

  const handleNext = () => {
    if (step === 1) {
      if (validateForm()) {
        setStep(2);
      }
    }
  };

  const normalizePhone = (input) => {
    const trimmed = (input || '').trim();
    // keep leading +, strip other non-digits
    let normalized = trimmed.replace(/(?!^)[^0-9]/g, '');
    if (trimmed.startsWith('+')) {
      normalized = '+' + normalized;
    }
    // If no country code and local TN 8-digit, prefix +216
    const digitsOnly = normalized.replace(/\D/g, '');
    if (!normalized.startsWith('+') && digitsOnly.length === 8) {
      normalized = '+216' + digitsOnly;
    }
    return normalized;
  };

  const handleSubmitOrder = async () => {
    try {
      setLoading(true);
      
      const orderPayload = {
        ...orderData,
        customer_phone: normalizePhone(orderData.customer_phone),
        order_items: cartItems.map(item => ({
          product_variant_id: item.variant.id,
          quantity: item.quantity
        }))
      };

      console.log('Order payload:', orderPayload);
      console.log('Cart items:', cartItems);

      const response = await apiService.createOrder(orderPayload);
      setCreatedOrder(response);
      setStep(3);
      // Clear the cart on success
      try { clearCart(); } catch (_) {}
    } catch (error) {
      console.error('Error creating order:', error);
      const message = error?.message || t('failed_to_create_order');
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setOrderData({
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'Tunisia',
      notes: ''
    });
    setErrors({});
    setCreatedOrder(null);
    try { onOrderComplete && onOrderComplete(); } catch (_) {}
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={step !== 3 ? handleClose : undefined}
      />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-3 sm:p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {step === 1 && t('checkout_details_title')}
              {step === 2 && t('review_order_title')}
              {step === 3 && t('order_confirmed_title')}
            </h2>
            {step !== 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="p-2"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-4 sm:p-6">
            {/* Step 1: Customer Details */}
            {step === 1 && (
              <div className="p-6 space-y-6">
                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    {t('customer_info_heading')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('full_name_label')}
                      </label>
                      <input
                        type="text"
                        value={orderData.customer_name}
                        onChange={(e) => handleInputChange('customer_name', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.customer_name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={t('full_name_placeholder')}
                      />
                      {errors.customer_name && (
                        <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('phone_number_label')}
                      </label>
                      <input
                        type="tel"
                        value={orderData.customer_phone}
                        onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.customer_phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={t('phone_number_placeholder')}
                      />
                      {errors.customer_phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.customer_phone}</p>
                      )}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('email_label')}
                      </label>
                      <input
                        type="email"
                        value={orderData.customer_email}
                        onChange={(e) => handleInputChange('customer_email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t('email_placeholder')}
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    {t('delivery_address_heading')}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('address_line1_label')}
                      </label>
                      <input
                        type="text"
                        value={orderData.address_line_1}
                        onChange={(e) => handleInputChange('address_line_1', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.address_line_1 ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={t('address_line1_placeholder')}
                      />
                      {errors.address_line_1 && (
                        <p className="text-red-500 text-xs mt-1">{errors.address_line_1}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('address_line2_label')}
                      </label>
                      <input
                        type="text"
                        value={orderData.address_line_2}
                        onChange={(e) => handleInputChange('address_line_2', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t('address_line2_placeholder')}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('city_label')}
                        </label>
                        <input
                          type="text"
                          value={orderData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder={t('city_placeholder')}
                        />
                        {errors.city && (
                          <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('state_label')}
                        </label>
                        <input
                          type="text"
                          value={orderData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.state ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder={t('state_placeholder')}
                        />
                        {errors.state && (
                          <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('postal_code_label')}
                        </label>
                        <input
                          type="text"
                          value={orderData.postal_code}
                          onChange={(e) => handleInputChange('postal_code', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.postal_code ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder={t('postal_code_placeholder')}
                        />
                        {errors.postal_code && (
                          <p className="text-red-500 text-xs mt-1">{errors.postal_code}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('country_label')}
                      </label>
                      <input
                        type="text"
                        value={orderData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.country ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Tunisia"
                      />
                      {errors.country && (
                        <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('special_instructions_label')}
                  </label>
                  <textarea
                    value={orderData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('special_instructions_placeholder')}
                  />
                </div>

                {/* Payment Method */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    {t('payment_method_heading')}
                  </h3>
                  <div className="flex items-center space-x-3">
                    <Truck className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{t('cod_title')}</p>
                      <p className="text-sm text-gray-600">{t('cod_description')}</p>
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <Button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold"
                >
                  {t('continue_to_review')}
                </Button>
              </div>
            )}

            {/* Step 2: Review Order */}
            {step === 2 && (
              <div className="p-6 space-y-6">
                {/* Order Summary */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{t('order_summary_heading')}</h3>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.variant.id} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
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
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                          <p className="text-sm text-gray-500">
                            {item.variant.size} • {item.variant.color} • {t('qty_label')}: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {formatPrice(item.variant.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Details */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{t('delivery_details_heading')}</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-900">{orderData.customer_name}</p>
                    <p className="text-gray-600">{orderData.customer_phone}</p>
                    {orderData.customer_email && (
                      <p className="text-gray-600">{orderData.customer_email}</p>
                    )}
                    <div className="mt-2 text-gray-600">
                      <p>{orderData.address_line_1}</p>
                      {orderData.address_line_2 && <p>{orderData.address_line_2}</p>}
                      <p>{orderData.city}, {orderData.state} {orderData.postal_code}</p>
                      <p>{orderData.country}</p>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between text-xl font-bold">
                    <span>{t('total_amount_label')}</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{t('payment_cod_info')}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    {t('back_to_details')}
                  </Button>
                  <Button
                    onClick={handleSubmitOrder}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    {loading ? t('placing_order_button') : t('place_order_button')}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <div className="p-6 text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('order_success_title')}</h3>
                  <p className="text-gray-600">
                    {t('order_success_message')}
                  </p>
                </div>

                {createdOrder && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">{t('order_id_label')}</p>
                    <p className="font-mono text-lg font-medium text-gray-900">
                      {createdOrder.order_id}
                    </p>
                  </div>
                )}

                <div className="space-y-2 text-sm text-gray-600">
                  <p>{t('confirmation_call_info')}</p>
                  <p>{t('delivery_time_info')}</p>
                  <p>{t('payment_method_info')}</p>
                </div>

                <Button
                  onClick={handleClose}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  {t('continue_shopping')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
