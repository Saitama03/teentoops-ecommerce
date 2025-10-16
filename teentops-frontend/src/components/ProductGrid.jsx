import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/App';
import { Filter, Grid, List, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from './ProductCard';
import apiService from '@/lib/api';

const ProductGrid = ({ onProductClick }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [viewMode, setViewMode] = useState('grid');
  const { t, lang } = useLanguage();

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [selectedCategory, sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {
        ordering: sortBy === 'price_asc' ? 'base_price' : sortBy === 'price_desc' ? '-base_price' : '-created_at',
      };
      
      if (selectedCategory) {
        params.category = selectedCategory;
      }

      const data = await apiService.getProducts(params);
      setProducts(data.results || data);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await apiService.getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadProducts();
      return;
    }

    try {
      setLoading(true);
      const data = await apiService.searchProducts(searchQuery, {
        category: selectedCategory,
      });
      setProducts(data);
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) {
    return (
      <section id="products" className="bg-gray-50 scroll-mt-24 pt-6 sm:pt-12 pb-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('our_products_title')}</h2>
            <p className="text-lg text-gray-600">{t('our_products_subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="bg-gray-50 scroll-mt-24 pt-6 sm:pt-12 pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('our_products_title')}</h2>
          <p className="text-lg text-gray-600">{t('our_products_subtitle')}</p>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 sm:mb-8 space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <Button onClick={handleSearch} className="w-full sm:w-auto px-6">
              {t('search_button')}
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{t('all_categories')}</option>
                {Array.isArray(categories) && categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {/* Prefer localized label if backend provides i18n fields */}
                    {category[`name_${lang}`] || category.name}
                  </option>
                ))}
              </select>

              {/* Sort Filter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="created_at">{t('newest_first')}</option>
                <option value="price_asc">{t('price_low_high')}</option>
                <option value="price_desc">{t('price_high_low')}</option>
                <option value="name">{t('name_az')}</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className={`grid gap-4 sm:gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 lg:grid-cols-2'
          }`}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={onProductClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('no_products_found')}</h3>
            <p className="text-gray-600">{t('try_adjusting_filters')}</p>
          </div>
        )}

        {/* Load More Button (if needed) */}
        {products.length > 0 && products.length % 12 === 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              {t('load_more')}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
