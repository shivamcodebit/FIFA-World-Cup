# Deployment Guide – StadiumPilot AI

## Overview

StadiumPilot AI is a full-stack application consisting of:
- **Backend:** FastAPI + Python 3.11 (port 8000)
- **Frontend:** React + TypeScript + Vite, served by Nginx (port 3000/80)
- **Database:** SQLite (development) / PostgreSQL (production recommended)

---

## 🐳 Docker Deployment (Recommended)

### Prerequisites
- Docker 24+
- Docker Compose 2.20+

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/stadiumPilot-ai.git
cd stadiumPilot-ai

# 2. Configure environment variables
cp .env.example .env
# Edit .env and set:
# - GEMINI_API_KEY=your_gemini_api_key
# - SECRET_KEY=$(python -c "import secrets; print(secrets.token_hex(32))")
# - ENVIRONMENT=production

# 3. Build and start
make docker-up

# 4. Verify health
curl http://localhost:8000/health
```

### Services
| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React app |
| Backend API | http://localhost:8000 | FastAPI |
| API Docs | http://localhost:8000/docs | Swagger UI |
| Health Check | http://localhost:8000/health | Monitoring |

---

## ☁️ Cloud Deployment

### Google Cloud Run (Recommended for hackathon)

```bash
# Backend
gcloud run deploy stadiumPilot-backend \
  --source ./backend \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key,ENVIRONMENT=production,SECRET_KEY=your_secret

# Frontend (Firebase Hosting recommended)
cd frontend && npm run build
firebase deploy --only hosting
```

### Railway / Render (Easy one-click deploy)

1. Connect GitHub repo to Railway/Render
2. Set environment variables in the dashboard
3. Backend: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Frontend: Build command `npm run build`, publish dir `dist`

### Vercel (Frontend) + Render (Backend)

1. Deploy backend to Render (free tier available)
2. Deploy frontend to Vercel:
   - Build Command: `npm run build`
   - Output Dir: `dist`
   - Environment Variable: `VITE_API_BASE_URL=https://your-render-backend.onrender.com`

---

## 🔧 Environment Variables

### Backend

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GEMINI_API_KEY` | **Yes** | Google Gemini API key | `AIza...` |
| `SECRET_KEY` | Yes (prod) | Application secret key | 64-char random hex |
| `ENVIRONMENT` | No | `development` or `production` | `production` |
| `DATABASE_URL` | No | SQLAlchemy connection string | `sqlite+aiosqlite:///./stadium.db` |
| `ALLOWED_ORIGINS` | No | Comma-separated CORS origins | `https://app.example.com` |
| `LOG_LEVEL` | No | Python logging level | `INFO` |
| `GEMINI_MODEL` | No | Gemini model to use | `gemini-2.0-flash` |
| `GEMINI_MAX_TOKENS` | No | Max response tokens | `2048` |
| `GEMINI_TEMPERATURE` | No | AI response temperature | `0.7` |

### Frontend

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_BASE_URL` | No | Backend API URL | `http://localhost:8000` |

---

## 🔒 Production Security Checklist

- [ ] `SECRET_KEY` is a strong random value (never the default)
- [ ] `ENVIRONMENT=production` is set
- [ ] `GEMINI_API_KEY` is stored as a secret (not in code)
- [ ] `ALLOWED_ORIGINS` is restricted to your frontend domain
- [ ] HTTPS is enabled (TLS certificate)
- [ ] Database is backed up regularly
- [ ] `.env` files are never committed to Git

---

## 📊 Monitoring

The `/health` endpoint returns:
```json
{
  "status": "healthy",
  "app": "StadiumPilot AI",
  "version": "1.0.0",
  "environment": "production",
  "ai_enabled": true,
  "ai_model": "gemini-2.0-flash"
}
```

Use this for load balancer health checks and uptime monitoring (Uptime Robot, Better Uptime, etc.).

---

## 🛠️ Manual Deployment (No Docker)

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env  # Edit with your values
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Frontend (separate terminal)
cd frontend
npm ci --ignore-scripts
cp .env.local.example .env.local  # Edit with backend URL
npm run dev  # Development
# Or: npm run build && npx serve dist  # Production preview
```
