#!/bin/bash

# Attente que PostgreSQL soit prêt
until nc -z postgresql 5432; do
  echo "Waiting for PostgreSQL..."
  sleep 1
done

# Démarre le serveur Django
echo "PostgreSQL is ready!"
exec "$@"
