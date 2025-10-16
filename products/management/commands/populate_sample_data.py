from django.core.management.base import BaseCommand
from django.utils.text import slugify
from products.models import Category, Product, ProductVariant
from reviews.models import Review
import random

class Command(BaseCommand):
    help = 'Populate the database with sample data for TeenTops e-commerce'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting to populate sample data...'))
        
        # Create Categories
        categories_data = [
            {'name': 'T-Shirts', 'description': 'Comfortable and stylish t-shirts for everyday wear'},
            {'name': 'Hoodies', 'description': 'Cozy hoodies perfect for casual outings'},
            {'name': 'Jeans', 'description': 'Trendy jeans in various fits and styles'},
            {'name': 'Dresses', 'description': 'Beautiful dresses for special occasions'},
            {'name': 'Jackets', 'description': 'Stylish jackets for all seasons'},
            {'name': 'Accessories', 'description': 'Complete your look with our accessories'},
        ]
        
        categories = []
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'slug': slugify(cat_data['name']),
                    'description': cat_data['description']
                }
            )
            categories.append(category)
            if created:
                self.stdout.write(f'Created category: {category.name}')

        # Create Products
        products_data = [
            # T-Shirts
            {
                'name': 'Classic Cotton T-Shirt',
                'description': 'A comfortable and versatile cotton t-shirt perfect for everyday wear. Made from 100% premium cotton with a relaxed fit.',
                'category': 'T-Shirts',
                'base_price': 19.99,
                'featured': True
            },
            {
                'name': 'Graphic Print Tee',
                'description': 'Express your style with this trendy graphic print t-shirt. Features unique artwork and comfortable fit.',
                'category': 'T-Shirts',
                'base_price': 24.99,
                'featured': False
            },
            {
                'name': 'Vintage Band T-Shirt',
                'description': 'Rock your favorite bands with this vintage-inspired t-shirt. Soft fabric with distressed print.',
                'category': 'T-Shirts',
                'base_price': 29.99,
                'featured': True
            },
            
            # Hoodies
            {
                'name': 'Cozy Pullover Hoodie',
                'description': 'Stay warm and comfortable in this soft pullover hoodie. Perfect for chilly days and casual outings.',
                'category': 'Hoodies',
                'base_price': 49.99,
                'featured': True
            },
            {
                'name': 'Zip-Up Hoodie',
                'description': 'Versatile zip-up hoodie with adjustable hood and front pockets. Great for layering.',
                'category': 'Hoodies',
                'base_price': 54.99,
                'featured': False
            },
            {
                'name': 'Oversized Hoodie',
                'description': 'Trendy oversized hoodie for a relaxed, comfortable fit. Perfect for lounging or street style.',
                'category': 'Hoodies',
                'base_price': 59.99,
                'featured': True
            },
            
            # Jeans
            {
                'name': 'Skinny Fit Jeans',
                'description': 'Modern skinny fit jeans that hug your curves perfectly. Made from stretch denim for comfort.',
                'category': 'Jeans',
                'base_price': 69.99,
                'featured': False
            },
            {
                'name': 'High-Waisted Mom Jeans',
                'description': 'Vintage-inspired high-waisted jeans with a relaxed fit. Perfect for creating retro looks.',
                'category': 'Jeans',
                'base_price': 74.99,
                'featured': True
            },
            {
                'name': 'Distressed Boyfriend Jeans',
                'description': 'Casual boyfriend jeans with trendy distressed details. Comfortable loose fit.',
                'category': 'Jeans',
                'base_price': 79.99,
                'featured': False
            },
            
            # Dresses
            {
                'name': 'Summer Floral Dress',
                'description': 'Light and airy floral dress perfect for summer days. Features a flattering A-line silhouette.',
                'category': 'Dresses',
                'base_price': 89.99,
                'featured': True
            },
            {
                'name': 'Little Black Dress',
                'description': 'Classic little black dress that works for any occasion. Timeless design with modern touches.',
                'category': 'Dresses',
                'base_price': 94.99,
                'featured': False
            },
            {
                'name': 'Casual Midi Dress',
                'description': 'Comfortable midi dress perfect for everyday wear. Versatile style that can be dressed up or down.',
                'category': 'Dresses',
                'base_price': 84.99,
                'featured': True
            },
            
            # Jackets
            {
                'name': 'Denim Jacket',
                'description': 'Classic denim jacket that never goes out of style. Perfect for layering over any outfit.',
                'category': 'Jackets',
                'base_price': 89.99,
                'featured': False
            },
            {
                'name': 'Leather Biker Jacket',
                'description': 'Edgy leather biker jacket for a bold look. High-quality faux leather with metal details.',
                'category': 'Jackets',
                'base_price': 129.99,
                'featured': True
            },
            {
                'name': 'Bomber Jacket',
                'description': 'Trendy bomber jacket with ribbed cuffs and hem. Lightweight and perfect for transitional weather.',
                'category': 'Jackets',
                'base_price': 99.99,
                'featured': False
            },
        ]
        
        products = []
        for prod_data in products_data:
            category = Category.objects.get(name=prod_data['category'])
            product, created = Product.objects.get_or_create(
                name=prod_data['name'],
                defaults={
                    'slug': slugify(prod_data['name']),
                    'description': prod_data['description'],
                    'category': category,
                    'base_price': prod_data['base_price'],
                    'featured': prod_data['featured'],
                    'is_active': True
                }
            )
            products.append(product)
            if created:
                self.stdout.write(f'Created product: {product.name}')

        # Create Product Variants
        sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
        colors = ['black', 'white', 'red', 'blue', 'green', 'gray', 'navy', 'pink']
        
        for product in products:
            # Create 3-5 variants per product
            num_variants = random.randint(3, 5)
            used_combinations = set()
            
            for _ in range(num_variants):
                size = random.choice(sizes)
                color = random.choice(colors)
                combination = (size, color)
                
                # Avoid duplicate combinations
                if combination in used_combinations:
                    continue
                used_combinations.add(combination)
                
                # Generate SKU
                sku = f"{product.slug[:3].upper()}-{size}-{color[:3].upper()}-{random.randint(100, 999)}"
                
                # Random price modifier (-5 to +10)
                price_modifier = random.uniform(-5, 10)
                
                # Random stock quantity (5-50)
                stock_quantity = random.randint(5, 50)
                
                variant, created = ProductVariant.objects.get_or_create(
                    product=product,
                    size=size,
                    color=color,
                    defaults={
                        'sku': sku,
                        'price_modifier': round(price_modifier, 2),
                        'stock_quantity': stock_quantity,
                        'is_active': True
                    }
                )
                
                if created:
                    self.stdout.write(f'Created variant: {variant}')

        # Create Sample Reviews
        review_data = [
            {
                'customer_name': 'Sarah Johnson',
                'customer_email': 'sarah@example.com',
                'rating': 5,
                'title': 'Love this t-shirt!',
                'review_text': 'Super comfortable and the quality is amazing. Fits perfectly and the color is exactly as shown.',
                'is_featured': True
            },
            {
                'customer_name': 'Emma Wilson',
                'customer_email': 'emma@example.com',
                'rating': 4,
                'title': 'Great hoodie',
                'review_text': 'Really cozy and warm. Perfect for cold days. The material is soft and doesn\'t shrink after washing.',
                'is_featured': False
            },
            {
                'customer_name': 'Mia Davis',
                'customer_email': 'mia@example.com',
                'rating': 5,
                'title': 'Perfect fit!',
                'review_text': 'These jeans fit like a glove! The high-waisted style is so flattering and comfortable to wear all day.',
                'is_featured': True
            },
            {
                'customer_name': 'Olivia Brown',
                'customer_email': 'olivia@example.com',
                'rating': 5,
                'title': 'Beautiful dress',
                'review_text': 'This dress is gorgeous! The floral pattern is so pretty and the fabric is high quality. Got so many compliments!',
                'is_featured': True
            },
            {
                'customer_name': 'Ava Miller',
                'customer_email': 'ava@example.com',
                'rating': 4,
                'title': 'Stylish jacket',
                'review_text': 'Love the style of this jacket. It goes with everything and the quality is good for the price.',
                'is_featured': False
            },
            {
                'customer_name': 'Isabella Garcia',
                'customer_email': 'isabella@example.com',
                'rating': 5,
                'title': 'Excellent quality',
                'review_text': 'The material is so soft and comfortable. Washed it several times and it still looks brand new!',
                'is_featured': False
            },
        ]
        
        for i, review_info in enumerate(review_data):
            if i < len(products):
                product = products[i]
                review, created = Review.objects.get_or_create(
                    product=product,
                    customer_email=review_info['customer_email'],
                    defaults={
                        'customer_name': review_info['customer_name'],
                        'rating': review_info['rating'],
                        'title': review_info['title'],
                        'review_text': review_info['review_text'],
                        'is_approved': True,
                        'is_featured': review_info['is_featured']
                    }
                )
                
                if created:
                    self.stdout.write(f'Created review: {review}')

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully populated sample data!\n'
                f'Created {Category.objects.count()} categories\n'
                f'Created {Product.objects.count()} products\n'
                f'Created {ProductVariant.objects.count()} product variants\n'
                f'Created {Review.objects.count()} reviews'
            )
        )
