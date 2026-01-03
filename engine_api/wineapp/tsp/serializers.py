from rest_framework import serializers

class SolveSerializer(serializers.Serializer):
    data_source = serializers.ChoiceField(choices=["excel", "tsplib"], default="excel")

    s_value = serializers.IntegerField(required=False)
    k_value = serializers.IntegerField(min_value=1)

    group_size = serializers.IntegerField(min_value=1, default=1)
    speed_kmph = serializers.FloatField(min_value=1.0, default=50.0)

    budget_max = serializers.FloatField(min_value=0.0)
    time_max = serializers.FloatField(min_value=0.0)

    cost_scenario = serializers.ChoiceField(choices=["min", "avg", "max"], default="max")
    connectivity = serializers.ChoiceField(choices=["flow", "mtz", "hybrid"], default="hybrid")

    mode = serializers.ChoiceField(choices=["min_distance", "min_budget", "min_time"], default="min_distance")
    dist_max = serializers.FloatField(required=False)

    solver = serializers.CharField(default="cplex")
    neos_email = serializers.EmailField(required=False)

    excel_path = serializers.CharField(required=False)
    tsplib_path = serializers.CharField(required=False)
