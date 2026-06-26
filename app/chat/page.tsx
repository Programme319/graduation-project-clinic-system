'use client';

import { useState } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your clinic assistant. How can I help you today? You can ask about patient information, medical procedures, or general clinic questions.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user', // For testing
        },
        body: JSON.stringify({
          message: userMessage,
          patientId: null, // Optional - can specify a patient for context
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat error: ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response');
      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry, I encountered an error: ${error || 'Please try again.'}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h1>AI Clinic Assistant</h1>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          Chat with our AI assistant for instant medical guidance
        </p>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          background: '#f9f9f9',
          borderRadius: '8px',
          marginBottom: '1rem',
          border: '1px solid #eee',
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '70%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: msg.role === 'user' ? '#007bff' : '#e9ecef',
                color: msg.role === 'user' ? 'white' : '#333',
                wordWrap: 'break-word',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ textAlign: 'center', color: '#666', padding: '1rem' }}>
            Assistant is typing...
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem',
            opacity: loading ? 0.6 : 1,
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            padding: '0.75rem 1.5rem',
            background: loading || !input.trim() ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
          }}
        >
          Send
        </button>
      </form>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <a href="/" style={{ color: '#007bff', textDecoration: 'none' }}>
          ← Back to Home
        </a>
      </div>
    </main>
  );
}
