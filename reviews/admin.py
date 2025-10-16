from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['customer_name', 'product', 'rating', 'star_display', 'is_approved', 'is_featured', 'created_at']
    list_filter = ['rating', 'is_approved', 'is_featured', 'created_at', 'product__category']
    search_fields = ['customer_name', 'customer_email', 'product__name', 'title', 'review_text']
    readonly_fields = ['created_at', 'updated_at', 'star_display']
    list_editable = ['is_approved', 'is_featured']
    
    fieldsets = (
        ('Review Information', {
            'fields': ('product', 'customer_name', 'customer_email', 'rating', 'star_display')
        }),
        ('Review Content', {
            'fields': ('title', 'review_text')
        }),
        ('Status', {
            'fields': ('is_approved', 'is_featured')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('product')
