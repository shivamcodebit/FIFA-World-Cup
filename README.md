# ⚽ StadiumPilot AI
### GenAI Smart Stadium Copilot for FIFA World Cup 2026™

[![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)](https://typescriptlang.org)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.0_Flash-orange?logo=google)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![CI](https://img.shields.io/badge/CI-GitHub_Actions-blue?logo=github-actions)](.github/workflows/ci.yml)

> **StadiumPilot AI** is a production-quality Generative AI solution that transforms the FIFA World Cup 2026 stadium experience for fans, volunteers, staff, and organizers — powered by Google Gemini.

---

## 🎯 Problem Statement

FIFA World Cup 2026 spans **3 countries, 16 cities, and stadiums holding 60,000–100,000+ fans**. The operational challenges are massive:

- **Fans** struggle with navigation, long queues, language barriers, and emergency situations
- **Volunteers** lack real-time incident workflow guidance and struggle to generate reports quickly
- **Staff** have no intelligent prioritization for cleaning, security, or restocking
- **Organizers** need rapid decision support when crowd distributions become imbalanced

Traditional approaches rely on hardcoded signage, radio communication, and manual judgement — all of which break down at scale during a World Cup.

---

## 💡 Solution

**StadiumPilot AI** is a contextual, multilingual AI copilot that understands:
- **Who** is asking (fan, volunteer, staff, organizer)
- **Where** they are (zone, section, gate)
- **What** conditions exist (crowd density, queue lengths, active incidents)
- **What language** they speak

It then uses Google Gemini to provide intelligent, role-specific, situation-aware responses — not hardcoded chatbot replies.

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph Frontend ["Frontend (React + TypeScript + Vite)"]
        LP[Landing Page]
        FA[Fan Assistant]
        VA[Volunteer Assistant]
        SD[Staff Dashboard]
        OD[Organizer Dashboard]
        EM[Emergency Page]
        MAP[Stadium Map]
        CI[Chat Interface]
        STORE[Zustand Store]
    end

    subgraph Backend ["Backend (FastAPI + Python)"]
        API[FastAPI App]
        CHAT[/api/v1/chat]
        INC[/api/v1/incidents]
        CROWD[/api/v1/crowd]
        DASH[/api/v1/dashboard]
        HEALTH[/health]
    end

    subgraph Services ["AI Services"]
        AIS[AI Service]
        PROMPTS[Prompt Templates]
        GEMINI[Google Gemini API]
    end

    subgraph Data ["Data Layer"]
        DB[(SQLite)]
        MOCK[Mock Data]
        MODELS[SQLAlchemy Models]
    end

    Frontend -->|HTTP/REST| Backend
    API --> CHAT
    API --> INC
    API --> CROWD
    API --> DASH
    CHAT --> AIS
    INC --> AIS
    CROWD --> AIS
    DASH --> AIS
    AIS --> PROMPTS
    AIS --> GEMINI
    CHAT --> DB
    INC --> DB
    CROWD --> DB
    DB --> MODELS
    CROWD --> MOCK
```

---

## ✨ Key Features

### 👥 Fan Assistant
| Feature | Description |
|---------|-------------|
| 🗺️ Seat Navigation | AI-guided directions based on section, row, seat |
| 🍔 Food & Queue-Aware | Recommends less-crowded food options |
| 🚻 Nearest Facilities | Restrooms, ATMs, refill stations with queue info |
| 👶 Lost & Found | Child separation protocol guidance |
| 🅿️ Parking & Shuttle | Real-time transport recommendations |
| ♿ Accessibility | Wheelchair routes, elevator locations, priority access |
| 🌱 Sustainability | Refill stations, green transport, waste guidance |
| 🌍 Multilingual | English, Spanish, French, Portuguese, Arabic, Hindi |

### 🙋 Volunteer Assistant
| Feature | Description |
|---------|-------------|
| 📋 Incident Workflows | Step-by-step protocols for medical, fire, lost child, security |
| 🤖 AI Report Generation | Automatic incident summaries with escalation paths |
| 👀 Crowd Monitoring | Real-time zone density summaries |
| 📞 Escalation Paths | Clear chain of command guidance |

### 🏢 Staff Dashboard
| Feature | Description |
|---------|-------------|
| 📊 Live Crowd Data | Real-time zone density with color-coded alerts |
| 🧹 Cleaning Priorities | AI-ranked cleaning tasks based on crowd flow |
| 💧 Water Refill Alerts | Proactive restocking recommendations |
| 🛡️ Security Alerts | AI-generated security situation summaries |
| 💡 AI Insights | Proactive operational recommendations |

### 🏗️ Organizer Dashboard
| Feature | Description |
|---------|-------------|
| 🎯 Decision Support | Top 3 decisions the organizer should make NOW |
| 📈 Crowd Distribution | Strategic analysis across all zones |
| 🚪 Gate Optimization | Open/close gate recommendations |
| 👥 Staff Allocation | Where to deploy more staff |
| 🚌 Transport Management | Shuttle/subway dispatch recommendations |
| 🏟️ Stadium Health | Executive summary with KPIs |

### 🚨 Emergency Mode
| Type | Actions |
|------|---------|
| 🏥 Medical | Immediate steps + escalation |
| 🔥 Fire | Evacuation protocol |
| 👶 Lost Child | Child-safe protocol |
| 🛡️ Security | Non-engagement protocol |
| ⚠️ Suspicious Activity | Report & alert flow |

All incidents generate AI-powered reports automatically.

---

## 🧠 How AI Works

Uses **Google Gemini 2.0 Flash** with carefully crafted system prompts:

```
User Message
    ↓
[Role Detection]  →  Fan / Volunteer / Staff / Organizer
    ↓
[System Prompt]   →  Role-specific persona + capabilities + guidelines
    ↓
[Context Injection] → Location + Crowd data + Language + Conversation history
    ↓
[Gemini API]       → Contextual, intelligent response
    ↓
[Suggested Actions] → 2-3 follow-up action chips
    ↓
[Response]         → Multilingual, contextual answer
```

### Prompt Architecture

Each user role has a dedicated system prompt defined in `backend/app/prompts/templates.py`:

- **Fan prompt**: Warm, helpful navigation and facility guidance
- **Volunteer prompt**: Professional, protocol-driven emergency workflows  
- **Staff prompt**: Data-driven operational intelligence
- **Organizer prompt**: Executive-level strategic decision support

### Structured AI Outputs

For dashboards, Gemini generates **structured JSON responses** with:
- Crowd summaries and hotspot detection
- Prioritized recommendations
- Alert categorization
- Decision support statements

---

## 🖼️ Screenshots

> *Screenshots placeholder – run the app locally to see the full UI*

| Landing Page | Fan Assistant | Staff Dashboard |
|:---:|:---:|:---:|
| Role selection + FIFA branding | Multilingual chat + quick prompts | Real-time crowd heatmap |

| Volunteer Assistant | Emergency Mode | Stadium Map |
|:---:|:---:|:---:|
| Incident reporting + AI summaries | Emergency protocols + 911 | Interactive Leaflet map |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript 5, Vite, TailwindCSS |
| **State Management** | Zustand |
| **Charts** | Recharts (bar, radar) |
| **Maps** | React Leaflet + OpenStreetMap |
| **Animations** | Framer Motion |
| **Backend** | FastAPI, Python 3.11+ |
| **ORM** | SQLAlchemy 2.0 (async) |
| **Database** | SQLite (via aiosqlite) |
| **AI** | Google Gemini 2.0 Flash |
| **Testing** | pytest + pytest-asyncio + pytest-cov (backend), Vitest (frontend) |
| **Deployment** | Docker, Docker Compose, GitHub Actions CI/CD |

---

## 📁 Folder Structure

```
stadiumPilot-ai/
├── README.md
├── .env.example
├── .gitignore
│
├── backend/
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py              # FastAPI app + startup
│   │   ├── config.py            # Pydantic settings
│   │   ├── database.py          # Async SQLAlchemy setup
│   │   ├── api/
│   │   │   ├── chat.py          # Chat endpoints
│   │   │   ├── incidents.py     # Incident CRUD
│   │   │   ├── crowd.py         # Crowd data endpoints
│   │   │   └── dashboard.py     # Staff/organizer dashboards
│   │   ├── models/
│   │   │   ├── chat.py          # ChatMessage ORM model
│   │   │   ├── incident.py      # Incident ORM model
│   │   │   └── crowd.py         # CrowdSnapshot ORM model
│   │   ├── schemas/
│   │   │   ├── chat.py          # Chat Pydantic schemas
│   │   │   ├── incident.py      # Incident schemas
│   │   │   ├── crowd.py         # Crowd schemas
│   │   │   └── dashboard.py     # Dashboard schemas
│   │   ├── services/
│   │   │   └── ai_service.py    # Gemini AI service
│   │   ├── prompts/
│   │   │   └── templates.py     # All AI prompt templates
│   │   └── data/
│   │       └── mock_data.py     # Mock crowd/transport/emergency data
│   └── tests/
│       ├── conftest.py          # Test fixtures
│       ├── test_health.py
│       ├── test_chat.py
│       ├── test_incidents.py
│       └── test_crowd.py
│
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.tsx             # React entry point
        ├── App.tsx              # Router + layout
        ├── index.css            # Global styles + Tailwind
        ├── api/
        │   ├── client.ts        # Axios client
        │   ├── chat.ts          # Chat API calls
        │   ├── incidents.ts     # Incidents API calls
        │   ├── crowd.ts         # Crowd API calls
        │   └── dashboard.ts     # Dashboard API calls
        ├── components/
        │   ├── chat/
        │   │   └── ChatInterface.tsx   # Main AI chat UI
        │   ├── crowd/
        │   │   ├── CrowdHeatmap.tsx    # Recharts bar chart
        │   │   └── ZoneCard.tsx        # Zone density card
        │   ├── layout/
        │   │   ├── Layout.tsx          # App shell
        │   │   ├── Header.tsx          # Top navigation
        │   │   ├── Sidebar.tsx         # Side navigation
        │   │   └── AccessibilityBar.tsx
        │   └── ui/
        │       ├── AlertCard.tsx
        │       ├── DensityBadge.tsx
        │       ├── LanguageSelector.tsx
        │       └── LoadingSpinner.tsx
        ├── hooks/
        │   ├── useChat.ts              # Chat state + API hook
        │   └── useDashboard.ts         # Dashboard data hooks
        ├── pages/
        │   ├── LandingPage.tsx
        │   ├── FanPage.tsx
        │   ├── VolunteerPage.tsx
        │   ├── StaffPage.tsx
        │   ├── OrganizerPage.tsx
        │   ├── EmergencyPage.tsx
        │   └── MapPage.tsx
        ├── store/
        │   ├── appStore.ts             # Global app state (Zustand)
        │   └── chatStore.ts            # Chat history state
        ├── types/
        │   └── index.ts                # All TypeScript types
        ├── utils/
        │   ├── helpers.ts              # Utility functions
        │   └── i18n.ts                 # Translations + language utils
        └── test/
            ├── setup.ts
            ├── helpers.test.ts
            └── i18n.test.ts
```

---

## 📖 Additional Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** – Cloud deployment guides (Docker, Cloud Run, Railway, Vercel)
- **[CONTRIBUTING.md](CONTRIBUTING.md)** – Development setup and contribution guidelines
- **[API Docs](http://localhost:8000/docs)** – Interactive Swagger UI (when running locally)

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Google Gemini API Key ([Get one free](https://aistudio.google.com/app/apikey))

### 1. Clone the repository
```bash
git clone https://github.com/your-username/stadiumPilot-ai.git
cd stadiumPilot-ai
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp ../.env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp ../.env.example .env.local
# Edit .env.local and set VITE_API_BASE_URL=http://localhost:8000
```

### 4. Environment Variables

Copy `.env.example` to `.env` (backend) and `.env.local` (frontend):

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | **Yes** |
| `DATABASE_URL` | SQLite URL | No (default: SQLite) |
| `SECRET_KEY` | App secret key | No (change in prod) |
| `ALLOWED_ORIGINS` | CORS origins | No |
| `VITE_API_BASE_URL` | Backend API URL | No (default: localhost:8000) |

> **Note**: The app works in **Demo Mode** without a Gemini API key, with placeholder responses.

### 5. Run the Application

**Backend:**
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**API Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 🌍 Multilingual Support

The AI responds in the user's selected language. UI labels are pre-translated:

| Language | Code | AI Translation | UI Labels |
|----------|------|---------------|-----------|
| English | `en` | ✅ | ✅ |
| Spanish | `es` | ✅ | ✅ |
| French | `fr` | ✅ | ✅ |
| Portuguese | `pt` | ✅ | ✅ |
| Arabic | `ar` | ✅ + RTL layout | ✅ |
| Hindi | `hi` | ✅ | ✅ |

---

## ♿ Accessibility Features

- **Skip to content** link for keyboard users
- **ARIA labels** on all interactive elements
- **Role attributes** for dynamic content (chat log uses `aria-live="polite"`)
- **High contrast mode** toggle
- **Large text mode** toggle
- **Screen reader mode** toggle
- **Keyboard navigation** throughout
- **Wheelchair-friendly routing** in AI responses
- **Voice input placeholder** (UI ready for Web Speech API)

---

## 🌱 Sustainability Features

StadiumPilot AI actively promotes sustainability:
- 💧 Water refill station recommendations
- 🚌 Green transport options (subway, bike share, shuttle)
- 🚶 Walking recommendations for short distances
- ♻️ Waste segregation guidance
- 🌱 Carbon footprint comparison for transport options

---

## 📊 Sample AI Conversations

### Fan – Navigation
```
User: Where is my seat? Section 102, Row 8, Seat 14
AI: Your seat is in Section 102 (Lower Level East Side), Row 8, Seat 14.
    From Gate B, walk straight ahead and take the first right past the food court.
    Your section entrance is clearly marked with blue signage.
    Estimated walk time: 3 minutes.
    Would you like directions to the nearest restroom on the way?
```

### Fan – Multilingual (Arabic)
```
User: أين أقرب دورة مياه؟
AI: أقرب دورة مياه تقع في الجناح الغربي - الطابق الأول، على بُعد حوالي 50 متراً من موقعك الحالي.
    هناك طابور قصير حالياً (حوالي 3 دقائق انتظار).
    البديل الأقرب هو دورة مياه الجناح الشرقي وهي أقل ازدحاماً الآن.
```

### Volunteer – Lost Child
```
User: I found a lost child near Gate C, she's about 6 years old
AI: Activate Lost Child Protocol immediately:
    1. Stay calm and reassure the child – do NOT leave her alone
    2. Escort her to the nearest Security Point (Gate C has one)
    3. Radio supervisor: 'Code Purple at Gate C'
    4. Get a description: name, parents' names, what they're wearing
    5. DO NOT announce on PA yet – wait for supervisor authorization
    I'll generate an incident report. Can you provide her description?
```

### Organizer – Decision Support
```
User: What are the top decisions I need to make right now?
AI: Based on current crowd data, here are your top 3 decisions:
    1. URGENT: Open Gate D immediately – Gate A is at 95% capacity with 320 people queuing
    2. DEPLOY: 12 additional staff to North Concourse – queue length at 145 and rising
    3. DISPATCH: 3 additional shuttle buses from Lot C – Parking A at 90% full
```

---

## 🔮 Future Improvements

- [ ] **Real-time WebSocket** updates for live crowd changes
- [ ] **Voice I/O** via Web Speech API + text-to-speech
- [ ] **Computer Vision** integration for automated crowd counting
- [ ] **Push Notifications** for critical alerts
- [ ] **Offline Mode** with service worker
- [ ] **AR Navigation** overlay for in-stadium wayfinding
- [ ] **Predictive Analytics** for crowd flow forecasting
- [ ] **Multi-stadium** support with venue switching
- [ ] **Integration** with official FIFA ticketing and transport APIs
- [ ] **Wearable support** for volunteer smartwatches

---

## ⚠️ Assumptions

1. Stadium zones and facility locations are based on MetLife Stadium as a representative FIFA 2026 venue
2. Crowd data is simulated – in production, this would come from sensor networks, CCTV analytics, or ticketing systems
3. The Gemini API key must be obtained from [Google AI Studio](https://aistudio.google.com/)
4. Emergency contacts use US numbers (911) – production would localize per host country
5. Transport data is mock – production would integrate with transit authority APIs

---

## 📄 License

MIT License – see [LICENSE](LICENSE) file for details.

---

## 🏆 About This Project

Built for the **FIFA World Cup 2026 GenAI Challenge**. StadiumPilot AI demonstrates how Generative AI can transform large-scale event management, making stadium experiences safer, smarter, and more accessible for everyone.

---

*Made with ⚽ for FIFA World Cup 2026 · Powered by Google Gemini*
