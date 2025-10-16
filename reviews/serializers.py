from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    star_display = serializers.ReadOnlyField()
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 'product', 'product_name', 'customer_name', 'customer_email',
            'rating', 'title', 'review_text', 'star_display', 'is_approved',
            'is_featured', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'is_approved']

class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            'product', 'customer_name', 'customer_email',
            'rating', 'title', 'review_text'
        ]
