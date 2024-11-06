FROM python:3.13

# Set environment variable to ensure logs are outputted immediately
ENV PYTHONUNBUFFERED=1

# Set working directory inside the container
WORKDIR /project

# Install netcat (nc) to use in the wait-for-it script
RUN apt-get update && apt-get install -y netcat-traditional


# Copy the requirements.txt file into the container
COPY requirements.txt .

# Install pip dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the project files into the container
COPY project/ .

# Copy the wait-for-it script into the container and make it executable
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Expose the port the application will run on
EXPOSE 8000

# Command to run the Django server after waiting for PostgreSQL to be ready
# Copie le fichier entrypoint.sh dans le conteneur
COPY wait-for-it.sh /wait-for-it.sh

# Rendre le script exécutable
RUN chmod +x /wait-for-it.sh

# Modifie le CMD pour utiliser ce script
CMD ["/wait-for-it.sh", "python", "manage.py", "runserver", "0.0.0.0:8000"]