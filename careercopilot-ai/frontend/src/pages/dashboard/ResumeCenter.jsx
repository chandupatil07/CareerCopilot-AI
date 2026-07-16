/**
 * File Explanation: ResumeCenter.jsx
 * 
 * Production-grade Resume Center. Integrates PDF uploads, versioning,
 * deletions, live ATS scoring, and interactive job description matching.
 */

import React, { useState, useEffect, useRef } from 'react';
import PageHeader from '../../components/PageHeader';
import Badge from '../../components/Badge';
import PageLoader from '../../components/PageLoader';
import ButtonLoader from '../../components/ButtonLoader';
import { resumeService } from '../../services/resume';

const TECH_SKILLS_DB = [
  "python", "fastapi", "react", "sql", "postgresql", "mysql", "sqlite", "aws", "gcp", "azure", 
  "docker", "kubernetes", "git", "typescript", "javascript", "node.js", "express", "django", 
  "flask", "html", "css", "java", "c++", "go", "rust", "terraform", "ci/cd", "rest api", 
  "graphql", "redis", "mongodb", "linux", "scikit-learn", "tensorflow", "pytorch", "nlp", "ai"
];

function ResumeCenter() {
  const [resumes, setResumes] = useState([]);
  const [activeResume, setActiveResume] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Action status indicators
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [actionId, setActionId] = useState(null); // Tracks specific row actions
  const [error, setError] = useState(null);

  // Job description matching state
  const [jobDescription, setJobDescription] = useState('');
  const [matchResults, setMatchResults] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const list = await resumeService.listResumes();
      setResumes(list);

      const active = list.find(r => r.is_active === true);
      if (active) {
        setActiveResume(active);
        await fetchAnalysis(active.id);
      } else {
        setActiveResume(null);
        setAnalysis(null);
      }
    } catch (err) {
      console.error('Error listing resumes:', err);
      setError('Failed to fetch resumes history. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchAnalysis(resumeId) {
    try {
      const data = await resumeService.getResumeAnalysis(resumeId);
      setAnalysis(data);
    } catch (err) {
      // If analysis doesn't exist, trigger parsing automatically
      if (err.response?.status === 404) {
        try {
          setParsing(true);
          const parsed = await resumeService.parseResume(resumeId);
          setAnalysis(parsed);
        } catch (parseErr) {
          console.error('Auto parsing failed:', parseErr);
        } finally {
          setParsing(false);
        }
      } else {
        console.error('Error fetching analysis details:', err);
      }
    }
  }

  // Trigger hidden file picker
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Upload file event handler
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Only PDF documents are supported.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setMatchResults(null);

      // Upload file to backend
      const newResume = await resumeService.uploadResume(file);

      // Trigger automatic parser extraction & scoring
      setUploading(false);
      setParsing(true);
      const parsedAnalysis = await resumeService.parseResume(newResume.id);

      setAnalysis(parsedAnalysis);
      
      // Reload resumes list to reflect status updates
      const list = await resumeService.listResumes();
      setResumes(list);
      setActiveResume(newResume);
    } catch (err) {
      console.error('Resume upload failed:', err);
      setError(err.response?.data?.detail || 'Failed to upload PDF resume.');
    } finally {
      setUploading(false);
      setParsing(false);
      // Reset input value to allow uploading same file name again
      e.target.value = null;
    }
  };

  const handleActivate = async (id) => {
    try {
      setActionId(id);
      setMatchResults(null);
      const updated = await resumeService.activateResume(id);
      
      // Refresh list
      const list = await resumeService.listResumes();
      setResumes(list);
      setActiveResume(updated);
      await fetchAnalysis(id);
    } catch (err) {
      console.error('Activate failed:', err);
      alert('Failed to set resume version as active.');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this resume version?')) return;

    try {
      setActionId(id);
      await resumeService.deleteResume(id);
      
      // Refresh list
      const list = await resumeService.listResumes();
      setResumes(list);

      if (activeResume?.id === id) {
        const nextActive = list.find(r => r.is_active === true);
        if (nextActive) {
          setActiveResume(nextActive);
          await fetchAnalysis(nextActive.id);
        } else {
          setActiveResume(null);
          setAnalysis(null);
          setMatchResults(null);
        }
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete resume.');
    } finally {
      setActionId(null);
    }
  };

  // Run interactive job description matching
  const handleAnalyzeJobMatch = (e) => {
    e.preventDefault();
    if (!jobDescription.trim() || !analysis) return;

    const descLower = jobDescription.toLowerCase();
    const resumeSkills = (analysis.skills || []).map(s => s.toLowerCase());

    // Scan for tech keywords in the job description
    const descSkills = TECH_SKILLS_DB.filter(skill => {
      const pattern = new RegExp(`\\b${skill}\\b`, 'i');
      return pattern.test(descLower);
    });

    if (descSkills.length === 0) {
      setMatchResults({
        score: 0,
        matched: [],
        missing: [],
        message: 'No tech keywords from our database found in the description. Try adding technical keywords like Python, React, SQL, etc.'
      });
      return;
    }

    const matched = descSkills.filter(skill => resumeSkills.includes(skill));
    const missing = descSkills.filter(skill => !resumeSkills.includes(skill));
    const score = Math.round((matched.length / descSkills.length) * 100);

    setMatchResults({
      score,
      matched,
      missing,
      message: score >= 80 
        ? 'Excellent Match! Your resume covers the key tech requirements.' 
        : score >= 50 
        ? 'Good Match, but some keyword gaps were detected.' 
        : 'Low Match. We recommend tailoring your resume to include the missing keywords.'
    });
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Resume Center" 
        description="Verify document formatting and audit ATS keyword matches against targeted job requirements." 
      />

      {error && (
        <div style={{ padding: '0.8rem', borderRadius: 'var(--border-radius-sm)', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444', marginBottom: '1.5rem', fontSize: '0.85rem', textAlign: 'center' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Hidden input for PDF uploading */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
        accept=".pdf"
      />

      <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
        {/* Document Administration Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', fontWeight: 700 }}>
              📄 Document Administration
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Upload new resume versions, replace existing files, or download your active PDF.
            </p>

            {uploading ? (
              <div style={{ padding: '2rem 1.5rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--border-radius-md)', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.01)', marginBottom: '1.5rem' }}>
                <ButtonLoader />
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>Uploading PDF to storage...</span>
              </div>
            ) : parsing ? (
              <div style={{ padding: '2rem 1.5rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--border-radius-md)', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.01)', marginBottom: '1.5rem' }}>
                <ButtonLoader />
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>Extracting text & running ATS score rules...</span>
              </div>
            ) : !activeResume ? (
              <div style={{ padding: '2rem 1.5rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--border-radius-md)', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.01)', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📁</span>
                <strong style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No Resume Uploaded Yet</strong>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Upload a PDF CV under 10MB to begin.</span>
              </div>
            ) : (
              <div style={{ padding: '1.5rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--border-radius-md)', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.01)', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📄</span>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', display: 'block' }} title={activeResume.filename}>
                  {activeResume.filename}
                </strong>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Uploaded: {new Date(activeResume.created_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={handleUploadClick} 
              className="btn btn-primary" 
              style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
              disabled={uploading || parsing}
            >
              {activeResume ? 'Replace Resume' : 'Upload Resume'}
            </button>
            {activeResume && (
              <a 
                href={resumeService.getDownloadUrl(activeResume.id)} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-secondary" 
                style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', textDecoration: 'none' }}
              >
                Download PDF
              </a>
            )}
          </div>
        </div>

        {/* Analyze Operations Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', fontWeight: 700 }}>
              🔍 Job Description Analysis
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Paste a targeted job listing text description to calculate ATS compatibility match scores.
            </p>
            <form onSubmit={handleAnalyzeJobMatch}>
              <div className="form-group">
                <label className="form-label" htmlFor="jobDescInput">Target Job Description</label>
                <textarea 
                  id="jobDescInput" 
                  className="form-input" 
                  rows="4" 
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="We are looking for a Software Developer with experience in building React frontends, Python FastAPI backends, and SQL database management..." 
                  required
                  style={{ resize: 'none' }}
                  disabled={!activeResume}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem' }}
                disabled={!activeResume || !jobDescription.trim()}
              >
                Analyze Resume Match
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ATS ANALYSIS RESULTS */}
      {analysis && !matchResults && (
        <div className="card animate-fade-in" style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', fontWeight: 700 }}>
            📊 Overall ATS Alignment Analysis
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }} className="grid-responsive-2">
            {/* Circular Score */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '5px solid var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '0.75rem' }}>
                {analysis.ats_score}%
              </div>
              <h4 style={{ fontWeight: 600 }}>ATS Match Rating</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Based on contact, section presence, and formatting.</span>
            </div>

            {/* Suggestions and Skills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ color: 'var(--color-success)', marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: 600 }}>Extracted Tech Skills badges:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {analysis.skills && analysis.skills.length > 0 ? (
                    analysis.skills.map(skill => (
                      <Badge key={skill} type="success">{skill}</Badge>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No standard tech skills detected in text scans.</span>
                  )}
                </div>
              </div>

              <div>
                <h4 style={{ color: 'var(--color-warning)', marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: 600 }}>Improvement Recommendations:</h4>
                <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {analysis.score_breakdown?.suggestions && analysis.score_breakdown.suggestions.length > 0 ? (
                    analysis.score_breakdown.suggestions.map((sug, idx) => (
                      <li key={idx}>{sug}</li>
                    ))
                  ) : (
                    <li>🎉 Outstanding! Your resume satisfies all key structural and formatting guidelines.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JOB DESCRIPTION MATCH ANALYSIS RESULTS */}
      {matchResults && (
        <div className="card animate-fade-in" style={{ marginBottom: '2.5rem', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              🎯 Target Job Description Match
            </h3>
            <button onClick={() => setMatchResults(null)} className="btn btn-secondary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem' }}>
              Show General Report
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }} className="grid-responsive-2">
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: `5px solid ${matchResults.score >= 70 ? 'var(--color-success)' : matchResults.score >= 40 ? 'var(--color-warning)' : '#EF4444'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '0.75rem' }}>
                {matchResults.score}%
              </div>
              <h4 style={{ fontWeight: 600 }}>Keywords Match Rating</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '180px' }}>{matchResults.message}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ color: 'var(--color-success)', marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: 600 }}>Matching Keywords Found:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {matchResults.matched.length > 0 ? (
                    matchResults.matched.map(skill => (
                      <Badge key={skill} type="success">{skill}</Badge>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>None of the technical keywords in the job description match your resume.</span>
                  )}
                </div>
              </div>

              <div>
                <h4 style={{ color: 'var(--color-warning)', marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: 600 }}>Keyword Gaps Detected (Missing in CV):</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {matchResults.missing.length > 0 ? (
                    matchResults.missing.map(skill => (
                      <Badge key={skill} type="warning">{skill}</Badge>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No keyword gaps detected! You match all identified tech keywords.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VERSION HISTORY TABLE */}
      {resumes.length > 0 && (
        <div className="card animate-fade-in">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', fontWeight: 700 }}>
            📚 Resume Version History
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Filename</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Uploaded Date</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resumes.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 500, color: 'var(--text-primary)', maxWidth: '250px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} title={item.filename}>
                      {item.filename}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      {item.is_active ? (
                        <Badge type="success">Active Profile</Badge>
                      ) : (
                        <button 
                          onClick={() => handleActivate(item.id)} 
                          className="btn btn-secondary" 
                          style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                          disabled={actionId !== null}
                        >
                          {actionId === item.id ? 'Toggling...' : 'Make Active'}
                        </button>
                      )}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <a 
                          href={resumeService.getDownloadUrl(item.id)} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="btn btn-secondary" 
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', textDecoration: 'none' }}
                        >
                          Download
                        </a>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="btn btn-secondary" 
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                          disabled={actionId !== null}
                        >
                          {actionId === item.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Responsive Media Style */}
      <style>{`
        @media (max-width: 768px) {
          .grid-responsive-2 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ResumeCenter;
