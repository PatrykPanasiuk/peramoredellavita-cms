'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push('/admin');
      } else {
        const data = await res.json();
        setError(data.error || 'Błąd logowania');
      }
    } catch {
      setError('Błąd połączenia');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f0e8' }}>
      <form
        onSubmit={handleSubmit}
        style={{ background: '#fff', padding: '3rem', width: '100%', maxWidth: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
      >
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1a1a2e' }}>Panel Admina</h1>
        <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '2rem' }}>Per Amore della Vita</p>

        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e0d8', fontSize: '1rem', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hasło</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e0d8', fontSize: '1rem', outline: 'none' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '0.9rem', background: '#1a1a2e', color: '#fff', border: 'none', fontSize: '0.95rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Logowanie…' : 'Zaloguj się'}
        </button>
      </form>
    </div>
  );
}
