from django.urls import path, include
from rest_framework.routers import DefaultRouter

from home.api.v1.viewsets import (
	SignupViewSet,
	LoginViewSet,
	HomePageViewSet,
	CustomTextViewSet,
)

from users.views import FacebookConnect

router = DefaultRouter()
router.register("signup", SignupViewSet, basename="signup")
router.register("login", LoginViewSet, basename="login")
router.register("customtext", CustomTextViewSet)
router.register("homepage", HomePageViewSet)

urlpatterns = [
	path('facebook/connect/', FacebookConnect.as_view(), name='fb_connect'),
	path("", include(router.urls)),
]
