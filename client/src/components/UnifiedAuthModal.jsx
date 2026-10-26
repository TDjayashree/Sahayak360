import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Building2, 
  BadgeCheck, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  KeyRound,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const UnifiedAuthModal = ({ isOpen, onClose, initialPortal = 'citizen', onLoginSuccess }) => {
  const { citizenLogin, citizenRegister, adminLogin, citizenDemoUsers, officialDemoUsers, switchDemoUser } = useAuth();
  const { success, error } = useToast();

  const [activePortal, setActivePortal] = useState(initialPortal); // 'citizen' | 'admin'
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  // Citizen Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [ward, setWard] = useState('Ward 14 - Indiranagar');
  const [badgeId, setBadgeId] = useState('');

  if (!isOpen) return null;

  const handlePortalSwitch = (portal) => {
    setActivePortal(portal);
    setIsRegister(false);
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activePortal === 'citizen') {
        if (isRegister) {
          const u = await citizenRegister({ name, email, password, phone, ward });
          success(`Citizen registration successful! Welcome, ${name}.`);
          if (onLoginSuccess) onLoginSuccess('citizen', u);
        } else {
          const u = await citizenLogin(email, password);
          success(`Welcome back, ${u.name}! Citizen interface loaded.`);
          if (onLoginSuccess) onLoginSuccess('citizen', u);
        }
      } else {
        // Admin & Officer login
        const u = await adminLogin(email, password, badgeId);
        success(`Administrative clearance verified! Welcome, ${u.name}.`);
        if (onLoginSuccess) onLoginSuccess('admin', u);
      }
      onClose();
    } catch (err) {
      error(err.message || 'Authentication failed. Please verify credentials.');
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
          maxWidth: '560px',
          padding: '2.25rem',
          background: activePortal === 'admin' ? 'rgba(10, 15, 35, 0.98)' : 'rgba(15, 23, 42, 0.98)',
          border: activePortal === 'admin' ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
          boxShadow: activePortal === 'admin' 
            ? '0 25px 60px -12px rgba(0, 0, 0, 0.9), 0 0 35px rgba(99, 102, 241, 0.3)' 
            : '0 25px 60px -12px rgba(0, 0, 0, 0.9), 0 0 35px rgba(16, 185, 129, 0.25)',
          transition: 'border 0.3s ease, background 0.3s ease'
        }}
      >
        {/* Close Button */}
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

        {/* Portal Selection Switcher Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          background: 'rgba(0, 0, 0, 0.35)',
          padding: '0.35rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-glass)',
          marginBottom: '1.75rem'
        }}>
          <button
            type="button"
            onClick={() => handlePortalSwitch('citizen')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: activePortal === 'citizen' ? '1px solid #10b981' : '1px solid transparent',
              background: activePortal === 'citizen' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.35))' : 'transparent',
              color: activePortal === 'citizen' ? '#34d399' : 'var(--text-muted)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.25s'
            }}
          >
            <UserCheck size={18} />
            Citizen Login
          </button>

          <button
            type="button"
            onClick={() => handlePortalSwitch('admin')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: activePortal === 'admin' ? '1px solid #6366f1' : '1px solid transparent',
              background: activePortal === 'admin' ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(79, 70, 229, 0.4))' : 'transparent',
              color: activePortal === 'admin' ? '#a5b4fc' : 'var(--text-muted)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.25s'
            }}
          >
            <ShieldCheck size={18} />
            Admin / Officer Login
          </button>
        </div>

        {/* Portal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: activePortal === 'admin' 
              ? 'linear-gradient(135deg, #6366f1, #4f46e5)' 
              : 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem',
            color: '#fff',
            boxShadow: activePortal === 'admin' 
              ? '0 0 25px rgba(99, 102, 241, 0.5)' 
              : '0 0 25px rgba(16, 185, 129, 0.5)'
          }}>
            {activePortal === 'admin' ? <ShieldCheck size={30} /> : <UserCheck size={30} />}
          </div>

          <span style={{
            fontSize: '0.725rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: activePortal === 'admin' ? '#a5b4fc' : '#34d399'
          }}>
            {activePortal === 'admin' ? 'MUNICIPAL ADMINISTRATIVE CONSOLE' : 'PUBLIC CITIZEN ACCESS GATEWAY'}
          </span>

          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.2rem' }}>
            {activePortal === 'admin' 
              ? 'Official Municipal Login' 
              : isRegister 
                ? 'Create Citizen Account' 
                : 'Citizen Grievance Sign In'}
          </h3>

          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            {activePortal === 'admin' 
              ? 'Enter official municipal credentials to access the Executive Monitoring & Resolution Console' 
              : isRegister 
                ? 'Register to file complaints, receive SMS updates, and track your local ward issues' 
                : 'Sign in to file issues, track live status, and view your neighborhood complaints'}
          </p>
        </div>

        {/* 1-Click Fast Persona Switcher */}
        <div style={{
          background: activePortal === 'admin' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(16, 185, 129, 0.08)',
          padding: '0.85rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          border: activePortal === 'admin' ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid rgba(16, 185, 129, 0.25)'
        }}>
          <span style={{
            fontSize: '0.7rem',
            color: activePortal === 'admin' ? '#c7d2fe' : '#34d399',
            display: 'block',
            marginBottom: '0.45rem',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}>
            ⚡ 1-Click Instant Login ({activePortal === 'admin' ? 'Official Personas' : 'Citizen Accounts'}):
          </span>

          <div style={{
            display: 'grid',
            gridTemplateColumns: activePortal === 'admin' ? 'repeat(auto-fit, minmax(150px, 1fr))' : '1fr 1fr',
            gap: '0.45rem'
          }}>
            {activePortal === 'admin' ? (
              officialDemoUsers.map(du => {
                const isComm = du.role === 'admin';
                return (
                  <button
                    type="button"
                    key={du.id}
                    onClick={() => {
                      switchDemoUser(du);
                      success(`Authenticated as ${du.name}! Loading Municipal Admin Interface...`);
                      if (onLoginSuccess) onLoginSuccess('admin', du);
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
              })
            ) : (
              citizenDemoUsers.map(du => (
                <button
                  type="button"
                  key={du.id}
                  onClick={() => {
                    switchDemoUser(du);
                    success(`Authenticated as Citizen ${du.name}! Loading User Interface...`);
                    if (onLoginSuccess) onLoginSuccess('citizen', du);
                    onClose();
                  }}
                  style={{
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.04)',
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
                  <div>
                    <p style={{ color: '#fff', fontSize: '0.75rem' }}>{du.name}</p>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{du.ward.split(' - ')[1] || du.ward}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {activePortal === 'citizen' && isRegister && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
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
            <label className="form-label">
              {activePortal === 'admin' ? 'Official Government Email' : 'Citizen Email'}
            </label>
            <input 
              type="email" 
              className="form-input" 
              placeholder={activePortal === 'admin' ? 'commissioner@city.gov.in / priya.roads@city.gov.in' : 'rahul@citizen.in'}
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
              placeholder={activePortal === 'admin' ? "•••••••• (use 'admin123' or 'officer123')" : "•••••••• (use 'citizen123')"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {activePortal === 'admin' ? (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Municipal Employee / Badge ID (Optional)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. MUNICIPAL-ENG-8491"
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
              />
            </div>
          ) : isRegister && (
            <>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Mobile Phone (For SMS Tracking)</label>
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
            className={`btn ${activePortal === 'admin' ? 'btn-indigo' : 'btn-primary'} btn-lg`}
            disabled={loading}
            style={{ marginTop: '0.4rem', gap: '0.5rem' }}
          >
            {activePortal === 'admin' ? <KeyRound size={18} /> : <ArrowRight size={18} />}
            {loading 
              ? 'Verifying Credentials...' 
              : activePortal === 'admin' 
                ? 'Access Municipal Admin Interface' 
                : isRegister 
                  ? 'Register & Access Citizen Interface' 
                  : 'Access Citizen Interface'}
          </button>
        </form>

        {/* Footer toggles */}
        {activePortal === 'citizen' && (
          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
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
              {isRegister ? 'Already registered? Sign In as Citizen' : "New Citizen? Register for Grievance Tracking"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
