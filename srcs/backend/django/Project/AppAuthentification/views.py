from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    refreshToken = RefreshToken.for_user(user)
    accessToken = refreshToken.access_token
    response = Response({'message': 'Login successful'})

    response.set_cookie(
        'access_token',
        str(accessToken),
        max_age=20,
        httponly=True,
        samesite='Lax',
    )
    response.set_cookie(
        'refresh_token',
        str(refreshToken),
        max_age=30,
        httponly=True,
        samesite='Lax',
    )
    return response


@api_view(['POST'])
@permission_classes([AllowAny])
def refreshToken(request):
    refresh_token = request.COOKIES.get('refresh_token')
    if not refresh_token:
        return Response({'message': 'Refresh token missing'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        rtoken = RefreshToken(refresh_token)
        access_token = rtoken.access_token
        response = Response({'message': 'Token refreshed successfully'})
        response.set_cookie(
            'access_token',
            str(access_token),
            max_age=20,
            httponly=True,
            samesite='Lax',
        )
        return response
    except TokenError:
        return Response({'message': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)