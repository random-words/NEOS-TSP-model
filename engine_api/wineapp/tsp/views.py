import uuid
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import OptimizerRequestSerializer, OptimizerResponseSerializer
from engine_api.math_service.service import KCycleTSPService


class SolveView(APIView):
    http_method_names = ["post", "options"]

    def post(self, request):
        # request_id: из middleware или новый
        request_id = getattr(request, "request_id", None) or request.headers.get("X-Request-Id") or str(uuid.uuid4())

        # 1) validate request
        req_ser = OptimizerRequestSerializer(data=request.data)
        req_ser.is_valid(raise_exception=True)

        # 2) run optimizer
        service = KCycleTSPService()
        payload = dict(req_ser.validated_data)
        payload["request_id"] = request_id  # полезно для логов/ответа

        result = service.run(payload)

        # safety: если сервис вдруг не вернул resCode — считаем это 500
        res_code = int(result.get("resCode") or 500)

        # 3) validate response (но не уронить всё при ошибке формата)
        resp_ser = OptimizerResponseSerializer(data=result)
        if not resp_ser.is_valid():
            fallback = {
                "objective": 0.0,
                "totalDistance": 0.0,
                "totalBudget": 0.0,
                "locationsCost": 0.0,
                "fuelCost": 0.0,
                "totalTime": 0.0,
                "tour": [],
                "resCode": 500,
                "resMessage": f"Invalid optimizer response shape (request_id={request_id})",
            }
            return Response(fallback, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 4) map resCode -> HTTP status
        if res_code == 200:
            http_status = status.HTTP_200_OK
        elif res_code in (400, 422):
            http_status = status.HTTP_400_BAD_REQUEST
        else:
            http_status = status.HTTP_500_INTERNAL_SERVER_ERROR

        return Response(resp_ser.data, status=http_status)

