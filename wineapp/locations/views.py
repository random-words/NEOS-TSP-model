from django.shortcuts import render, get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.viewsets import ModelViewSet
from .serializers import LocationSerializer
from .models import Location
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes


class LocationViewSet(ModelViewSet):
    queryset = Location.objects.filter(is_deleted=False)
    serializer_class = LocationSerializer
    permission_classes = [AllowAny]

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["post"])
    def restore(self, request, pk=None):
        obj = Location.objects.get(pk=pk)
        obj.is_deleted = False
        obj.save(update_fields=["is_deleted"])
        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="location_id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                required=True,
                description="ID локации (поле location_id)",
            )
        ],
        responses=LocationSerializer,
    )
    @action(detail=False, methods=["get"], url_path="by-location-id")
    def by_location_id(self, request):
        location_id = request.query_params.get("location_id")
        if not location_id:
            return Response(
                {"detail": "location_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        obj = get_object_or_404(Location, location_id=location_id, is_deleted=False)
        serializer = self.get_serializer(obj)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="name",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                required=True,
                description="Имя локации (поиск по name, icontains)",
            )
        ],
        responses=LocationSerializer(many=True),
    )
    @action(detail=False, methods=["get"], url_path="by-name")
    def by_name(self, request):
        name = request.query_params.get("name")
        if not name:
            return Response(
                {"detail": "name is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        qs = Location.objects.filter(is_deleted=False, name__icontains=name)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
