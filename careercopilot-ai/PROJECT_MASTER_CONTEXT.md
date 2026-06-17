# File Explanation: PROJECT_MASTER_CONTEXT.md

## 1. What is it?
`PROJECT_MASTER_CONTEXT.md` is the high-level design and architectural boundaries document for the CareerCopilot AI startup.

## 2. Why is it needed?
In a startup development context, team alignment is critical. This document sets the high-level business vision, target audience, core pillars of the product, and explicit system boundaries so that engineers build features aligned with the business domain.

## 3. How does it work?
It acts as a static blueprint detailing product requirements, user experience rules (like the Human-in-the-loop validation rule), and system interface boundaries.

## 4. Real-world example
Product Managers and Tech Leads in software firms write Product Requirement Documents (PRDs) and Master Context documents to orient new developers and align cross-functional product teams.

## 5. Advantages
- **Unified Vision:** Prevents scope creep.
- **Explicit Rules:** Outlines critical rules (e.g., user-confirmation rules) to prevent accidental automation issues.
- **Architectural Scope:** Clearly defines what is *out of scope* for early phases.

## 6. Limitations
- **Evolving Product:** Product specs change rapidly in early-stage startups; this requires constant updates.

## 7. Interview questions
- *What is the difference between a technical design doc and a product master context doc?*
- *Why is a "Human-in-the-loop" approval step critical for AI-driven automated tools in enterprise systems?*

## 8. Interview answers
- *Answer:* A master context document focuses on the *why*, *what*, boundaries, and business rules of the platform, whereas a technical design document details the *how* (data schemas, server routes, specific algorithms).
- *Answer:* For actions like sending emails or applying to jobs, automation without confirmation risks reputational damage (unprofessional spamming) and high rate-limit costs, making user confirmation mandatory for professional-grade trust.

---

# PROJECT MASTER CONTEXT: CareerCopilot AI

## 1. Product Vision & Value Proposition
CareerCopilot AI is a premium career-management dashboard built for professionals who want to optimize their career progression. By aggregating resume tailoring, application tracking, interview tracking, and cold outreach under a single unified hub, the platform serves as a virtual career manager.

## 2. Core Pillars
- **Resume Tailoring & Analysis:** Highlighting gaps in resumes compared to target descriptions.
- **Application & Interview Tracker:** Streamlining the pipeline from application to offer.
- **LinkedIn / Cold Email Generator:** Auto-generating hyper-customized outreach templates.
- **Human-in-the-Loop AI Guidance:** Under no circumstances does the system execute actions (sending emails, updating status, scheduling follow-ups) without explicit user approval.

## 3. System Boundaries (Module 1.1)
- **Frontend Focus:** Single Page Application (SPA) utilizing Vite + React.
- **Client-Side Rendering (CSR):** React-controlled routing via React Router DOM.
- **No Backend integration:** State is simulated locally (and will be integrated with mocks in Module 1.2).
- **Design system:** Pure vanilla CSS for maximum extensibility, using custom dark-blue variables.
