from django.contrib.auth.models import User  # Importe le modèle User de Django
from rest_framework import serializers

class GameUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User  # Référence le modèle User de Django
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        # Utilise create_user pour que le mot de passe soit haché
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
