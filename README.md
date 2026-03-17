# MediFlow SaaS Platform

Welcome to the MediFlow Monorepo! This platform consists of a NestJS backend, a Python AI engine, 6 React frontend applications, and a Dockerized infrastructure layer (PostgreSQL + Redis).

## Prerequisites
- **Node.js** v20+ (required for Tailwind CSS v4)
- **Python** 3.9+
- **Docker** and **Docker Compose**

---

## 🚀 Run Everything in a Single Command

```bash
cd mediflow_platform
./start.sh
```

This single script will:
1. Start **Docker** containers (PostgreSQL + Redis)
2. Install dependencies & push the Prisma schema
3. Start the **NestJS Backend** on `:3000`
4. Start the **Python AI Engine** on `:8000`
5. Start all **6 React Frontends** on `:5173` – `:5178`

Then open **[http://localhost:3000](http://localhost:3000)** — the **Unified MediFlow Gateway** with role-based cards linking to every dashboard.

---

## 📖 Manual Setup (Step by Step)

If you prefer to start things individually:

### 1. Infrastructure (Databases)
```bash
cd mediflow_platform
docker-compose up -d
```

### 2. Backend (NestJS → `:3000`)
```bash
cd backend
npm install
npx prisma db push
npx prisma generate
npm run start:dev
```

### 3. AI Engine (FastAPI → `:8000`)
```bash
cd ai_engine
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn pydantic scikit-learn numpy
uvicorn main:app --reload --port 8000
```

### 4. Frontend Portals (React/Vite)
Open a separate terminal for each:

| Portal | Command | URL |
|--------|---------|-----|
| Patient Portal | `cd frontend/patient_portal && npm run dev` | [localhost:5173](http://localhost:5173) |
| Reception Desk | `cd frontend/reception_dashboard && npm run dev` | [localhost:5174](http://localhost:5174) |
| Doctor Dashboard | `cd frontend/doctor_dashboard && npm run dev` | [localhost:5175](http://localhost:5175) |
| Pharmacy Portal | `cd frontend/pharmacy_portal && npm run dev` | [localhost:5176](http://localhost:5176) |
| Lab Portal | `cd frontend/lab_portal && npm run dev` | [localhost:5177](http://localhost:5177) |
| Admin Dashboard | `cd frontend/admin_dashboard && npm run dev` | [localhost:5178](http://localhost:5178) |

---

## 🏗️ Architecture

```
mediflow_platform/
├── backend/          → NestJS API + WebSocket + Prisma (Port 3000)
│   └── public/       → Unified Gateway Landing Page
├── ai_engine/        → FastAPI ML Risk Engine (Port 8000)
├── frontend/
│   ├── patient_portal/       → Doctor Search & Booking (5173)
│   ├── reception_dashboard/  → Live Queue & Tokens   (5174)
│   ├── doctor_dashboard/     → EMR & Telemedicine     (5175)
│   ├── pharmacy_portal/      → E-Prescriptions        (5176)
│   ├── lab_portal/           → Lab Orders & Results    (5177)
│   └── admin_dashboard/      → KPIs & Analytics        (5178)
├── docker-compose.yml → PostgreSQL + Redis
└── start.sh           → One-command startup
```

## 🛠️ Testing the WebSocket Queue
```bash
curl -X POST http://localhost:3000/queue/join \
  -H "Content-Type: application/json" \
  -d '{"appointmentId": "mock-apt-1", "doctorId": "doc-1", "patientName": "John Doe"}'
```

## 🧠 Testing the AI Engine
```bash
curl -X POST http://localhost:8000/predict-risk \
  -H "Content-Type: application/json" \
  -d '{"patientId": "p1", "weight_kg": 85, "height_cm": 170, "systolic_bp": 145, "diastolic_bp": 92, "fasting_sugar_mg_dl": 130, "age": 55}'
```
