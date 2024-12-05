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


@api_view(['Get'])
@authentication_classes([JWTCookieAuthentication])
@permission_classes([IsAuthenticated])
def matchsDetails(request):
    user =  request.user
    win = 0
    lose = 0
    winLoseRatio = None
    matchsDetails = []

    matchs = Match.objects.all()
    for match in matchs:
        if user == match.player1 or user == match.player2:
            if user == match.winner:
                win+=1
            else:
                lose+=1
            matchsDetails.append({
            "player1": match.player1.username,
            "player2": match.player2.username,
            "p1_score": match.p1_score,
            "p2_score": match.p2_score,
            "winner": match.winner.username,
            "date": match.created_at,
        })
    total_matches = win + lose
    if total_matches > 0:
        winLoseRatio = round((win / total_matches) * 100, 2)
    else:
        winLoseRatio = -1
    return Response({
        "win": win,
        "lose": lose,
        "winLoseRatio": winLoseRatio,
        "matchs": matchsDetails
    }, status=status.HTTP_200_OK)