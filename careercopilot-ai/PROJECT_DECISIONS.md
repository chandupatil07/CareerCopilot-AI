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



