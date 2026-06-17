# StartupForge AI Mobile

> "Turn Ideas Into Funded Startups"

StartupForge AI Mobile is a production-ready, enterprise-grade mobile application and accelerator SaaS platform. The system helps startup founders transform ideas into investor-ready companies through AI agent swarms, vector-database semantic search (RAG), and machine learning predictive engines.

---

## 🏗️ Architecture Monorepo Layout

```
STARTUPFORGE-AI-MOBILE-APPLICATION/
├── docker-compose.yml              # Local orchestration services setup
├── .github/workflows/ci-cd.yml     # Github Action build checks
├── mobile/                         # React Native Expo app client
└── backend/                        # Node.js TypeScript REST Express API server
└── ai-service/                     # Python FastAPI LangChain agent swarm
└── ml-service/                     # Python FastAPI ML predictive models
```

---

## ⚡ Quick Start Instructions

To spin up the complete accelerator ecosystem, execute the following commands:

### 1. Build and boot backend microservices
Make sure Docker Desktop is active on your device, then run:
```bash
docker-compose up --build
```
This spins up:
- **MongoDB database** (`localhost:27017`)
- **Redis cache server** (`localhost:6379`)
- **Backend API server** (`localhost:5000`)
- **FastAPI AI Swarm worker** (`localhost:8000`)
- **FastAPI ML prediction server** (`localhost:8001`)

### 2. Boot Mobile Client (Expo)
```bash
cd mobile
npm install
npm run android # or 'npm run ios' / 'npm run web'
```

---

## 🛡️ Service Descriptions

### 1. [Mobile Client](file:///d:/work/STARTUPFORGE%20AI%20MOBILE%20APPLICATION/mobile)
- **Framework**: React Native with Expo SDK.
- **State management**: Zustand stores for user profile and workspace caches.
- **Routing**: React Navigation (Tab bars & tool screens tree).
- **Theme**: Premium accelerator color system (#FF6B00 primary over dark glass background).

### 2. [Backend API Server](file:///d:/work/STARTUPFORGE%20AI%20MOBILE%20APPLICATION/backend)
- **Database**: MongoDB Mongoose schemas + Redis key-value pairs (presence mapping, cache endpoints).
- **Billing**: Stripe Checkout sessions & subscription webhook listeners.
- **Real-time**: Socket.io manager managing team threads, messages, and typing triggers.

### 3. [AI LangChain Swarm Service](file:///d:/work/STARTUPFORGE%20AI%20MOBILE%20APPLICATION/ai-service)
- **Engine**: Gemini 2.5 Pro via LangChain Expression Language (LCEL).
- **Agents**: Startup Validator, Market Analyst, Competitor sweeps (using Tavily search), Slide outline drafts.
- **RAG Core**: Document loader that chunk-splits PDFs, calculates Google Gemini embeddings, and upserts indexes in Pinecone.

### 4. [ML Predictor Service](file:///d:/work/STARTUPFORGE%20AI%20MOBILE%20APPLICATION/ml-service)
- **Predictors**: Scikit-Learn classifiers and XGBoost models for:
  - Startup success probability metrics
  - 36-month linear cash runway forecasts
  - Cofounder skill vector similarity (cosine math)
  - Investor matching criteria
