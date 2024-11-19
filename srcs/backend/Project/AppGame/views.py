from django.shortcuts import render
from .models import Match
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from AppAuthentification.check import JWTCookieAuthentication

@api_view(['POST'])
@authentication_classes([JWTCookieAuthentication])
@permission_classes([IsAuthenticated])
def manageMatch(request):
    user = request.user
    if user.matches_player1.exists() or user.matches_player2.exists():
        return Response({"message": "You already are in a match"}, status=status.HTTP_400_BAD_REQUEST)

    matchs = Match.objects.filter(status=1)

    if matchs.exists():
        match = matchs.first()
        match.player2 = user
        match.status = 2
        match.save()
        return Response({"message": "match join"}, status=status.HTTP_200_OK)

    newMatch = Match.objects.create(
        player1 = user,
        status = 1
    )
    newMatch.save()
    return Response({"message": "match create"}, status=status.HTTP_200_OK)

    

