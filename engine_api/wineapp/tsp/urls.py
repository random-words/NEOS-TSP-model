from django.urls import path
from .views import PingView, SolveView

urlpatterns = [
    path("ping/", PingView.as_view()),
    path("solve/", SolveView.as_view()),
]
