import React, { useState } from 'react';
import axios from 'axios';

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    setError('');
    if (!form.email || !form.password) {
      setError('Email and password are required');
      return;
    }
    if (mode === 'register' && !form.name) {
      setError('Name is required');
      return;
    }
    setLoading(true);
    try {
      const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };
      const { data } = await axios.post(url, payload);
      localStorage.setItem('fc_token', data.token);
      localStorage.setItem('fc_user', JSON.stringify(data.user));
      onLogin(data.user, data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 56, height: 56, background: '#1D9E75', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 12px' }}>🥗</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 600, color: '#085041' }}>FridgeChef</div>
          <div style={{ fontSize: 13, color: '#888780', marginTop: 4 }}>Cook with what you have</div>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', border: '0.5px solid #e8e5de' }}>

          {/* Mode toggle */}
          <div style={{ display: 'flex', background: '#f5f3ec', borderRadius: 10, padding: 4, marginBottom: '1.5rem' }}>
            <button onClick={() => { setMode('login'); setError(''); }}
              style={{ flex: 1, padding: '8px', border: 'none', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, fontWeight: 500, cursor: 'pointer', background: mode === 'login' ? '#fff' : 'none', color: mode === 'login' ? '#1a1a18' : '#888780', boxShadow: mode === 'login' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.18s' }}>
              Login
            </button>
            <button onClick={() => { setMode('register'); setError(''); }}
              style={{ flex: 1, padding: '8px', border: 'none', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, fontWeight: 500, cursor: 'pointer', background: mode === 'register' ? '#fff' : 'none', color: mode === 'register' ? '#1a1a18' : '#888780', boxShadow: mode === 'register' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.18s' }}>
              Register
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding: '10px 14px', background: '#FCEBEB', borderRadius: 8, fontSize: 13, color: '#A32D2D', marginBottom: '1rem', border: '0.5px solid #F7C1C1' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Name field - register only */}
          {mode === 'register' && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#5f5e5a', display: 'block', marginBottom: 6 }}>Full Name</label>
              <input className="input" name="name" placeholder="Your name"
                value={form.name} onChange={handleChange} />
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#5f5e5a', display: 'block', marginBottom: 6 }}>Email</label>
            <input className="input" name="email" type="email" placeholder="you@email.com"
              value={form.email} onChange={handleChange}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#5f5e5a', display: 'block', marginBottom: 6 }}>Password</label>
            <input className="input" name="password" type="password" placeholder="••••••••"
              value={form.password} onChange={handleChange}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>

          {/* Submit */}
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: 15 }}
            onClick={handleSubmit} disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? '🔑 Login' : '🚀 Create Account'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: 12, color: '#888780' }}>
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <span style={{ color: '#1D9E75', cursor: 'pointer', fontWeight: 500 }}
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
            {mode === 'login' ? 'Register here' : 'Login here'}
          </span>
        </div>
      </div>
    </div>
  );
}