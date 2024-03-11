from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from jwt import decode as jwt_decode
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import UntypedToken

User = get_user_model()


@database_sync_to_async
def get_user(user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        user = AnonymousUser()

    return user


# Middleware here

class TokenAuthMiddleware(BaseMiddleware):
    """
    Custom token auth middleware for channels
    """

    def __init__(self, inner):
        super().__init__(inner)

    async def __call__(self, scope: dict, receive, send):
        # Get query_string from websocket URL
        query_string = scope.get("query_string", None)
        if query_string:  # Decode query_string if exist
            query_string = query_string.decode("utf8")
        else:  # Else user not authenticated
            scope["user"] = AnonymousUser()
            return await super().__call__(scope, receive, send)

        try:  # Try to decode token and login
            token = parse_qs(query_string).get("token", [0])[0]
            UntypedToken(token)
            decoded_data = jwt_decode(jwt=token, key=settings.SIMPLE_JWT["SIGNING_KEY"], algorithms=[
                                      settings.SIMPLE_JWT["ALGORITHM"]])
            scope['user'] = await get_user(int(decoded_data["id"]))
        except (InvalidToken, TokenError) as e:  # else user is Anonymous
            scope["user"] = AnonymousUser()
        except Exception as e:  # If unknown error acquired dont answer
            return None

        return await super().__call__(scope, receive, send)
