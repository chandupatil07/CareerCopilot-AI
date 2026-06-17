/**
 * File Explanation: Interviews.jsx (Upgraded Interactive Coach)
 * 
 * 1. What is it?
 *    Interviews.jsx handles schedule tracking and interactive mock interview coaching.
 * 
 * 2. Why is it needed?
 *    SaaS users need to practice questions and receive evaluations. This interactive coach simulates
 *    AI responses based on user-entered text answers.
 * 
 * 3. How does it work?
 *    It uses controlled text areas to capture answers. When "Submit Answer" is clicked, it scans the text
 *    for target keywords (like React, optimization, state, trade-off, data) and outputs tailored scores and recommendations.
 * 
 * 4. Real-world example
 *    Preparation systems (like Interviewer.ai or Pramp) scan candidate video transcriptions for structural key terms.
 * 
 * 5. Advantages
 *    - Fully responsive mock preparation panel.
 *    - Dynamic keyword-checking evaluation engine.
 * 
 * 6. Limitations
 *    - Text evaluation is string-matching and does not capture structural grammar nuances.
 * 
 * 7. Interview questions
 *    - How do you construct text evaluation algorithms in React state?
 * 
 * 8. Interview answers
 *    - Answer: By capturing text in controlled inputs, scanning strings for keyword arrays using regular expressions
 *      or `.includes()` methods, and mapping matches to performance thresholds.
 */

import React, { useState } from 'react';

function Interviews() {
  const [prepCategory, setPrepCategory] = useState('behavioral'); // behavioral, technical
  
  // Interactive Coach States
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [grading, setGrading] = useState(false);
  const [gradeResult, setGradeResult] = useState(null);

  const upcomingInterviews = [
    { id: 1, company: 'Google', role: 'Senior Front-End Dev', type: 'System Design', date: 'June 20, 2026', time: '10:00 AM PST' },
    { id: 2, company: 'Stripe', role: 'Staff UI Engineer', type: 'Technical Screening', date: 'June 23, 2026', time: '2:30 PM PST' }
  ];

  const behavioralQuestions = [
    { id: 1, q: "Tell me about a time you had a technical disagreement with a colleague. How did you resolve it?", keywords: ['empathy', 'data', 'trade-off', 'consensus', 'listen'], modelAnswer: "Detail a structured resolution: active listening, documenting architectural tradeoffs, gathering performance benchmarks, and aligning on product goals." },
    { id: 2, q: "Describe a project you worked on that failed. What did you learn?", keywords: ['communication', 'planning', 'post-mortem', 'testing', 'lessons'], modelAnswer: "Detail personal accountability: describe project parameters, explain early warning signs, log failures, and outline coding and testing controls implemented afterwards." }
  ];

  const technicalQuestions = [
    { id: 3, q: "How would you optimize initial rendering speeds in a data-heavy React application?", keywords: ['lazy', 'memo', 'split', 'context', 're-render'], modelAnswer: "Implement code splitting (React.lazy), use useMemo/useCallback to cache functions, decouple context states to reduce re-renders, and compress static images." },
    { id: 4, q: "Explain the differences between client-side rendering (CSR) and server-side rendering (SSR).", keywords: ['server', 'client', 'seo', 'hydration', 'load'], modelAnswer: "CSR delivers empty HTML templates and renders all components client-side. SSR pre-renders static layout frames on the server, ensuring faster loading speeds and optimized search indexing." }
  ];

  // Grade Answer Logic
  const handleGrade = (e) => {
    e.preventDefault();
    if (!userAnswer) return;

    setGrading(true);
    setGradeResult(null);

    setTimeout(() => {
      const parsedAnswer = userAnswer.toLowerCase();
      
      // Check which target keywords exist in answer
      const matched = selectedQuestion.keywords.filter(kw => parsedAnswer.includes(kw));
      const missing = selectedQuestion.keywords.filter(kw => !parsedAnswer.includes(kw));

      // Grade based on matched keyword count
      let grade = 'Needs Revision';
      let gradeColor = 'var(--color-danger)';
      if (matched.length >= 3) {
        grade = 'Excellent';
        gradeColor = 'var(--color-success)';
      } else if (matched.length >= 1) {
        grade = 'Good';
        gradeColor = 'var(--color-warning)';
      }

      setGradeResult({
        grade,
        gradeColor,
        matched,
        missing,
        feedback: matched.length >= 3 
          ? "Great answer! You covered core terminology and backed it up with structural principles."
          : "Good attempt. Consider incorporating more specific technical terms to explain your engineering choices."
      });
      setGrading(false);
    }, 1200);
  };

  const startPractice = (questionObj) => {
    setSelectedQuestion(questionObj);
    setUserAnswer('');
    setGradeResult(null);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Interviews & Prep</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Review upcoming schedules and practice mock interview question sets.
        </p>
      </div>

      <div className="grid-2">
        {/* LEFT COLUMN: UPCOMING LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Upcoming Sessions
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {upcomingInterviews.map((int) => (
                <div key={int.id} className="card-accent-cyan" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', padding: '1.25rem', position: 'relative' }}>
                  <span className="badge badge-cyan" style={{ float: 'right' }}>{int.type}</span>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{int.company}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{int.role}</p>
                  
                  <div style={{ display: 'flex', gap: '15px', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-accent)' }}>
                    <span>📅 {int.date}</span>
                    <span>⏰ {int.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card card-accent-purple" style={{ padding: '1.5rem' }}>
            <h4>💡 Pre-Interview Checklist</h4>
            <ul style={{ paddingLeft: '1rem', fontSize: '0.85rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>Confirm your computer camera & mic work correctly.</li>
              <li>Read the company's engineering values and story.</li>
              <li>Prepare 2 questions to ask the interviewer.</li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: COACH OR PRACTICE DRAWER */}
        <div className="card">
          {!selectedQuestion ? (
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
                🤖 AI Mock Prep Coach
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Select a topic category to inspect tailored questions. Click any question to launch practice mode.
              </p>

              {/* Category selector tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem' }}>
                <button 
                  className={`btn ${prepCategory === 'behavioral' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                  onClick={() => setPrepCategory('behavioral')}
                >
                  Behavioral Prep
                </button>
                <button 
                  className={`btn ${prepCategory === 'technical' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                  onClick={() => setPrepCategory('technical')}
                >
                  Technical Prep
                </button>
              </div>

              {/* Topic lists */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {(prepCategory === 'behavioral' ? behavioralQuestions : technicalQuestions).map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => startPractice(item)}
                    style={{ 
                      backgroundColor: 'rgba(255,255,255,0.01)', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: 'var(--border-radius-md)', 
                      padding: '1.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Q: {item.q}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)' }}>Practice Question ➡️</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // ACTIVE PRACTICE WINDOW
            <div className="animate-slide-up">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem' }}>Practice Workspace</h3>
                <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }} onClick={() => setSelectedQuestion(null)}>
                  ⬅️ Back
                </button>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-purple)', fontWeight: 600 }}>QUESTION:</span>
                <p style={{ color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: 600, marginTop: '2px' }}>{selectedQuestion.q}</p>
              </div>

              <form onSubmit={handleGrade}>
                <div className="form-group">
                  <label className="form-label" htmlFor="user-ans">Your Answer</label>
                  <textarea 
                    id="user-ans"
                    className="form-input" 
                    rows="6"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    required
                    placeholder="Type your structured answer here (STAR method or technical terms details)..."
                    style={{ resize: 'vertical', fontFamily: 'inherit', fontSize: '0.95rem' }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={grading}>
                  {grading ? 'Coaching Analysis In Progress...' : '🤖 Submit Response for AI Grading'}
                </button>
              </form>

              {/* EVALUATION FEEDBACK LOG */}
              {gradeResult && (
                <div className="card animate-slide-up" style={{ marginTop: '1.5rem', border: `1px solid ${gradeResult.gradeColor}`, backgroundColor: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.875rem' }}>Response Grade:</span>
                    <strong style={{ color: gradeResult.gradeColor, fontSize: '1.15rem' }}>{gradeResult.grade}</strong>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                    {gradeResult.feedback}
                  </p>

                  <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }} />

                  {/* Matching terminology indicators */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    <div>
                      <span style={{ color: 'var(--color-success)' }}>Matched Target Keywords: </span>
                      <span>{gradeResult.matched.length === 0 ? 'None' : gradeResult.matched.join(', ')}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-warning)' }}>Omitted Skill Gaps: </span>
                      <span>{gradeResult.missing.length === 0 ? 'None' : gradeResult.missing.join(', ')}</span>
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.05)', borderRadius: 'var(--border-radius-md)', padding: '0.75rem', fontSize: '0.85rem', border: '1px solid rgba(56, 189, 248, 0.1)' }}>
                    <strong style={{ color: 'var(--color-accent)' }}>AI Model Answer: </strong>
                    <span style={{ color: 'var(--text-secondary)' }}>{selectedQuestion.modelAnswer}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Interviews;
