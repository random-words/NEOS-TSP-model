from rest_framework import serializers


class NodeSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    lat = serializers.FloatField()
    lon = serializers.FloatField()
    openingHours = serializers.CharField(required=False, allow_blank=True, default="")
    avgStayMinutes = serializers.FloatField(required=False, default=0.0)
    priceLevel = serializers.FloatField(required=False, allow_null=True, default=None)
    avgTastingPricePerPerson = serializers.FloatField(required=False, allow_null=True, default=None)
    avgMealPricePerPerson = serializers.FloatField(required=False, allow_null=True, default=None)
    avgBottlePrice = serializers.FloatField(required=False, allow_null=True, default=None)


class StartNodeSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    lat = serializers.FloatField()
    lon = serializers.FloatField()


class OptimizerRequestSerializer(serializers.Serializer):
    numberOfNodes = serializers.IntegerField(min_value=1)
    allNodes = NodeSerializer(many=True, default=list)
    startNode = StartNodeSerializer(default=dict)

    groupSize = serializers.IntegerField(min_value=1)
    budgetMax = serializers.IntegerField(min_value=0)
    timeMax = serializers.IntegerField(min_value=0)
    distanceMax = serializers.IntegerField(required=False, allow_null=True)

    routePace = serializers.FloatField()
    objectiveFunction = serializers.ChoiceField(
        choices=["min_distance", "min_budget", "min_time"]
    )

    def validate(self, attrs):
        all_nodes = attrs.get("allNodes") or []
        start_node = attrs.get("startNode") or {}

        if not all_nodes:
            raise serializers.ValidationError({"allNodes": "allNodes must not be empty"})

        if not start_node:
            raise serializers.ValidationError({"startNode": "startNode is required"})

        # ensure start node exists in allNodes by id
        start_id = str(start_node.get("id"))
        ids = {str(n["id"]) for n in all_nodes}
        if start_id not in ids:
            raise serializers.ValidationError({"startNode": "startNode.id must exist in allNodes"})

        n = attrs["numberOfNodes"]
        if n > len(all_nodes):
            raise serializers.ValidationError({"numberOfNodes": "numberOfNodes cannot exceed len(allNodes)"})

        return attrs


class TourItemSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    lat = serializers.FloatField()
    lon = serializers.FloatField()


class OptimizerResponseSerializer(serializers.Serializer):
    objective = serializers.FloatField()
    totalDistance = serializers.FloatField()
    totalBudget = serializers.FloatField()
    locationsCost = serializers.FloatField()
    fuelCost = serializers.FloatField()
    totalTime = serializers.FloatField()
    tour = TourItemSerializer(many=True)

    resCode = serializers.IntegerField()
    resMessage = serializers.CharField()
