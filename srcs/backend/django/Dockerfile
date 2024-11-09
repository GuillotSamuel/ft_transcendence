FROM python:3.9

ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade pip && pip install -r requirements.txt

COPY Project/manage.py /app/Project/manage.py
COPY Project/ /app/Project/.
COPY tools/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh /app/Project/manage.py

EXPOSE 8000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
