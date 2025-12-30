from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from math_models.service import KCycleTSPService

class PingView(APIView):
    def get(self, request):
        return Response({"ok": True, "msg": "tsp api is alive"}, status=status.HTTP_200_OK)


class SolveView(APIView):
    def post(self, request):
        try:
            result = KCycleTSPService().run(request.data)
        except Exception as e:
            return Response({"ok": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if not result.get("ok"):
            return Response(result, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        return Response(result, status=status.HTTP_200_OK)

