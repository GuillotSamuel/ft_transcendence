from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from .views import refreshToken

class JWTCookieAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token')
        if not access_token:
            return None

        try:
            validated_token = self.get_validated_token(access_token)
            user = self.get_user(validated_token)
            return (user, validated_token)
        except InvalidToken:
            refresh_token = request.COOKIES.get('refresh_token')
            if not refresh_token:
                return None

            try:
                refresh = RefreshToken(refresh_token)
                access_token = str(refresh.access_token)
                request.COOKIES['access_token'] = access_token

                validated_token = self.get_validated_token(access_token)
                user = self.get_user(validated_token)
                return (user, validated_token)
            except TokenError:
                return None

        return None