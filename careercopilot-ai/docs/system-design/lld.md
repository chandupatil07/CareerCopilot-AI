# Low-Level Design (LLD): Resume Upload & Application Tracker

This document provides detailed class layouts, schema validation rules, repository query interfaces, and logical process flows for the **Resume Upload** and **Application Tracker** features.

---

## 1. LLD: Resume Upload Flow

The Resume Upload feature handles multipart file uploads, file size checks, S3 path generation, version increments, and active-state configuration.

### Class & Module Relationships

```mermaid
classDiagram
    class ResumeRouter {
        +upload_resume(file: UploadFile, db: Session, user: User)
        +get_resume_history(db: Session, user: User)
    }
    class ResumeService {
        +save_resume_file(user_id: int, file: UploadFile, db: Session) : Resume
        -validate_pdf_file(file: UploadFile) : bool
        -generate_storage_path(user_id: int, filename: string) : string
    }
    class ResumeRepository {
        +get_active_resume(db: Session, user_id: int) : Resume
        +deactivate_all_resumes(db: Session, user_id: int) : void
        +create_resume_record(db: Session, obj_in: ResumeCreate) : Resume
    }
    class ResumeSchema {
        +filename: str
        +storage_path: str
        +version: int
        +is_active: bool
    }
    
    ResumeRouter --> ResumeService : invokes
    ResumeService --> ResumeRepository : query DB
    ResumeService --> ResumeSchema : validates
```

### Resume Versioning & Upload Flowchart

```mermaid
flowchart TD
    Start[User Clicks Upload Resume] --> ValidateFormat{Is PDF or DOCX?}
    ValidateFormat -->|No| RejectFormat[Return HTTP 400: Format Not Allowed]
    ValidateFormat -->|Yes| ValidateSize{Is File Size < 5MB?}
    ValidateSize -->|No| RejectSize[Return HTTP 400: File Too Large]
    ValidateSize -->|Yes| SaveBucket[Save File to Secure Storage Bucket]
    SaveBucket --> QueryActive[Find Existing Active Resume Version]
    QueryActive --> DeactivateOld[Set Existing Active Resume is_active = False]
    DeactivateOld --> SaveDB[Insert New Resume Record with version = old_version + 1, is_active = True]
    SaveDB --> Response[Return HTTP 201 Created with Resume Details JSON]
```

---

## 2. LLD: Application Tracker Flow

The Application Tracker handles creating application cards, tracking stages, recording notes, and updating stages on board drag-and-drop.

### Class & Module Relationships

```mermaid
classDiagram
    class ApplicationRouter {
        +create_application(payload: ApplicationCreate, db: Session, user: User)
        +update_application_stage(id: int, stage: string, db: Session, user: User)
        +search_applications(query: string, db: Session)
    }
    class ApplicationService {
        +register_application(user_id: int, payload: ApplicationCreate, db: Session) : Application
        +transition_stage(app_id: int, target_stage: string, db: Session) : Application
    }
    class ApplicationRepository {
        +get_user_applications(db: Session, user_id: int, skip: int, limit: int) : List
        +update_stage(db: Session, id: int, stage: string) : Application
        +create(db: Session, obj: ApplicationCreate) : Application
    }
    class ApplicationSchema {
        +company_name: str
        +job_role: str
        +applied_date: date
        +current_stage: str
        +location: str
    }

    ApplicationRouter --> ApplicationService : invokes
    ApplicationService --> ApplicationRepository : query DB
    ApplicationService --> ApplicationSchema : validates
```

### Stage Transition Flowchart

```mermaid
flowchart TD
    Start[User Drags Card to Interviewing Stage] --> ValidateAccess{Does user own application?}
    ValidateAccess -->|No| RejectAccess[Return HTTP 403 Forbidden]
    ValidateAccess -->|Yes| ValidateStage{Is Stage Value Valid?}
    ValidateStage -->|No| RejectStage[Return HTTP 422 Validation Error]
    ValidateStage -->|Yes| UpdateDB[Repository executes SQL update current_stage = Interviewing]
    UpdateDB --> AutoLog{Are stage reminders needed?}
    AutoLog -->|Yes| CreateNotify[Create System Notification for Interview Prep]
    CreateNotify --> Response[Return HTTP 200 OK with Updated Application Card JSON]
    AutoLog -->|No| Response
```
