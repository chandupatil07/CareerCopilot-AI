# Application Error Code Catalog

This document defines the application-specific error codes returned by the CareerCopilot AI backend, supplementing standard HTTP status codes to provide detailed debugging context.

---

## 1. Authentication & Authorization Errors (`AUTH_xxx`)

| Application Error Code | HTTP Status | Title | Description |
| :--- | :--- | :--- | :--- |
| `AUTH_001` | `401 Unauthorized` | Invalid Credentials | The email or password supplied during login is incorrect. |
| `AUTH_002` | `401 Unauthorized` | Token Expired | The JWT access token supplied in headers has expired. |
| `AUTH_003` | `401 Unauthorized` | Invalid Token | The token signature is invalid, or the payload is corrupted. |
| `AUTH_004` | `403 Forbidden` | Access Denied | The user lacks permissions to access or modify this resource. |
| `AUTH_005` | `409 Conflict` | Email Already Registered | An account with the same email already exists. |
| `AUTH_006` | `400 Bad Request` | Missing Refresh Token | The refresh token cookie is missing or has expired. |

---

## 2. Resume Management Errors (`RESUME_xxx`)

| Application Error Code | HTTP Status | Title | Description |
| :--- | :--- | :--- | :--- |
| `RESUME_001` | `400 Bad Request` | Invalid File Format | The uploaded file is not a PDF or DOCX. |
| `RESUME_002` | `400 Bad Request` | File Too Large | The uploaded file exceeds the 5MB size limit. |
| `RESUME_003` | `404 Not Found` | Resume Not Found | The requested resume identifier does not exist. |
| `RESUME_004` | `500 Internal Error` | Storage Upload Failure | S3 bucket failed to write or acknowledge the file upload. |

---

## 3. Application Tracker Errors (`APP_xxx`)

| Application Error Code | HTTP Status | Title | Description |
| :--- | :--- | :--- | :--- |
| `APP_001` | `404 Not Found` | Application Not Found | The requested job application identifier does not exist. |
| `APP_002` | `422 Unprocessable` | Invalid Stage Transition | Transitioning to an undefined stage value (e.g. from "Applied" to "Invalid"). |
| `APP_003` | `400 Bad Request` | Missing Required Fields | Required parameters (e.g. `company_name`, `job_role`) are missing. |

---

## 4. Interview Scheduling Errors (`INT_xxx`)

| Application Error Code | HTTP Status | Title | Description |
| :--- | :--- | :--- | :--- |
| `INT_001` | `404 Not Found` | Interview Not Found | The interview identifier does not exist. |
| `INT_002` | `400 Bad Request` | Date Conflict | The interview date is in the past, or overlaps with another slot. |

---

## 5. Notification Errors (`NOTIFY_xxx`)

| Application Error Code | HTTP Status | Title | Description |
| :--- | :--- | :--- | :--- |
| `NOTIFY_001` | `404 Not Found` | Notification Not Found | The notification identifier does not exist. |

---

## 6. Generative AI Errors (`AI_xxx`)

| Application Error Code | HTTP Status | Title | Description |
| :--- | :--- | :--- | :--- |
| `AI_001` | `503 Service Unavailable` | LLM Provider Timeout | Gemini API timed out or failed to return a response. |
| `AI_002` | `429 Too Many Requests` | AI Rate Limit Exceeded | The user has exceeded their daily AI prompt generation quota. |
| `AI_003` | `500 Internal Error` | Parsing Failure | LLM output could not be parsed into target JSON schemas. |
