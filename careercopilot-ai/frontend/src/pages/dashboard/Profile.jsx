/**
 * File Explanation: Profile.jsx
 * 
 * 1. What is it?
 *    Profile.jsx manages the career preferences, contact coordinates, and skills records of the user.
 * 
 * 2. Why is it needed?
 *    AI tools require user-profile parameters (e.g. target titles, salary goals, core skills) to generate
 *    tailored messages and mock questions.
 * 
 * 3. How does it work?
 *    It uses controlled React state inputs to show and store editable parameters, outputting skills as list badges.
 * 
 * 4. Real-world example
 *    Portals (like LinkedIn Profile or Indeed Settings) let users set target job configurations to govern recommendation algorithms.
 * 
 * 5. Advantages
 *    - Reuses styled design system input components.
 *    - Clear separation of metadata sections (Contact Info, Target Details, Skill Badges).
 * 
 * 6. Limitations
 *    - Save changes only update local state; edits do not persist across full page reloads.
 * 
 * 7. Interview questions
 *    - How do you implement tag-input systems in React state arrays?
 * 
 * 8. Interview answers
 *    - Answer: By keeping an array of string values in state, appending new entries on input submit,
 *      and filtering out entries when the user clicks a delete action.
 */

import React, { useState } from 'react';

function Profile() {
  const [targetTitle, setTargetTitle] = useState('Senior Software Engineer');
  const [targetSalary, setTargetSalary] = useState('$160,000 - $190,000');
  const [skills, setSkills] = useState(['React', 'Node.js', 'Vite', 'JavaScript', 'CSS Grid', 'System Design']);
  const [newSkill, setNewSkill] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>User Profile</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Configure your targeted coordinates and technical competencies to feed the AI generator.
        </p>
      </div>

      {saved && (
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.75rem', borderRadius: 'var(--border-radius-md)', marginBottom: '1.5rem', textAlign: 'center' }}>
          ✅ Preferences Saved (Simulated local state update)
        </div>
      )}

      <div className="grid-2">
        {/* Core preferences form */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Target Career Parameters
          </h3>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">Target Job Title</label>
              <input 
                type="text" 
                id="title" 
                className="form-input" 
                value={targetTitle} 
                onChange={(e) => setTargetTitle(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="salary">Expected Salary Range</label>
              <input 
                type="text" 
                id="salary" 
                className="form-input" 
                value={targetSalary} 
                onChange={(e) => setTargetSalary(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="exp">Years of Experience</label>
              <input type="text" id="exp" className="form-input" defaultValue="6 Years" disabled style={{ opacity: 0.6 }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Save Target Preferences
            </button>
          </form>
        </div>

        {/* Skill Tag Manager */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Technical Competencies
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            These tags are appended to resume optimization scans and interview coach configurations.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2rem' }}>
            {skills.map((skill, index) => (
              <span key={index} className="badge badge-cyan" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', padding: '0.4rem 0.8rem' }}>
                <span>{skill}</span>
                <button 
                  onClick={() => handleRemoveSkill(skill)}
                  style={{ color: 'var(--color-danger)', fontWeight: 'bold', fontSize: '0.85rem' }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '8px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <input 
                type="text" 
                className="form-input" 
                value={newSkill} 
                onChange={(e) => setNewSkill(e.target.value)} 
                placeholder="Add skill (e.g. Node.js)" 
              />
            </div>
            <button type="submit" className="btn btn-secondary" style={{ padding: '0.75rem 1.25rem' }}>
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
