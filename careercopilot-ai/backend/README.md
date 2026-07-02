# CareerCopilot AI Backend (Module 3.0)

This is the Python FastAPI ASGI backend foundation for CareerCopilot AI, providing versioned REST endpoints, standard health audits, global exception hooks, and performance request telemetry.

---

## 1. Directory Structure

```text
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       └── endpoints/
│   │           └── health.py    # Health check endpoint
│   ├── core/
│   │   ├── config.py            # Pydantic configuration module
│   │   └── errors.py            # Global exception handlers
│   └── main.py                  # FastAPI boot file
└── requirements.txt             # Dependency configurations
```

---

## 2. Bootstrapping Instructions

### Prerequisites
- Python 3.10+ installed on your local operating system.

### Step 1: Install Dependencies
Create a virtual environment and load standard dependencies:
```bash
# Navigate to the backend directory
cd backend/

# Initialize virtual environment
python -m venv venv

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Install dependency configurations
pip install -r requirements.txt
```

### Step 2: Boot Server
Launch the ASGI web server utilizing Uvicorn:
```bash
uvicorn app.main:app --reload
```

---

## 3. Interactive Documentation API

Once the server boots successfully, access the standard interactive routers docs in your web browser:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs) (used for running active testing queries).
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc) (used for structural documentation analysis).
- **Health Endpoint**: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health) (verifies operational status).
