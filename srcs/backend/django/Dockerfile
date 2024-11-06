FROM python:3.13

# Envoyer tous les logs et erreurs vers la console principale (optionnel)
ENV PYTHONUNBUFFERED=1

# Définir le répertoire de travail dans /project (où se trouve manage.py)
WORKDIR /project

# Copier le fichier requirements.txt du sous-dossier project vers le répertoire de travail
COPY requirements.txt .

# Installer les dépendances
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copier tous les fichiers du sous-dossier project dans le répertoire de travail du conteneur
COPY project/ .

# Exposer le port 8000 pour l'application Django
EXPOSE 8000

# Démarrer le serveur Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
