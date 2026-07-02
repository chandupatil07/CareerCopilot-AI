# System Sequence Diagrams

This document maps out the system sequence interactions between the React Frontend, FastAPI Backend, Repositories, Databases, and external service agents for critical user flows.

---

## 1. User Registration Flow

```mermaid
sequenceDiagram
    actor User as User Browser
    participant API as FastAPI Router
    participant Validate as Pydantic Schema
    participant Repo as UserRepository
    participant DB as PostgreSQL DB

    User->>API: POST /api/v1/auth/register (payload)
    API->>Validate: Validate input format
    alt Validation Fails
        Validate-->>API: Raise ValidationError
        API-->>User: Return HTTP 422 (SCHEMA_VALIDATION_FAILED)
    else Validation Succeeds
        API->>Repo: check_email_exists(email)
        Repo->>DB: SELECT * FROM "user" WHERE email = :email
        DB-->>Repo: User record (or None)
        alt Email Exists
            Repo-->>API: User exists
            API-->>User: Return HTTP 409 Conflict (AUTH_005)
        else Email Free
            API->>API: Generate 12-round Bcrypt hash
            API->>Repo: create_user(obj_in)
            Repo->>DB: INSERT INTO "user" (email, password_hash...)
            DB-->>Repo: Committed record with ID
            Repo-->>API: User details
            API-->>User: Return HTTP 201 Created (User details JSON)
        end
    end
```

---

## 2. Resume Upload & Active Versioning Flow

```mermaid
sequenceDiagram
    actor User as User Browser
    participant API as FastAPI Router
    participant Service as ResumeService
    participant S3 as Storage Bucket (S3/Local)
    participant Repo as ResumeRepository
    participant DB as PostgreSQL DB

    User->>API: POST /api/v1/resumes/upload (multipart PDF file)
    API->>Service: save_resume_file(file, user_id)
    Service->>Service: Validate format (PDF/DOCX) & size (< 5MB)
    alt Format/Size Invalid
        Service-->>API: Raise HTTPException (RESUME_001/002)
        API-->>User: Return HTTP 400 Bad Request
    else File Valid
        Service->>S3: Upload file to storage path
        S3-->>Service: Acknowledge storage path
        Service->>Repo: deactivate_all_resumes(user_id)
        Repo->>DB: UPDATE resume SET is_active = False WHERE user_id = :user_id
        DB-->>Repo: Acknowledge
        Service->>Repo: create_resume_record(user_id, storage_path, version = old_version + 1, is_active = True)
        Repo->>DB: INSERT INTO resume (user_id, storage_path, version, is_active)
        DB-->>Repo: Acknowledge
        Repo-->>Service: New Resume details
        Service-->>API: Compiled Resume Details
        API-->>User: Return HTTP 201 Created (Resume details JSON)
    end
```

---

## 3. Application Tracking Flow

```mermaid
sequenceDiagram
    actor User as User Browser
    participant API as FastAPI Router
    participant Repo as ApplicationRepository
    participant DB as PostgreSQL DB

    User->>API: PATCH /api/v1/applications/{id}/stage (current_stage = "Interviewing")
    API->>Repo: get_application_by_id(id)
    Repo->>DB: SELECT * FROM application WHERE id = :id
    DB-->>Repo: Application details
    alt Application Not Found
        Repo-->>API: None
        API-->>User: Return HTTP 404 Not Found (APP_001)
    else Application Exists
        API->>Repo: update_stage(id, stage = "Interviewing")
        Repo->>DB: UPDATE application SET current_stage = :stage WHERE id = :id
        DB-->>Repo: Committed record
        Repo-->>API: Updated Application details
        API-->>User: Return HTTP 200 OK (Updated Application JSON)
    end
```

---

## 4. Scheduled Interview Reminder Cron Flow

```mermaid
sequenceDiagram
    participant Cron as Cron Scheduler / Background Worker
    participant DB as PostgreSQL DB
    participant Gateway = Email Gateway (SES/SMTP)
    participant Repo as NotificationRepository

    Cron->>DB: Query interviews occurring in next 24 hours where reminder_sent = False
    DB-->>Cron: List of interviews
    loop For each interview
        Cron->>Gateway: Send email alert to User
        Gateway-->>Cron: Dispatch successful
        Cron->>Repo: create_notification(user_id, title = "Interview reminder", type = "warning")
        Repo->>DB: INSERT INTO notification ...
        DB-->>Repo: Acknowledge
        Cron->>DB: UPDATE interview SET reminder_sent = True WHERE id = :id
        DB-->>Cron: Acknowledge
    end
```

---

## 5. AI Chat Dialogue Flow

```mermaid
sequenceDiagram
    actor User as User Browser
    participant API as FastAPI Router
    participant Agent as LangGraph Controller
    participant LLM as Gemini 1.5 API
    participant Vector as ChromaDB
    participant Repo as AIChatRepository
    participant DB as PostgreSQL DB

    User->>API: POST /api/v1/ai/chat (prompt, conversation_id)
    API->>Agent: process_chat_message(prompt, conversation_id)
    Agent->>Vector: Search relevant resume text context
    Vector-->>Agent: Context matches
    Agent->>LLM: Generate response (Prompt + System instructions + context)
    LLM-->>Agent: AI Response Text
    Agent->>Repo: save_dialogue(user_id, conversation_id, prompt, response)
    Repo->>DB: INSERT INTO aichat (prompt, response, conversation_id)
    DB-->>Repo: Acknowledge
    Repo-->>API: Chat log details
    API-->>User: Return HTTP 200 OK (Response text JSON)
```

---

## 6. Outreach Cold Email Generation Flow

```mermaid
sequenceDiagram
    actor User as User Browser
    participant API as FastAPI Router
    participant Agent as LangGraph Agent
    participant LLM as Gemini 1.5 API
    participant Repo as OutreachRepository
    participant DB as PostgreSQL DB

    User->>API: POST /api/v1/ai/cold-email (company, role, keywords)
    API->>Agent: compile_email_outreach(company, role, keywords)
    Agent->>LLM: Generate email utilizing target keywords and job details
    LLM-->>Agent: Generated Email text
    Agent->>Repo: save_cold_email_history(user_id, company, role, email_text)
    Repo->>DB: INSERT INTO coldemailhistory (user_id, company, role, generated_email)
    DB-->>Repo: Acknowledge
    Repo-->>API: History record details
    API-->>User: Return HTTP 200 OK (Email text and history metadata JSON)
```
