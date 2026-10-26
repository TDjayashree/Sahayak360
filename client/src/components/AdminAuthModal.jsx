import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Building2, 
  BadgeCheck, 
  AlertTriangle, 
  Truck, 
  Droplets, 
  Zap, 
  Trash2, 
  ArrowRight,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AdminAuthModal = ({ isOpen, onClose, onSwitchToCitizen }) => {
  const { adminLogin, officialDemoUsers, switchDemoUser } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [badgeId, setBadgeId] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin(email, password, badgeId);
      success('Municipal credentials verified. Administrative access granted.');
      onClose();
    } catch (err) {
      error(err.message || 'Administrative verification failed.');
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
          maxWidth: '540px',
          padding: '2.25rem',
          background: 'rgba(11, 19, 43, 0.98)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 30px rgba(99, 102, 241, 0.25)'
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

        {/* Official Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '58px',
            height: '58px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem',
            color: '#fff',
            boxShadow: '0 0 25px rgba(99, 102, 241, 0.5)'
          }}>
            <ShieldCheck size={32} />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            OFFICIAL MUNICIPAL ACCESS
          </span>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.2rem' }}>
            Officer & Admin Portal
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Secure terminal for Departmental Engineers, Sanitary Inspectors & Commissioners
          </p>
        </div>

        {/* 1-Click Official Logins */}
        <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
          <span style={{ fontSize: '0.7rem', color: '#a5b4fc', display: 'block', marginBottom: '0.45rem', fontWeight: 700, textTransform: 'uppercase' }}>
            ⚡ 1-Click Municipal Official Personas:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.4rem' }}>
            {officialDemoUsers.map(du => {
              const isComm = du.role === 'admin';
              return (
                <button
                  type="button"
                  key={du.id}
                  onClick={() => {
                    switchDemoUser(du);
                    success(`Logged in as: ${du.name} (${isComm ? 'Admin' : du.department?.toUpperCase()})`);
                    onClose();
                  }}
                  style={{
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isComm ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: isComm ? '1px solid #6366f1' : '1px solid var(--border-glass)',
                    color: isComm ? '#c7d2fe' : '#38bdf8',
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
                  <div style={{ minWidth: 0, overflow: 'hidden' }}>
                    <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff', fontSize: '0.75rem' }}>
                      {du.name.split(' ')[0]} {du.name.split(' ')[1] || ''}
                    </p>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      {isComm ? 'Commissioner' : `${du.department?.toUpperCase()} Head`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Official Government Email</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="commissioner@city.gov.in / priya.roads@city.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Municipal Security Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="•••••••• (use 'admin123' or 'officer123')"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Municipal Badge / Employee ID (Optional)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. BBMP-ENG-4891"
              value={badgeId}
              onChange={(e) => setBadgeId(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-indigo btn-lg" 
            disabled={loading}
            style={{ marginTop: '0.4rem', gap: '0.5rem' }}
          >
            <KeyRound size={18} />
            {loading ? 'Authenticating Security Clearance...' : 'Verify & Enter Municipal Command Center'}
          </button>
        </form>

        {/* Security Notice & Citizen Redirect */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
          <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            🔒 <strong>Statutory Notice:</strong> Official access is monitored under the Municipal Digital Governance Act. All dispatch logs are legally timestamped.
          </p>

          <div style={{ marginTop: '0.65rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Are you a citizen filing or tracking an issue?
            </span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onSwitchToCitizen();
              }}
              style={{
                display: 'block',
                margin: '0.25rem auto 0',
                background: 'none',
                border: 'none',
                color: '#10b981',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              ➔ Switch to Citizen Grievance Portal
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
