/**
 * File Explanation: routes.jsx (Upgraded Active Routing)
 * 
 * 1. What is it?
 *    routes.jsx is the routing configuration registry mapping URLs to public views and nested dashboard panels.
 * 
 * 2. Why is it needed?
 *    It acts as the URL controller, determining which layouts and child page components render
 *    when users navigate between public marketing views and dashboard workspace scopes.
 * 
 * 3. How does it work?
 *    It exports a React Router DOM router object containing defined routing paths. Nested scopes are managed
 *    by children routes arrays under parent layouts (like AppLayout and DashboardLayout).
 * 
 * 4. Real-world example
 *    Production SaaS tools route marketing panels and authenticated workspaces separately to keep layouts organized.
 * 
 * 5. Advantages
 *    - Centralized routing configuration.
 *    - Fully maps new AI outreach and prep modules cleanly.
 * 
 * 6. Limitations
 *    - Changes to routing links require updates to the sidebar menu paths.
 * 
 * 7. Interview questions
 *    - What is the benefit of grouping routes under layouts inside React Router?
 * 
 * 8. Interview answers
 *    - Answer: It allows sharing headers, footers, or navigation menus across multiple views, preventing code replication
 *      and optimizing page transition rendering.
 */

import React from 'react';
import { createBrowserRouter, Link } from 'react-router-dom';

// Layout Scaffolds
import AppLayout from '../layouts/AppLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Public Pages
import LandingPage from '../pages/LandingPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

// Dashboard Views
import DashboardHome from '../pages/dashboard/DashboardHome';
import Profile from '../pages/dashboard/Profile';
import ResumeCenter from '../pages/dashboard/ResumeCenter';
import Applications from '../pages/dashboard/Applications';
import Interviews from '../pages/dashboard/Interviews';
import AICareerAssistant from '../pages/dashboard/AICareerAssistant';
import ColdEmailGenerator from '../pages/dashboard/ColdEmailGenerator';
import LinkedInGenerator from '../pages/dashboard/LinkedInGenerator';
import CareerAnalytics from '../pages/dashboard/CareerAnalytics';
import Notifications from '../pages/dashboard/Notifications';
import Settings from '../pages/dashboard/Settings';
import Support from '../pages/dashboard/Support';

// Security and Constants
import ProtectedRoute from '../components/ProtectedRoute';
import { ROUTES } from '../constants/routes';

// ==========================================================================
// 404 CATCH-ALL ROUTE VIEW
// ==========================================================================
function NotFoundPage() {
  const containerStyle = {
    textAlign: 'center',
    padding: '6rem 1rem'
  };

  return (
    <div style={containerStyle} className="animate-fade-in">
      <h1 style={{ fontSize: '7rem', color: 'var(--color-accent)', marginBottom: '1rem', fontFamily: 'var(--font-headers)' }}>404</h1>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '480px', margin: '0 auto 2.5rem auto' }}>
        The page you are looking for does not exist or has been relocated to another workspace directory.
      </p>
      <Link to={ROUTES.LANDING} className="btn btn-primary">
        Return Home
      </Link>
    </div>
  );
}

// ==========================================================================
// ROUTER ROUTING CONFIGURATION
// ==========================================================================
export const router = createBrowserRouter([
  // 1. PUBLIC MARKETING SCOPE
  {
    path: ROUTES.LANDING,
    element: <AppLayout />,
    children: [
      {
        path: ROUTES.LANDING,
        element: <LandingPage />
      },
      {
        path: ROUTES.ABOUT,
        element: <AboutPage />
      },
      {
        path: ROUTES.CONTACT,
        element: <ContactPage />
      },
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />
      },
      {
        path: ROUTES.REGISTER,
        element: <RegisterPage />
      }
    ]
  },
  
  // 2. PRIVATE DASHBOARD SCOPE (NESTED UNDER PROTECTED SIDEBAR LAYOUT)
  {
    path: ROUTES.DASHBOARD.HOME,
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ROUTES.DASHBOARD.HOME,
        element: <DashboardHome />
      },
      {
        path: ROUTES.DASHBOARD.RESUMES,
        element: <ResumeCenter />
      },
      {
        path: ROUTES.DASHBOARD.APPLICATIONS,
        element: <Applications />
      },
      {
        path: ROUTES.DASHBOARD.INTERVIEWS,
        element: <Interviews />
      },
      {
        path: ROUTES.DASHBOARD.ASSISTANT,
        element: <AICareerAssistant />
      },
      {
        path: ROUTES.DASHBOARD.COLD_EMAIL,
        element: <ColdEmailGenerator />
      },
      {
        path: ROUTES.DASHBOARD.LINKEDIN,
        element: <LinkedInGenerator />
      },
      {
        path: ROUTES.DASHBOARD.ANALYTICS,
        element: <CareerAnalytics />
      },
      {
        path: ROUTES.DASHBOARD.NOTIFICATIONS,
        element: <Notifications />
      },
      {
        path: ROUTES.DASHBOARD.PROFILE,
        element: <Profile />
      },
      {
        path: ROUTES.DASHBOARD.SETTINGS,
        element: <Settings />
      },
      {
        path: ROUTES.DASHBOARD.SUPPORT,
        element: <Support />
      }
    ]
  },

  // 3. GLOBAL FALLBACK Catch-All
  {
    path: '*',
    element: <NotFoundPage />
  }
]);
export default router;
