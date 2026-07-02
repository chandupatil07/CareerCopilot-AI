# Database Index Strategy

This document details the index optimization strategy designed for the CareerCopilot AI PostgreSQL database. It outlines which columns are indexed, the underlying data structure, and the target queries they optimize.

---

## 1. Index Classifications

We utilize **B-Tree (Balanced Tree)** indexes. B-Trees are highly efficient for equality comparisons (`=`) and range queries (`<`, `>`, `BETWEEN`, `LIKE 'prefix%'`).

---

## 2. Table Index Selections

### 1. `user` Table

#### Index: `ix_user_email`
- **Columns:** `email` (Unique)
- **Type:** B-Tree
- **Optimized Queries:**
  - `SELECT * FROM "user" WHERE email = :email;` (Used during login and token refresh audits).
- **Rationale:** Login requires fetching user credentials by email. Because email is unique, this index reduces query time to $O(\log n)$.

---

### 2. `resume` Table

#### Index: `ix_resume_user_id`
- **Columns:** `user_id`
- **Type:** B-Tree
- **Optimized Queries:**
  - `SELECT * FROM resume WHERE user_id = :user_id;` (Fetches the user's uploaded resume versions).
- **Rationale:** The dashboard frequently displays a user's resume history. Indexing the foreign key prevents full table scans when rendering the Resume Center.

---

### 3. `application` Table

#### Index: `ix_application_user_id`
- **Columns:** `user_id`
- **Type:** B-Tree
- **Optimized Queries:**
  - `SELECT * FROM application WHERE user_id = :user_id ORDER BY applied_date DESC;` (Loads the user's job applications).
- **Rationale:** Every dashboard visit queries the active applications list. Indexing `user_id` ensures that page loading times remain fast as the database scales.

#### Index: `ix_application_company_name`
- **Columns:** `company_name`
- **Type:** B-Tree
- **Optimized Queries:**
  - `SELECT * FROM application WHERE company_name ILIKE :company_query;` (Searches applications by company name).
- **Rationale:** Users frequently search for jobs by company name. This index speeds up text search queries.

---

### 4. `interview` Table

#### Index: `ix_interview_application_id`
- **Columns:** `application_id`
- **Type:** B-Tree
- **Optimized Queries:**
  - `SELECT * FROM interview WHERE application_id = :application_id;` (Loads interviews scheduled for a specific application).
- **Rationale:** Essential for rendering the details card of a job application.

#### Index: `ix_interview_interview_date`
- **Columns:** `interview_date`
- **Type:** B-Tree
- **Optimized Queries:**
  - `SELECT * FROM interview WHERE interview_date >= :today;` (Queries upcoming interview schedules for calendar alerts).
- **Rationale:** Used by background reminder crons to identify interviews occurring in the next 24 hours.

---

### 5. `aichat` Table

#### Index: `ix_aichat_user_id` & `ix_aichat_conversation_id`
- **Columns:** `user_id`, `conversation_id`
- **Type:** B-Tree
- **Optimized Queries:**
  - `SELECT * FROM aichat WHERE user_id = :user_id AND conversation_id = :conversation_id ORDER BY created_at ASC;` (Loads chat history logs for a specific session).
- **Rationale:** Ensures conversational history streams render instantly without lag during chat sessions.

---

## 3. Tradeoffs & Maintenance Strategy

1. **Write Overhead:** Indexes slow down insert operations (`INSERT INTO application`). We only index columns that are frequently used in query filters (`WHERE` or `JOIN`).
2. **Cardinality Check:** We do **not** index columns with low cardinality (e.g. `resume.is_active` or `interview.reminder_sent` which are simple boolean flags), as index lookups on low-cardinality columns are often slower than full table scans.
