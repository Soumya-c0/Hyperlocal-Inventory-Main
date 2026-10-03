# Hyperlocal Inventory Synthesizer

**Autonomous spatial morphing and carbon-optimized inventory routing platform for quick-commerce logistics.**

Quick-commerce platforms lose revenue when unpredictable neighborhood demand causes sudden stockouts or spoilage, while static delivery boundaries and disconnected route planning lead to SLA breaches and unaccounted carbon output. This project builds an integrated platform that predicts hyperlocal demand, autonomously rebalances inventory, dynamically adjusts delivery zones, and ranks delivery routes by real predicted carbon emissions tracked in a live, auditable ledger.

---

## Implemented Features

- **Carbon-aware multi-route optimization** — queries OSRM for real street geometry (direct + detour routes), engineers a genuine per-route gradient from live elevation data (Open-Elevation API, 8-point sampling), and ranks routes by CO2 predicted from a trained XGBoost regressor.
- **XGBoost carbon regression microservice** (FastAPI) — trained on the NREL Fleet DNA dataset with a physics-bound synthetic target (weight, gradient, distance → CO2), served via a `/predict-emissions` endpoint.
- **Courier Dashboard** — live map with selected OSRM route, route-selection cards (eco vs. standard, each with real distance/CO2), live SLA countdown timer, and drop-off confirmation.
- **Manager Dashboard** — live map with custom warehouse markers, a delivery-radius boundary around the local hub, active dispatch manifest, warehouse stock levels, and a running total emissions-saved counter.
- **Emissions Ledger service** (Java) — accumulates emissions saved across every completed delivery platform-wide, polled live by the manager dashboard.
- **Carbon-optimized route selection algorithm** — fully documented pseudocode/math model (see `/docs`).
- **PostgreSQL + PostGIS persistence layer** — relational schema for users, warehouses, inventory, orders, and deliveries (see ER diagram in `/docs`); currently the system runs without persistent storage.
- **Redis distributed locking** — concurrency-safe checkout to prevent double-selling the last unit of a SKU (`SETNX`-based mutual exclusion); designed, not yet wired into the repo.
- **Spring Security + JWT** — role-based access control separating Manager, Courier, and Customer permissions.
- **DBSCAN spatial clustering** — detects geographically concentrated demand surges in micro-markets.
- **Dynamic PostGIS polygon morphing** — auto-redraws warehouse delivery boundaries based on live demand clusters (currently a static radius).
- **Agentic AI orchestration layer** — LangChain + Llama-3 reasoning/resolution agents, grounded via a ChromaDB historical-sales RAG store, to autonomously trigger inter-warehouse stock transfers.
- **Digital twin replay simulator** — replays historical telemetry to analyze route drift over time.

---

## Architecture

```
Frontend (Next.js)  →  Spring Boot REST API (backend-core)  →  OSRM (public API)
                                     ↓                                ↓
                          FastAPI + XGBoost (backend-ml)  ←———————————┘
                                     ↓
                          PostgreSQL/PostGIS + Redis
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, React-Leaflet |
| Backend Core | Java, Spring Boot |
| ML Engine | Python, FastAPI, XGBoost |
| Routing | OSRM (public API), Open-Elevation API |
| Persistence | PostgreSQL, PostGIS, Redis |
| Agentic AI | LangChain, Llama-3, ChromaDB |

## API Endpoints

| Method | Endpoint | Service | Purpose |
|---|---|---|---|
| GET | `/api/routing/options` | backend-core | Ranked route options with predicted CO2 |
| POST | `/api/ledger/record-delivery` | backend-core | Records emissions saved from a completed delivery |
| GET | `/api/ledger/total-saved` | backend-core | Running total emissions saved |
| POST | `/api/ledger/reset` | backend-core | Resets the ledger total to 0 |
| POST | `/predict-emissions` | backend-ml | XGBoost CO2 prediction from weight, gradient, distance |

## Project Structure

```
Hyperlocal-Inventory-Main/
├── backend-core/    
├── backend-ml/       
├── frontend/         
└── docker-compose.yml
```

## Running the Project

**1. ML service**
```bash
cd backend-ml
pip install -r requirements.txt --break-system-packages
python train_model.py
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**2. Backend core**
```bash
cd backend-core
./mvnw spring-boot:run
```

**3. Frontend**
```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" >> .env.local
npm run dev
```

## Dataset Credits

- **XGBoost training data:** [NREL Fleet DNA Project](https://www.nrel.gov/transportation/fleettest-fleet-dna)
- **Planned DBSCAN clustering:** Porto Taxi Trajectory Dataset, Microsoft Geolife GPS Trajectories (Kaggle)

---
