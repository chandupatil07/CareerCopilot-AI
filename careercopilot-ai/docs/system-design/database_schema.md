# Database Schema Specification

This document defines the raw table structures, data types, index mappings, constraints, unique keys, and cascade deletion rules for the CareerCopilot AI PostgreSQL database.

---

## 1. Table Definitions

### 1. `user` Table
Represents registered job seeker accounts.

| Column Name | Data Type | Constraints / Keys | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Auto-increment | Unique user identifier |
| `full_name` | `VARCHAR(100)` | `NOT NULL` | User's full name |
| `email` | `VARCHAR(100)` | Unique, Index, `NOT NULL` | Login email coordinate |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | Bcrypt hashed credential |
| `phone` | `VARCHAR(20)` | `NULL` | Optional contact number |
| `profile_image` | `VARCHAR(255)` | `NULL` | Path to S3/Local avatar file |
| `college` | `VARCHAR(150)` | `NULL` | Academic institution |
| `degree` | `VARCHAR(100)` | `NULL` | e.g. B.S., M.S., B.Tech |
| `branch` | `VARCHAR(100)` | `NULL` | e.g. Computer Science |
| `graduation_year`| `INTEGER` | `NULL` | Graduation completion year |
| `linkedin_url` | `VARCHAR(255)` | `NULL` | Professional profile link |
| `github_url` | `VARCHAR(255)` | `NULL` | Code repository link |
| `portfolio_url` | `VARCHAR(255)` | `NULL` | Personal portfolio link |
| `created_at` | `TIMESTAMP WITH TZ`| `server_default = now()` | Account creation date |
| `updated_at` | `TIMESTAMP WITH TZ`| `server_default = now()`, `onupdate = now()` | Last update timestamp |

---

### 2. `resume` Table
Stores uploaded resume versions.

| Column Name | Data Type | Constraints / Keys | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Auto-increment | Resume identifier |
| `user_id` | `INTEGER` | Foreign Key (`user.id`), Index, `NOT NULL` | References uploading owner |
| `filename` | `VARCHAR(255)` | `NOT NULL` | Display filename |
| `storage_path` | `VARCHAR(255)` | `NOT NULL` | File path in storage bucket |
| `upload_date` | `TIMESTAMP WITH TZ`| `server_default = now()` | Upload timestamp |
| `version` | `INTEGER` | Default `1` | Incremental version tag |
| `is_active` | `BOOLEAN` | Default `True` | Flags active resume for ATS scans |

---

### 3. `application` Table
Tracks job application stages.

| Column Name | Data Type | Constraints / Keys | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Auto-increment | Application identifier |
| `user_id` | `INTEGER` | Foreign Key (`user.id`), Index, `NOT NULL` | References tracker owner |
| `company_name` | `VARCHAR(100)` | Index, `NOT NULL` | Target employer name |
| `job_role` | `VARCHAR(100)` | `NOT NULL` | Target role/title |
| `source` | `VARCHAR(50)` | `NULL` | e.g. LinkedIn, Referral |
| `applied_date` | `DATE` | `NULL` | Date of submission |
| `current_stage` | `VARCHAR(50)` | Default `"Applied"`, `NOT NULL` | Tracker stage |
| `location` | `VARCHAR(100)` | `NULL` | e.g. Remote, Hybrid |
| `salary_range` | `VARCHAR(50)` | `NULL` | e.g. $100k - $120k |
| `notes` | `TEXT` | `NULL` | Details, keywords, context |

---

### 4. `interview` Table
Tracks scheduled meeting dates.

| Column Name | Data Type | Constraints / Keys | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Auto-increment | Interview identifier |
| `application_id` | `INTEGER` | Foreign Key (`application.id`), Index, `NOT NULL` | Links to tracker card |
| `interview_date` | `DATE` | Index, `NOT NULL` | Date of interview |
| `interview_time` | `VARCHAR(50)` | `NULL` | Time slot |
| `mode` | `VARCHAR(50)` | Default `"Google Meet"`, `NOT NULL` | Zoom, In-person, etc. |
| `meeting_link` | `VARCHAR(255)` | `NULL` | Dial-in URL |
| `interviewer_name`| `VARCHAR(100)` | `NULL` | Name of contact |
| `notes` | `TEXT` | `NULL` | Preps, questions logs |
| `reminder_sent` | `BOOLEAN` | Default `False`, `NOT NULL` | Cron check flag |

---

### 5. `notification` Table
Tracks status notifications and reminders.

| Column Name | Data Type | Constraints / Keys | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Auto-increment | Notification identifier |
| `user_id` | `INTEGER` | Foreign Key (`user.id`), Index, `NOT NULL` | Target owner |
| `title` | `VARCHAR(150)` | `NOT NULL` | Alert title |
| `message` | `TEXT` | `NOT NULL` | Alert description |
| `type` | `VARCHAR(50)` | Default `"info"`, `NOT NULL` | e.g. success, warning, info |
| `is_read` | `BOOLEAN` | Default `False`, `NOT NULL` | Read status |
| `created_at` | `TIMESTAMP WITH TZ`| `server_default = now()` | Creation timestamp |

---

### 6. `aichat` Table
Stores telemetry chat history with AI Coach.

| Column Name | Data Type | Constraints / Keys | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Auto-increment | Chat identifier |
| `user_id` | `INTEGER` | Foreign Key (`user.id`), Index, `NOT NULL` | Target owner |
| `conversation_id`| `VARCHAR(100)` | Index, `NULL` | Groups dialogue segments |
| `prompt` | `TEXT` | `NOT NULL` | User input |
| `response` | `TEXT` | `NOT NULL` | AI output |
| `created_at` | `TIMESTAMP WITH TZ`| `server_default = now()` | Dialogue timestamp |

---

### 7. `coldemailhistory` Table
Stores generated cold emails.

| Column Name | Data Type | Constraints / Keys | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Auto-increment | Record identifier |
| `user_id` | `INTEGER` | Foreign Key (`user.id`), Index, `NOT NULL` | Target owner |
| `generated_email`| `TEXT` | `NOT NULL` | Formatted output letter |
| `company` | `VARCHAR(100)` | `NOT NULL` | Target firm |
| `role` | `VARCHAR(100)` | `NOT NULL` | Target job |
| `created_date` | `TIMESTAMP WITH TZ`| `server_default = now()` | Timestamp |

---

### 8. `linkedinhistory` Table
Stores generated recruiter messages.

| Column Name | Data Type | Constraints / Keys | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Auto-increment | Record identifier |
| `user_id` | `INTEGER` | Foreign Key (`user.id`), Index, `NOT NULL` | Target owner |
| `generated_message`| `TEXT` | `NOT NULL` | Pitch output |
| `target_company` | `VARCHAR(100)` | `NOT NULL` | Target firm |
| `created_date` | `TIMESTAMP WITH TZ`| `server_default = now()` | Timestamp |

---

## 2. Integrity Constraints & Cascades Rationale

### 1. Primary Keys (`PK`)
- **Rationale:** Ensures every single row inside all tables can be uniquely selected, updated, or deleted without ambiguous matching risks.

### 2. Foreign Keys (`FK`) & Cascading
- **Rule:** `ondelete="CASCADE"` is enforced across all parent-child relationships:
  - `resume.user_id` ➔ `user.id`
  - `application.user_id` ➔ `user.id`
  - `interview.application_id` ➔ `application.id`
  - `notification.user_id` ➔ `user.id`
  - `aichat.user_id` ➔ `user.id`
  - `coldemailhistory.user_id` ➔ `user.id`
  - `linkedinhistory.user_id` ➔ `user.id`
- **Why?** Prevents orphaned records in child tables, which would otherwise clutter storage and cause integrity violations or exceptions during API database queries.

### 3. Unique Constraints (`UK`)
- **Rule:** Enforced on `user.email`.
- **Why?** Prevents duplicate account registrations, ensuring that credentials mapping remains unique.

### 4. Non-Null Constraints (`NOT NULL`)
- **Rule:** Enforced on vital parameters (e.g. `company_name`, `email`, `prompt`, `generated_email`).
- **Why?** Safeguards the database from storing incomplete records, ensuring high data quality before data serialization.
