/**
 * File Explanation: Applications.jsx (Upgraded Interactive Kanban)
 * 
 * 1. What is it?
 *    Applications.jsx is the Kanban pipeline tracker dashboard page where users monitor job applications.
 * 
 * 2. Why is it needed?
 *    A professional tracking board must support adding listings, shifting stages in both directions, and clearing records
 *    that are no longer active, ensuring the workspace remains clean.
 * 
 * 3. How does it work?
 *    It stores job arrays in state. Users click move buttons (`◀️` and `▶️`) to shift status flags, or click delete
 *    icons to filter out jobs, updating the column grids instantly.
 * 
 * 4. Real-world example
 *    Trello and Kanban boards (like GitHub Projects) allow users to drag cards to columns, move them backward
 *    upon rescheduling, or archive completed tasks.
 * 
 * 5. Advantages
 *    - Bidirectional movement matches user workflows.
 *    - Instant card clearing logs.
 *    - State-driven React render updates.
 * 
 * 6. Limitations
 *    - Local state resets to mock defaults upon full browser reloading.
 * 
 * 7. Interview questions
 *    - How do you update a single object field within an array stored in React state?
 * 
 * 8. Interview answers
 *    - Answer: By calling the state setter with a `.map()` traversal, matching target identifiers, returning the updated
 *      object values, and returning the unchanged items for non-matching instances: e.g.,
 *      `setJobs(jobs.map(job => job.id === targetId ? { ...job, status: nextStatus } : job))`.
 */

import React, { useState } from 'react';

function Applications() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newJob, setNewJob] = useState({ company: '', role: '', salary: '', status: 'Wishlist' });
  const [jobs, setJobs] = useState([
    { id: 1, company: 'Google', role: 'Senior Front-End Dev', salary: '$180,000', status: 'Interviewing' },
    { id: 2, company: 'Stripe', role: 'Staff UI Engineer', salary: '$210,000', status: 'Applied' },
    { id: 3, company: 'Vercel', role: 'React Developer', salary: '$165,000', status: 'Wishlist' },
    { id: 4, company: 'Airbnb', role: 'Senior Product Engineer', salary: '$195,000', status: 'Offer' },
    { id: 5, company: 'Netflix', role: 'UI Architect', salary: '$240,000', status: 'Applied' }
  ]);

  const handleAddJob = (e) => {
    e.preventDefault();
    if (newJob.company && newJob.role) {
      setJobs([...jobs, { ...newJob, id: Date.now() }]);
      setNewJob({ company: '', role: '', salary: '', status: 'Wishlist' });
      setShowAddForm(false);
    }
  };

  const handleChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  const handleDelete = (id) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  // Bidirectional move handler
  const moveJob = (id, direction) => {
    const statusOrder = ['Wishlist', 'Applied', 'Interviewing', 'Offer'];
    const job = jobs.find(j => j.id === id);
    if (!job) return;

    const currentIndex = statusOrder.indexOf(job.status);
    let newIndex = currentIndex;

    if (direction === 'forward' && currentIndex < statusOrder.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === 'backward' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }

    if (newIndex !== currentIndex) {
      const nextStatus = statusOrder[newIndex];
      setJobs(jobs.map(j => j.id === id ? { ...j, status: nextStatus } : j));
    }
  };

  const columns = ['Wishlist', 'Applied', 'Interviewing', 'Offer'];

  const columnIcons = {
    Wishlist: '💡',
    Applied: '📤',
    Interviewing: '🗓️',
    Offer: '🎉'
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Applications Pipeline</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Track application stages. Promote or demote cards using action buttons, or delete cards to clear items.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Close Form' : '＋ Add Application'}
        </button>
      </div>

      {/* ADD FORM */}
      {showAddForm && (
        <div className="card animate-slide-up" style={{ marginBottom: '2rem', border: '1px solid var(--color-accent)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Log Job Listing</h3>
          <form onSubmit={handleAddJob} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Company</label>
              <input type="text" name="company" className="form-input" value={newJob.company} onChange={handleChange} required placeholder="Stripe" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Role</label>
              <input type="text" name="role" className="form-input" value={newJob.role} onChange={handleChange} required placeholder="Senior Engineer" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Target Salary</label>
              <input type="text" name="salary" className="form-input" value={newJob.salary} onChange={handleChange} placeholder="$160K" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Initial Stage</label>
              <select name="status" className="form-input" value={newJob.status} onChange={handleChange} style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff' }}>
                <option value="Wishlist">Wishlist</option>
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offer</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: '42px', padding: '0 1.5rem' }}>
              Add Card
            </button>
          </form>
        </div>
      )}

      {/* KANBAN BOARD */}
      <div className="kanban-board" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        {columns.map((colName) => {
          const colJobs = jobs.filter(job => job.status === colName);
          return (
            <div 
              key={colName} 
              style={{ 
                flex: '1 0 260px', 
                backgroundColor: 'rgba(255,255,255,0.01)', 
                border: '1px solid var(--border-color)', 
                borderRadius: 'var(--border-radius-lg)', 
                padding: '1rem', 
                minHeight: '450px' 
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{columnIcons[colName]}</span>
                  <span>{colName}</span>
                </h3>
                <span className="badge badge-cyan" style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem' }}>
                  {colJobs.length}
                </span>
              </div>

              {/* Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {colJobs.map((job) => (
                  <div key={job.id} className="card animate-slide-up" style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', position: 'relative' }}>
                    
                    {/* Delete trigger */}
                    <button 
                      onClick={() => handleDelete(job.id)}
                      style={{ position: 'absolute', top: '8px', right: '8px', color: 'var(--text-muted)', fontSize: '0.75rem', padding: '2px' }}
                      className="hover-glow"
                      title="Delete Listing"
                    >
                      ❌
                    </button>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, paddingRight: '12px' }}>{job.role}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{job.company}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 500 }}>{job.salary}</span>
                      
                      {/* Bidirectional promotion buttons */}
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {colName !== 'Wishlist' && (
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.2rem 0.4rem', fontSize: '0.65rem' }}
                            onClick={() => moveJob(job.id, 'backward')}
                            title="Move Backward"
                          >
                            ◀️
                          </button>
                        )}
                        {colName !== 'Offer' && (
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.2rem 0.4rem', fontSize: '0.65rem' }}
                            onClick={() => moveJob(job.id, 'forward')}
                            title="Move Forward"
                          >
                            ▶️
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .kanban-board::-webkit-scrollbar {
          height: 6px;
        }
        .kanban-board::-webkit-scrollbar-thumb {
          background-color: var(--border-color);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}

export default Applications;
