# DEVELOPMENT HANDOFF: CareerCopilot AI (Modules 2.0 - 4.6)

## 1. System Deliverables Overview
We have finalized the SaaS frontend workspace foundation, established the Python FastAPI backend, designed the database schema, documented the system architecture, implemented production authentication, and integrated all completed backend features with the React client:
- **12 SaaS Subpage Modules:** Interactive views for Dashboard, Resume Center, Applications, Interviews, AI Assistant, Cold Email, LinkedIn Builder, Career Analytics, Notifications, Profile, Settings, Support.
- **FastAPI ASGI Backend:** Setup standard app configurations, logging middleware telemetry, and global error handling routes.
- **Production Database Schema & Migrations:** Mapped user accounts, resumes, jobs, interviews, notifications, and audit trails. Added SQLite `render_as_batch=True` to migrate columns safely.
- **Authentication & User Management (Module 3.3):** Implemented stateless JWT session tokens, 12-round bcrypt password hashing, and profile management.
- **Resume Center Integration (Module 4.3):** Real-time PDF uploading, dynamic parsing reports with ATS recommendations, version history grids, activation status toggling, and interactive targeted job description scans.
- **Job Application CRM (Module 4.4):** Kanban stage tracking table, search & filters, favorite toggles, archived logs, modal creations, and slide-out detail timelines drawers.
- **Interview Scheduler Calendar (Module 4.5):** Scheduled sessions list divided into upcoming and past events, scheduling dialogs linking database applications, and automatic application status promotions on the backend.
- **Notification Center Integration (Module 4.6):** Read status changes, unread counters, purge buttons, and custom global events dispatch listeners.

---

## 2. Authentication & API Specifications
- **Unified Axios Client (`api.js`):** Configured base URL using environment variable `VITE_API_BASE_URL`. Performs automatic silent token refreshes via request/response interceptors.
- **React Context State (`AuthContext.jsx`):** Exposes `user`, `loading`, `error`, `isAuthenticated`, `login`, `register`, and `logout` state variables globally.
- **Dashboard API Aggregations:** Uses `Promise.all` to fetch statistics, interviews, notifications activity stream, and resumes history concurrently at startup, preventing sequential loading waterfalls.
- **SQLAlchemy Mapper Bootstrapping:** Explicitly imports `app.database.base` in `app/main.py` to prevent lazy compilation KeyError crashes during dynamic relationship lookups.

---

## 3. Reusable UI Loaders
- **`FullScreenLoader.jsx`:** A full viewport loader rendering during session verification.
- **`ButtonLoader.jsx`:** A loading spinner inside buttons when submitting forms.
- **`PageLoader.jsx`:** A container spinner for dashboard panels fetching content.

---

## 4. Automated & Manual Test Verification
- Run backend tests: `python -m pytest` (36 passed successfully).
- Verify frontend compilation: `npm run build` (built production bundle successfully in under 6 seconds).

---

## 5. Technical Interview Prep Q&A

### Q1: How does a silent token refresh flow work using Axios interceptors?
**Answer:** When an API request fails with a `401 Unauthorized` status (meaning the access token expired), the Axios response interceptor catches the error. It pauses execution, sends a `POST /auth/refresh` request to the backend with secure cookies to receive a new access token, saves the new token, updates the headers, and retries the original request. If the refresh fails, it clears browser tokens and logs out the user.

### Q2: What is the purpose of storing refresh tokens in HttpOnly cookies instead of localStorage?
**Answer:** Storing refresh tokens in `HttpOnly` cookies makes them inaccessible to client-side JavaScript. This protects the session from Cross-Site Scripting (XSS) extraction attacks, maintaining industry-standard security boundaries.

### Q3: Why is importing app.database.base in main.py necessary for SQLAlchemy ORM applications?
**Answer:** If models aren't imported at app boot, SQLAlchemy compiles relationships on demand. If a model containing a relationship (e.g. `User`) is loaded before its related target model (e.g. `AIChat`) has been imported, the ORM registry will throw a `'KeyError'` because it cannot locate the class definition.

### Q4: How do you synchronize unread counts across independent components without Redux in React?
**Answer:** We can use standard HTML custom window events. When a state modifies, we dispatch a custom event: `window.dispatchEvent(new Event('auth:unread_notifications_changed'))`. Other components subscribe to this event using `window.addEventListener` inside `useEffect`, updating their internal states accordingly.

---

## 6. Development Commands

### Running Locally
- Start Frontend server:
  ```powershell
  cd careercopilot-ai/frontend
  npm run dev
  ```
- Launch ASGI API server:
  ```powershell
  cd careercopilot-ai/backend
  $env:DATABASE_URL="sqlite:///sql_app.db"
  python -m uvicorn app.main:app --reload --port 8000
  ```
- Run automated tests: `python -m pytest`
