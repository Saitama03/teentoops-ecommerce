from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from products.models import Product

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    customer_name = models.CharField(max_length=200)
    customer_email = models.EmailField(blank=True)
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating from 1 to 5 stars"
    )
    title = models.CharField(max_length=200)
    review_text = models.TextField()
    is_approved = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['product', 'customer_email']  # One review per customer per product
    
    def __str__(self):
        return f"{self.customer_name} - {self.product.name} ({self.rating}/5)"
    
    @property
    def star_display(self):
        """Return stars as string for display"""
        return '★' * self.rating + '☆' * (5 - self.rating)
