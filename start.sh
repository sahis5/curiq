#!/bin/bash
# ──────────────────────────────────────────────────────
#  MediFlow Platform — One-Shot Startup Script
#  Starts: Docker → Backend → AI Engine → 6 Frontends
# ──────────────────────────────────────────────────────

set -e
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "⚕  MediFlow Platform — Starting All Services..."
echo "──────────────────────────────────────────────────"

# 1. Infrastructure
echo "🏗️  Starting Docker containers (Postgres + Redis)..."
docker-compose -f "$ROOT_DIR/docker-compose.yml" up -d

# 2. Backend
echo "⚙️  Starting NestJS Backend on :3000..."
cd "$ROOT_DIR/backend"
npm install --silent
npx prisma generate --schema=./prisma/schema.prisma
npx prisma db push --schema=./prisma/schema.prisma --accept-data-loss
npm run start:dev &
BACKEND_PID=$!
sleep 5

# 3. AI Engine
echo "🧠  Starting AI Engine on :8000..."
cd "$ROOT_DIR/ai_engine"
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi
source venv/bin/activate
pip install -q fastapi uvicorn pydantic scikit-learn numpy
uvicorn main:app --host 0.0.0.0 --port 8000 &
AI_PID=$!
deactivate 2>/dev/null || true
sleep 2

# 4. Frontend Portals
PORTALS=("patient_portal:5173" "reception_dashboard:5174" "doctor_dashboard:5175" "pharmacy_portal:5176" "lab_portal:5177" "admin_dashboard:5178")

for entry in "${PORTALS[@]}"; do
  NAME="${entry%%:*}"
  PORT="${entry##*:}"
  echo "🖥️  Starting $NAME on :$PORT..."
  cd "$ROOT_DIR/frontend/$NAME"
  npm run dev -- --port "$PORT" &
done

echo ""
echo "══════════════════════════════════════════════════"
echo "✅  All MediFlow services are starting!"
echo ""
echo "  🚀  Gateway:      http://localhost:3000"
echo "  📡  Backend API:   http://localhost:3000"
echo "  🧠  AI Engine:     http://localhost:8000"
echo ""
echo "  🏥  Patient:       http://localhost:5173"
echo "  📋  Reception:     http://localhost:5174"
echo "  🩺  Doctor:        http://localhost:5175"
echo "  💊  Pharmacy:      http://localhost:5176"
echo "  🔬  Lab:           http://localhost:5177"
echo "  ⚙️   Admin:         http://localhost:5178"
echo "══════════════════════════════════════════════════"
echo ""
echo "Press Ctrl+C to stop all services."

# Wait for all background processes
wait
