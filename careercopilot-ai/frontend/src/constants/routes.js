/**
 * File Explanation: routes.js
 * 
 * Reusable routing path constants for the frontend application.
 * Prevents hardcoding paths across layouts, sidebars, and protected route checks.
 */

export const ROUTES = {
  LANDING: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: {
    HOME: '/dashboard',
    RESUMES: '/dashboard/resumes',
    APPLICATIONS: '/dashboard/applications',
    INTERVIEWS: '/dashboard/interviews',
    ASSISTANT: '/dashboard/assistant',
    COLD_EMAIL: '/dashboard/cold-email',
    LINKEDIN: '/dashboard/linkedin-generator',
    ANALYTICS: '/dashboard/analytics',
    NOTIFICATIONS: '/dashboard/notifications',
    PROFILE: '/dashboard/profile',
    SETTINGS: '/dashboard/settings',
    SUPPORT: '/dashboard/support'
  }
};
