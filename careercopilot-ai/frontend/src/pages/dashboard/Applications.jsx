/**
 * File Explanation: Applications.jsx
 * 
 * Job Application CRM. Supports search, filter, favorites, archive logs,
 * add/edit modals, status transition timelines, and timeline audit logs.
 */

import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import Badge from '../../components/Badge';
import PageLoader from '../../components/PageLoader';
import ButtonLoader from '../../components/ButtonLoader';
import { applicationsService } from '../../services/applications';

function Applications() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Filter and search parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  // Modals and Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    company_name: '',
    job_role: '',
    source: '',
    applied_date: new Date().toISOString().split('T')[0],
    current_stage: 'Interested',
    location: '',
    priority: 'Medium',
    salary_range: '',
    job_description: '',
    application_url: '',
    notes: ''
  });

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, statusFilter, priorityFilter, showArchived]);

  async function fetchJobs() {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        skip: 0,
        limit: 100,
        archived: showArchived
      };
      
      if (searchQuery.trim()) params.search = searchQuery;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const data = await applicationsService.listApplications(params);
      setJobs(data);
    } catch (err) {
      console.error('Error loading job applications:', err);
      setError('Unable to fetch job application logs from database.');
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await applicationsService.createApplication(formData);
      setIsAddModalOpen(false);
      resetForm();
      fetchJobs();
    } catch (err) {
      console.error('Create application failed:', err);
      alert('Failed to create application.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (job) => {
    setSelectedJob(job);
    setFormData({
      company_name: job.company_name,
      job_role: job.job_role,
      source: job.source || '',
      applied_date: job.applied_date || '',
      current_stage: job.current_stage,
      location: job.location || '',
      priority: job.priority || 'Medium',
      salary_range: job.salary_range || '',
      job_description: job.job_description || '',
      application_url: job.application_url || '',
      notes: job.notes || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await applicationsService.updateApplication(selectedJob.id, formData);
      setIsEditModalOpen(false);
      resetForm();
      fetchJobs();
      if (isDrawerOpen && selectedJob?.id === selectedJob.id) {
        // Refresh details drawer if open
        const updated = await applicationsService.getApplication(selectedJob.id);
        setSelectedJob(updated);
      }
    } catch (err) {
      console.error('Update application failed:', err);
      alert('Failed to modify job application.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusTransition = async (id, newStatus) => {
    try {
      await applicationsService.updateStatus(id, newStatus, 'Stage transition via dashboard selector.');
      fetchJobs();
      if (isDrawerOpen && selectedJob?.id === id) {
        const updated = await applicationsService.getApplication(id);
        setSelectedJob(updated);
      }
    } catch (err) {
      console.error('Status transition failed:', err);
      alert('Failed to update stage.');
    }
  };

  const handleToggleFavorite = async (job) => {
    try {
      await applicationsService.updateApplication(job.id, { favorite: !job.favorite });
      fetchJobs();
    } catch (err) {
      console.error('Favorite toggle failed:', err);
    }
  };

  const handleToggleArchive = async (job) => {
    try {
      await applicationsService.updateApplication(job.id, { archived: !job.archived });
      fetchJobs();
      if (isDrawerOpen && selectedJob?.id === job.id) {
        setIsDrawerOpen(false);
      }
    } catch (err) {
      console.error('Archive toggle failed:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job application? All interview schedules and timeline logs will be lost.')) return;

    try {
      await applicationsService.deleteApplication(id);
      fetchJobs();
      if (isDrawerOpen && selectedJob?.id === id) {
        setIsDrawerOpen(false);
      }
    } catch (err) {
      console.error('Delete application failed:', err);
      alert('Failed to delete application.');
    }
  };

  const handleOpenDrawer = async (job) => {
    try {
      const fullDetails = await applicationsService.getApplication(job.id);
      setSelectedJob(fullDetails);
      setIsDrawerOpen(true);
    } catch (err) {
      console.error('Get application details failed:', err);
      setSelectedJob(job);
      setIsDrawerOpen(true);
    }
  };

  const resetForm = () => {
    setFormData({
      company_name: '',
      job_role: '',
      source: '',
      applied_date: new Date().toISOString().split('T')[0],
      current_stage: 'Interested',
      location: '',
      priority: 'Medium',
      salary_range: '',
      job_description: '',
      application_url: '',
      notes: ''
    });
    setSelectedJob(null);
  };

  return (
    <div className="animate-fade-in" style={{ position: 'relative' }}>
      <PageHeader 
        title="Applications Tracker" 
        description="Monitor application progress, interview stages, and timeline metrics in a live interactive grid." 
        actions={
          <button onClick={() => { resetForm(); setIsAddModalOpen(true); }} className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
            ＋ Add Job Application
          </button>
        }
      />

      {error && (
        <div style={{ padding: '0.8rem', borderRadius: 'var(--border-radius-sm)', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444', marginBottom: '1.5rem', fontSize: '0.85rem', textAlign: 'center' }}>
          ⚠️ {error}
        </div>
      )}

      {/* FILTER CONTROLS BAR */}
      <div className="card" style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search company or role..." 
          className="form-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 2, minWidth: '200px', margin: 0, padding: '0.5rem' }}
        />
        
        <select 
          className="form-input" 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ flex: 1, minWidth: '130px', margin: 0, padding: '0.5rem' }}
        >
          <option value="">All Stages</option>
          <option value="Interested">Interested</option>
          <option value="Applied">Applied</option>
          <option value="Technical Interview">Technical Interview</option>
          <option value="Behavioral Interview">Behavioral Interview</option>
          <option value="Under Review">Under Review</option>
          <option value="Offer Received">Offer Received</option>
          <option value="Rejected">Rejected</option>
          <option value="Accepted">Accepted</option>
        </select>

        <select 
          className="form-input" 
          value={priorityFilter} 
          onChange={(e) => setPriorityFilter(e.target.value)}
          style={{ flex: 1, minWidth: '120px', margin: 0, padding: '0.5rem' }}
        >
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', userSelect: 'none' }}>
          <input 
            type="checkbox" 
            checked={showArchived} 
            onChange={(e) => setShowArchived(e.target.checked)}
            style={{ accentColor: 'var(--color-accent)' }} 
          />
          <span>Show Archived</span>
        </label>
      </div>

      {loading ? (
        <PageLoader />
      ) : jobs.length === 0 ? (
        <div className="card text-center" style={{ padding: '4rem 2rem' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📈</span>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>No job application cards tracked</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
            {showArchived 
              ? 'You do not have any archived applications. Tracked cards can be archived via details view.' 
              : 'Add applications manually using the button above to begin logging timeline stages.'
            }
          </p>
          {!showArchived && (
            <button onClick={() => { resetForm(); setIsAddModalOpen(true); }} className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>
              Create First Listing
            </button>
          )}
        </div>
      ) : (
        <div style={{ width: '100%', overflowX: 'auto', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-color)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '850px' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.95rem' }}>Company</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.95rem' }}>Role & Location</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.95rem' }}>Priority</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.95rem' }}>Stage Stage</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.95rem' }}>Favorite</th>
                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, fontSize: '0.95rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }} className="table-row-hover">
                  <td 
                    onClick={() => handleOpenDrawer(job)}
                    style={{ padding: '1.25rem 1rem', fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer' }}
                  >
                    {job.company_name}
                  </td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <div style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{job.job_role}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📍 {job.location || 'Not Specified'}</span>
                  </td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <Badge type={job.priority === 'High' ? 'danger' : job.priority === 'Medium' ? 'warning' : 'success'}>
                      {job.priority}
                    </Badge>
                  </td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <select 
                      value={job.current_stage} 
                      onChange={(e) => handleStatusTransition(job.id, e.target.value)}
                      className="form-input" 
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem', width: 'auto', margin: 0 }}
                    >
                      <option value="Interested">Interested</option>
                      <option value="Applied">Applied</option>
                      <option value="Technical Interview">Technical Interview</option>
                      <option value="Behavioral Interview">Behavioral Interview</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Offer Received">Offer Received</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Accepted">Accepted</option>
                    </select>
                  </td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <button 
                      onClick={() => handleToggleFavorite(job)} 
                      style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', outline: 'none' }}
                      title={job.favorite ? 'Remove Favorite' : 'Mark Favorite'}
                    >
                      {job.favorite ? '⭐️' : '☆'}
                    </button>
                  </td>
                  <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleOpenDrawer(job)} className="btn btn-secondary" style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}>
                        Timeline
                      </button>
                      <button onClick={() => handleOpenEdit(job)} className="btn btn-secondary" style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(job.id)} className="btn btn-secondary" style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 1. ADD APPLICATION DIALOG MODAL */}
      {/* ---------------------------------------------------- */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '550px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', fontWeight: 700 }}>
              ➕ Create Job Track Card
            </h3>
            <form onSubmit={handleCreateSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-responsive-2">
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input type="text" name="company_name" value={formData.company_name} onChange={handleInputChange} className="form-input" placeholder="Google" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Role *</label>
                  <input type="text" name="job_role" value={formData.job_role} onChange={handleInputChange} className="form-input" placeholder="Front-End Dev" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-responsive-2">
                <div className="form-group">
                  <label className="form-label">Applied Date</label>
                  <input type="date" name="applied_date" value={formData.applied_date} onChange={handleInputChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Location (Remote/Hybrid)</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="form-input" placeholder="Remote" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-responsive-2">
                <div className="form-group">
                  <label className="form-label">Status Stage</label>
                  <select name="current_stage" value={formData.current_stage} onChange={handleInputChange} className="form-input">
                    <option value="Interested">Interested</option>
                    <option value="Applied">Applied</option>
                    <option value="Technical Interview">Technical Interview</option>
                    <option value="Behavioral Interview">Behavioral Interview</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Offer Received">Offer Received</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Accepted">Accepted</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select name="priority" value={formData.priority} onChange={handleInputChange} className="form-input">
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-responsive-2">
                <div className="form-group">
                  <label className="form-label">Salary Range</label>
                  <input type="text" name="salary_range" value={formData.salary_range} onChange={handleInputChange} className="form-input" placeholder="$120k - $140k" />
                </div>
                <div className="form-group">
                  <label className="form-label">Source (e.g. LinkedIn)</label>
                  <input type="text" name="source" value={formData.source} onChange={handleInputChange} className="form-input" placeholder="LinkedIn" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Job Application URL</label>
                <input type="url" name="application_url" value={formData.application_url} onChange={handleInputChange} className="form-input" placeholder="https://careers.google.com/jobs/..." />
              </div>

              <div className="form-group">
                <label className="form-label">Notes & Comments</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="form-input" rows="2" placeholder="Referral requested from..." />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? <ButtonLoader /> : 'Save Job Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. EDIT APPLICATION DIALOG MODAL */}
      {/* ---------------------------------------------------- */}
      {isEditModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '550px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', fontWeight: 700 }}>
              ✏️ Modify Job Details
            </h3>
            <form onSubmit={handleEditSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-responsive-2">
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input type="text" name="company_name" value={formData.company_name} onChange={handleInputChange} className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Role *</label>
                  <input type="text" name="job_role" value={formData.job_role} onChange={handleInputChange} className="form-input" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-responsive-2">
                <div className="form-group">
                  <label className="form-label">Applied Date</label>
                  <input type="date" name="applied_date" value={formData.applied_date} onChange={handleInputChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Location (Remote/Hybrid)</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="form-input" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-responsive-2">
                <div className="form-group">
                  <label className="form-label">Status Stage</label>
                  <select name="current_stage" value={formData.current_stage} onChange={handleInputChange} className="form-input">
                    <option value="Interested">Interested</option>
                    <option value="Applied">Applied</option>
                    <option value="Technical Interview">Technical Interview</option>
                    <option value="Behavioral Interview">Behavioral Interview</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Offer Received">Offer Received</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Accepted">Accepted</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select name="priority" value={formData.priority} onChange={handleInputChange} className="form-input">
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-responsive-2">
                <div className="form-group">
                  <label className="form-label">Salary Range</label>
                  <input type="text" name="salary_range" value={formData.salary_range} onChange={handleInputChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Source (e.g. LinkedIn)</label>
                  <input type="text" name="source" value={formData.source} onChange={handleInputChange} className="form-input" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Job Application URL</label>
                <input type="url" name="application_url" value={formData.application_url} onChange={handleInputChange} className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Notes & Comments</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="form-input" rows="2" />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? <ButtonLoader /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. SLIDE-OUT DRAWER FOR TIMELINE AUDIT & DETAILS */}
      {/* ---------------------------------------------------- */}
      {isDrawerOpen && selectedJob && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '100%', maxWidth: '400px', height: '100%', backgroundColor: 'var(--bg-secondary)', borderLeft: '1px solid var(--border-color)', boxShadow: '-4px 0 20px rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '2rem' }} className="animate-fade-in">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Job Details Workspace</h3>
            <button onClick={() => setIsDrawerOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>
              ✕
            </button>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>{selectedJob.priority} Priority</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{selectedJob.company_name}</h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: '4px 0 0 0', fontWeight: 600 }}>{selectedJob.job_role}</p>
            </div>

            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
              <div>📍 <strong>Location:</strong> {selectedJob.location || 'Remote/Not specified'}</div>
              <div>💼 <strong>Employment:</strong> {selectedJob.employment_type || 'Full-Time'}</div>
              <div>💵 <strong>Salary Range:</strong> {selectedJob.salary_range || 'Not specified'}</div>
              <div>🔗 <strong>Link:</strong> {selectedJob.application_url ? <a href={selectedJob.application_url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)' }}>Job Posting</a> : 'None'}</div>
              {selectedJob.notes && <div style={{ marginTop: '6px' }}>📝 <strong>Notes:</strong> {selectedJob.notes}</div>}
            </div>

            {/* CHRONOLOGICAL TIMELINE AUDIT HISTORY */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
                🗓️ Status Audit Timeline
              </h4>
              
              {(!selectedJob.timeline || selectedJob.timeline.length === 0) ? (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.5rem 0' }}>
                  No historical stage transitions registered.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '0.5rem', marginTop: '0.5rem' }}>
                  {selectedJob.timeline.map((event, idx) => {
                    const eventDate = new Date(event.changed_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <div key={event.id || idx} style={{ position: 'relative', paddingLeft: '1.25rem', borderLeft: '2px solid var(--color-accent)' }}>
                        <div style={{ position: 'absolute', top: '2px', left: '-5px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-accent)' }} />
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          Transitioned to: <Badge type={event.to_stage}>{event.to_stage}</Badge>
                        </div>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Changed: {eventDate}
                        </span>
                        {event.notes && (
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '2px' }}>
                            "{event.notes}"
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <button 
                onClick={() => handleToggleArchive(selectedJob)} 
                className="btn btn-secondary" 
                style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}
              >
                {selectedJob.archived ? '📥 Unarchive' : '🗄️ Archive Card'}
              </button>
              <button 
                onClick={() => { setIsDrawerOpen(false); handleOpenEdit(selectedJob); }} 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}
              >
                ✏️ Edit Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style>{`
        .table-row-hover:hover {
          background-color: rgba(255, 255, 255, 0.015);
        }
      `}</style>
    </div>
  );
}

export default Applications;
