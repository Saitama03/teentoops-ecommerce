from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
import os

def product_image_path(instance, filename):
    """Generate file path for product images"""
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('products', filename)

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    base_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    is_active = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    @property
    def main_image(self):
        """Get the first image for this product"""
        image = self.images.first()
        return image.image.url if image else None
    
    @property
    def available_sizes(self):
        """Get all available sizes for this product"""
        return self.variants.values_list('size', flat=True).distinct()
    
    @property
    def available_colors(self):
        """Get all available colors for this product"""
        return self.variants.values_list('color', flat=True).distinct()
    
    @property
    def min_price(self):
        """Get minimum price among all variants"""
        min_variant_price = self.variants.aggregate(models.Min('price_modifier'))['price_modifier__min']
        return self.base_price + (min_variant_price or 0)
    
    @property
    def max_price(self):
        """Get maximum price among all variants"""
        max_variant_price = self.variants.aggregate(models.Max('price_modifier'))['price_modifier__max']
        return self.base_price + (max_variant_price or 0)

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to=product_image_path)
    alt_text = models.CharField(max_length=200, blank=True)
    color = models.CharField(max_length=50, blank=True, help_text="Color variant this image represents")
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order', 'id']
    
    def __str__(self):
        return f"{self.product.name} - Image {self.id}"

class ProductVariant(models.Model):
    SIZE_CHOICES = [
        ('XS', 'Extra Small'),
        ('S', 'Small'),
        ('M', 'Medium'),
        ('L', 'Large'),
        ('XL', 'Extra Large'),
        ('XXL', '2X Large'),
    ]
    
    COLOR_CHOICES = [
        ('black', 'Black'),
        ('white', 'White'),
        ('red', 'Red'),
        ('blue', 'Blue'),
        ('green', 'Green'),
        ('yellow', 'Yellow'),
        ('pink', 'Pink'),
        ('purple', 'Purple'),
        ('orange', 'Orange'),
        ('gray', 'Gray'),
        ('navy', 'Navy'),
        ('brown', 'Brown'),
    ]
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    size = models.CharField(max_length=10, choices=SIZE_CHOICES)
    color = models.CharField(max_length=20, choices=COLOR_CHOICES)
    sku = models.CharField(max_length=100, unique=True)
    price_modifier = models.DecimalField(max_digits=10, decimal_places=2, default=0, 
                                       help_text="Amount to add/subtract from base price")
    stock_quantity = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['product', 'size', 'color']
        ordering = ['size', 'color']
    
    def __str__(self):
        return f"{self.product.name} - {self.size} - {self.color}"
    
    @property
    def price(self):
        """Calculate final price including modifier"""
        return self.product.base_price + self.price_modifier
    
    @property
    def is_in_stock(self):
        """Check if variant is in stock"""
        return self.stock_quantity > 0
