from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductVariant

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'created_at']

class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'image_url', 'alt_text', 'color', 'is_primary', 'order']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class ProductVariantSerializer(serializers.ModelSerializer):
    price = serializers.ReadOnlyField()
    is_in_stock = serializers.ReadOnlyField()
    
    class Meta:
        model = ProductVariant
        fields = [
            'id', 'size', 'color', 'sku', 'price_modifier', 
            'stock_quantity', 'is_active', 'price', 'is_in_stock'
        ]

class ProductListSerializer(serializers.ModelSerializer):
    """Serializer for product list view (minimal data)"""
    main_image_url = serializers.SerializerMethodField()
    min_price = serializers.ReadOnlyField()
    max_price = serializers.ReadOnlyField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'base_price', 'min_price', 'max_price',
            'main_image', 'main_image_url', 'category_name', 'featured', 'is_active'
        ]
    
    def get_main_image_url(self, obj):
        if obj.main_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.main_image)
            return obj.main_image
        return None

class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer for product detail view (full data)"""
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    available_sizes = serializers.ReadOnlyField()
    available_colors = serializers.ReadOnlyField()
    min_price = serializers.ReadOnlyField()
    max_price = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'category', 'base_price',
            'min_price', 'max_price', 'is_active', 'featured', 'created_at',
            'updated_at', 'images', 'variants', 'available_sizes', 'available_colors'
        ]
