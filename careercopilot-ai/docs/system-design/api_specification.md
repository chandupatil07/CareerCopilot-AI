# API Specifications & Frontend-Backend Contracts

This document contains the OpenAPI-style REST API specifications and the frontend-backend payload contracts for all page views in the CareerCopilot AI platform.

---

## 1. Authentication Endpoints (`/api/v1/auth`)

### 1. Register Account
- **Verb / Path:** `POST /api/v1/auth/register`
- **Purpose:** Registers a new user account.
- **Request Body (JSON):**
  ```json
  {
    "full_name": "Jane Doe",
    "email": "jane@demo.com",
    "password": "SecurePassword123"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "full_name": "Jane Doe",
      "email": "jane@demo.com",
      "created_at": "2026-07-03T01:41:15Z"
    }
  }
  ```
- **Errors:**
  - `409 Conflict (AUTH_005)`: Email already registered.
  - `422 Unprocessable (SCHEMA_VALIDATION_FAILED)`: Invalid email structure.

### 2. Login Session
- **Verb / Path:** `POST /api/v1/auth/login`
- **Purpose:** Authenticates user and issues tokens.
- **Request Body (JSON):**
  ```json
  {
    "email": "jane@demo.com",
    "password": "SecurePassword123"
  }
  ```
- **Response (200 OK):**
  - *Response Cookies:* Sets `refresh_token` as HttpOnly, Secure cookie.
  - *Response Body:*
    ```json
    {
      "success": true,
      "data": {
        "access_token": "eyJhbGciOi...",
        "token_type": "Bearer",
        "expires_in": 900
      }
    }
    ```
- **Errors:**
  - `401 Unauthorized (AUTH_001)`: Invalid credentials.

### 3. Logout / Revoke Token
- **Verb / Path:** `POST /api/v1/auth/logout`
- **Purpose:** Revokes the user session.
- **Response (200 OK):** Clears the refresh token cookie.

---

## 2. User Profile Endpoints (`/api/v1/users`)

### 1. Get Profile Coordinates
- **Verb / Path:** `GET /api/v1/users/profile`
- **Headers:** `Authorization: Bearer <access_token>`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "full_name": "Jane Doe",
      "email": "jane@demo.com",
      "college": "Stanford University",
      "degree": "B.S.",
      "branch": "Computer Science",
      "graduation_year": 2026,
      "linkedin_url": "https://linkedin.com/in/janedoe",
      "github_url": "https://github.com/janedoe"
    }
  }
  ```

---

## 3. Resume Management Endpoints (`/api/v1/resumes`)

### 1. Upload Resume PDF
- **Verb / Path:** `POST /api/v1/resumes/upload`
- **Request Body (Multipart Form):** File binary upload (`file: UploadFile`).
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "id": 4,
      "filename": "Jane_Doe_CV.pdf",
      "storage_path": "/storage/resumes/1/version_2.pdf",
      "version": 2,
      "is_active": true,
      "upload_date": "2026-07-03T01:41:15Z"
    }
  }
  ```

---

## 4. Application Tracker Endpoints (`/api/v1/applications`)

### 1. Create Application Card
- **Verb / Path:** `POST /api/v1/applications`
- **Request Body (JSON):**
  ```json
  {
    "company_name": "Google",
    "job_role": "Software Engineer",
    "source": "LinkedIn",
    "applied_date": "2026-07-01",
    "current_stage": "Applied",
    "location": "Remote",
    "salary_range": "$120k - $150k"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "id": 15,
      "company_name": "Google",
      "job_role": "Software Engineer",
      "current_stage": "Applied"
    }
  }
  ```

### 2. Update Application Stage (Drag-and-Drop)
- **Verb / Path:** `PATCH /api/v1/applications/{id}/stage`
- **Request Body (JSON):**
  ```json
  {
    "current_stage": "Interviewing"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": 15,
      "company_name": "Google",
      "job_role": "Software Engineer",
      "current_stage": "Interviewing"
    }
  }
  ```

---

## 5. Interview Scheduling Endpoints (`/api/v1/interviews`)

### 1. Create Interview Slot
- **Verb / Path:** `POST /api/v1/interviews`
- **Request Body (JSON):**
  ```json
  {
    "application_id": 15,
    "interview_date": "2026-07-15",
    "interview_time": "14:30",
    "mode": "Google Meet",
    "meeting_link": "https://meet.google.com/abc-xyz",
    "interviewer_name": "Sarah Connor"
  }
  ```
- **Response (210 Created):**
  ```json
  {
    "success": true,
    "data": {
      "id": 8,
      "application_id": 15,
      "interview_date": "2026-07-15",
      "mode": "Google Meet"
    }
  }
  ```

---

## 6. Notification Endpoints (`/api/v1/notifications`)

### 1. Get List of Notifications
- **Verb / Path:** `GET /api/v1/notifications`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 44,
        "title": "Upcoming Interview",
        "message": "Interview with Google in 24 hours.",
        "type": "warning",
        "is_read": false,
        "created_at": "2026-07-02T12:00:00Z"
      }
    ]
  }
  ```

---

## 7. AI Operations Endpoints (Future `/api/v1/ai`)

### 1. Chat Prompt
- **Verb / Path:** `POST /api/v1/ai/chat`
- **Request Body (JSON):**
  ```json
  {
    "conversation_id": "session-12",
    "prompt": "How should I describe my experience with Docker?"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "response": "Here is how you can highlight your Docker experience: 'Orchestrated multi-container applications...'"
    }
  }
  ```

### 2. Cold Email Generation
- **Verb / Path:** `POST /api/v1/ai/cold-email`
- **Request Body (JSON):**
  ```json
  {
    "company": "Stripe",
    "role": "Frontend Architect",
    "keywords": "React, Vite, Web performance"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "generated_email": "Subject: Deeply impressed by Stripe's developer platforms...\n\nDear [Name],\n\nI am writing to express my interest in..."
    }
  }
  ```
