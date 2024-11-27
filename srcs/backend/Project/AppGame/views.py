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
from django.utils.timezone import now

@api_view(['POST'])
@authentication_classes([JWTCookieAuthentication])
@permission_classes([IsAuthenticated])
def manageMatch(request):
    user = request.user

    # Vérifier si un match en attente existe
    matchs = Match.objects.filter(status=1)
    if matchs.exists():
        match = matchs.first()
        match.player2 = user
        match.status = 2
        match.created_at = now()
        match.save()
        print(f"Match rejoint : {match.uuid}, player2: {user.id}")

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

    # Créer un nouveau match
    newMatch = Match.objects.create(
        player1=user,
        status=1
    )
    print(f"Match créé : {newMatch.uuid}, player1: {user.id}")
    return Response({"message": "match created"}, status=status.HTTP_200_OK)



@api_view(['POST'])
@authentication_classes([JWTCookieAuthentication])
@permission_classes([IsAuthenticated])
def disconnectPlayer(request):
    user = request.user
    try:
        # Trouver le match où le joueur est player1
        match = Match.objects.filter(player1=user, status=1).first()

        if not match:
            return Response({"message": "No match found for the player or match is not in waiting status."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Si player1 se déconnecte, le match est supprimé
        match.delete()

        return Response({"message": "Match deleted because player 1 disconnected."}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"message": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
