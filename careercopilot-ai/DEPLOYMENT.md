# Production Deployment Guide: CareerCopilot AI

This document provides a step-by-step production-grade deployment plan for CareerCopilot AI. It details migrating to a live PostgreSQL database, deploying the FastAPI backend to Render/Railway, and hosting the React + Vite frontend on Vercel/Netlify.

---

## Architecture Overview

```mermaid
graph LR
    User[Candidate Browser] -->|HTTPS Requests| Frontend[Vercel Static Hosting]
    Frontend -->|API calls with JWT| Backend[Render FastAPI API Service]
    Backend -->|Read/Write Queries| DB[(Supabase / Render Managed PostgreSQL)]
    Backend -->|Dialogue Generation| Gemini[Google Gemini API]
```

---

## Phase 1: Database Setup (Managed PostgreSQL)

For production, SQLite is not suitable because its file storage is ephemeral (it will be wiped every time the server restarts or deploys). We must use a managed **PostgreSQL** instance.

### Options:
1. **Supabase (Recommended):** Free tier PostgreSQL.
2. **Render PostgreSQL:** Add-on database for Render services.
3. **Railway PostgreSQL:** Managed database plugin on Railway.

### Steps:
1. Create a database instance on one of the providers.
2. Copy the connection string. It will look like:
   `postgresql://username:password@hostname:port/database_name`
3. If using SQLAlchemy, Python requires the PostgreSQL driver package `psycopg2-binary`. Ensure it is added to your production package listings.

---

## Phase 2: Deploying the FastAPI Backend (Render / Railway)

### Steps for Render:
1. Log in to [Render.com](https://render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Configure the service settings:
   - **Name:** `careercopilot-backend`
   - **Language:** `Python`
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
     *(Note: Navigate to `backend` folder first: `cd backend && gunicorn...`)*
5. Under **Environment Variables**, configure the following:
   - `DATABASE_URL`: `postgresql://...` (your live PostgreSQL connection string)
   - `GEMINI_API_KEY`: `AQ.Ab8RN6L-mjvjhCUAlPkf4owpTP8J9c8-s5qPhOLFX53b_AhgGw` (your Gemini API key)
   - `JWT_SECRET`: Generate a secure random hex string (e.g. run `openssl rand -hex 32` in your local terminal).
   - `ALGORITHM`: `HS256`
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: `15`
6. Click **Deploy Web Service**. Render will build and deploy your API server, exposing a public URL (e.g. `https://careercopilot-backend.onrender.com`).

---

## Phase 3: Deploying the React Frontend (Vercel / Netlify)

Vercel is the industry-standard hosting for static React SPAs. It is highly optimized, fast, and free.

### Steps for Vercel:
1. Log in to [Vercel.com](https://vercel.com).
2. Click **Add New** > **Project** and import your GitHub repository.
3. Configure the project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://careercopilot-backend.onrender.com/api/v1` *(points to your live backend URL from Phase 2)*
5. Configure URL Redirects (Fallbacks):
   Since Vite is a Single Page Application (SPA) using client-side routing, page refreshes (like reloading `/resume-center`) will trigger 404 errors on static hosts. Create a `vercel.json` file inside your `frontend/` folder with the following contents to route all traffic back to `index.html`:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
6. Click **Deploy**. Vercel will build your static files and provide your production URL (e.g., `https://careercopilot-ai.vercel.app`).

---

## Phase 4: Post-Deployment Verification Checklist

1. **Verify CORS Settings:**
   Ensure the frontend URL is included in the backend's allowed origins list (`BACKEND_CORS_ORIGINS` in `app/core/config.py`). If you deploy to Vercel, update the list to include your Vercel URL.
2. **Database Migrations:**
   Run your Alembic migrations on the PostgreSQL database instance:
   ```bash
   DATABASE_URL="postgresql://..." alembic upgrade head
   ```
3. **Verify Auth Flow:**
   Register, log out, and log in to verify JWT cookies and tokens are set and recovered correctly across origins.
4. **Verify PDF Upload & Parse:**
   Upload a sample PDF resume to confirm file writes and extract capabilities.
5. **Verify AI Chat:**
   Send a message to confirm the Gemini API key is active and streaming live AI responses.
