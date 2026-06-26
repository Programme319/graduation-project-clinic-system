'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api');
  }, []);

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>Clinic Management System</h1>
        <p style={{ marginTop: '1rem', fontSize: '1.1rem', color: '#666' }}>
          Welcome to your comprehensive clinic management platform
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
        }}
      >
        <div
          style={{
            padding: '2rem',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ marginBottom: '1rem' }}>Patient Management</h2>
          <p>
            Manage patient records, medical history, and emergency contacts
            efficiently.
          </p>
          <a href="/patients" style={{ color: '#007bff', fontWeight: '600' }}>
            Go to Patients →
          </a>
        </div>

        <div
          style={{
            padding: '2rem',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ marginBottom: '1rem' }}>AI Chatbot</h2>
          <p>
            Get instant assistance with medical queries and patient information
            lookup.
          </p>
          <a href="/chat" style={{ color: '#007bff', fontWeight: '600' }}>
            Open Chat →
          </a>
        </div>

        <div
          style={{
            padding: '2rem',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ marginBottom: '1rem' }}>API Status</h2>
          <p>
            API URL: <code style={{ background: '#f0f0f0', padding: '0.25rem 0.5rem' }}>{apiUrl}</code>
          </p>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
            Backend is running and ready to serve requests.
          </p>
        </div>
      </div>

      <div style={{ marginTop: '3rem', padding: '2rem', background: 'white', borderRadius: '8px' }}>
        <h2>API Endpoints</h2>
        <ul style={{ marginTop: '1rem', lineHeight: '2' }}>
          <li><code>POST /api/auth/sign-in</code> - Sign in with email</li>
          <li><code>POST /api/auth/sign-up</code> - Register new account</li>
          <li><code>GET /api/patients</code> - List all patients</li>
          <li><code>POST /api/patients</code> - Create new patient</li>
          <li><code>GET /api/patients/[id]</code> - Get patient details</li>
          <li><code>PUT /api/patients/[id]</code> - Update patient</li>
          <li><code>DELETE /api/patients/[id]</code> - Delete patient</li>
          <li><code>POST /api/investigations</code> - Add investigation</li>
          <li><code>POST /api/medications</code> - Add medication</li>
          <li><code>POST /api/chat</code> - Chat with AI assistant</li>
        </ul>
      </div>
    </main>
  );
}
