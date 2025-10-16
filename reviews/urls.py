from django.urls import path
from . import views

app_name = 'reviews'

urlpatterns = [
    path('', views.ReviewListView.as_view(), name='review-list'),
    path('featured/', views.FeaturedReviewsView.as_view(), name='featured-reviews'),
    path('product/<int:product_id>/', views.ProductReviewsView.as_view(), name='product-reviews'),
    path('create/', views.create_review, name='create-review'),
]
