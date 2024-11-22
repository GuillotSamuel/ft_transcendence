#!/bin/bash

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PINK='\033[1;35m'
NC='\033[0m'

echo -e "${YELLOW}Starting Django setup...${NC}"

# Temps d'attente pour la connexion à PostgreSQL
start_time=$(date +%s)
end_time=$((start_time + 60))

# Attente de la disponibilité de PostgreSQL
start_time=$(date +%s)
end_time=$((start_time + 60))

while ! nc -z postgresql 5432; do
  echo -e "${BLUE}Waiting for PostgreSQL...${NC}"
  sleep 2

  if [ $(date +%s) -ge $end_time ]; then
    echo -e "${RED}Failed to access the PostgreSQL container in 60 seconds.${NC}"
    exit 1
  fi
done

echo -e "${GREEN}PostgreSQL is ready, starting Django...${NC}"

# Exécution des migrations
echo -e "${BLUE}Running makemigrations...${NC}"
python /app/Project/manage.py makemigrations || true

echo -e "${BLUE}Running migrations...${NC}"
python /app/Project/manage.py migrate

# Démarrage de Daphne
echo -e "${PINK}Starting Daphne server...${NC}"

# On s'assure que le chemin PYTHONPATH inclut le dossier contenant 'Project'
export PYTHONPATH=$PYTHONPATH:/app/Project

# Lancement de Daphne avec la bonne application ASGI
exec daphne -b 0.0.0.0 -p 8000 Project.asgi:application

=======
echo -e "${PINK}Starting Django server...${NC}"
exec python /app/Project/manage.py runserver 0.0.0.0:8000
