from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import GameUserSerializer
from rest_framework.permissions import IsAuthenticated

@api_view(['POST'])
def register(request):
    serializer = GameUserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_score(request):
    user = request.user
    score = request.data.get('score')
    if score is None:
        return Response({"error": "Score must be provided"}, status=status.HTTP_400_BAD_REQUEST)
    user.score = score
    user.save()
    return Response({"message": "Score updated successfully!", "score": user.score}, status=status.HTTP_200_OK)
