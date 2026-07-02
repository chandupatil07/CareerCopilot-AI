# File Explanation: INTERVIEW_MASTER_NOTES.md

## 1. What is it?
`INTERVIEW_MASTER_NOTES.md` is a collection of mock interview questions, technical answers, and architectural explanations.

## 2. Why is it needed?
CareerCopilot AI is a career-coaching platform. This document serves as a study guide for senior engineering roles, focusing on React renders, bundlers (Vite/Rollup), styling systems, and routing mechanics.

## 3. How does it work?
It acts as a study sheet containing conceptual questions, code snippets, and structured explanations.

## 4. Real-world example
Candidates prep for tech interviews by compiling cheat sheets or reading guides (like the Tech Interview Handbook).

## 5. Advantages
- **Deep Technical Review:** Explains React reconciliation and bundler treeshaking.
- **Direct Alignment:** Prepares engineers for system design and code interviews.

## 6. Limitations
- **Focus Area:** Focuses on React/frontend engineering; does not cover system-wide backend design or DevOps.

## 7. Interview questions
- *How does a master interview notes file assist in developer mentoring?*

## 8. Interview answers
- *Answer:* It acts as a reference library of core concepts, ensuring team members have a shared understanding of deep technical concepts like Virtual DOM rendering cycles and code splitting.

---

# Interview Master Notes

This document contains deep technical questions and answers focusing on React, Vite, CSS, and SPA architectures.

---

## 1. React Reconciliation & Virtual DOM

### Question
*How does React's reconciliation algorithm work, and what is the significance of the `key` prop in lists?*

### Answer
Reconciliation is React's process of sync-ing the Virtual DOM with the real DOM. When component state changes:
1. React builds a new virtual tree.
2. It compares it with the previous virtual tree using a **heuristic O(n) diffing algorithm** based on two assumptions:
   - Two elements of different types will produce different trees.
   - Child elements can be marked as stable across renders using a `key` prop.
3. The `key` prop acts as a unique identifier for sibling elements. It tells React which items have been added, removed, or reordered. Without unique keys, React re-renders *all* list items instead of only updating the modified ones.

---

## 2. Bundling & Compiling: Vite & Rollup

### Question
*What is tree-shaking, and how does Vite/Rollup accomplish it?*

### Answer
**Tree-shaking** is a dead-code elimination process. It removes unused exports from the final bundle to reduce file size.
Vite uses Rollup for production builds, which performs tree-shaking by:
1. Relying on **ES Modules (ESM)** syntax (`import` / `export`), which is statically analyzable.
2. Scanning the import graph to find modules that are exported but never imported.
3. Excluding those unused modules from the final generated javascript bundle.

---

## 3. React Performance Optimization

### Question
*When should you use `useMemo` and `useCallback`? What are the tradeoffs?*

### Answer
- `useMemo` caches the *result* of a costly computation.
- `useCallback` caches the *instance* of a function declaration to prevent it from being recreated on every render.

**Tradeoffs:**
Do not wrap everything in these hooks. They have a runtime memory overhead because React must store dependencies in memory and run shallow comparisons on every render. Only use them:
- When passing function callbacks to children optimized with `React.memo` (to prevent unnecessary re-renders).
- For expensive mathematical or filtering operations (e.g., sorting 1,000 resumes).

---

## 4. SaaS Dashboard Layout Architecture

### Question
*How do you construct a reusable layout shell for a SaaS dashboard, and how does single-page application (SPA) routing manage nested subviews within it?*

### Answer
A modern SaaS dashboard layout is typically structured as follows:
1. **Top Navbar:** A horizontal header spanning 100% width, containing brand logo, search bar, notifications, and user avatar.
2. **Sidebar:** A vertical drawer positioned on the left side below the navbar, containing navigation links with icons for all core pages.
3. **Content Area:** A flex-grow or grid-mapped viewport placed on the right side next to the sidebar, hosting the active subview page.
4. **Footer:** A footer placed either sticky at the bottom of the content container or aligned below the subview contents.

To implement this layout dynamically in React:
- We use a layout shell component (e.g., `DashboardLayout`) that renders the shared layout elements (`Navbar`, `Sidebar`, `Footer`) and uses React Router's `<Outlet />` component in the main content pane.
- The router is configured with nested routes, where the layout is the parent component and each page view (e.g., `DashboardHome`, `Profile`, `Applications`) is defined as a child. When a route is matched, React Router renders the matching child view component inside the `<Outlet />` container.
- CSS styling utilizes custom variables, Flexbox (`display: flex`), or CSS Grid to manage heights. Usually, the sidebar has a fixed width (e.g., `260px`) and `height: calc(100vh - var(--navbar-height))`, with `overflow-y: auto` to allow scrollability while keeping the main shell sticky.

---

## 5. Reusable Component Decomposition

### Question
*What are the advantages of decomposing a dashboard UI into smaller, reusable presentational components (e.g., `StatCard`, `Badge`, `EmptyState`, `ApplicationTable`), and how should props be designed for them?*

### Answer
Decomposing complex views into highly focused, reusable components provides several benefits:
1. **Maintainability & DRY Principle:** Writing a tabular grid or badge styling once avoids duplicate CSS and HTML, ensuring that updates to spacing, fonts, or colors apply globally.
2. **Testing Isolation:** Smaller components have a single responsibility, making them easy to test in isolation with mock data.
3. **Visual Consistency:** Ensures identical hover micro-animations, color gradients, and layout margins across different pages.

**Component Prop Design Best Practices:**
- **Controlled Configuration:** Pass raw data arrays (e.g., list of applications to `ApplicationTable`) and let the component handle rendering, rather than hardcoding markup in the page views.
- **Dynamic CSS Classes/Modifiers:** Pass parameters like status or type to toggle states (e.g., a `type` prop on a `Badge` component like `applied`, `interviewing`, or `rejected` maps directly to CSS variable classes for styling).
- **Callback Handlers:** Interactive components should accept event callback props (e.g., `onEdit`, `onDelete` on a card or table row) to bubble actions back up to the parent page view which owns the state, keeping the presentational component stateless.

---

## 6. ASGI vs WSGI Server Architectures

### Question
*What is the difference between ASGI and WSGI server specifications in Python, and how does this affect runtime performance for concurrent API connections?*

### Answer
- **WSGI (Web Server Gateway Interface):** The traditional synchronous standard (used by default in Flask and Django). It binds a single request to a single thread. When a database query or model call blocks, the thread is blocked. Handling concurrent connections requires spawning more threads/processes, which consumes significant server memory.
- **ASGI (Asynchronous Server Gateway Interface):** The modern successor (used by FastAPI). It supports asynchronous execution of concurrent connections on a single thread. When an I/O task blocks (like an API call or database query), the thread suspends the task and yields control back to the event loop to process other incoming requests.
- **Performance Impact:** ASGI handles thousands of concurrent connections (like WebSockets, long polling, or chat streaming) with minimal memory overhead, outperforming WSGI by orders of magnitude under high network concurrency.

---

## 7. CORS (Cross-Origin Resource Sharing) browser security

### Question
*What is CORS, what are preflight requests, and how does configuring CORSMiddleware in FastAPI resolve browser script blocks?*

### Answer
- **CORS:** A security mechanism implemented by web browsers to enforce the Same-Origin Policy. It prevents javascript running on one domain (e.g., `localhost:5173`) from reading response data from another domain (e.g., `localhost:8000`) unless the target server authorizes that origin.
- **Preflight Request:** For non-simple requests (like POST with JSON payloads), the browser sends a pre-emptive HTTP `OPTIONS` request to query the server's authorized origins, methods, and headers.
- **FastAPI CORSMiddleware:** Intercepts these preflight `OPTIONS` requests and appends standard CORS headers (like `Access-Control-Allow-Origin`, `Access-Control-Allow-Headers`) to the HTTP response, authorizing the browser to complete the original script API call.

---

## 8. Pydantic Serialization & Data Validation

### Question
*How does Pydantic manage data validation and serialization under the hood in a FastAPI application, and what is HTTP 422?*

### Answer
- **Data Validation:** Pydantic uses Python type annotations to validate incoming HTTP payloads against class schemas (inheriting from `BaseModel`). It verifies type constraints (e.g., checking if an ID is an integer, or if an email matches regex guidelines) and automatically parses/casts string values.
- **Serialization:** It serializes native Python models back into standard JSON payloads.
- **HTTP 422 (Unprocessable Entity):** If an incoming request fails validation constraints (e.g., missing a required parameter, or incorrect data type), Pydantic catches it, raises a `RequestValidationError`, and FastAPI automatically intercepts it to return an HTTP 422 JSON payload containing detailed validation logs.

---

## 9. Telemetry Middleware in ASGI Frameworks

### Question
*How do you build a custom middleware in FastAPI to audit API request performance, and how does it execute during the request-response lifecycle?*

### Answer
- **Middleware Lifecycle:** Middleware runs globally, wrapping around the request-response pipeline. It receives the raw `Request` before it reaches target router paths, and intercepts the completed `Response` before it leaves the server.
- **Implementation:**
  1. Record the request start time using `time.perf_counter()`.
  2. Invoke `await call_next(request)` to pass execution down to the FastAPI router tree.
  3. Intercept the return `Response` (or catch the raised `Exception`).
  4. Calculate the process time, log request details (HTTP method, path, response status, duration in ms), and return the response.
- By placing this in middleware, we ensure that performance logging runs uniformly across all API routes, keeping the router code clean and focused.

