# 🔭 INFRA OBSERVATORY

> **Unified Observability Platform for the INFRA Ecosystem**

Enterprise-grade observability platform that centralizes logs, metrics, traces, and alerts across all 9 INFRA platforms with projected revenue of $4.5B+.

![INFRA Observatory](docs/images/dashboard-preview.png)

## 🌟 Features

- **Unified Dashboard** - Real-time monitoring across all INFRA platforms
- **Log Management** - Centralized log search, filtering, and live tail
- **Metrics Explorer** - Time-series metrics with custom queries
- **Distributed Tracing** - End-to-end request tracing across services
- **Smart Alerting** - Threshold, anomaly detection, and SLO-based alerts
- **SLO Management** - Define and track Service Level Objectives
- **Custom Dashboards** - Build and share custom dashboards
- **Cost Attribution** - Track infrastructure costs by platform/service

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        INFRA OBSERVATORY                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Frontend   │  │   Backend    │  │   Workers    │          │
│  │  (Next.js)   │──│  (FastAPI)   │──│  (Celery)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                 │                 │                   │
│         └─────────────────┼─────────────────┘                   │
│                           │                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  PostgreSQL  │  │    Redis     │  │  Prometheus  │          │
│  │ (TimescaleDB)│  │   (Cache)    │  │  (Metrics)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Monitored Platforms

| Platform | Code | Criticality | Est. Services |
|----------|------|-------------|---------------|
| INFRABANK | `infrabank` | 🔴 Critical | 25-40 |
| INFRA PAY & TREASURY | `infrapay` | 🔴 Critical | 15-25 |
| INFRA VAULT CORE | `infravault` | 🔴 Critical | 20-30 |
| INFRA DIGITAL ASSETS | `infradigital` | 🔴 Critical | 30-50 |
| INFRACOINN | `infracoinn` | 🟡 High | 15-20 |
| INFRA Dev·Tech | `infradevtech` | 🟡 High | 20-35 |
| INFRA FORGE | `infraforge` | 🟢 Medium | 10-15 |
| INFRA Global Insurance | `infrainsurance` | 🔴 Critical | 40-60 |
| INFRA SCHOOL | `infraschool` | 🟢 Medium | 15-25 |

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 15+ (with TimescaleDB)
- Redis 7+

### Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/infra-group/infra-observatory.git
cd infra-observatory
```

2. **Start infrastructure services**
```bash
cd docker
docker-compose -f docker-compose.dev.yml up -d
```

3. **Set up the backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
uvicorn app.main:app --reload
```

4. **Set up the frontend**
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

5. **Seed the database**
```bash
cd scripts
python seed.py
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Production Deployment

```bash
cd docker
docker-compose up -d
```

## 📁 Project Structure

```
INFRA-OBSERVATORY/
├── frontend/          # Next.js 14 frontend
│   ├── app/          # App router pages
│   ├── components/   # React components
│   ├── lib/          # Utilities
│   ├── hooks/        # Custom hooks
│   ├── stores/       # Zustand stores
│   └── types/        # TypeScript types
│
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── models/   # SQLAlchemy models
│   │   ├── schemas/  # Pydantic schemas
│   │   ├── routers/  # API endpoints
│   │   ├── services/ # Business logic
│   │   └── workers/  # Celery tasks
│   └── tests/
│
├── docker/            # Docker configurations
├── docs/              # Documentation
└── scripts/           # Utility scripts
```

## 🎨 Design System

The platform uses a consistent dark theme with:

- **Primary Accent**: Cyan (#00d4ff)
- **Secondary Accent**: Purple (#7c3aed)
- **Background**: Deep black with blue undertones
- **Glassmorphism**: Translucent panels with blur
- **Status Colors**: Green (healthy), Amber (warning), Red (critical)

## 📡 API Reference

### Overview
- `GET /api/v1/overview` - System overview
- `GET /api/v1/overview/health-score` - Global health score

### Platforms
- `GET /api/v1/platforms` - List platforms
- `GET /api/v1/platforms/{code}` - Get platform details
- `GET /api/v1/platforms/{code}/services` - Get platform services

### Services
- `GET /api/v1/services` - List services
- `GET /api/v1/services/{id}` - Get service details

### Logs, Metrics, Traces
- `GET /api/v1/logs` - Search logs
- `GET /api/v1/metrics/query` - Query metrics
- `GET /api/v1/traces` - Search traces

## 🔒 Security

- JWT-based authentication
- Role-based access control (Admin, Operator, Viewer)
- SSO integration with INFRA IAM
- Audit logging
- Rate limiting

## 📈 Roadmap

- [ ] Machine learning-based anomaly detection
- [ ] Automated incident response
- [ ] FinOps cost optimization recommendations
- [ ] Mobile app (iOS/Android)
- [ ] Custom plugin system

## 🤝 Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

## 📄 License

Proprietary - INFRA Group © 2024

---

Built with ❤️ by the INFRA Platform Engineering Team
