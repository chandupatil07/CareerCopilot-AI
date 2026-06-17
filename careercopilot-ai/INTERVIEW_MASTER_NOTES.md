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
