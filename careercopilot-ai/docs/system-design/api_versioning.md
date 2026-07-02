# API Versioning Strategy & Naming Conventions

This document defines the REST API versioning strategy, routing mechanics for backward compatibility, and naming standards enforced across the CareerCopilot AI platform.

---

## 1. API Versioning Strategy

### URL Path Versioning
We use **URL path versioning** (e.g. `/api/v1/resumes`) as our primary versioning scheme. It is highly readable, easy to cache at CDN layers, and simplifies API gateway routing.

```text
/api/v1/  ->  Legacy endpoints (v1 features)
/api/v2/  ->  Next-generation endpoints (introduced when schemas change)
```

### Version Evolution & Backward Compatibility
To avoid breaking client applications (e.g. active mobile apps, legacy frontend builds) when schemas change, we enforce these rules:

1. **Additive Changes:** Adding optional query parameters or new JSON response fields does **not** trigger a version increment. These changes are backwards-compatible and are merged directly into `v1`.
2. **Breaking Changes (Schema Migrations):** Changing data types, dropping columns, or renaming required payload keys triggers a version increment (e.g. duplicating endpoints under `/api/v2/`).
3. **Internal Routing Structure:**
   FastAPI routes are version-mounted inside separate directory hierarchies.
   ```text
   backend/app/api/
   ├── v1/
   │   ├── endpoints/
   │   │   ├── auth.py
   │   │   └── resume.py
   └── v2/
       ├── endpoints/
       │   └── resume.py
   ```
   Both versions run concurrently. Common business rules are kept in the **Service Layer** to avoid duplicate code across version endpoints.

---

## 2. API Naming Convention (REST Standards)

We adhere to standard RESTful design practices:

### 1. Resource Identifiers (Plurals)
Resource paths must use plural nouns. Do **not** use verbs in URL paths.
- **Correct:** `GET /api/v1/applications`
- **Incorrect:** `POST /api/v1/getApplications` or `POST /api/v1/deleteApplication`

### 2. Nesting Sub-Resources
For hierarchical relations, nest the child resource under its parent:
- **Correct:** `GET /api/v1/applications/{id}/interviews` (fetches interviews scheduled for a specific application).

### 3. Lowercase & Hyphens
Paths must use lowercase letters and hyphens (kebap-case). Do **not** use camelCase or underscores in paths.
- **Correct:** `GET /api/v1/linkedin-generator`
- **Incorrect:** `GET /api/v1/linkedin_generator` or `GET /api/v1/linkedinGenerator`

### 4. HTTP Verbs Mapping
Each action maps to a specific HTTP verb:

| HTTP Verb | Path | Purpose | Success Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/applications` | Retrieve a list of applications | `200 OK` |
| `GET` | `/applications/{id}` | Retrieve a specific application | `200 OK` |
| `POST` | `/applications` | Create a new application card | `201 Created` |
| `PUT` | `/applications/{id}` | Replace/overwrite an entire application card | `200 OK` |
| `PATCH` | `/applications/{id}` | Update partial fields (e.g., transition stage) | `200 OK` |
| `DELETE` | `/applications/{id}` | Remove an application card | `200 OK` / `204 No Content` |
| `OPTIONS` | `/applications` | Return allowed HTTP headers (CORS preflight) | `200 OK` |
