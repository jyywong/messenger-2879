from django.contrib.auth.middleware import get_user
from django.http import HttpResponse, JsonResponse
from messenger_backend.models import User
from online_users import online_users
from rest_framework.request import Request
from rest_framework.views import APIView


class Username(APIView):
    """Find users by username"""

    def get(self, request: Request, username: str):
        try:
            user = get_user(request)

            if user.is_anonymous:
                return HttpResponse(status=401)

            users = User.objects.filter(username__contains=username).exclude(id=user.id)

            users_list = []

            for usr in users:
                usr_dict = usr.to_dict(
                    ["id", "username", "email", "photoUrl", "createdAt", "updatedAt"]
                )
                if usr.id in online_users:
                    usr_dict["online"] = True
                users_list.append(usr_dict)

            return JsonResponse(users_list, safe=False)
        except Exception as e:
            return HttpResponse(status=500)
