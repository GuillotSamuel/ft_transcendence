# Define
YELLOW = \033[1;33m
NC = \033[0m
COMPOSE_FILE = srcs/docker-compose.yml

# Build and run

all: build up

prepare_directories:
	@echo "$(YELLOW)Preparing directories for Docker containers volumes...$(NC)"
	@sudo mkdir -p $(HOME)/data/db
	@sudo mkdir -p $(HOME)/data/static
	@sudo mkdir -p $(HOME)/data/media
	@sudo chown -R $(USER):$(USER) $(HOME)/data
	@sudo chmod -R 755 $(HOME)/data

build: # prepare_directories
	@echo "$(YELLOW)Building Docker images...$(NC)"
	docker-compose -f $(COMPOSE_FILE) build

up:
	@echo "$(YELLOW)Starting containers...$(NC)"
	docker-compose -f $(COMPOSE_FILE) up -d

down:
	@echo "$(YELLOW)Stopping and removing Docker containers...$(NC)"
	docker-compose -f $(COMPOSE_FILE) down

stop:
	@echo "$(YELLOW)Stopping Docker containers...$(NC)"
	docker-compose -f $(COMPOSE_FILE) stop

restart: remove up
	@echo "$(YELLOW)Restarting Docker containers...$(NC)"

re: remove all


# Logs and status 

logs:
	@echo "$(YELLOW)Displaying Docker logs...$(NC)"
	docker-compose -f $(COMPOSE_FILE) logs -f

status:
	@echo "$(YELLOW)Displaying Docker status...$(NC)"
	docker-compose -f $(COMPOSE_FILE) ps -a


# Cleaning containers and datas

remove:
	@echo "$(YELLOW)Stopping Docker containers and removing all resources...$(NC)"
	docker-compose -f $(COMPOSE_FILE) down --volumes --remove-orphans

prune: remove
	@echo "$(YELLOW)Pruning all unused Docker resources...$(NC)"
	@docker system prune -a --volumes -f


# Accessing container terminals

shellPostgreSQL:
	@echo "$(YELLOW)Accessing the shell of the PostgreSQL container...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec postgresql sh

shellDjango:
	@echo "$(YELLOW)Accessing the shell of the Django container...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec django sh

shellNginx:
	@echo "$(YELLOW)Accessing the shell of the Nginx container...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec nginx sh


.PHONY: all prepare_directories build up down stop restart re logs status remove prune shellPostgreSQL shellDjango shellNginx