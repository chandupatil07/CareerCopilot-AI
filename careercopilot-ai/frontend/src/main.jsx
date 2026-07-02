/**
 * File Explanation: main.jsx
 * 
 * 1. What is it?
 *    main.jsx is the compiler and runtime entry point for the React application in a Vite project.
 * 
 * 2. Why is it needed?
 *    It binds the React Virtual DOM to the native browser document node (`<div id="root">`), starting
 *    the React execution cycle in the browser.
 * 
 * 3. How does it work?
 *    It uses `ReactDOM.createRoot` to bind to `document.getElementById('root')` and calls `.render()`
 *    on the root node, injecting the `<App />` component tree under StrictMode.
 * 
 * 4. Real-world example
 *    Every Single Page Application needs a single mounting point that maps Javascript files to the index.html
 *    document, which is always what main.jsx (or index.js) does.
 * 
 * 5. Advantages
 *    - Separation of concerns: Handles mount mechanics, leaving App.jsx to handle component structures.
 *    - StrictMode highlights unsafe lifecycles, legacy API usages, and component re-render behaviors.
 * 
 * 6. Limitations
 *    - Executed only once on initial boot; modifications here require full server restarts or page refreshes.
 * 
 * 7. Interview questions
 *    - What does React.StrictMode do under the hood during development?
 *    - What is the difference between `react` and `react-dom` packages?
 * 
 * 8. Interview answers
 *    - Answer: StrictMode triggers double renders of components in development to help identify side effects,
 *      verify state consistency, and warn about deprecated APIs. It does not affect production builds.
 *    - Answer: `react` contains component structures, hooks, and Virtual DOM diffing algorithms. `react-dom`
 *      contains browser-specific mounting methods (like `createRoot`) to render virtual nodes into actual DOM elements.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import mockDb from './services/mockDb';

// Pre-populate mock localStorage tables for frontend SaaS simulation
mockDb.initialize();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
