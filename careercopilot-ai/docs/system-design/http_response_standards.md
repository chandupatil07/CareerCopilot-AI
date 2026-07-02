# HTTP Response Standards & API Payloads

This document defines the HTTP status code strategy and the unified JSON payload formats returned by all APIs across the CareerCopilot AI platform.

---

## 1. HTTP Status Code Strategy

We map standard API response states to the following HTTP status codes:

| Status Code | Label | Scenario |
| :--- | :--- | :--- |
| `200` | `OK` | Requests that retrieve, update (`PUT`/`PATCH`), or delete resources successfully. |
| `201` | `Created` | Successful creation of resources (e.g. creating application cards or uploading resumes). |
| `400` | `Bad Request` | Client-side errors that do not fit other codes (e.g. file upload too large, invalid format). |
| `401` | `Unauthorized` | Credentials authentication failure (missing token, invalid password, expired session). |
| `403` | `Forbidden` | Authorization failure (e.g. authenticated user trying to delete another user's resume). |
| `404` | `Not Found` | The requested resource identifier does not exist. |
| `409` | `Conflict` | Resource conflict (e.g., trying to register an account using an email that is already in use). |
| `422` | `Unprocessable Entity` | Schema data validation failures (Pydantic caught invalid format parameters). |
| `500` | `Internal Server Error` | Unhandled backend server runtime errors. |

---

## 2. Unified JSON Response Formats

To ensure consistent integration with our React frontend, all API responses conform to a unified structure.

### 1. Success Response Structure
Contains the query results inside a `data` parameter. For paginated results, a `pagination` parameter is included.

```json
{
  "success": true,
  "data": {
    "id": 12,
    "company_name": "Google",
    "job_role": "Software Engineer",
    "current_stage": "Applied"
  }
}
```

### 2. General Error Response Structure
Includes an application-specific error code (e.g. `AUTH_001`, `RESUME_003`) to simplify error handling on the frontend.

```json
{
  "success": false,
  "error": {
    "error_code": "AUTH_001",
    "title": "Invalid Credentials",
    "detail": "The email or password supplied during login is incorrect."
  }
}
```

### 3. Validation Error Response Structure (HTTP 422)
Pydantic schema validation failures include an `errors` list detailing which parameters failed checks.

```json
{
  "success": false,
  "error": {
    "error_code": "SCHEMA_VALIDATION_FAILED",
    "title": "Data Validation Failed",
    "detail": "Request payload schema validation failed.",
    "errors": [
      {
        "field": "email",
        "type": "value_error.email",
        "message": "value is not a valid email address"
      }
    ]
  }
}
```
