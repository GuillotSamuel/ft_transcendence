#!/bin/bash

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PINK='\033[1;35m'
NC='\033[0m'

echo -e "${YELLOW}Starting Nginx setup...${NC}"

if [ ! -d /etc/nginx/ssl ]; then
    echo -e "${BLUE}Creating SSL directory...${NC}"
    mkdir -p /etc/nginx/ssl
fi

if [ ! -f /etc/nginx/ssl/inception.key ] || [ ! -f /etc/nginx/ssl/inception.crt ]; then
    echo -e "${BLUE}Generating new SSL certificates...${NC}"
    openssl req -x509 -nodes -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/inception.key \
        -out /etc/nginx/ssl/inception.crt \
        -subj "/C=FR/ST=Ile-de-France/L=Paris/O=42/OU=42/CN=sguillot.42.fr/UID=sguillot"
else
    echo -e "${BLUE}SSL certificates already exist.${NC}"
fi

echo -e "${PINK}Starting Nginx...${NC}"

nginx -g 'daemon off;'