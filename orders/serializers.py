from rest_framework import serializers
from .models import Order, OrderItem, Contact
from products.models import ProductVariant
from products.serializers import ProductVariantSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product_variant = ProductVariantSerializer(read_only=True)
    product_variant_id = serializers.IntegerField(write_only=True)
    total_price = serializers.ReadOnlyField()
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product_variant', 'product_variant_id', 
            'quantity', 'price', 'total_price'
        ]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    order_items = serializers.ListField(write_only=True, required=False)
    full_address = serializers.ReadOnlyField()
    total_items = serializers.ReadOnlyField()
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_id', 'customer_name', 'customer_email', 'customer_phone',
            'address_line_1', 'address_line_2', 'city', 'state', 'postal_code', 'country',
            'status', 'total_amount', 'notes', 'created_at', 'updated_at',
            'items', 'order_items', 'full_address', 'total_items'
        ]
        read_only_fields = ['order_id', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        order_items_data = validated_data.pop('order_items', [])
        
        # Set total_amount to 0 initially to satisfy NOT NULL constraint
        validated_data['total_amount'] = 0
        order = Order.objects.create(**validated_data)
        
        total_amount = 0
        for item_data in order_items_data:
            try:
                variant = ProductVariant.objects.get(id=item_data['product_variant_id'])
                if variant.stock_quantity >= item_data['quantity']:
                    order_item = OrderItem.objects.create(
                        order=order,
                        product_variant=variant,
                        quantity=item_data['quantity'],
                        price=variant.price
                    )
                    total_amount += order_item.total_price
                    
                    # Update stock
                    variant.stock_quantity -= item_data['quantity']
                    variant.save()
                else:
                    raise serializers.ValidationError(
                        f"Insufficient stock for {variant.product.name} ({variant.size}, {variant.color})"
                    )
            except ProductVariant.DoesNotExist:
                raise serializers.ValidationError(f"Product variant {item_data['product_variant_id']} not found")
        
        order.total_amount = total_amount
        order.save()
        return order

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = [
            'id', 'name', 'email', 'phone', 'subject', 
            'message', 'is_read', 'created_at'
        ]
        read_only_fields = ['created_at', 'is_read']
