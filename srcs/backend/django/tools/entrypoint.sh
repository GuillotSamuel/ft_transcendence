#!/bin/bash


# Définit les couleurs pour l'affichage
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PINK='\033[1;35m'
NC='\033[0m'


# Affiche un message d'initialisation
echo -e "${YELLOW}Starting Django setup...${NC}"

# Enregistre le temps de démarrage et définit un timeout de 60 secondes
start_time=$(date +%s)
end_time=$((start_time + 60))

# Attend que le service PostgreSQL soit disponible
while ! nc -z postgresql 5432; do
  echo -e "${BLUE}Waiting for PostgreSQL...${NC}"
  sleep 2


  # Si PostgreSQL n'est pas disponible après 60 secondes, échoue le script
  if [ $(date +%s) -ge $end_time ]; then
    echo -e "${RED}Failed to access the PostgreSQL container in 60 seconds.${NC}"
    exit 1
  fi
done


# Si PostgreSQL est prêt, continue le setup de Django
echo -e "${PINK}PostgreSQL is ready, starting Django...${NC}"

# Applique les migrations de Django (si elles existent)
echo -e "${GREEN}Running makemigrations...${NC}"
python /app/Project/manage.py makemigrations || true  # N'échoue pas si aucune migration n'est nécessaire

echo -e "${GREEN}Running migrations...${NC}"
python /app/Project/manage.py migrate

# Lance le serveur Django
echo -e "${GREEN}Starting Django server...${NC}"
exec python /app/Project/manage.py runserver 0.0.0.0:8000
