from django.shortcuts import render
from .models import Match
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from AppAuthentification.check import JWTCookieAuthentication
from rest_framework.permissions import AllowAny
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

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

        # Notifier le groupe que le match est prêt
        channel_layer = get_channel_layer()
        group_name = f"Match{match.uuid}"
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'match_ready',
                'event_name': 'MATCH_READY',
                'data': {
                    'match_uuid': str(match.uuid)
                }
            }
        )
        return Response({"message": "match joined"}, status=status.HTTP_200_OK)

    newMatch = Match.objects.create(
        player1=user,
        status=1
    )
    return Response({"message": "match created"}, status=status.HTTP_200_OK)

    

