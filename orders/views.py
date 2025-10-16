from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Order, Contact
from .serializers import OrderSerializer, ContactSerializer

@method_decorator(csrf_exempt, name='dispatch')
class OrderCreateView(generics.CreateAPIView):
    """Create a new order (Cash on Delivery)"""
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class OrderDetailView(generics.RetrieveAPIView):
    """Get order details by order_id"""
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    lookup_field = 'order_id'

class ContactCreateView(generics.CreateAPIView):
    """Submit contact form"""
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

@api_view(['POST'])
def submit_contact(request):
    """Submit contact form"""
    serializer = ContactSerializer(data=request.data)
    if serializer.is_valid():
        contact = serializer.save()
        return Response(
            {'message': 'Thank you for your message. We will get back to you soon!'},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def contact_info(request):
    """Public contact information for frontend display"""
    data = {
        'address': 'Médenine centre, Tunisie',
        'email': 'teentopss02@gmail.com',
        'phone': '58055337',
        'hours': 'Lun - Ven : 9h - 18h',
        'country_code': '+216',
    }
    return Response(data, status=status.HTTP_200_OK)
