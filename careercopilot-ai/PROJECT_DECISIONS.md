# File Explanation: PROJECT_DECISIONS.md

## 1. What is it?
`PROJECT_DECISIONS.md` is an Architectural Decision Record (ADR) file. It documents the key technical decisions made during the project kickoff, detailing the rationale behind chosen technologies and designs.

## 2. Why is it needed?
As teams scale, developers often ask "Why did we write this in X?" or "Why did we use this pattern?". Documenting architectural tradeoffs avoids repeat debates, preserves historical context, and helps onboard new engineers with confidence.

## 3. How does it work?
It acts as a permanent record of decision-making, mapping options, tradeoffs, and finalized selections for easy reference.

## 4. Real-world example
Professional engineering teams use ADR directories to document why they migrated from REST to GraphQL, why they picked Postgres over MongoDB, or why they selected Vite over Webpack.

## 5. Advantages
- **Reduces Cognitive Overhead:** No need to re-verify stack decisions.
- **Architectural Traceability:** Explains the design decisions to future senior engineers or external reviewers.
- **Historical Accuracy:** Captures the constraints present at the moment the decision was made.

## 6. Limitations
- **Maintenance Discipline:** Developers must actively record new decisions as the stack grows.

## 7. Interview questions
- *What is an ADR (Architectural Decision Record) and how does it help a startup?*
- *Why might a team choose vanilla CSS variables over TailwindCSS or styled-components?*

## 8. Interview answers
- *Answer:* An ADR is a document capturing a clean technical decision, its context, alternatives considered, and consequences. In a startup, it prevents "architectural drift," keeping the codebase coherent and focused as new members join.
- *Answer:* Vanilla CSS variables are standard-compliant, require zero build-time configuration or runtime overhead, avoid dependency lock-in, and allow styling to scale natively in simple web components.

---

# Architectural Decision Records (ADR)

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

## ADR-004: Design Theme: Dark Blue + White
- **Decision:** Select Deep Dark Navy Blue (`#0A1128`) and Pure White/Off-White for typography.
- **Rationale:** Blue inspires feelings of trust, stability, and career professionalism. Dark Mode reduces eye strain during long career searches.
- **Alternatives Considered:** Light Mode by default (causes eye fatigue), Red/Green palettes (feels too aggressive for a professional career assistant).

## ADR-005: Modular Architecture (Components/Layouts/Routes)
- **Decision:** Separate the frontend application structure by layouts, pages (routes), and components.
- **Rationale:** Decoupling layout shells (Header, Navbar, Footer) from individual page views and shared elements (Buttons, Logos) keeps components highly modular and simple to test.
- **Alternatives Considered:** Flat folder structure (leads to "spaghetti code" folders where codebases grow unmanageable).
