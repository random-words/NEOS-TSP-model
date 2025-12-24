from django.contrib import admin
from .models import Location


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('location_id',
                    'name',
                    'type',
                    'latitude',
                    'longitude',
                    'address',
                    'openingHours',
                    'avgStayMinutes',
                    'priceLevel',
                    'rating',
                    'wineTags',
                    'experienceTags',
                    'avgTastingPricePerPerson',
                    'avgMealPricePerPerson',
                    'avgBottlePrice',
                    'site',
                    'contacts', 'is_deleted')
    list_filter = ('type', 'is_deleted')
    search_fields = ('location_id', 'name',)



