from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializer import GameUserSerializer

@api_view(['POST'])
def register(request):
    serializer = GameUserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)