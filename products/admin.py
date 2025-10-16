from django.contrib import admin
from .models import Category, Product, ProductImage, ProductVariant

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'alt_text', 'color', 'is_primary', 'order']

class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1
    fields = ['size', 'color', 'sku', 'price_modifier', 'stock_quantity', 'is_active']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'base_price', 'is_active', 'featured', 'created_at']
    list_filter = ['category', 'is_active', 'featured', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline, ProductVariantInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'description', 'category')
        }),
        ('Pricing & Status', {
            'fields': ('base_price', 'is_active', 'featured')
        }),
    )

@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ['product', 'size', 'color', 'price', 'stock_quantity', 'is_active']
    list_filter = ['size', 'color', 'is_active', 'product__category']
    search_fields = ['product__name', 'sku']
    list_editable = ['stock_quantity', 'is_active']
