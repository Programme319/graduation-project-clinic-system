'use client';

import { useEffect, useState } from 'react';

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/patients', {
        headers: {
          'x-user-id': 'demo-user', // For testing - in production use real auth
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch patients: ${response.status}`);
      }

      const data = await response.json();
      setPatients(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch patients');
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Patient Management</h1>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          View and manage all patient records
        </p>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: '#fee', border: '1px solid #fcc', borderRadius: '4px', marginBottom: '1rem', color: '#c00' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Loading patients...
        </div>
      ) : patients.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', background: '#f5f5f5', borderRadius: '4px', color: '#666' }}>
          <p>No patients found. Create your first patient to get started.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
            <thead>
              <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>First Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Last Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Phone</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Date of Birth</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.75rem' }}>{patient.firstName}</td>
                  <td style={{ padding: '0.75rem' }}>{patient.lastName}</td>
                  <td style={{ padding: '0.75rem' }}>{patient.email || '-'}</td>
                  <td style={{ padding: '0.75rem' }}>{patient.phone || '-'}</td>
                  <td style={{ padding: '0.75rem' }}>{patient.dateOfBirth || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <a href="/" style={{ color: '#007bff', textDecoration: 'none' }}>
          ← Back to Home
        </a>
      </div>
    </main>
  );
}
