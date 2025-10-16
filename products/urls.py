from django.urls import path
from . import views

app_name = 'products'

urlpatterns = [
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('', views.ProductListView.as_view(), name='product-list'),
    path('featured/', views.FeaturedProductsView.as_view(), name='featured-products'),
    path('search/', views.search_products, name='search-products'),
    path('<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('<int:product_id>/variants/', views.product_variants, name='product-variants'),
]
