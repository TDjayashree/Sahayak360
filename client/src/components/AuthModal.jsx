import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, demoUsers, switchDemoUser } = useAuth();
  const { success, error } = useToast();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [ward, setWard] = useState('Ward 14 - Indiranagar');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register({ name, email, password, phone, ward, role: 'citizen' });
        success(`Welcome to Sahayak 360, ${name}!`);
      } else {
        await login(email, password);
        success('Logged in successfully!');
      }
      onClose();
    } catch (err) {
      error(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel-elevated modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '480px',
          padding: '2rem',
          background: 'rgba(15, 23, 42, 0.95)'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
            {isRegister ? 'Citizen Registration' : 'Citizen & Officer Login'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            {isRegister ? 'Create an account to report issues and receive SMS/email updates' : 'Sign in to access your civic grievance history'}
          </p>
        </div>

        {/* Demo Accounts Quick-Select */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-glass)' }}>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem', fontWeight: 700, textTransform: 'uppercase' }}>
            ⚡ 1-Click Instant Demo Login:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            {demoUsers.slice(0, 4).map(du => (
              <button
                type="button"
                key={du.id}
                onClick={() => {
                  switchDemoUser(du);
                  success(`Switched role to ${du.name}`);
                  onClose();
                }}
                style={{
                  padding: '0.4rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-glass)',
                  color: du.role === 'admin' ? '#a78bfa' : du.role === 'department_officer' ? '#38bdf8' : '#34d399',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <img src={du.avatar} alt="" style={{ width: '18px', height: '18px', borderRadius: '50%' }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {du.name.split(' ')[0]} ({du.role === 'department_officer' ? du.department?.toUpperCase() : du.role})
                </span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {isRegister && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="rahul@citizen.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {isRegister && (
            <>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Mobile Number (SMS Updates)</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Residential Ward</label>
                <select 
                  className="form-select"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                >
                  <option value="Ward 14 - Indiranagar">Ward 14 - Indiranagar</option>
                  <option value="Ward 22 - Koramangala">Ward 22 - Koramangala</option>
                  <option value="Ward 12 - HSR Layout">Ward 12 - HSR Layout</option>
                  <option value="Ward 18 - Whitefield">Ward 18 - Whitefield</option>
                  <option value="Ward 7 - MG Road">Ward 7 - MG Road</option>
                </select>
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="btn btn-primary btn-lg" 
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? 'Please wait...' : isRegister ? 'Create Citizen Account' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            style={{
              background: 'none',
              border: 'none',
              color: '#38bdf8',
              fontSize: '0.85rem',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register as Citizen"}
          </button>
        </div>

      </div>
    </div>
  );
};
