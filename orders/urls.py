from django.urls import path
from . import views

app_name = 'orders'

urlpatterns = [
    path('create/', views.OrderCreateView.as_view(), name='create-order'),
    path('<uuid:order_id>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('contact/', views.submit_contact, name='submit-contact'),
    path('contact-info/', views.contact_info, name='contact-info'),
]
