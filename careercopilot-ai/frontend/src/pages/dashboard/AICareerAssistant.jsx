import React, { useState, useRef, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';

function AICareerAssistant() {
  const [conversations, setConversations] = useState([
    { id: 1, title: 'Resume Keyword Scan', active: true, date: 'Today' },
    { id: 2, title: 'Google Behavioral Prep', active: false, date: 'Yesterday' },
    { id: 3, title: 'LinkedIn Cold Message Draft', active: false, date: '3 days ago' },
    { id: 4, title: 'Stripe Staff Interview Review', active: false, date: '1 week ago' }
  ]);

  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: "Hello! I am your CareerCopilot AI Assistant. I can scan your resume, draft outbound cold emails, suggest interview behavior answers, or help prepare for engineering onsite loops. What would you like to build today?"
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const suggestedPrompts = [
    '🔍 Scan my resume for key gaps in Staff roles',
    '🎭 Simulate a mock interview question for Stripe',
    '✉️ Draft a cold outreach pitch to a hiring manager',
    '📊 Review my response rates metrics'
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (textToSend) => {
    if (!textToSend || textToSend.trim() === '') return;

    // 1. Add User Message
    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // 2. Mock AI Response
    setTimeout(() => {
      let aiText = '';
      const promptLower = textToSend.toLowerCase();

      if (promptLower.includes('scan') || promptLower.includes('resume')) {
        aiText = "Based on your active profile ('Lead Frontend UI Architect'), your resume is highly competitive (ATS Score: 88%). However, I notice a slight gap in Cloud Infrastructure keywords (like Terraform or Kubernetes) for Staff roles. Would you like me to draft bullet points incorporating these skills?";
      } else if (promptLower.includes('mock') || promptLower.includes('interview') || promptLower.includes('stripe')) {
        aiText = "Sure! Let's practice a common behavioral: 'Tell me about a time you resolved a major rendering bottleneck in a web application.' Try answering using the STAR format (Situation, Task, Action, Result), and I will evaluate your response.";
      } else if (promptLower.includes('outreach') || promptLower.includes('pitch') || promptLower.includes('email')) {
        aiText = "I can definitely help with that. Go to the Cold Email Generator or LinkedIn Generator in the sidebar, or give me details here (Company Name, Role Name, Recruiter Name) and I'll compile a draft directly in this chat room.";
      } else {
        aiText = `I received your prompt: "${textToSend}". Under this mock environment, I can simulate full career advice. Feel free to ask about resume keyword alignment, mock technical loops, or cold outbound techniques!`;
      }

      setMessages(prev => [...prev, { sender: 'assistant', text: aiText }]);
      setIsTyping(false);
    }, 1200);
  };

  const selectConversation = (id) => {
    setConversations(prev => prev.map(c => ({
      ...c,
      active: c.id === id
    })));

    // Load mock conversation message sets
    if (id === 1) {
      setMessages([
        { sender: 'assistant', text: 'Loaded chat: "Resume Keyword Scan".' },
        { sender: 'user', text: 'Can you check my resume against Staff UI roles?' },
        { sender: 'assistant', text: "I scanned your credentials. You have excellent React optimizations experience. Adding 'Webpack asset splitting' and 'Vite bundler configuration' keywords will push your match score past 90%." }
      ]);
    } else if (id === 2) {
      setMessages([
        { sender: 'assistant', text: 'Loaded chat: "Google Behavioral Prep".' },
        { sender: 'user', text: 'What is the best way to explain conflict resolution?' },
        { sender: 'assistant', text: "Focus on de-escalation: explain how you aligned engineering opinions using data telemetry and metrics, rather than subjective personal arguments. Focus heavily on objective benchmarks." }
      ]);
    } else {
      setMessages([
        { sender: 'assistant', text: 'Loaded mock conversation log.' }
      ]);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 190px)' }}>
      <PageHeader 
        title="AI Career Assistant" 
        description="Interact with our simulated AI assistant to refine resumes, practice behaviorals, and craft pitches."
      />

      <div style={{
        display: 'flex',
        flex: 1,
        background: 'rgba(11, 17, 36, 0.4)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius-xl)',
        boxShadow: 'var(--shadow-glow)',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Left Side: Conversations list */}
        <div style={{
          width: '280px',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          overflowY: 'auto'
        }} className="hide-scrollbar">
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <button 
              className="btn btn-secondary" 
              style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onClick={() => {
                const newId = conversations.length + 1;
                setConversations([
                  { id: newId, title: 'New Conversation Chat', active: true, date: 'Just now' },
                  ...conversations.map(c => ({ ...c, active: false }))
                ]);
                setMessages([{ sender: 'assistant', text: 'New chat started. Ask me anything about your job search strategy!' }]);
              }}
            >
              <span>➕</span> New Conversation
            </button>
          </div>
          <div style={{ flex: 1, padding: '0.5rem' }}>
            {conversations.map(c => (
              <div 
                key={c.id}
                onClick={() => selectConversation(c.id)}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--border-radius-md)',
                  backgroundColor: c.active ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                  borderLeft: c.active ? '3px solid var(--color-accent)' : '3px solid transparent',
                  cursor: 'pointer',
                  marginBottom: '4px',
                  transition: 'all 0.2s ease-in-out'
                }}
                className="hover-glow"
              >
                <div style={{ color: c.active ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: c.active ? 600 : 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  💬 {c.title}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>
                  {c.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Chat Window */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
          {/* Chat Messages Log */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            background: 'radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.2) 0%, transparent 100%)'
          }}>
            {messages.map((m, idx) => (
              <div 
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{
                  backgroundColor: m.sender === 'user' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(30, 41, 59, 0.8)',
                  border: m.sender === 'user' ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid var(--border-color)',
                  color: '#fff',
                  borderRadius: m.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                  padding: '0.85rem 1.25rem',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  {m.text}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', padding: '0 4px' }}>
                  {m.sender === 'user' ? 'You' : 'CareerCopilot AI'}
                </span>
              </div>
            ))}

            {isTyping && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '4px', padding: '10px 18px', backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>AI is thinking...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick prompt suggestions */}
          <div style={{
            padding: '0.5rem 1.5rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            backgroundColor: 'rgba(15, 23, 42, 0.2)'
          }}>
            {suggestedPrompts.map((p, idx) => (
              <button 
                key={idx}
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}
                onClick={() => handleSend(p.slice(3))} // strip emoji and send
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box Area */}
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input 
              type="text"
              className="form-input"
              style={{ flex: 1, margin: 0 }}
              placeholder="Ask the career coach assistant..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend(inputText);
              }}
            />
            <button 
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => handleSend(inputText)}
            >
              <span>⚡</span> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AICareerAssistant;
