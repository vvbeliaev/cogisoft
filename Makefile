.PHONY: build up down logs dev

build:
	docker compose -f compose.local.yml build

up:
	docker compose -f compose.local.yml up -d

down:
	docker compose -f compose.local.yml down

logs:
	docker compose -f compose.local.yml logs -f

dev: build up
