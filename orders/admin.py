from django.contrib import admin
from .models import Order, OrderItem, Contact

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product_variant', 'quantity', 'price', 'total_price']
    
    def has_add_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_id', 'customer_name', 'customer_phone', 'status', 'total_amount', 'created_at']
    list_filter = ['status', 'created_at', 'country']
    search_fields = ['order_id', 'customer_name', 'customer_phone', 'customer_email']
    readonly_fields = ['order_id', 'created_at', 'updated_at', 'total_amount', 'full_address', 'total_items']
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_id', 'status', 'total_amount', 'total_items', 'notes')
        }),
        ('Customer Information', {
            'fields': ('customer_name', 'customer_email', 'customer_phone')
        }),
        ('Delivery Address', {
            'fields': ('address_line_1', 'address_line_2', 'city', 'state', 'postal_code', 'country', 'full_address')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing existing order
            return self.readonly_fields + ['customer_name', 'customer_email', 'customer_phone',
                                         'address_line_1', 'address_line_2', 'city', 'state', 'postal_code', 'country']
        return self.readonly_fields

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject']
    readonly_fields = ['created_at']
    list_editable = ['is_read']
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'phone', 'subject')
        }),
        ('Message', {
            'fields': ('message',)
        }),
        ('Status', {
            'fields': ('is_read', 'created_at')
        }),
    )
