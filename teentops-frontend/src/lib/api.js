const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('Making request to:', url);
      console.log('Request config:', config);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Products API
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/products/?${queryString}` : '/products/';
    return this.request(endpoint);
  }

  async getProduct(slug) {
    return this.request(`/products/${slug}/`);
  }

  async getFeaturedProducts() {
    return this.request('/products/featured/');
  }

  async searchProducts(query, filters = {}) {
    const params = { q: query, ...filters };
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products/search/?${queryString}`);
  }

  async getCategories() {
    const response = await this.request('/products/categories/');
    return response.results || response;
  }

  async getProductVariants(productId) {
    return this.request(`/products/${productId}/variants/`);
  }

  // Orders API
  async createOrder(orderData) {
    return this.request('/orders/create/', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(orderId) {
    return this.request(`/orders/${orderId}/`);
  }

  // Reviews API
  async getReviews() {
    return this.request('/reviews/');
  }

  async getProductReviews(productId) {
    return this.request(`/reviews/product/${productId}/`);
  }

  async getFeaturedReviews() {
    return this.request('/reviews/featured/');
  }

  async createReview(reviewData) {
    return this.request('/reviews/create/', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // Contact API
  async submitContact(contactData) {
    return this.request('/orders/contact/', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  // Contact info
  async getContactInfo() {
    return this.request('/orders/contact-info/');
  }
}

export const apiService = new ApiService();
export default apiService;
