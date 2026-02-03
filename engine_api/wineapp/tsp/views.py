from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import OptimizerRequestSerializer, OptimizerResponseSerializer
from engine_api.math_service.service import KCycleTSPService





class SolveView(APIView):
    def post(self, request):
        req_ser = OptimizerRequestSerializer(data=request.data)
        req_ser.is_valid(raise_exception=True)

        service = KCycleTSPService()
        result = service.run(req_ser.validated_data)

        resp_ser = OptimizerResponseSerializer(data=result)
        resp_ser.is_valid(raise_exception=True)

        http_status = status.HTTP_200_OK if result.get("resCode") == 200 else status.HTTP_500_INTERNAL_SERVER_ERROR
        return Response(resp_ser.data, status=http_status)

