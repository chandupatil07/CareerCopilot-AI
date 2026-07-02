# DEVELOPMENT HANDOFF: CareerCopilot AI (Modules 2.0, 3.0, 3.1, 3.2, 3.3, 3.4 & 3.5)

## 1. System Deliverables Overview
We have finalized the SaaS frontend workspace foundation, established the Python FastAPI backend, designed the database schema, documented the system architecture, implemented production authentication, completed the resume management service, and implemented the parsing/ATS scoring engine:
- **12 SaaS Subpage Modules:** Interactive views for Dashboard, Resume Center, Applications, Interviews, AI Assistant, Cold Email, LinkedIn Builder, Career Analytics, Notifications, Profile, Settings, Support.
- **FastAPI ASGI Backend:** Setup standard app configurations, logging middleware telemetry, and global error handling routes.
- **Production Database Schema:** Designed the complete normalized PostgreSQL relational database layer using SQLAlchemy 2.x ORM models.
- **System Design & API Specs:** Formulated blueprints under `docs/system-design/` mapping HLD, LLD, Security, Scaling, and OpenAPI specifications.
- **Authentication & User Management (Module 3.3):** Implemented stateless JWT session tokens, 12-round bcrypt password hashing, and profile management.
- **Resume Management Service (Module 3.4):** Implemented file upload validations (PDF formats only, size <10MB), version numbering increments, local disk directory partitions (`uploads/{user_id}/`), download controllers, active states activation, and file deletes.
- **Resume Parsing & ATS Scoring Engine (Module 3.5):** Completed pdfplumber text extraction, contact extraction regex filters, tech keywords scanner dictionary, transparent scoring calculations, and metadata analysis persistence (`resume_analyses` table).

---

## 2. Parsing & ATS Scoring Specifications
- **PDF Extraction:** Streams page-by-page characters from PDF using `pdfplumber`, falling back to standard exceptions on encrypted or empty documents.
- **NLP Information Extraction:** Mapped regular expressions for emails, telephone numbers, and URLs (GitHub, LinkedIn).
- **ATS Metric Calculations:** Rules-based evaluation scoring resumes out of 100 max:
  - 30 Points: Contact info presence (10 pts email, 10 pts phone, 10 pts links).
  - 60 Points: Essential sections check (15 pts education, 15 pts experience, 15 pts skills, 15 pts projects).
  - 10 Points: Text density boundaries (10 pts for 150-800 words range).

---

## 3. Automated Test Suite (Pytest)
- **Files Location:**
  - `backend/tests/test_resume.py`
  - `backend/tests/test_parser.py`
- **Command:** `python -m pytest`

---

## 4. Technical Interview Prep Q&A

### Q1: Why is a rule-based parser preferred for structural checks over an LLM parser?
**Answer:** It is deterministic, runs instantly with zero network call latency, incurs zero API token costs, and guarantees consistent evaluation metrics across all uploads.

### Q2: What is the risk of using basic line splitting to parse university details?
**Answer:** Text layouts vary. Simple splits fail on multi-column alignments. Utilizing Named Entity Recognition (NER) models (like spaCy ORG tags) or keyword mapping against university libraries is far more robust.

---

## 5. Development Commands

### Frontend Workspace
- Start dev server: `npm run dev`
- Build assets: `npm run build`

### Backend Workspace & Migrations
- Activate Virtual Env (Windows): `.\venv\Scripts\Activate.ps1`
- Install dependencies: `pip install -r requirements.txt`
- Run automated tests: `python -m pytest`
- Launch ASGI API server: `uvicorn app.main:app --reload`
