# Architectural Decision Records (ADR) - CareerCopilot AI (Module 1.2)

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
