/**
 * File Explanation: App.jsx
 * 
 * 1. What is it?
 *    App.jsx is the root React component of the application, serving as the shell container for routing
 *    and global state providers.
 * 
 * 2. Why is it needed?
 *    It binds together global systems (like routers, telemetry, or UI notification context providers)
 *    and launches them as the primary component tree when React mounts the application.
 * 
 * 3. How does it work?
 *    It imports the React Router configuration (`router`) and returns the `<RouterProvider>` element,
 *    passing it the configured route map to govern page state.
 * 
 * 4. Real-world example
 *    Enterprise applications wrap their root component in App.jsx with internationalization (i18n), Redux stores,
 *    and theme configurations to make them globally accessible.
 * 
 * 5. Advantages
 *    - Centralized context initialization.
 *    - Keeps the mounting code (main.jsx) completely clean and decoupled from page-level configurations.
 *    - Simple component footprint.
 * 
 * 6. Limitations
 *    - Placing too many global state providers directly here makes the component hard to read,
 *      a problem solved by creating separate context aggregation components.
 * 
 * 7. Interview questions
 *    - What is the purpose of the `<RouterProvider>` component?
 *    - How do you register global styling files in a React Vite application?
 * 
 * 8. Interview answers
 *    - Answer: `<RouterProvider>` binds React Router's state history and URL matcher to the React component tree,
 *      ensuring changes to the address bar dynamically update layout and page views.
 *    - Answer: By using standard ES module imports (e.g. `import './index.css';`) inside the root entry files
 *      (App.jsx or main.jsx), letting Vite compile and link the styles during compilation.
 */

import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;

