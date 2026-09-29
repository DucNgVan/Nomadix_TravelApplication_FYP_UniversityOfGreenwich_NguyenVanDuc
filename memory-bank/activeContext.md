# Active Context: Current State & Immediate Focus

## 1. Current Project State

### 1.1 Academic Milestone: Week 1 Analysis & Design Completed (100%)
* **Institution:** University of Greenwich (BSc Computing FYP).
* **Scope Refinement:** Successfully expanded from solo travel into **Collaborative Squad Travel & Group Expense Splitting**.
* **Documentation Synchronization:** 100% of documentation across all 6 phases has been thoroughly updated and cross-linked:
  * **Phase 1 (Foundation):** 7 core modules, 4 personas, 7 value pillars, 22-step MVP verification script.
  * **Phase 2 (Requirements):** 42 Functional Requirements (`FR-01` to `FR-42`), 35 User Stories, 17 BDD Gherkin scenarios, and detailed BDD specifications in `08-detailed-collaborative-planning-and-expense-sharing-specs.md`.
  * **Phase 3 (Use Cases):** 5 system actors (including Trip Companion), 22 use cases, 10 deep-dive UML specifications.
  * **Phase 4 (Architecture):** 5-Tier Architecture, 6 sequence diagrams (including Companion Invite/Sync and Group Expense Bill Upload & Settlement).
  * **Phase 5 (Tech Research):** Technology stack evaluation with Greedy Minimum Cash-Flow algorithm ($O(N \log N)$), Cloudinary bill receipts storage.
  * **Phase 6 (Database Analysis):** Master Polyglot Schema (28 PostgreSQL 16 tables in 3NF, 4 MongoDB Atlas collections, Redis key taxonomy, production DDL script, and `08-group-expenses-and-collaboration-erd.md`).

### 1.2 Skills Infrastructure: 24 Specialized Skills Configured
The project's local agent skills ecosystem at `.agents/skills/` has been fully populated with 24 production-grade capabilities:
1. **React Native & Mobile:** `react-native-architecture`, `mobile-developer`, `react-state-management`, `frontend-mobile-development-component-scaffold`.
2. **Node.js, Express & Architecture:** `nodejs-backend-patterns`, `javascript-pro`, `typescript-pro`, `api-design-principles`, `backend-security-coder`.
3. **PostgreSQL & Relational:** `postgresql`, `sql-pro`, `database-migrations-sql-migrations`, `sql-optimization-patterns`.
4. **MongoDB & NoSQL:** `database-architect`, `database-optimizer`.
5. **Extreme Programming & TDD:** `tdd-orchestrator`, `tdd-workflows-tdd-cycle`, `tdd-workflows-tdd-red`, `tdd-workflows-tdd-green`, `tdd-workflows-tdd-refactor`, `javascript-testing-patterns`, `unit-testing-test-generate`, `e2e-testing-patterns`.
6. **Project Memory:** `memory-bank`.

---

## 2. Recent Key Decisions & Design Consensus

1. **ACID Ledger for Group Financials:**
   * Handled in **PostgreSQL 16** (`trip_members`, `trip_expenses`, `trip_expense_splits`, `trip_settlements`) using `NUMERIC(12, 2)` and explicit database transactions (`BEGIN...COMMIT`) to eliminate floating-point rounding errors and avoid multi-document MongoDB transaction latency.
2. **Sub-15ms Dynamic Itinerary Reads in MongoDB:**
   * Itinerary timelines remain in **MongoDB Atlas 7.0**, embedding both multi-day stops and squad collaborators (`collaborators: [{ userId, role, status, joinedAt }]`).
3. **Greedy Minimum Cash-Flow Reduction Algorithm:**
   * Debt settlements are calculated using two Priority Queues (Debtors & Creditors) in $O(N \log N)$ time, condensing tangled multi-member debts to at most $N-1$ direct payments while preserving the net balance invariant $\sum \text{NetBalance}_i = 0$.
4. **Cloudinary Asset Folder Partitioning:**
   * Bill receipts are uploaded to `/nomadix/receipts/{tripId}/` with client-side image compression ($< 1\text{MB}$) and automated WebP transformation.

---

## 3. Active Sprint & Execution Status (Week 2 — Sprint 1)

### 3.1 Completed Actions (Scaffolding & Module 1 TDD Complete)
* [x] **Polyglot Infrastructure Setup:**
  * Created `docker-compose.yml` (PostgreSQL 16, MongoDB 7.0, Redis 7.0).
  * Generated `docker/init-db/01-init.sql` with full 28 tables in 3NF and seed roles.
  * Configured `.env.example` and `.env`.
* [x] **Backend Server Initialization:**
  * Created `server/package.json` and installed dependencies (`express`, `pg`, `mongoose`, `ioredis`, `bcrypt`, `jsonwebtoken`, `joi`, `supertest`, `jest`).
  * Configured `server/jest.config.js` with $\ge 80\%$ global coverage thresholds.
* [x] **Module 1 (Auth & RBAC) TDD RED Phase:**
  * Created 4 test suites covering 13 test cases:
    1. `server/tests/unit/utils/password.test.js` (`RED-01`, `RED-02`, `RED-03` - Bcrypt 12 rounds)
    2. `server/tests/unit/services/token.service.test.js` (`RED-04`, `RED-05`, `RED-06`, `RED-07` - JWT & SHA-256 tokens)
    3. `server/tests/integration/auth.register.test.js` (`RED-08`, `RED-09`, `RED-10`, `RED-08b` - Registration & validation)
    4. `server/tests/integration/auth.login.test.js` (`RED-11`, `RED-12`, `RED-13` - Login & error handling)
  * Confirmed RED state failure.
* [x] **Module 1 (Auth & RBAC) TDD GREEN & REFACTOR Phase:**
  * `server/src/utils/password.util.js`: Bcrypt 12-round hashing & constant-time password comparison.
  * `server/src/services/token.service.js`: JWT 15-minute access token generation/verification & SHA-256 refresh tokens.
  * `server/src/repositories/user.repository.js`: Dual-mode repository supporting PostgreSQL connection pool and in-memory test fallback.
  * `server/src/services/auth.service.js`: Register, login, conflict detection (409), credentials verification (401).
  * `server/src/middlewares/validate.middleware.js`: Joi DTO validation with 400 Bad Request envelope.
  * `server/src/controllers/auth.controller.js` & `server/src/routes/auth.routes.js`: Route endpoints for `/api/v1/auth/register` and `/api/v1/auth/login`.
  * `server/src/app.js`: Express application with helmet, cors, json body parsing, `/health` endpoint, and centralized error handler.
  * Verified 100% test pass: **6 test suites passed, 20 tests passed, 0 failed** in ~1.7s.
  * Verified test coverage: **100% Statements, 93.54% Branches, 100% Functions, 100% Lines** (all exceeding $\ge 80\%$ threshold).

* [x] **Module 2 (Smart Booking Aggregator - Flights & Hotels) TDD Complete:**
  * Configured `DUFFEL_API_TOKEN` in `.env` and `.env.example`.
  * `server/src/providers/duffel.provider.js`: Next-gen Duffel Flights & Stays API adapter with Bearer auth, custom duration parser, and currency normalizer.
  * `server/src/providers/mock.provider.js`: High-fidelity Vietnamese domestic flights (VNA, Vietjet, Bamboo) and domestic hotels (Vinpearl, Novotel, Haian, InterContinental).
  * `server/src/services/normalizer.service.js`: Normalizes heterogeneous raw flight/hotel offers to `UnifiedFlight` and `UnifiedHotel` with de-duplication favoring lowest price.
  * `server/src/services/cache.service.js`: Deterministic Redis Cache-Aside (`nomadix:flight:...` TTL 1800s, `nomadix:hotel:...` TTL 3600s) with in-memory fallback.
  * `server/src/services/booking.service.js`: Parallel query orchestration, cache hit/miss resolution, multi-facet filtering (`directOnly`, `maxPrice`, `minRating`), and multi-key sorting.
  * `server/src/middlewares/validate.middleware.js`: Joi query validation for flight search (IATA codes, non-identical airports, future departure date) and hotel search (date sequence, 4 guests/room capacity).
  * `server/src/controllers/flight.controller.js`, `hotel.controller.js`, and routes mounted on `/api/v1/flights` and `/api/v1/hotels`.
  * Verified 100% test pass: **13 test suites passed, 47 tests passed, 0 failed** in ~1.9s.
  * Verified test coverage: **98.9% Statements, 81.87% Branches, 98.57% Functions, 99.14% Lines** (all exceeding $\ge 80\%$ threshold).

* [x] **Module 3 (Collaborative Itinerary Planner & Maps) TDD Complete:**
  * `server/src/utils/geo.util.js`: Haversine great-circle distance algorithm on WGS84 ellipsoid & multi-modal transit duration calculator.
  * `server/src/middlewares/auth.middleware.js`: Bearer JWT token verification protecting itinerary endpoints.
  * `server/src/models/itinerary.model.js`: Mongoose Schema for MongoDB with embedded `days[]`, `items[]`, and `collaborators[]` (`OWNER`, `EDITOR`, `VIEWER`).
  * `server/src/repositories/itinerary.repository.js`: Dual-mode repository supporting MongoDB connection and in-memory test fallback.
  * `server/src/services/itinerary.service.js`: Itinerary creation, collaborator role authorization, stop addition with automatic Haversine distance, atomic drag-and-drop stop reordering, and soft/hard deletion.
  * `server/src/middlewares/validate.middleware.js`: Joi validation schemas for itinerary creation, collaborator invitations, stop additions, and timeline reordering.
  * `server/src/controllers/itinerary.controller.js` & `server/src/routes/itinerary.routes.js`: Routes mounted on `/api/v1/itineraries`.
  * Verified 100% test pass: **20 test suites passed, 70 tests passed, 0 failed** in ~2.4s.
  * Verified test coverage: **93.3% Statements, 80.37% Branches, 98.31% Functions, 93.3% Lines** (all exceeding $\ge 80\%$ threshold).

* [x] **Module 4 (Group Expense Tracking & Bill Splitting Hub) TDD Complete:**
  * `server/src/utils/debt.util.js`: Greedy Minimum Cash-Flow Reduction Algorithm ($O(N \log N)$) with zero-sum invariant verification ($\sum \text{NetBalance}_i = 0$) and greedy matching of maximum debtors to maximum creditors (reducing debt graphs to at most $N-1$ payments).
  * `server/src/providers/cloudinary.provider.js`: Receipt cloud storage provider with mock and production WebP fallback.
  * `server/src/repositories/expense.repository.js`: PostgreSQL dual-mode repository supporting atomic transactions (`BEGIN ... COMMIT / ROLLBACK`) and in-memory test fallback for `trip_expenses`, `trip_expense_splits`, and `trip_settlements`.
  * `server/src/services/expense.service.js`: Split calculations (`equal`, `exact`, `percentage`, `shares`), remainder cent/dong distribution without precision loss, expense summary balance sheet, debt settlement plan generator, and settle-up payment lifecycle.
  * `server/src/controllers/expense.controller.js` & `server/src/routes/expense.routes.js`: Full REST API mounted at `/api/v1/trips/:tripId/expenses` and `/api/v1/trips/:tripId/debts`.
  * Verified 100% test pass: **25 test suites passed, 97 tests passed, 0 failed** in ~1.8s.
  * Verified test coverage: **93.8% Statements, 80.45% Branches, 98.19% Functions, 93.85% Lines** (all exceeding $\ge 80\%$ threshold).

### 3.2 Current Active State & Next Immediate Action
* **Current State:** ✅ **Modules 1, 2, 3, and 4 TDD Cycles Complete & 100% Verified** (97/97 tests passing).
* **Next Immediate Action:** Ready for Navigator's instructions to begin Module 5 (Cultural Gamification & Location Engine — `MOD-05`), covering:
  * WGS84 Geofencing (`ST_DWithin` / Haversine $< 100\text{m}$) for cultural landmark check-ins.
  * Gamified Quiz Engine, XP progression, and Badge award triggers.
  * Step 2 Plan presentation and waiting for Navigator's 'Approved'.
