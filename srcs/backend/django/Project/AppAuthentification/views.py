from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .checkAuthentification import JWTCookieAuthentication
from django_otp.models import TOTPDevice

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
@authentication_classes([JWTCookieAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        response = Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
