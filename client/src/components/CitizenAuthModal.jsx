import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, MapPin, CheckCircle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const CitizenAuthModal = ({ isOpen, onClose, onSwitchToAdmin }) => {
  const { citizenLogin, citizenRegister, citizenDemoUsers, switchDemoUser } = useAuth();
  const { success, error } = useToast();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [ward, setWard] = useState('Ward 14 - Indiranagar');
  const [address, setAddress] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await citizenRegister({ name, email, password, phone, ward, address });
        success(`Welcome to Sahayak 360, ${name}! Your citizen profile is active.`);
      } else {
        await citizenLogin(email, password);
        success('Citizen authenticated successfully!');
      }
      onClose();
    } catch (err) {
      error(err.message || 'Citizen authentication failed.');
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
          maxWidth: '500px',
          padding: '2.25rem',
          background: 'rgba(15, 23, 42, 0.96)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 25px rgba(16, 185, 129, 0.2)'
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

        {/* Citizen Portal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem',
            color: '#fff',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            <UserCheck size={28} />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            CITIZEN ACCESS GATEWAY
          </span>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.2rem' }}>
            {isRegister ? 'Register as Citizen' : 'Citizen Grievance Sign In'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            {isRegister 
              ? 'Join your community to report potholes, water bursts, and sanitation issues' 
              : 'Sign in to track your reported issues and rate municipal resolutions'}
          </p>
        </div>

        {/* 1-Click Demo Citizens */}
        <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <span style={{ fontSize: '0.7rem', color: '#34d399', display: 'block', marginBottom: '0.45rem', fontWeight: 700, textTransform: 'uppercase' }}>
            ⚡ 1-Click Demo Citizen Logins:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {citizenDemoUsers.map(du => (
              <button
                type="button"
                key={du.id}
                onClick={() => {
                  switchDemoUser(du);
                  success(`Logged in as Citizen: ${du.name}`);
                  onClose();
                }}
                style={{
                  padding: '0.45rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-glass)',
                  color: '#34d399',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <img src={du.avatar} alt="" style={{ width: '22px', height: '22px', borderRadius: '50%' }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {du.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {isRegister && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Citizen Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Citizen Email</label>
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
              placeholder="•••••••• (use 'citizen123' for demo)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {isRegister && (
            <>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Mobile Number (For SMS Status Updates)</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
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
            style={{ marginTop: '0.4rem' }}
          >
            {loading ? 'Verifying...' : isRegister ? 'Complete Citizen Registration' : 'Sign In as Citizen'}
          </button>
        </form>

        {/* Toggle Register/Login */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            style={{
              background: 'none',
              border: 'none',
              color: '#34d399',
              fontSize: '0.825rem',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            {isRegister ? 'Already registered? Sign In' : "New to Sahayak 360? Create Citizen Account"}
          </button>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Are you an authorized municipal officer or commissioner?
            </span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onSwitchToAdmin();
              }}
              style={{
                display: 'block',
                margin: '0.3rem auto 0',
                background: 'none',
                border: 'none',
                color: '#38bdf8',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              ➔ Go to Municipal Admin & Officer Portal
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
