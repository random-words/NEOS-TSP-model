from django.db import models
from django.db.models import Q


class Location(models.Model):
    location_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=200)
    latitude = models.FloatField()
    longitude = models.FloatField()
    address = models.CharField(max_length=200)
    openingHours = models.CharField(max_length=200)
    avgStayMinutes = models.IntegerField()
    priceLevel = models.IntegerField()
    rating = models.FloatField()
    wineTags = models.CharField(max_length=200)
    experienceTags = models.CharField(max_length=200)
    avgTastingPricePerPerson = models.IntegerField()
    avgMealPricePerPerson = models.IntegerField()
    avgBottlePrice = models.IntegerField()
    site = models.CharField(max_length=200)
    contacts = models.CharField(max_length=200)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["location_id"],
                condition=Q(is_deleted=False),
                name="uniq_location_id_not_deleted",
            )
        ]

    def delete(self, using=None, keep_parents=False):
        self.is_deleted = True
        self.save(update_fields=["is_deleted"])

    def __str__(self):
        return self.name

