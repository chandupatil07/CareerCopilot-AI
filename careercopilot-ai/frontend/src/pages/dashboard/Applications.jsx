import React from 'react';
import PageHeader from '../../components/PageHeader';
import ApplicationTable from '../../components/ApplicationTable';

function Applications() {
  const sampleJobs = [
    { id: 1, company: 'Google', role: 'Senior Front-End Dev', dateApplied: '2026-06-10', status: 'Interview Scheduled', source: 'Referral' },
    { id: 2, company: 'Stripe', role: 'Staff UI Engineer', dateApplied: '2026-06-12', status: 'Applied', source: 'LinkedIn' },
    { id: 3, company: 'Vercel', role: 'React Developer', dateApplied: '2026-06-14', status: 'Interested', source: 'Company Website' },
    { id: 4, company: 'Airbnb', role: 'Senior Product Engineer', dateApplied: '2026-06-08', status: 'Offer Received', source: 'Indeed' },
    { id: 5, company: 'Netflix', role: 'UI Architect', dateApplied: '2026-06-05', status: 'Interview Completed', source: 'Hired' },
    { id: 6, company: 'Uber', role: 'Senior Developer', dateApplied: '2026-06-01', status: 'Rejected', source: 'LinkedIn' },
    { id: 7, company: 'Figma', role: 'Product Designer', dateApplied: '2026-06-03', status: 'Accepted', source: 'Company Website' },
    { id: 8, company: 'Microsoft', role: 'Software Engineer', dateApplied: '2026-05-28', status: 'Assessment', source: 'Referral' }
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Job Applications Tracker" 
        description="Monitor application progress, interview stages, and feedback details in a tabular grid." 
        actions={
          <button className="btn btn-primary" style={{ cursor: 'not-allowed', opacity: 0.6 }} disabled>
            ＋ Add New Application
          </button>
        }
      />

      <div style={{ marginTop: '1.5rem' }}>
        <ApplicationTable jobs={sampleJobs} onDelete={(id) => console.log('Mock delete for', id)} />
      </div>
    </div>
  );
}

export default Applications;
