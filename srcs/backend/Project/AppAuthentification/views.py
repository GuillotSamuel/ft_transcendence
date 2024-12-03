from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .check import JWTCookieAuthentication
from django_otp.plugins.otp_totp.models import TOTPDevice
from .models import GameUser
from django.http import HttpResponseRedirect
import requests
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.http import HttpResponse

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully!"}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def loginWith42(request):
    client_id = "u-s4t2ud-01f6d171a5fd07c8e9565148373482f55d6c89970205d3030a039466c3ff3fb9"
    redirect_uri = "http://localhost:8000/api/callBack42/" 
    authorization_url = f"https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code"
    return JsonResponse({"authorization_url": authorization_url})

@api_view(['GET'])
@permission_classes([AllowAny])
def callBack42(request):
    code = request.GET.get('code')
    if not code:
        return Response({'error': "not valid code"}, status=status.HTTP_400_BAD_REQUEST)

    data = {
        'client_id': 'u-s4t2ud-01f6d171a5fd07c8e9565148373482f55d6c89970205d3030a039466c3ff3fb9',
        'client_secret': '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',
        'code': code,
        'redirect_uri': 'http://localhost:8000/api/callBack42/',
        'grant_type': 'authorization_code'
    }
    response = requests.post('https://api.intra.42.fr/oauth/token', data=data)
    data = response.json()
    access_token = data.get("access_token")
    if not access_token:
        return Response({'error': 'Failed to fetch access token'}, status=status.HTTP_400_BAD_REQUEST)

    url = "https://api.intra.42.fr/v2/me"
    headers = {'Authorization': f'Bearer {access_token}'}
    response = requests.get(url, headers=headers)
    user_data = response.json()
    username = user_data.get('login')
    email = user_data.get('email')

    user, created = get_user_model().objects.get_or_create(username=username, email=email)
    if created:
        user.set_unusable_password()
    user.online = True
    user.save()

    refreshToken = RefreshToken.for_user(user)
    accessToken = refreshToken.access_token
    response = HttpResponseRedirect('https://localhost:8443/#game')
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
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if TOTPDevice.objects.filter(user=user, confirmed=True).exists():
        device = TOTPDevice.objects.filter(user=user, confirmed=True).first()
        if not device or not device.verify_token(request.data.get("otp")):
            return Response({'error': 'error'}, status=status.HTTP_400_BAD_REQUEST)
    
    refreshToken = RefreshToken.for_user(user)
    accessToken = refreshToken.access_token
    response = Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
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
    user.online = True
    user.save()
    return response

@api_view(['POST'])
@authentication_classes([JWTCookieAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        response = Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        user = request.user
        user.online = False
        user.save()
        return response
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def isUserAuthentified(request):
    auth_result = JWTCookieAuthentication().authenticate(request)
    if auth_result is None:
        return Response({'Authentication': 'no'}, status=status.HTTP_200_OK)
    else:
        return Response({"Authentication": "yes"}, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@authentication_classes([JWTCookieAuthentication])
@permission_classes([IsAuthenticated])
def deleteUser(request):
    user = request.user
    response = Response({'message': 'account delete successfully'}, status=status.HTTP_200_OK)
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    user.delete()
    return response

#2FA
@api_view(['POST'])
@authentication_classes([JWTCookieAuthentication])
@permission_classes([IsAuthenticated])
def enable2FA(request):
    user = request.user
    devices = TOTPDevice.objects.filter(user=user)
    if devices.exists() and devices.first().confirmed:
        return Response({"detail": "2FA est déjà activée."}, status=status.HTTP_400_BAD_REQUEST)
    devices.delete()
    device = TOTPDevice.objects.create(user=user, confirmed=False)

    return Response({
        "detail": "QR code generate",
        "provisioning_uri": device.config_url
    }, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@authentication_classes([JWTCookieAuthentication])
@permission_classes([IsAuthenticated])
def disable2FA(request):
    user = request.user
    devices = TOTPDevice.objects.filter(user=user)
    devices.delete()
    return Response({"message": "2FA desactver avec succès."}, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([JWTCookieAuthentication])
@permission_classes([IsAuthenticated])
def confirm2FA(request):
    user = request.user
    otpCode = request.data.get("otp")
    device = TOTPDevice.objects.filter(user=user).first()
    if not device:
        return Response({"detail": "2FA is not activate"}, status=status.HTTP_400_BAD_REQUEST)
    if device.confirmed:
        return Response({"detail": "2FA is already confirm"}, status=status.HTTP_400_BAD_REQUEST)
    if not otpCode:
        return Response({"detail": "OTP code is required."}, status=status.HTTP_400_BAD_REQUEST)
    if device.verify_token(otpCode):
        device.confirmed = True
        device.save()
        return Response({"message": "2FA activée avec succès."}, status=status.HTTP_200_OK)
    else:
        return Response({"detail": "Code OTP invalide."}, status=status.HTTP_400_BAD_REQUEST)
#settings 

@api_view(['GET'])
@authentication_classes([JWTCookieAuthentication])
@permission_classes([IsAuthenticated])
def infosUser(request):
    user = request.user
    is_2fa_activated = TOTPDevice.objects.filter(user=user, confirmed=True).exists()
    response_data = {
        "2FA_activated": "yes" if is_2fa_activated else "no",
        "email": user.email,
        "username": user.username
    }
    return Response(response_data, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([JWTCookieAuthentication])
@permission_classes([IsAuthenticated])
def changePassword(request):
    user = request.user
    oldPwd = request.data.get("oldPwd")
    newPwd = request.data.get("newPwd")
    if not oldPwd or not newPwd:
        return Response({"error": "Both old password and new password are required."}, status=status.HTTP_400_BAD_REQUEST)
    if not user.check_password(oldPwd):
        return Response({"error": "Old password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)
    user.set_password(newPwd)
    user.save()
    return Response({"message": "Password change successful!"}, status=status.HTTP_200_OK)

# Friends

@api_view(['POST'])
@authentication_classes([JWTCookieAuthentication])
@permission_classes([IsAuthenticated])
def addFriend(request):
    user = request.user
    friendUsername = request.data.get('friend_id')
    if not friendUsername:
        return Response({'detail': 'Friend ID not provided.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        friend = GameUser.objects.get(username=friendUsername)
    except Exception:
        return Response({'detail': 'User not found.'}, status=status.HTTP_400_BAD_REQUEST)
    if friend.username == user.username:
        return Response({'detail': 'You cannot add yourself as a friend.'}, status=status.HTTP_400_BAD_REQUEST)
    if user.friends.filter(username=friend.username).exists():
        return Response({'detail': 'This user is already your friend.'}, status=status.HTTP_400_BAD_REQUEST)
    user.friends.add(friend)
    return Response({'detail': 'yes'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([JWTCookieAuthentication])
@permission_classes([IsAuthenticated])
def listFriends(request):
    user = request.user
    friends = user.friends.all()
    friendlist = []
    for friend in friends:
        friendlist.append({
            "username": friend.username,
            "online": friend.online,
        })
    return Response({'friends': friendlist}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@authentication_classes([JWTCookieAuthentication])
@permission_classes([IsAuthenticated])
def removeFriend(request):
    user = request.user
    friendUsername = request.data.get('friendUserName')
    friend = GameUser.objects.get(username=friendUsername)
    user.friends.remove(friend)
    return Response({'detail': 'yes'}, status=status.HTTP_200_OK)

#avatar

@api_view(['POST'])
@authentication_classes([JWTCookieAuthentication])
@permission_classes([IsAuthenticated])
def addAvatar(request):
    user = request.user
    if 'avatar' in request.data:
        user.avatar = request.data['avatar']
        user.save()
        return Response({'message': 'Avatar updated successfully.'}, status=status.HTTP_200_OK)
    return Response({'error': 'No avatar provided.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@authentication_classes([JWTCookieAuthentication])
@permission_classes([IsAuthenticated])
def getAvatar(request):
    user = request.user
    print(f"Utilisateur authentifié: {user.username}")

    if user.avatar:
        print(f"L'utilisateur a un avatar: {user.avatar.url}")
        with open(user.avatar.path, 'rb') as avatar_file:
            return HttpResponse(avatar_file.read(), content_type='image/jpeg')
    else:
        print("L'utilisateur n'a pas d'avatar, envoi de l'avatar par défaut.")
        default_avatar_path = os.path.join(settings.MEDIA_ROOT, 'avatars', 'default_avatar.jpg')
        with open(default_avatar_path, 'rb') as default_avatar:
            return HttpResponse(default_avatar.read(), content_type='image/jpeg')