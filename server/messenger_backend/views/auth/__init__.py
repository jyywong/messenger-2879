import datetime

import jwt
from django.contrib.auth.middleware import get_user
from django.db import IntegrityError
from django.http import HttpResponse, JsonResponse
from messenger_backend.models import User
from messenger_backend.settings import SECRET_KEY
from rest_framework.request import Request
from rest_framework.views import APIView


class Login(APIView):
    def post(self, request: Request):
        """expects username and password in request.data"""
        try:
            body = request.data
            username = body.get("username")
            password = body.get("password")

            if not (username and password):
                return JsonResponse(
                    {
                        "error": "Username and password required",
                    },
                    status=400,
                )
            user = None
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return JsonResponse(
                    {
                        "error": f"No user found for username: {username}",
                    },
                    status=401,
                )

            if not user.verify_password(password):
                return JsonResponse(
                    {
                        "error": "Wrong username and/or password",
                    },
                    status=401,
                )
            token = jwt.encode(
                {
                    "id": user.id,
                    "exp": datetime.datetime.utcnow()
                    + datetime.timedelta(seconds=86400),
                },
                SECRET_KEY,
                algorithm="HS256",
            )
            user_dict = user.to_dict()
            user_dict["token"] = token
            return JsonResponse(user_dict, status=200)
        except Exception as e:
            HttpResponse(status=500)


class Register(APIView):
    def post(self, request: Request):
        # expects {username, email, password} in request.data
        try:
            body = request.data
            username = body.get("username")
            password = body.get("password")
            email = body.get("email")
            if not (username and password and email):
                return JsonResponse(
                    {
                        "error": "Username, password, and email required",
                    },
                    status=400,
                )
            if len(password) < 6:
                return JsonResponse(
                    {
                        "error": "Password must be at least 6 characters",
                    },
                    status=400,
                )
            user = User(
                username=username,
                email=email,
                password=password,
            )
            user.save()

            token = jwt.encode(
                {
                    "id": user.id,
                    "exp": datetime.datetime.utcnow()
                    + datetime.timedelta(seconds=86400),
                },
                SECRET_KEY,
                algorithm="HS256",
            )
            user_dict = user.to_dict()
            user_dict["token"] = token
            return JsonResponse(user_dict, status=201)
        except IntegrityError as e:
            return JsonResponse({"error": "User already exists"}, status=401)
        except Exception as e:
            return HttpResponse(status=500)


class LogOut(APIView):
    def delete(self, request: Request):
        return HttpResponse(status=204)


class AuthenticatedUser(APIView):
    def get(self, request: Request):
        try:
            user = get_user(request)
            user_json_fields = [
                "id",
                "username",
                "email",
                "photoUrl",
                "createdAt",
                "updatedAt",
            ]

            return JsonResponse(
                {} if user.is_anonymous else user.to_dict(user_json_fields)
            )

        except Exception as e:
            return HttpResponse(status=500)
