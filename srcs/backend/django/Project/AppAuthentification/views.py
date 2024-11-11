from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .check import JWTCookieAuthentication
from django_otp.plugins.otp_totp.models import TOTPDevice


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
    
    if TOTPDevice.objects.filter(user=user, confirmed=True).exists():
        device = TOTPDevice.objects.filter(user=user, confirmed=True).first()
        if not device or not device.verify_token(request.data.get("opt")):
            return Response({'error': 'Invalid 2FA token'}, status=status.HTTP_401_UNAUTHORIZED)

    refreshToken = RefreshToken.for_user(user)
    accessToken = refreshToken.access_token
    response = Response({'message': 'Login successful'})

    response.set_cookie(
        'access_token',
        str(accessToken),
        max_age=6000000,
        httponly=True,
        samesite='Lax',
    )
    response.set_cookie(
        'refresh_token',
        str(refreshToken),
        max_age=700000,
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


@api_view(['POST'])
@authentication_classes([JWTCookieAuthentication])
@permission_classes([IsAuthenticated])
def activate2FA(request):
    user = request.user
    devices = TOTPDevice.objects.filter(user=user)
    if devices.exists() and devices.first().confirmed:
        return Response({"detail": "2FA est déjà activée."}, status=400)
    devices.delete()
    device = TOTPDevice.objects.create(user=user, confirmed=False)

    return Response({
        "detail": "QR code generate",
        "provisioning_uri": device.config_url
    })


@api_view(['POST'])
@authentication_classes([JWTCookieAuthentication])
@permission_classes([IsAuthenticated])
def confirm2FA(request):
    user = request.user
    otpCode = request.data.get("otp")
    device = TOTPDevice.objects.filter(user=user).first()
    if not device:
        return Response({"detail": "2FA is not activate"}, status=400)
    if device.confirmed:
        return Response({"detail": "2FA is already confirm"}, status=400)
    if not otpCode:
        return Response({"detail": "OTP code is required."}, status=400)
    if device.verify_token(otpCode):
        device.confirmed = True
        device.save()
        return Response({"detail": "2FA activée avec succès."})
    else:
        return Response({"detail": "Code OTP invalide."}, status=400)