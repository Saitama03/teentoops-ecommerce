from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer

class ReviewListView(generics.ListAPIView):
    """List all approved reviews"""
    queryset = Review.objects.filter(is_approved=True)
    serializer_class = ReviewSerializer

class ProductReviewsView(generics.ListAPIView):
    """List reviews for a specific product"""
    serializer_class = ReviewSerializer
    
    def get_queryset(self):
        product_id = self.kwargs['product_id']
        return Review.objects.filter(product_id=product_id, is_approved=True)

class FeaturedReviewsView(generics.ListAPIView):
    """List featured reviews"""
    queryset = Review.objects.filter(is_approved=True, is_featured=True)
    serializer_class = ReviewSerializer

@api_view(['POST'])
def create_review(request):
    """Create a new review"""
    serializer = ReviewCreateSerializer(data=request.data)
    if serializer.is_valid():
        review = serializer.save()
        return Response(
            ReviewSerializer(review).data,
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
