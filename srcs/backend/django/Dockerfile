FROM python:3.13

ENV PYTHONUNBUFFERED=1

WORKDIR /project

COPY requirements.txt .

RUN pip install --upgrade pip && pip install -r requirements.txt

COPY project/ .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
