from rest_framework import generics, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Category, Product, ProductVariant
from .serializers import (
    CategorySerializer, ProductListSerializer, 
    ProductDetailSerializer, ProductVariantSerializer
)

class CategoryListView(generics.ListAPIView):
    """List all categories"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductListView(generics.ListAPIView):
    """List all products with filtering and search"""
    queryset = Product.objects.filter(is_active=True).select_related('category').prefetch_related('images')
    serializer_class = ProductListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'featured']
    search_fields = ['name', 'description', 'category__name']
    ordering_fields = ['created_at', 'base_price', 'name']
    ordering = ['-created_at']
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class ProductDetailView(generics.RetrieveAPIView):
    """Get product details by slug or ID"""
    queryset = Product.objects.filter(is_active=True).prefetch_related(
        'images', 'variants', 'reviews'
    ).select_related('category')
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class FeaturedProductsView(generics.ListAPIView):
    """List featured products"""
    queryset = Product.objects.filter(is_active=True, featured=True).select_related('category').prefetch_related('images')
    serializer_class = ProductListSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

@api_view(['GET'])
def product_variants(request, product_id):
    """Get variants for a specific product"""
    try:
        product = Product.objects.get(id=product_id, is_active=True)
        variants = ProductVariant.objects.filter(product=product, is_active=True)
        serializer = ProductVariantSerializer(variants, many=True)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

@api_view(['GET'])
def search_products(request):
    """Advanced product search"""
    query = request.GET.get('q', '')
    category = request.GET.get('category', '')
    min_price = request.GET.get('min_price', '')
    max_price = request.GET.get('max_price', '')
    
    products = Product.objects.filter(is_active=True)
    
    if query:
        products = products.filter(
            Q(name__icontains=query) | 
            Q(description__icontains=query) |
            Q(category__name__icontains=query)
        )
    
    if category:
        products = products.filter(category__slug=category)
    
    if min_price:
        try:
            products = products.filter(base_price__gte=float(min_price))
        except ValueError:
            pass
    
    if max_price:
        try:
            products = products.filter(base_price__lte=float(max_price))
        except ValueError:
            pass
    
    products = products.select_related('category').prefetch_related('images')
    serializer = ProductListSerializer(products, many=True, context={'request': request})
    return Response(serializer.data)
