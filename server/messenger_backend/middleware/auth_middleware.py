from django.contrib.auth.models import AnonymousUser
import jwt

from messenger_backend.settings import SECRET_KEY
from messenger_backend.models import User


class AuthMiddleware:
    """
    Before each request, checks for a jwt, and decodes it.
    If jwt is valid, sets request.user and request._cached_user to the User object,
    Otherwise it sets it to an instance of Django's AnonymousUser.

    To check if the user is authenticated in a view, use django.contrib.auth.middleware's get_user function
    which returns request._cached_user: Union[User, AnonymousUser]
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        token = request.headers.get("x-access-token")
        user = None
        try:
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user = User.get_by_id(decoded["id"])
            
        except (jwt.ExpiredSignatureError, jwt.InvalidSignatureError, jwt.DecodeError):
            pass

        finally:
            user = user or AnonymousUser()

        request._cached_user = user
        request.user = user

        response = self.get_response(request)
        return response
