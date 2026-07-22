/**
 * File Explanation: AICareerAssistant.jsx
 * 
 * AI Career Assistant page connected to live backend database endpoints.
 * Displays history, creates conversations, deletes threads, and records chat turn messages.
 */

import React, { useState, useRef, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import PageLoader from '../../components/PageLoader';
import { aiService } from '../../services/ai';

function AICareerAssistant() {
  const [conversations, setConversations] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  const suggestedPrompts = [
    '🔍 Scan my resume for key gaps in Staff roles',
    '🎭 Simulate a mock interview question for Stripe',
    '✉️ Draft a cold outreach pitch to a hiring manager',
    '📊 Review my response rates metrics'
  ];

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadSessions() {
    try {
      setLoading(true);
      setError(null);
      const list = await aiService.listConversations();
      setConversations(list);

      if (list.length > 0) {
        // Auto-select the first conversation in the list
        await handleSelectConversation(list[0]);
      } else {
        setActiveSession(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Error loading chat conversations:', err);
      setError('Failed to fetch conversation history from backend.');
    } finally {
      setLoading(false);
    }
  }

  const handleSelectConversation = async (session) => {
    try {
      setError(null);
      setActiveSession(session);
      const msgList = await aiService.getMessages(session.id);
      setMessages(msgList);
    } catch (err) {
      console.error('Error fetching chat messages:', err);
      setError('Failed to load message history for this session.');
    }
  };

  const handleCreateSession = async () => {
    const title = prompt('Enter a title for this chat conversation:');
    if (!title || !title.trim()) return;

    try {
      setError(null);
      const newSession = await aiService.createConversation(title.trim());
      
      // Refresh list and select the new session
      const list = await aiService.listConversations();
      setConversations(list);
      await handleSelectConversation(newSession);
    } catch (err) {
      console.error('Failed to create new conversation:', err);
      alert('Failed to initialize a new conversation session.');
    }
  };

  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this conversation and all its messages?')) return;

    try {
      await aiService.deleteConversation(sessionId);
      
      // Reload list
      const list = await aiService.listConversations();
      setConversations(list);

      if (activeSession?.id === sessionId) {
        if (list.length > 0) {
          await handleSelectConversation(list[0]);
        } else {
          setActiveSession(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
      alert('Failed to delete conversation.');
    }
  };

  const handleSend = async (textToSend) => {
    if (!textToSend || !textToSend.trim() || !activeSession) return;

    const userText = textToSend.trim();
    setInputText('');

    try {
      // 1. Save User Message to database
      const userMsg = await aiService.sendMessage(activeSession.id, userText, 'user');
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);

      // 2. Mock Assistant response and save to database (since Gemini is disabled)
      setTimeout(async () => {
        try {
          const aiResponseText = `Under this foundation phase, Gemini API integrations are disabled. I have successfully recorded your prompt in the database: "${userText}"`;
          const assistantMsg = await aiService.sendMessage(activeSession.id, aiResponseText, 'assistant');
          setMessages(prev => [...prev, assistantMsg]);
        } catch (msgErr) {
          console.error('Failed to save mock assistant response:', msgErr);
        } finally {
          setIsTyping(false);
        }
      }, 800);

    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Unable to persist message to database.');
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 190px)' }}>
      <PageHeader 
        title="AI Career Assistant" 
        description="Interact with our database-backed AI assistant to tailor resumes, draft outreach pitches, and prepare for interviews."
      />

      {error && (
        <div style={{ padding: '0.8rem', borderRadius: 'var(--border-radius-sm)', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444', marginBottom: '1rem', fontSize: '0.85rem', textAlign: 'center' }}>
          ⚠️ {error}
        </div>
      )}

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
              onClick={handleCreateSession}
            >
              <span>➕</span> New Conversation
            </button>
          </div>
          <div style={{ flex: 1, padding: '0.5rem' }}>
            {conversations.map(c => {
              const isActive = activeSession?.id === c.id;
              return (
                <div 
                  key={c.id}
                  onClick={() => handleSelectConversation(c)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--border-radius-md)',
                    backgroundColor: isActive ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--color-accent)' : '3px solid transparent',
                    cursor: 'pointer',
                    marginBottom: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  className="hover-glow"
                >
                  <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                    <div style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: isActive ? 600 : 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      💬 {c.title}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {new Date(c.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteSession(e, c.id)}
                    style={{ background: 'none', border: 'none', color: 'rgba(239, 68, 68, 0.6)', cursor: 'pointer', fontSize: '0.9rem', padding: '2px' }}
                    title="Delete Conversation"
                    className="hover-danger"
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Chat Window */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
          {activeSession ? (
            <>
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
                {messages.map((m) => {
                  const isUser = m.role === 'user';
                  return (
                    <div 
                      key={m.id}
                      style={{
                        alignSelf: isUser ? 'flex-end' : 'flex-start',
                        maxWidth: '75%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >
                      <div style={{
                        backgroundColor: isUser ? 'rgba(56, 189, 248, 0.15)' : 'rgba(30, 41, 59, 0.8)',
                        border: isUser ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid var(--border-color)',
                        color: '#fff',
                        borderRadius: isUser ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                        padding: '0.85rem 1.25rem',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}>
                        {m.content}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', alignSelf: isUser ? 'flex-end' : 'flex-start', padding: '0 4px' }}>
                        {isUser ? 'You' : 'CareerCopilot AI'}
                      </span>
                    </div>
                  );
                })}

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
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
              <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>🤖</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>AI Career Coaching Center</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '420px', marginBottom: '1.5rem' }}>
                Start a new conversation session on the sidebar panel to align resumes or draft cold outreach templates.
              </p>
              <button onClick={handleCreateSession} className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>
                Start First Conversation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AICareerAssistant;
