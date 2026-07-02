/**
 * File Explanation: dashboardData.js
 * 
 * Centralized mock database variables for job tracker applications, notifications,
 * scheduled interviews, user credentials, FAQs, and analytics metrics.
 */

export const INITIAL_APPLICATIONS = [
  {
    id: 'app-1',
    company: 'Stripe',
    role: 'Staff UI Engineer',
    dateApplied: '2026-06-15',
    stage: 'Technical Screen',
    status: 'Active',
    recruiter: 'Alex Smith',
    notes: 'Focus on React performance, CSS render pipelines, and bundler configurations.'
  },
  {
    id: 'app-2',
    company: 'Vercel',
    role: 'Senior Frontend Developer',
    dateApplied: '2026-06-20',
    stage: 'Manager Chat',
    status: 'Active',
    recruiter: 'Sarah Jenkins',
    notes: 'Discussed Next.js App Router architectures and incremental static regeneration.'
  },
  {
    id: 'app-3',
    company: 'Linear',
    role: 'Product Engineer (Frontend)',
    dateApplied: '2026-06-10',
    stage: 'Applied',
    status: 'Pending',
    recruiter: 'David Hall',
    notes: 'Clean UX and keyboard shortcuts focus.'
  },
  {
    id: 'app-4',
    company: 'Clerk',
    role: 'Developer Advocate',
    dateApplied: '2026-05-25',
    stage: 'Offer Stage',
    status: 'Accepted',
    recruiter: 'Emily Ross',
    notes: 'Offer letter received! Base + Equity options are competitive.'
  },
  {
    id: 'app-5',
    company: 'Google',
    role: 'Software Engineer III',
    dateApplied: '2026-05-01',
    stage: 'Onsite Loop',
    status: 'Rejected',
    recruiter: 'Marcus Vance',
    notes: 'Cleared technical specs, but fit score fell below matching threshold on system design.'
  }
];

export const INITIAL_INTERVIEWS = [
  {
    id: 'int-1',
    company: 'Stripe',
    role: 'Staff UI Engineer',
    date: '2026-07-05',
    time: '14:00',
    mode: 'Google Meet',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    notes: 'Technical screen on React rendering optimization. Bring portfolio samples.',
    reminderSent: true,
    status: 'Upcoming'
  },
  {
    id: 'int-2',
    company: 'Vercel',
    role: 'Senior Frontend Developer',
    date: '2026-07-08',
    time: '10:00',
    mode: 'Zoom Video',
    meetingLink: 'https://vercel.zoom.us/j/123456789',
    notes: 'System architecture review on Next.js hydration optimizations.',
    reminderSent: false,
    status: 'Upcoming'
  },
  {
    id: 'int-3',
    company: 'Clerk',
    role: 'Developer Advocate',
    date: '2026-06-18',
    time: '11:00',
    mode: 'Slack Huddle',
    meetingLink: '#clerk-interview-room',
    notes: 'Introductory chat on authentication models and community evangelism. Completed.',
    reminderSent: true,
    status: 'Completed'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'warning',
    message: 'Interview Tomorrow: Stripe Staff UI Engineer at 14:00. Check notes.',
    date: '2026-07-02 09:00',
    read: false
  },
  {
    id: 'notif-2',
    type: 'success',
    message: 'Resume Analysis Complete: ATS score updated to 88% after keyword sync.',
    date: '2026-06-28 16:30',
    read: false
  },
  {
    id: 'notif-3',
    type: 'info',
    message: 'Application Updated: Vercel status advanced to Manager Chat stage.',
    date: '2026-06-25 11:20',
    read: true
  },
  {
    id: 'notif-4',
    type: 'warning',
    message: 'Follow-up Reminder: 5 days since submitting Linear application. Send ping.',
    date: '2026-06-20 09:00',
    read: true
  }
];

export const INITIAL_PROFILE = {
  name: 'Jane Doe',
  email: 'jane.doe@profile.com',
  title: 'Lead Frontend UI Architect',
  bio: 'Passionate UI engineer specializing in high-performance React architectures, responsive glassmorphic interfaces, and modular CSS design tokens.',
  location: 'San Francisco, CA',
  skills: ['React', 'JavaScript', 'HTML5', 'CSS Variables', 'Vite', 'Next.js', 'System Design', 'UI/UX', 'Performance Auditing'],
  education: [
    { school: 'UC Berkeley', degree: 'B.S. Computer Science', year: '2020' }
  ],
  experience: [
    { company: 'TechNova Solutions', role: 'Senior React Developer', years: '2022 - 2026' },
    { company: 'AppForge Inc', role: 'Software Engineer II', years: '2020 - 2022' }
  ],
  links: {
    github: 'https://github.com/janedoe-ui',
    linkedin: 'https://linkedin.com/in/janedoe-frontend',
    portfolio: 'https://janedoe.dev',
    resumeName: 'Jane_Doe_Resume_2026.pdf'
  },
  certificates: [
    { title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2025' },
    { title: 'Advanced React Architecture Credential', issuer: 'Frontend Masters', year: '2024' }
  ]
};

export const SUPPORT_FAQS = [
  {
    question: 'How does the ATS score scan my resume?',
    answer: 'Our mock ATS scanner parses your text blocks for keywords, comparing them against the target job requirements. It evaluates keyword density, formatting structures (looking for un-parseable double columns), and contact metadata, outputting a score out of 100.'
  },
  {
    question: 'How do I customize outreach templates?',
    answer: 'Navigate to either the Cold Email Generator or the LinkedIn Generator. Set your parameters (Company, Recruiter, Role, Tone), click "Generate", and you can edit the text directly in the review field before clipboard copying!'
  },
  {
    question: 'Can I log manual applications and interviews?',
    answer: 'Absolutely! Our dashboard provides comprehensive tracker desks where you can add new rows to applications and list upcoming interviews. All changes are stored locally in your browser workspace.'
  },
  {
    question: 'Where is my profile data stored?',
    answer: 'CareerCopilot AI values privacy. Because this is a frontend mock demonstration, all profile coordinates, resume details, and logged applications are saved directly in your browser local storage. No data is sent to external clouds.'
  }
];

export const ANALYTICS_DATA = {
  monthlyApplications: [
    { month: 'Jan', count: 4 },
    { month: 'Feb', count: 8 },
    { month: 'Mar', count: 12 },
    { month: 'Apr', count: 15 },
    { month: 'May', count: 19 },
    { month: 'Jun', count: 24 }
  ],
  stagesBreakdown: [
    { stage: 'Applied', count: 8, color: 'var(--text-muted)' },
    { stage: 'Phone Screen', count: 4, color: 'var(--color-accent-purple)' },
    { stage: 'Technical Loop', count: 3, color: 'var(--color-accent)' },
    { stage: 'Offers', count: 1, color: 'var(--color-success)' }
  ],
  skillLevels: [
    { name: 'React Architecture', level: 95 },
    { name: 'Vite & Bundling', level: 85 },
    { name: 'Vanilla CSS Design', level: 90 },
    { name: 'System Design', level: 75 },
    { name: 'Outreach & Copywriting', level: 80 }
  ]
};
