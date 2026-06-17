/**
 * File Explanation: vite.config.js
 * 
 * 1. What is it?
 *    vite.config.js is the configuration file for the Vite build tool and dev server.
 * 
 * 2. Why is it needed?
 *    It allows developers to customize the behavior of the bundler, register plugins (like React support),
 *    and configure local development servers.
 * 
 * 3. How does it work?
 *    Vite reads this file on startup, processes any registered plugins, and applies custom configurations
 *    (like aliases, proxies, and build output directories) to compile code.
 * 
 * 4. Real-world example
 *    Companies configure vite.config.js to set up path aliases (e.g., mapping '@' to 'src/') or configure
 *    proxy servers to route API requests to local backend services without encountering CORS errors.
 * 
 * 5. Advantages
 *    - Simplifies configuration compared to complex Webpack configs.
 *    - Natively supports plugins like `@vitejs/plugin-react` to enable Hot Module Replacement (HMR).
 *    - Easy to customize ports, hosts, and build parameters.
 * 
 * 6. Limitations
 *    - Relies on ES Modules (requires `"type": "module"` in package.json or using the `.mjs` extension).
 * 
 * 7. Interview questions
 *    - What is the role of the `@vitejs/plugin-react` plugin in Vite?
 *    - How do you configure a dev server port in Vite?
 * 
 * 8. Interview answers
 *    - Answer: The plugin integrates React support into Vite, enabling JSX compilation, React-specific
 *      warnings, and Fast Refresh (Hot Module Replacement) so component edits render instantly without losing state.
 *    - Answer: By adding a `server` object in the configuration export with a `port` key: e.g., `server: { port: 3000 }`.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true // Opens browser on dev server start
  }
});
