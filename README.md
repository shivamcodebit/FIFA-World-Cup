# ⚽ StadiumPilot AI
### GenAI Smart Stadium Copilot for FIFA World Cup 2026™

[![Python](https://img.shields.io/badge/Python-3.11%2B-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> **StadiumPilot AI** is a specialized Generative AI solution designed to transform the FIFA World Cup 2026™ stadium experience. It provides intelligent, context-aware assistance for fans, volunteers, staff, and organizers.

---

## 🚀 Project Highlights
* **Context-Aware Intelligence**: Leverages role-based prompting to provide tailored guidance for different stadium personas.
* **Demo Mode**: Fully functional prototype that operates without an API key by using simulated AI responses.
* **Multilingual Interface**: Built-in support for international fans including Arabic, Hindi, Spanish, and more.
* **Operational Intelligence**: Real-time crowd and incident management workflows.

---

## 🎯 Challenge Alignment
StadiumPilot AI addresses key operational pillars for FIFA World Cup 2026:
* **Smart Assistant**: Contextual, role-specific chat for all users.
* **Crowd Management**: Real-time density monitoring and hotspot detection.
* **Accessibility**: Specialized routing and assistance for fans with disabilities.
* **Multilingual Support**: Native-language support for diverse global fanbases.
* **Transportation**: Real-time guidance for parking, shuttles, and public transit.
* **Sustainability**: Recommendations for water refills and eco-friendly transport.
* **Operational Intelligence**: Data-driven cleaning and restocking tasks[cite: 1].
* **Decision Support**: AI-generated strategic recommendations for organizers[cite: 1].

---

## 💡 Why Generative AI?
Traditional stadium applications rely on rigid, hardcoded logic that struggles to adapt to the dynamic, high-pressure environment of a World Cup. Generative AI allows the system to:
* **Understand Intent**: Decode complex user queries beyond simple keyword matching[cite: 1].
* **Dynamic Response**: Provide situation-aware protocols rather than static text[cite: 1].
* **Synthesize Data**: Convert raw sensor data into actionable human-readable insights[cite: 1].

---

## 🏗️ Architecture
The system follows a modern decoupled architecture designed for scale and reliability[cite: 1].

* **Frontend**: Built with React, TypeScript, and Vite for a responsive, high-performance UI[cite: 1].
* **Backend**: FastAPI handles RESTful requests and orchestration with an asynchronous SQLAlchemy layer[cite: 1].
* **Data Layer**: Uses SQLite for lightweight, reliable local data storage[cite: 1].
* **AI Integration**: Google Gemini API enhances responses; however, the project is fully usable in **Demo Mode** if the API is unavailable or quotas are exhausted[cite: 1].

---

## 🤖 AI Workflow
The system utilizes Google Gemini 2.0 Flash to process inputs based on specific persona templates[cite: 1].

1. **Role Detection**: The system identifies the user as Fan, Volunteer, Staff, or Organizer[cite: 1].
2. **Context Injection**: Current location, crowd data, and conversation history are passed to the model[cite: 1].
3. **Prompt Execution**: Role-specific system prompts generate contextual answers and actionable UI chips[cite: 1].
4. **Structured Output**: For dashboards, the AI generates structured JSON for real-time data visualization[cite: 1].

---

## 💻 Installation & Setup

### Prerequisites
* Python 3.11 or 3.12
* Node.js 18+
* Docker & Docker Compose (for production)

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/shivamcodebit/FIFA-World-Cup
   cd FIFA-World-Cup
   ```

### Production Deployment
To deploy in a production environment using Docker:
1. Create a `.env` file in the `backend` directory based on `.env.example`.
2. **Critical Security Step**: Set `SECRET_KEY` to a strong random string.
3. Add your `GEMINI_API_KEY` for full AI functionality.
4. Set `ENVIRONMENT=production`.
5. Run `docker-compose up -d --build`. Nginx will proxy `/api/` traffic automatically.
