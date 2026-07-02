import { 
  INITIAL_APPLICATIONS, 
  INITIAL_INTERVIEWS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_PROFILE 
} from '../constants/dashboardData';

/**
 * File Explanation: mockDb.js
 * 
 * A mock client-side database service utility. In the absence of a real backend,
 * this file serves to initialize values in the local storage database and provide reset routines.
 */

const KEYS = {
  APPLICATIONS: 'cc_applications',
  INTERVIEWS: 'cc_interviews',
  NOTIFICATIONS: 'cc_notifications',
  PROFILE: 'cc_profile',
  ATS_SCORE: 'cc_ats_score'
};

export const mockDb = {
  initialize() {
    try {
      if (!window.localStorage.getItem(KEYS.APPLICATIONS)) {
        window.localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
      }
      if (!window.localStorage.getItem(KEYS.INTERVIEWS)) {
        window.localStorage.setItem(KEYS.INTERVIEWS, JSON.stringify(INITIAL_INTERVIEWS));
      }
      if (!window.localStorage.getItem(KEYS.NOTIFICATIONS)) {
        window.localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      }
      if (!window.localStorage.getItem(KEYS.PROFILE)) {
        window.localStorage.setItem(KEYS.PROFILE, JSON.stringify(INITIAL_PROFILE));
      }
      if (!window.localStorage.getItem(KEYS.ATS_SCORE)) {
        window.localStorage.setItem(KEYS.ATS_SCORE, '85');
      }
    } catch (e) {
      console.error('Error initializing mock localStorage database:', e);
    }
  },

  reset() {
    try {
      window.localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
      window.localStorage.setItem(KEYS.INTERVIEWS, JSON.stringify(INITIAL_INTERVIEWS));
      window.localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      window.localStorage.setItem(KEYS.PROFILE, JSON.stringify(INITIAL_PROFILE));
      window.localStorage.setItem(KEYS.ATS_SCORE, '85');
      window.location.reload(); // Refresh the page to reload state
    } catch (e) {
      console.error('Error resetting database:', e);
    }
  }
};

export default mockDb;
