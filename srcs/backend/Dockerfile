FROM python:3.9

ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y \
    netcat-openbsd \
    libjpeg62-turbo-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade pip && pip install -r requirements.txt

COPY Project/manage.py /app/Project/manage.py
COPY Project/ /app/Project/.
COPY tools/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY assets/default_avatar.jpg /app/Project/media/avatars/default_avatar.jpg
RUN mkdir -p /app/Project/media/avatars

RUN chmod +x /usr/local/bin/entrypoint.sh /app/Project/manage.py
RUN chmod -R 755 /app/Project/media/avatars/

EXPOSE 8000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
