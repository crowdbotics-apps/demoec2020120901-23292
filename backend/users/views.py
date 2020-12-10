from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from django.contrib.auth import get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse
from django.views.generic import DetailView, RedirectView, UpdateView
from rest_auth.registration.views import SocialConnectView
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from twilio.base import exceptions as twilio_exceptions

from fmwk_modules_22844.twilio_utils import send_verification_token_sms, check_verification_token

User = get_user_model()


class UserDetailView(LoginRequiredMixin, DetailView):
	model = User
	slug_field = "username"
	slug_url_kwarg = "username"


user_detail_view = UserDetailView.as_view()


class UserUpdateView(LoginRequiredMixin, UpdateView):
	model = User
	fields = ["name"]
	
	def get_success_url(self):
		return reverse("users:detail", kwargs={"username": self.request.user.username})
	
	def get_object(self):
		return User.objects.get(username=self.request.user.username)


user_update_view = UserUpdateView.as_view()


class UserRedirectView(LoginRequiredMixin, RedirectView):
	permanent = False
	
	def get_redirect_url(self):
		return reverse("users:detail", kwargs={"username": self.request.user.username})


user_redirect_view = UserRedirectView.as_view()


class RequestPasswordResetPhoneNumber(APIView):
	"""
	This class is to reset password through phone number and request a code on their mobile number
	FIXME: This is a naked endpoint so anyone can hit it repeatedly, look for something to avoid misuse
	"""
	
	def post(self, request):
		data = request.data
		to_number = data.get('to_number', None)
		if not to_number:
			return Response({"to_number": "Phone Number required"}, status.HTTP_400_BAD_REQUEST)
		try:
			user = User.objects.get(phone_number=to_number)
			verification = send_verification_token_sms(to_number)
		except twilio_exceptions.TwilioRestException:
			response = {
				"message": "SMS verification request unsuccessful. The number specified is invalid.",
				"code": status.HTTP_400_BAD_REQUEST
			}
			return Response(response, status.HTTP_400_BAD_REQUEST)
		except Exception as e:
			return Response({"message": e.args}, status.HTTP_400_BAD_REQUEST)
		
		except User.DoesNotExist as e:
			response = {
				"message": e.args,
				"code": status.HTTP_400_BAD_REQUEST
			}
			return Response(response, status.HTTP_400_BAD_REQUEST)
		
		response = {
			"message": "SMS verification request succesful.",
			"verification_sid": verification,
			"code": status.HTTP_200_OK
		}
		return Response(response, status.HTTP_200_OK)


class VerifyPasswordResetPhoneNumber(APIView):
	"""
	This class is to reset password through phone number and request a code on their mobile number
	FIXME: This is a naked endpoint so anyone can hit it repeatedly, look for something to avoid misuse
	"""
	
	def post(self, request):
		data = request.data
		to_number = data.get('to_number')
		code = data.get('code')
		new_password = data.get('new_password')
		if not new_password:
			return Response({"password": "Field Required"}, status.HTTP_400_BAD_REQUEST)
		try:
			verification_check = check_verification_token(to_number, code)
			if verification_check == "approved":
				user = User.objects.get(phone_number=to_number)
				user.phone_number_verified = True
				user.set_password(new_password)
				user.save()
			else:
				response = {
					"message": "Invalid Code.",
					"code": status.HTTP_400_BAD_REQUEST
				}
				return Response(response, status.HTTP_400_BAD_REQUEST)
		except twilio_exceptions.TwilioRestException as e:
			response = {
				"message": "SMS verification check unsuccessful.",
				"code": 404
			}
			return Response(response, status.HTTP_404_NOT_FOUND)
		
		response = {
			"message": "Password Reset Success",
			"code": status.HTTP_200_OK
		}
		return Response(response, status.HTTP_200_OK)


class FacebookConnect(SocialConnectView):
	permission_classes = (AllowAny,)
	adapter_class = FacebookOAuth2Adapter
