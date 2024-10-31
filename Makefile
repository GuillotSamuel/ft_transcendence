# Define
YELLOW = \033[1;33m
NC = \033[0m
COMPOSE_F = srcs/docker-compose.yml

# Build and run

all: build up

build:
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

restart: down up
	@echo "$(YELLOW)Restarting Docker containers...$(NC)"

re: prune all


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

prune:
	@echo "$(YELLOW)Pruning all unused Docker resources...$(NC)"
	@docker system prune -a --volumes -f

# Accessing container terminals

# todo, example :
# shell<ContainerName>:
# 	@echo "$(YELLOW)Accessing the shell of the specified container...$(NC)"
# 	docker-compose -f $(COMPOSE_FILE) exec <container_name> sh


.PHONY: all build up down stop restart re logs status remove prune