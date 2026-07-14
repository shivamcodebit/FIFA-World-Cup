# ──────────────────────────────────────────────────────────────────────
# StadiumPilot AI – Makefile
# Quick commands for development, testing, and deployment
# ──────────────────────────────────────────────────────────────────────

.PHONY: help install dev test build docker-build docker-up docker-down clean

# Default target
help: ## Show this help
	@echo ""
	@echo "⚽ StadiumPilot AI – Available Commands"
	@echo "────────────────────────────────────────"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""

# ──────────────────────────────────────────────
# Setup
# ──────────────────────────────────────────────
install: ## Install all dependencies (backend + frontend)
	@echo "📦 Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm ci --ignore-scripts
	@echo "✅ Dependencies installed!"

install-backend: ## Install backend dependencies only
	cd backend && pip install -r requirements.txt

install-frontend: ## Install frontend dependencies only
	cd frontend && npm ci --ignore-scripts

setup: install ## Full project setup (copy env files)
	@[ -f backend/.env ] || cp .env.example backend/.env && echo "✅ backend/.env created"
	@[ -f frontend/.env.local ] || cp frontend/.env.local.example frontend/.env.local && echo "✅ frontend/.env.local created"
	@echo "⚠️  Remember to add your GEMINI_API_KEY to backend/.env"

# ──────────────────────────────────────────────
# Development
# ──────────────────────────────────────────────
dev-backend: ## Start backend development server
	cd backend && uvicorn app.main:app --reload --port 8000

dev-frontend: ## Start frontend development server
	cd frontend && npm run dev

# ──────────────────────────────────────────────
# Testing
# ──────────────────────────────────────────────
test: test-backend test-frontend ## Run all tests

test-backend: ## Run backend tests with coverage
	cd backend && pytest tests/ -v --tb=short --cov=app --cov-report=term-missing

test-frontend: ## Run frontend tests
	cd frontend && npm test

test-watch-frontend: ## Run frontend tests in watch mode
	cd frontend && npm run test:watch

# ──────────────────────────────────────────────
# Build
# ──────────────────────────────────────────────
build-frontend: ## Build frontend for production
	cd frontend && npm run build

lint-frontend: ## Lint frontend code
	cd frontend && npm run lint

# ──────────────────────────────────────────────
# Docker
# ──────────────────────────────────────────────
docker-build: ## Build all Docker images
	docker-compose build

docker-up: ## Start all services with Docker Compose
	docker-compose up -d
	@echo "✅ Services started!"
	@echo "   Frontend: http://localhost:3000"
	@echo "   Backend:  http://localhost:8000"
	@echo "   API Docs: http://localhost:8000/docs"

docker-down: ## Stop all Docker services
	docker-compose down

docker-logs: ## View Docker service logs
	docker-compose logs -f

docker-clean: ## Remove Docker containers and volumes
	docker-compose down -v --remove-orphans

# ──────────────────────────────────────────────
# Cleanup
# ──────────────────────────────────────────────
clean: ## Clean build artifacts and caches
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
	find . -name "*.pyc" -delete 2>/dev/null || true
	rm -rf frontend/dist 2>/dev/null || true
	rm -f backend/stadiumPilot.db 2>/dev/null || true
	@echo "✅ Cleaned!"
