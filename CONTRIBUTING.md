# Contributing to StadiumPilot AI

Thank you for your interest in contributing! Here's how to get started.

## 🚀 Quick Setup

```bash
# Clone and set up the project
git clone https://github.com/your-username/stadiumPilot-ai.git
cd stadiumPilot-ai
make setup

# Add your Gemini API key to backend/.env
GEMINI_API_KEY=your_key_here
```

## 🏗️ Development Workflow

```bash
# Start backend (Terminal 1)
make dev-backend

# Start frontend (Terminal 2)
make dev-frontend
```

## ✅ Before Submitting a PR

1. **Run all tests:** `make test`
2. **Lint frontend:** `make lint-frontend`
3. **Ensure no debug logs** left in code
4. **Write tests** for new features (backend: pytest, frontend: vitest)

## 📁 Code Standards

### Backend (Python)
- Follow PEP 8 style
- Use type hints everywhere
- Write docstrings for all public functions
- Keep routes thin – business logic in services
- Never hardcode secrets

### Frontend (TypeScript/React)
- Use functional components and hooks
- Accessibility: all interactive elements need `aria-label`
- Use semantic HTML (`<section>`, `<article>`, `<nav>`, `<main>`)
- Test utilities with Vitest

## 🐛 Reporting Issues

Open a GitHub Issue with:
- Description of the bug
- Steps to reproduce
- Expected vs. actual behavior
- Environment (OS, Python version, Node version)

## 💡 Feature Requests

Open a GitHub Discussion or Issue with the `enhancement` label.

## 🔑 Environment Variables

Never commit `.env` files. All secrets must be environment variables.

## 📜 License

By contributing, you agree your contributions will be licensed under the MIT License.
