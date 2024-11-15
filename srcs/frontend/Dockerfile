FROM debian:bullseye

RUN apt-get update -y \
    && apt-get upgrade -y \
    && apt-get install -y nginx openssl telnet \
    && apt autoremove -y \
    && apt autoclean -y \
    && rm -rf /var/lib/apt/lists/*

COPY tools/setup.sh /usr/local/bin/setup.sh
COPY conf/nginx.conf /etc/nginx/nginx.conf

COPY ./index.html /var/www/transcendence/index.html
COPY ./app.js /var/www/transcendence/app.js
RUN mkdir -p /var/www/transcendence/style
COPY ./style/ /var/www/transcendence/style/
COPY ./local_game/ /var/www/transcendence/local_game/
COPY ./assets/ /var/www/transcendence/assets/
#COPY ./components/ /var/www/transcendence/components/

RUN chmod 755 /usr/local/bin/setup.sh

ENTRYPOINT [ "/usr/local/bin/setup.sh" ]