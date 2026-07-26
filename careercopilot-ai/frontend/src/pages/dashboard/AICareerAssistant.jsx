/**
 * File Explanation: AICareerAssistant.jsx
 * 
 * AI Career Assistant page connected to live backend database endpoints.
 * Displays history, creates conversations, deletes threads, and records chat turn messages.
 */

import React, { useState, useRef, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import PageLoader from '../../components/PageLoader';
import ButtonLoader from '../../components/ButtonLoader';
import { aiService } from '../../services/ai';


// Custom lightweight Markdown-to-HTML parser mapping headers, bold formatting, lists, and code blocks
const parseMarkdown = (text) => {
  if (!text) return '';
  
  // Escape HTML to prevent cross-site scripting (XSS) injections
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
    
  // Pre-formatted code blocks: ```code```
  html = html.replace(/```([\s\S]+?)```/g, (match, code) => {
    return `<pre style="background: rgba(0, 0, 0, 0.4); padding: 0.85rem; border-radius: 6px; overflow-x: auto; font-family: monospace; border: 1px solid var(--border-color); font-size: 0.85rem; margin: 0.75rem 0; color: #e2e8f0; line-height: 1.45;"><code>${code.trim()}</code></pre>`;
  });
  
  // Inline code tags: `code`
  html = html.replace(/`([^`\n]+?)`/g, '<code style="background: rgba(56, 189, 248, 0.1); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; color: var(--color-accent); border: 1px solid rgba(56, 189, 248, 0.2);">$1</code>');
  
  // Section headers: ###, ##, #
  html = html.replace(/^### (.*?)$/gm, '<h4 style="font-size: 1.05rem; font-weight: 600; color: #fff; margin-top: 0.85rem; margin-bottom: 0.35rem; display: block;">$1</h4>');
  html = html.replace(/^## (.*?)$/gm, '<h3 style="font-size: 1.15rem; font-weight: 700; color: #fff; margin-top: 1.1rem; margin-bottom: 0.5rem; display: block;">$1</h3>');
  html = html.replace(/^# (.*?)$/gm, '<h2 style="font-size: 1.3rem; font-weight: 700; color: #fff; margin-top: 1.35rem; margin-bottom: 0.6rem; display: block;">$1</h2>');
  
  // Bold styling: **text**
  html = html.replace(/\*\*([\s\S]+?)\*\*/g, '<strong style="font-weight: 600; color: #fff;">$1</strong>');
  
  // Bullet items: - item or * item
  html = html.replace(/^\s*[-*]\s+(.*?)$/gm, '<li style="margin-left: 1.25rem; margin-bottom: 0.35rem; list-style-type: disc; color: #cbd5e1;">$1</li>');
  
  // Replace newlines with breaks outside of <pre> tags
  const parts = html.split(/(<pre[\s\S]+?<\/pre>)/g);
  const processedParts = parts.map(part => {
    if (part.startsWith('<pre')) return part;
    return part.replace(/\n/g, '<br />');
  });
  html = processedParts.join('');

  return html;
};

function AICareerAssistant() {
  const [conversations, setConversations] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [abortController, setAbortController] = useState(null);
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
        const cachedId = localStorage.getItem('active_chat_session_id');
        const parsedCachedId = cachedId ? parseInt(cachedId, 10) : null;
        const cachedSession = list.find(c => c.id === parsedCachedId);
        
        if (cachedSession) {
          await handleSelectConversation(cachedSession);
        } else {
          await handleSelectConversation(list[0]);
        }
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
      localStorage.setItem('active_chat_session_id', session.id);
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

  const handleRenameSession = async (e, sessionId, currentTitle) => {
    e.stopPropagation();
    const newTitle = prompt('Enter a new title for this conversation:', currentTitle);
    if (!newTitle || !newTitle.trim() || newTitle.trim() === currentTitle) return;

    try {
      setError(null);
      await aiService.renameConversation(sessionId, newTitle.trim());
      
      // Reload list
      const list = await aiService.listConversations();
      setConversations(list);

      if (activeSession?.id === sessionId) {
        setActiveSession(prev => prev ? { ...prev, title: newTitle.trim() } : null);
      }
    } catch (err) {
      console.error('Failed to rename conversation:', err);
      alert('Failed to rename conversation.');
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
        localStorage.removeItem('active_chat_session_id');
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

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setIsGenerating(false);
    setIsTyping(false);
    // Rollback temporary messages from view state (which align with backend rollback deletions)
    setMessages(prev => prev.filter(m => m.id !== 'temp-user-id' && m.id !== 'temp-assistant-id'));
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert('Copied to clipboard!'))
      .catch((err) => console.error('Failed to copy text:', err));
  };

  const handleRegenerate = async () => {
    const userMessages = messages.filter(m => m.role === 'user');
    if (userMessages.length === 0) return;
    const lastUserMsg = userMessages[userMessages.length - 1];
    await handleSend(lastUserMsg.content);
  };

  const handleSend = async (textToSend) => {
    if (!textToSend || !textToSend.trim() || !activeSession || isGenerating) return;

    const userText = textToSend.trim();
    setInputText('');
    setError(null);
    setIsGenerating(true);
    setIsTyping(true);

    const controller = new AbortController();
    setAbortController(controller);

    // Append temporary user & assistant stream cards to log
    const tempUserMsg = {
      id: 'temp-user-id',
      role: 'user',
      content: userText,
      created_at: new Date().toISOString()
    };

    const tempAssistantMsg = {
      id: 'temp-assistant-id',
      role: 'assistant',
      content: '',
      isStreaming: true,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempUserMsg, tempAssistantMsg]);

    try {
      await aiService.sendMessageStream(activeSession.id, userText, {
        signal: controller.signal,
        onChunk: (chunk) => {
          setIsTyping(false); // Stop typing indicator once first token arrives
          setMessages(prev =>
            prev.map(m =>
              m.id === 'temp-assistant-id'
                ? { ...m, content: m.content + chunk }
                : m
            )
          );
        },
        onError: (errMsg) => {
          setError(errMsg);
          handleStop();
          setInputText(userText); // Restore input for retry attempts
        },
        onDone: async (doneData) => {
          setIsGenerating(false);
          setAbortController(null);
          try {
            // Re-fetch messages from database to obtain aligned IDs and metadata
            const list = await aiService.getMessages(activeSession.id);
            setMessages(list);
          } catch (e) {
            console.error('Failed to align messages after stream completion:', e);
          }
        }
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Failed to send message and generate AI response:', err);
        setError(err.message || 'Unable to communicate with the AI Assistant. Please try again.');
        handleStop();
        setInputText(userText);
      }
    }
  };


  const lastAssistantId = [...messages]
    .reverse()
    .find(m => m.role === 'assistant' && !m.isStreaming)?.id;

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
        <div style={{ padding: '0.8rem 1rem', borderRadius: 'var(--border-radius-sm)', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <span>⚠️ {error}</span>
          {inputText && (
            <button 
              onClick={() => handleSend(inputText)} 
              className="btn btn-secondary" 
              style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.15)', color: '#fff', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              🔄 Retry
            </button>
          )}
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
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      onClick={(e) => handleRenameSession(e, c.id, c.title)}
                      style={{ background: 'none', border: 'none', color: 'rgba(56, 189, 248, 0.6)', cursor: 'pointer', fontSize: '0.9rem', padding: '2px' }}
                      title="Rename Conversation"
                      className="hover-accent"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={(e) => handleDeleteSession(e, c.id)}
                      style={{ background: 'none', border: 'none', color: 'rgba(239, 68, 68, 0.6)', cursor: 'pointer', fontSize: '0.9rem', padding: '2px' }}
                      title="Delete Conversation"
                      className="hover-danger"
                    >
                      🗑️
                    </button>
                  </div>
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
                       <div 
                        className={m.isStreaming ? "streaming-cursor" : ""}
                        style={{
                          backgroundColor: isUser ? 'rgba(56, 189, 248, 0.15)' : 'rgba(30, 41, 59, 0.8)',
                          border: isUser ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid var(--border-color)',
                          color: '#fff',
                          borderRadius: isUser ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                          padding: '0.85rem 1.25rem',
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                          whiteSpace: m.isStreaming ? 'pre-wrap' : 'normal'
                        }}
                        dangerouslySetInnerHTML={m.isStreaming ? undefined : { __html: parseMarkdown(m.content) }}
                      >
                        {m.isStreaming ? m.content : undefined}
                      </div>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        color: 'var(--text-muted)', 
                        alignSelf: isUser ? 'flex-end' : 'flex-start', 
                        padding: '0 4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        {isUser ? 'You' : 'CareerCopilot AI'}
                        {!isUser && !m.isStreaming && (
                          <>
                            <button 
                              onClick={() => handleCopy(m.content)}
                              className="chat-action-btn"
                              title="Copy Response"
                            >
                              📋 Copy
                            </button>
                            {m.id === lastAssistantId && (
                              <button 
                                onClick={handleRegenerate}
                                className="chat-action-btn"
                                title="Regenerate Response"
                              >
                                🔄 Regenerate
                              </button>
                            )}
                          </>
                        )}
                      </span>
                    </div>
                  );
                })}

                {isTyping && (
                  <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
                    <div className="dot-flashing" style={{ marginRight: '16px' }} />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '8px' }}>AI is thinking...</span>
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
                    style={{ 
                      padding: '0.35rem 0.75rem', 
                      fontSize: '0.75rem', 
                      borderRadius: '20px', 
                      border: '1px solid rgba(255,255,255,0.05)',
                      cursor: isGenerating ? 'not-allowed' : 'pointer',
                      opacity: isGenerating ? 0.5 : 1
                    }}
                    disabled={isGenerating}
                    onClick={() => handleSend(p.slice(3))} // strip emoji and send
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Input Box Area */}
              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <textarea 
                  className="form-input"
                  style={{ 
                    flex: 1, 
                    margin: 0, 
                    resize: 'none', 
                    minHeight: '44px', 
                    maxHeight: '120px', 
                    padding: '0.75rem 1rem',
                    lineHeight: '1.4',
                    borderRadius: 'var(--border-radius-md)',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    color: '#fff',
                    border: '1px solid var(--border-color)',
                    overflowY: 'auto'
                  }}
                  placeholder={isGenerating ? "AI is generating a response..." : "Ask the career coach assistant..."}
                  value={inputText}
                  disabled={isGenerating}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(inputText);
                    }
                  }}
                  rows={1}
                />
                {isGenerating ? (
                  <button 
                    className="btn btn-danger"
                    style={{ 
                      padding: '0.75rem 1.5rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      height: '44px'
                    }}
                    onClick={handleStop}
                  >
                    <span>⏹️</span> Stop
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary"
                    style={{ 
                      padding: '0.75rem 1.5rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      height: '44px',
                      opacity: !inputText.trim() ? 0.6 : 1,
                      cursor: !inputText.trim() ? 'not-allowed' : 'pointer'
                    }}
                    disabled={!inputText.trim()}
                    onClick={() => handleSend(inputText)}
                  >
                    <span>⚡</span> Send
                  </button>
                )}
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
