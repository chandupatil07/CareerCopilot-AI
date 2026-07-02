# DEVELOPMENT HANDOFF: CareerCopilot AI (Modules 2.0 & 3.0)

## 1. Module 2.0 & 3.0 Overview
We have successfully wrapped up the frontend SaaS dashboard workspace foundation and initialized the versioned Python FastAPI backend API server:
- **12 SaaS Subpage Modules:** Completed the dashboard workspace nodes: Dashboard, Resume Center, Applications, Interviews, AI Assistant, Cold Email, LinkedIn Builder, Career Analytics, Notifications, Profile, Settings, Support.
- **Collapsible Sidebar Layout:** Upgraded `Sidebar.jsx` and `DashboardLayout.jsx` with an `isCollapsed` state, allowing users to collapse the vertical navigation panel to 70px.
- **Client-Side State Storage Hook:** Created `useLocalStorage.jsx` and `mockDb.js` to persist application tracking entries, profile records, and system stats across browser reloads.
- **FastAPI ASGI Backend:** Setup the production-ready directory structure under `backend/app/` powered by FastAPI and Uvicorn.
- **CORS Config & Durations Telemetry:** Registered CORS policies allowing Vite React ports and added custom middleware auditing request durations.
- **Central Exception handling & Logs:** Integrated global exception handles translating runtime errors to standardized JSON formats.

---

## 2. System Architecture & Decisions

### Why Collapsible Sidebar?
Collapsible sidebars (as seen in Notion, Slack, and Linear) let users reclaim screen space for large data grids or chat interfaces while retaining fast, single-click access to page nodes.

### Why Client-Side State Persistence?
Utilizing a custom `useLocalStorage` hook and `mockDb` service enables fully functional interactive mocks (creating, updating, filtering records) on the client side without needing database writes, facilitating rapid UI/UX iterations.

### Why FastAPI over Flask or Django?
FastAPI is built on modern ASGI standards and uses Python type hints for auto-documentation, data serialization, and input validation via Pydantic. It is significantly faster than Flask/Django and handles asynchronous execution natively.

### Why API Versioning (`/api/v1/`)?
Versioning endpoints protects client applications from breaking changes. When data contracts or schemas change, we deploy `/api/v2/` side-by-side with `/api/v1/`, ensuring backward compatibility.

---

## 3. Real-world Examples
- **FastAPI in Production:** Used by Microsoft, Netflix, and Uber for low-latency microservices due to native async routing.
- **Vercel & Notion Layouts:** Collapsible vertical menus that slide off-screen to provide distraction-free writing/reading areas.
- **Sentry Request Telemetry:** Audits performance of HTTP requests in production by recording durations and status codes.

---

## 4. Technical Interview Prep

### Q1: What is the difference between ASGI and WSGI servers?
**Answer:** WSGI (Web Server Gateway Interface) is synchronous and processes one request per worker thread sequentially. ASGI (Asynchronous Server Gateway Interface) is a spiritual successor that supports asynchronous concurrency, WebSockets, and long-polling by default, making it much more performant.

### Q2: Why is CORS configuration required when integrating a React app with a FastAPI backend?
**Answer:** Cross-Origin Resource Sharing (CORS) is a browser security mechanism that blocks scripts on one origin (e.g. `localhost:5173`) from querying APIs on another origin (e.g. `localhost:8000`) unless the target server explicitly sends headers permitting that origin.

---

## 5. Development Commands

### Frontend Workspace
- Start dev server: `npm run dev`
- Build assets: `npm run build`

### Backend Workspace
- Activate Virtual Env (Windows): `.\venv\Scripts\Activate.ps1`
- Install dependencies: `pip install -r requirements.txt`
- Launch ASGI server: `uvicorn app.main:app --reload`
