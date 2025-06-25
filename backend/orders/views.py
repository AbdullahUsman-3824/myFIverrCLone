from rest_framework import viewsets, permissions
from .models import Order
from .serializers import OrderSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Limit orders based on user's role (buyer or seller)
        user = self.request.user
        return Order.objects.filter(buyer=user) | Order.objects.filter(seller=user)

    def perform_create(self, serializer):
        gig = serializer.validated_data.get('gig')
        serializer.save(
            buyer=self.request.user,
            seller=gig.seller.user
        )
