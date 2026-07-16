# Architectural Decision Records (ADR) - CareerCopilot AI (Modules 2.0 & 3.0)

## ADR-001: Selection of React as UI Library
- **Decision:** Use React 18+ for building the CareerCopilot UI.
- **Rationale:** React's component-driven model enables developers to build self-contained, reusable UI blocks. The huge ecosystem of packages (like React Router) ensures we don't have to reinvent routing or page layouts.
- **Alternatives Considered:** Vanilla HTML/JS (too tedious for SaaS state management), Vue.js (smaller ecosystem).

## ADR-002: Selection of Vite as Bundling Tool
- **Decision:** Use Vite for development and compilation.
- **Rationale:** Vite utilizes native ES modules, enabling nearly instantaneous Hot Module Replacement (HMR) regardless of project size. It compiles production bundles using Rollup, resulting in smaller asset footprints than Create React App (which relies on Webpack).
- **Alternatives Considered:** Webpack / Create React App (CRA is deprecated, slow startup).

## ADR-003: Selection of JavaScript (ES6+)
- **Decision:** Implement frontend logic using JavaScript.
- **Rationale:** Allows rapid prototyping of features without the strict compilation requirements of TypeScript, which fits early-stage validation tasks.
- **Alternatives Considered:** TypeScript (increases initialization overhead; can be migrated to in later stages if type safety becomes a priority).

## ADR-004: Design Theme: Dark Blue + White + Dual Accent (Cyan/Indigo)
- **Decision:** Select Space Midnight Background (`#050816`), Navy Card background (`#0B1124`), with Electric Cyan (`#38BDF8`) and Indigo Violet (`#8B5CF6`) accent layers.
- **Rationale:** Blue inspires feelings of trust and career stability. The dark theme minimizes eye fatigue. The addition of Electric Cyan and Indigo violet glow highlights denotes modern machine intelligence (AI Co-pilot theme), making the visual interface feel modern and startup-grade.
- **Alternatives Considered:** Flat single-blue layout (felt like a template, lacked premium SaaS glow).

## ADR-005: Modular Architecture & Nested Layout Scaffolds
- **Decision:** Group page scopes into public marketing layouts (`AppLayout`) and authenticated dashboard environments (`DashboardLayout`) utilizing nested React Router structures.
- **Rationale:** Separating marketing pages (Hero, FAQ, Testimonials) from operational workspace panels keeps CSS classes isolated, guarantees page load optimization, and secures viewport scroll states.
- **Alternatives Considered:** Single flat layout directory (causes class pollution and forces unnecessary re-rendering of structural headers on layout swaps).

## ADR-006: Reusable Component System
- **Decision:** Extract common elements (Logo, Buttons, Inputs, Cards) into reusable React components and CSS classes.
- **Rationale:** Reusable components ensure consistent styling across the application, speed up development, and simplify maintenance. When a design system updates (e.g. a button border radius changes), it is modified in a single file instead of multiple pages.
- **Alternatives Considered:** Inline ad-hoc styling on every page (creates bloated code, leads to style discrepancies, and is difficult to refactor).

## ADR-007: SaaS Dashboard Layout with Top-Nav and Sticky-Sidebar
- **Decision:** Restructure the operational shell layout into a Top Navbar (100% width) sitting directly above a sidebar-content split-grid.
- **Rationale:** Fits industry-standard SaaS structures where the account/notification bar is globally visible at the top, and the sidebar is anchored directly below it to navigate secondary resource paths.
- **Alternatives Considered:** Sidebar-first layout (made mobile responsive headers more complex to align).

## ADR-008: Reusable Component Library for Dashboard Telemetry
- **Decision:** Build reusable `StatCard`, `Badge`, `PageHeader`, `EmptyState`, `NotificationCard`, and `ApplicationTable` components.
- **Rationale:** Consolidates common structures. The `ApplicationTable` maps all job variables into custom grids, and the `Badge` handles all color overrides for status flags, maintaining high visual hierarchy and code reuse.
- **Alternatives Considered:** Coding ad-hoc tables on each subpage (violates DRY principles and increases file size).

## ADR-009: Collapsible Sidebar Layout Navigation
- **Decision:** Support collapsing transitions on the Sidebar, shifting from `260px` to `70px` and hiding labels to show only icons.
- **Rationale:** Allows users to maximize active viewport space for screen-heavy features (like analytics charts or chat frames) while preserving single-click navigation.
- **Alternatives Considered:** Fixed width sidebar (camps screen space, poor fit for multi-grid tables).

## ADR-010: Client-side State Persistence via localStorage
- **Decision:** Pre-populate and mutate mock dashboard records using a custom `useLocalStorage` hook and `mockDb` service wrapper.
- **Rationale:** Allows complete interactive mock capability (adding applications, filtering interviews, clearing notifications) completely frontend-only without database overhead.
- **Alternatives Considered:** In-memory state variables (wipes records on page refreshes, poor user experience).

## ADR-011: Selection of FastAPI as Backend Framework
- **Decision:** Use FastAPI for building the Python backend REST API.
- **Rationale:** High performance, native asynchronous ASGI architecture support, and automatic OpenAPI generation via Pydantic schemas make FastAPI the ideal framework for fast REST APIs.
- **Alternatives Considered:** Django (overly heavy, slow startup, complex configuration), Flask (synchronous by default, lacks automatic Pydantic validation out of the box).

## ADR-012: Selection of Uvicorn as ASGI Web Server
- **Decision:** Run FastAPI using Uvicorn ASGI server.
- **Rationale:** Extremely fast, conforms to ASGI specifications, and works seamlessly with FastAPI's async loops to handle high concurrent HTTP loads.
- **Alternatives Considered:** Gunicorn (WSGI-based, requires ASGI worker plugins like Uvicorn workers for async operations).

## ADR-013: API Versioning scheme (`/api/v1/`)
- **Decision:** Route all endpoints under versioned prefixes (e.g. `/api/v1/health`).
- **Rationale:** Allows future endpoints (v2, v3) to be deployed concurrently without breaking legacy clients.
- **Alternatives Considered:** Flat unversioned URLs (difficult to migrate database schemas or endpoint routes in the future).

## ADR-014: Centralized Error handling & logging middleware
- **Decision:** Implement a global exception handler in `errors.py` and request duration logger middleware.
- **Rationale:** Ensures consistent JSON error payloads regardless of failure type, preventing server traceback details from leaking, while auditing request times to watch for performance bottlenecks.
- **Alternatives Considered:** Ad-hoc try/catch blocks in every router path (prone to code repetition, difficult to guarantee consistent error formats).

## ADR-015: Selection of PostgreSQL as Production Database
- **Decision:** Use PostgreSQL as the production database for CareerCopilot AI.
- **Rationale:** Highly reliable, complies with SQL standards, supports complex relational schemas, indexes, and constraints, and is the industry-standard open-source database for SaaS systems.
- **Alternatives Considered:** MySQL (less robust JSON handling), MongoDB (NoSQL lacks native relational constraint checking for transaction trackers).

## ADR-016: Selection of SQLAlchemy 2.x as ORM
- **Decision:** Use SQLAlchemy 2.0+ as the Object Relational Mapper (ORM).
- **Rationale:** SQLAlchemy 2.x provides a modern query execution interface (e.g. `select()`), automatic session handling, type checking, and native integration with FastAPI validation layers.
- **Alternatives Considered:** Tortoise ORM (lacks maturity), raw SQL query drivers (prone to injection attacks and lacks object mapping helper properties).

## ADR-017: Selection of Alembic as Database Migration Engine
- **Decision:** Initialize and manage schema migrations utilizing Alembic.
- **Rationale:** Standard companion for SQLAlchemy that tracks database alterations incrementally as version files, ensuring production systems never require manual tables manipulation.
- **Alternatives Considered:** Manual SQL delta scripts (highly error-prone and difficult to deploy consistently).

## ADR-018: Database Normalization & Constraint Rules
- **Decision:** Normalize the data models to Third Normal Form (3NF) and enforce strict constraints (Cascade delete, Foreign Keys, Unique values, Indexes on query paths).
- **Rationale:** Prevents orphan records (e.g. deleting an application automatically cascades to purge its associated interviews) and optimizes query lookups via index keys (e.g. `email` index on users).
- **Alternatives Considered:** Denormalized flat structures (leads to update anomalies and data duplication).

## ADR-019: Decoupled Data Access via Repository Pattern
- **Decision:** Restructure data transactions inside a repository layer (`app/repositories/`).
- **Rationale:** Isolates query logic from routers. The API layer talks to repository interfaces, enabling database engines to be swapped or mocked in unit tests without changing endpoint business logic.
- **Alternatives Considered:** Direct SQLAlchemy query execution inside router methods (leads to tight coupling, making testing harder).

## ADR-020: Stateless Token-based Security Architecture (JWT)
- **Decision:** Implement stateless authentication utilizing signed JWT access tokens (15m expiration) sent via Authorization headers and refresh tokens (7d expiration) stored as HttpOnly, Secure cookies.
- **Rationale:** Prevents server session storage bloat and protects active sessions from XSS token theft.
- **Alternatives Considered:** Stateful session tables (scales poorly on high traffic).

## ADR-021: API Versioning in URL Paths
- **Decision:** Implement API versioning via URL paths (e.g. `/api/v1/...`).
- **Rationale:** Highly visible, easily cached by CDNs, and allows deploying breaking changes (v2) side-by-side with legacy v1 endpoints.
- **Alternatives Considered:** Header-based versioning (harder to test and inspect).

## ADR-022: Unified JSON Response Standards
- **Decision:** Enforce a unified JSON envelope format `{ "success": bool, "data": obj, "error": obj }` returned on all API paths.
- **Rationale:** Ensures consistent data parsing on the React frontend and simplifies catch-all response deserialization.
- **Alternatives Considered:** Allowing arbitrary, un-enveloped JSON structures.

## ADR-023: Passlib CryptContext with Bcrypt Hashing
- **Decision:** Utilize Passlib's `CryptContext(schemes=["bcrypt"])` to hash and verify passwords in the UserRepository.
- **Rationale:** Bcrypt incorporates an auto-generated salt and key stretching (work factor) to protect passwords against brute-force and rainbow table attacks.
- **Alternatives Considered:** Raw SHA256 hashing (vulnerable to dictionary lookups).

## ADR-024: Secure Cookie Handling for Session Refresh
- **Decision:** Store the JWT refresh token inside an `HttpOnly`, `Secure`, `SameSite=Strict` cookie during login.
- **Rationale:** Prevents JavaScript from reading the token via document.cookie, mitigating XSS theft, while SameSite blocks cross-site request forgery (CSRF) attempts.
- **Alternatives Considered:** Storing refresh tokens in client-side localStorage (high security risk).

## ADR-025: Transient Key Fallbacks for Startup Verification
- **Decision:** Generate a cryptographically secure transient fallback key (`secrets.token_hex(32)`) at boot if `JWT_SECRET` is not set in the environment.
- **Rationale:** Allows local development, test suites, and compilation checks to run cleanly without forcing developers to configure local variables upfront, while invalidating active logins on server restarts to prevent security holes.
- **Alternatives Considered:** Failing startup immediately when variables are missing (degrades local developer experience).

## ADR-026: Local Disk Storage with User-ID Partitioning
- **Decision:** Store uploaded resumes locally in development under a directory partitioned by User ID (e.g. `uploads/{user_id}/resume_v{version}.pdf`).
- **Rationale:** Keeps files isolated on disk, prevents version namespace collisions, and mirrors folder hierarchies used in cloud bucket architectures.
- **Alternatives Considered:** Flat storage layouts without partitioning (causes naming conflicts and scalability bottlenecks).

## ADR-027: Strict PDF File Upload Validations
- **Decision:** Restrict resume uploads strictly to PDF formats (file extension `.pdf` and MIME type `application/pdf`) and enforce a maximum file size limit of 10MB.
- **Rationale:** Minimizes security risks (like executable uploads or cross-site scripting payload injection) and ensures high data consistency before running ATS parsing operations.
- **Alternatives Considered:** Allowing DOCX/images directly (increases security risks and requires more complex server-side converters).

## ADR-028: S3 Cloud Object Storage Migration Design
- **Decision:** Structure the local storage service interface (file writes, reads, deletes) so it can be swapped with AWS S3 / Azure Blob Storage cloud providers in production without modifying database schemas.
- **Rationale:** Decouples core logic from physical storage hardware, simplifying cloud deployment migrations in the future.
- **Alternatives Considered:** Directly coupling S3 API calls inside routing controllers (violates isolation boundaries).

## ADR-029: Local Rule-Based NLP & Regex Parsing
- **Decision:** Utilize regex pattern parsers and keyword-dictionary matching via `pdfplumber` to extract resume sections (Education, Skills, Experience, Projects) and contact coordinates locally.
- **Rationale:** Guarantees instantaneous, zero-cost text parsing that requires no external API connections, maintaining strict user privacy and high processing speeds.
- **Alternatives Considered:** Calling remote LLMs (costly, slow, and raises user privacy concerns).

## ADR-030: Transparent ATS Scoring Breakdown
- **Decision:** Implement a transparent, rule-based mathematical scoring algorithm (0-100 scale: 30% contact completeness, 60% essential sections presence, 10% word density metrics).
- **Rationale:** Provides job seekers with clear, actionable recommendations and reproducible scores that don't suffer from LLM hallucination inconsistencies.
- **Alternatives Considered:** Generative AI score audits (non-deterministic and slow).

## ADR-031: Isolated Metadata Database Model
- **Decision:** Store parsed resume analyses and ATS scores inside a separate, dedicated `resume_analyses` table mapped via `ResumeAnalysis` SQLAlchemy model.
- **Rationale:** Isolates large parsed text blocks from core transactional search queries on resumes, optimizing database search and read operations.
- **Alternatives Considered:** Storing parsed data as bloated text fields inside the `resumes` table (degrades search performance).

## ADR-032: Job Application Schema Extensions
- **Decision:** Add priority, recruiter contact details, salary trackers, joining dates, favorite indicators, and archive states directly to the `application` table.
- **Rationale:** Equips the application tracker with Huntr/Teal-like CRM capabilities while maintaining a single cohesive database entity.
- **Alternatives Considered:** Keeping the metadata columns in a separate table (introduces unnecessary join query overhead).

## ADR-033: Strict State Machine Workflow Validation
- **Decision:** Enforce logical state machine workflow transitions (e.g. from `Offer` ➔ `Accepted`, and blocking jumps from `Interested` ➔ `Accepted`) with HTTP 400 Bad Request responses.
- **Rationale:** Guarantees database state integrity, preventing users from logging logically impossible transitions.
- **Alternatives Considered:** Open/flexible status updates (leads to inconsistent pipeline stages history).

## ADR-034: Chronological Transition History (Timeline Tracking)
- **Decision:** Store every status change in a dedicated `application_timelines` table linked to the `application` record.
- **Rationale:** Preserves historical audit records of a candidate's journey (e.g. Applied ➔ OA ➔ Technical Interview) without overwriting past state changes.
- **Alternatives Considered:** Storing only the current stage on the application record (erases the candidate's transition timeline history).

## ADR-035: Alembic Batch Migration Mode for SQLite
- **Decision:** Configure Alembic with `render_as_batch=True` to compile database schemas inside a batch context.
- **Rationale:** Works around SQLite's lack of support for standard `ALTER TABLE ... ALTER COLUMN` DDL operations, facilitating consistent migrations in both development and production databases.
- **Alternatives Considered:** Modifying raw SQL migrations manually (error-prone and violates ORM automation principles).

## ADR-036: Generic CRUD Support on BaseRepository
- **Decision:** Equip `BaseRepository` with standard `update` and `remove` method implementations using generic entity mappings and parameter dictionaries.
- **Rationale:** Standardizes update and delete operations across all repositories, resolving a latent issue with missing write methods on base repositories, and minimizing repetitive database code.
- **Alternatives Considered:** Duplicating custom update/delete logic inside every individual repository (violates DRY principles).

## ADR-037: Automatic Application Status Promotion on Scheduling
- **Decision:** Automatically transition a job application's current stage to `"Technical Interview"` and write to the application timeline history whenever an interview slot is scheduled (if the current stage is `"Interested"` or `"Applied"`).
- **Rationale:** Minimizes candidate friction by keeping job tracker cards in sync with scheduled calendar appointments automatically.
- **Alternatives Considered:** Requiring candidates to update both the interview calendar details and drag-and-drop the card status manually (poor user experience).

## ADR-038: Rich Notification Schema Extensions
- **Decision:** Extend the `notification` model mapping with specific columns: `notification_type`, `priority`, `icon`, `expires_at`, `metadata_json`, and `action_url` for routing.
- **Rationale:** Supports customizable alerts for different event severities (success, warning, error) and allows routing candidates to relevant views (e.g., calendar redirects) while preserving structured contextual payload values.
- **Alternatives Considered:** Storing only simple text messages without priorities or routing links (forces client-side string parsings).

## ADR-039: Service-Layer Decoupled Notification Triggers
- **Decision:** Trigger automated alerts inside service-layer transactional contexts (e.g., `ResumeService`, `ApplicationService`, `InterviewService`) rather than endpoint controllers.
- **Rationale:** Guarantees that alerts are generated consistently whenever domain objects are modified, regardless of which REST controller or background job triggered the event.
- **Alternatives Considered:** Putting triggers in endpoint routers (leads to code duplication and missing triggers on background tasks).

## ADR-040: Auto-Retention Cleanups for Notification Logs
- **Decision:** Set default TTL retention limits (30 days) and expose a dedicated system cleaning route (`DELETE /expired`) calling bulk purge deletes.
- **Rationale:** Prevents database growth and keeps index spaces small, maintaining fast search performance over long-term platform operations.
- **Alternatives Considered:** Keeping historical notification logs indefinitely (degrades database read/write speeds over time).

## ADR-041: Axios Base Instance & Interceptor Token Refreshes
- **Decision:** Build a unified `api.js` Axios instance configured with `import.meta.env.VITE_API_BASE_URL`. Implement request interceptors to inject authorization headers, and response interceptors to catch 401 unauthorized errors, automatically trigger `/auth/refresh` cookies endpoints, and retry the original request.
- **Rationale:** Centralizes token management, handles session refreshes transparently without forcing the user to log in again, and enforces session termination upon refresh failure.
- **Alternatives Considered:** Calling `fetch` manually in every component (leads to massive code replication and complex error handling).

## ADR-042: React Context API for Session States
- **Decision:** Manage global states (`user`, `loading`, `error`, `isAuthenticated`) inside a React `AuthContext` provider. Expose user flows (`login`, `register`, `logout`) via a custom `useAuth` hook.
- **Rationale:** Provides clean access to session details across all layouts, dashboards, and route protection checks without prop-drilling or initializing heavy Redux stores.
- **Alternatives Considered:** Managing state locally in layout components (causes synchronization bugs and complex prop passing).

## ADR-043: Consolidated Dashboard Endpoint Data Fetches
- **Decision:** Fetch dashboard metrics, upcoming interview cards, notifications feed, and active resume structures in parallel using `Promise.all` on mount.
- **Rationale:** Reduces dashboard loading latencies and prevents redundant database reads, optimizing UI responsiveness.
- **Alternatives Considered:** Sequential calls (results in slow, cascading loading waterfalls).

## ADR-044: Global Model Mapper Registration at App Boot
- **Decision:** Explicitly import `app.database.base` inside the ASGI main startup module `app/main.py`.
- **Rationale:** Ensures all SQLAlchemy model mappers are initialized and compiled in the registry at system boot, resolving dynamic relationship import errors like missing `'AIChat'` class definitions.
- **Alternatives Considered:** Importing models on demand in endpoints (causes race conditions and runtime crashes when dependent classes aren't yet loaded).

## ADR-045: Client-Side Job Description Keyword Matching
- **Decision:** Evaluate job description keyword matches and locate gaps client-side by scanning pasted text against `TECH_SKILLS_DB` and matching against the active resume's parsed skills.
- **Rationale:** Offloads heavy string regex matching from the backend server, provides sub-millisecond response rates, and creates a seamless interactive UI experience.
- **Alternatives Considered:** Implementing a dedicated POST endpoint for every text comparisons (creates unnecessary server latency).

## ADR-046: Slide-Out Drawers for CRM Application Timelines
- **Decision:** Display application details, priorities, salaries, and chronological stage-change timelines inside a right-aligned slide-out drawer rather than separate page routes.
- **Rationale:** Maintains context inside the tabular workspace grid, reducing screen transitions and improving search/filters efficiency.
- **Alternatives Considered:** Redirecting users to a separate `/applications/{id}` detail page (results in high navigation friction).

## ADR-047: Local Lookup Dictionaries for Interview App Mappings
- **Decision:** Fetch user applications list and create a fast lookup map (`appMap`) in the frontend client during interviews calendar mounts.
- **Rationale:** Allows showing parent company names and job roles on scheduled interview cards dynamically without modifying the backend schemas or adding join overhead to API responses.
- **Alternatives Considered:** Querying the application endpoint for each interview item sequentially (causes N+1 query patterns).

## ADR-048: Global Custom Events for Notifications State Synchronization
- **Decision:** Dispatch a custom global event `auth:unread_notifications_changed` whenever notifications are marked read or deleted.
- **Rationale:** Allows independent workspace sections (like the Navbar bell or Sidebar counter badges) to update counts instantly without forcing full page reloads.
- **Alternatives Considered:** Using heavy prop-drilling or polling endpoints repeatedly (degrades responsiveness).





