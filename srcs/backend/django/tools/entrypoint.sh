#!/bin/bash

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PINK='\033[1;35m'
NC='\033[0m'

echo -e "${YELLOW}Starting Django setup...${NC}"

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

echo -e "${PINK}PostgreSQL is ready, starting Django...${NC}"

exec python /app/Project/manage.py runserver 0.0.0.0:8000
