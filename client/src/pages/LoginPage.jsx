import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  Building2, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Mail, 
  Search, 
  Phone, 
  MapPin, 
  KeyRound, 
  CheckCircle, 
  Globe, 
  Shield, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage = ({ onContinueAsGuest, onOpenTrackModal }) => {
  const { citizenLogin, citizenRegister, adminLogin, citizenDemoUsers, officialDemoUsers, switchDemoUser } = useAuth();
  const { success, error } = useToast();

  // Mode: 'choose' | 'citizen' | 'admin'
  const [selectedRole, setSelectedRole] = useState('choose');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [ward, setWard] = useState('Ward 14 - Indiranagar');
  const [badgeId, setBadgeId] = useState('');

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setIsRegister(false);
    setEmail('');
    setPassword('');
  };

  const handleBackToChoice = () => {
    setSelectedRole('choose');
    setIsRegister(false);
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedRole === 'citizen') {
        if (isRegister) {
          const user = await citizenRegister({ name, email, password, phone, ward });
          success(`Welcome to Sahayak 360, ${user.name}!`);
        } else {
          const user = await citizenLogin(email, password);
          success(`Welcome back, ${user.name}!`);
        }
      } else {
        // Admin & Officer Login
        const user = await adminLogin(email, password, badgeId);
        success(`Administrative clearance verified! Welcome, ${user.name}.`);
      }
    } catch (err) {
      error(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: 'radial-gradient(circle at 50% 20%, rgba(30, 41, 59, 0.7) 0%, #0a0f1d 75%)',
      padding: '2rem 1.5rem 1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Background Decorative Glow Elements */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '20%',
        width: '500px',
        height: '500px',
        background: selectedRole === 'admin' 
          ? 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
        transition: 'background 0.5s ease'
      }} />

      {/* Main Centered Sign-In Card (Google Style Entity) */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '1.5rem 0'
      }}>
        <div 
          className="glass-panel-elevated animate-fade-in"
          style={{
            width: '100%',
            maxWidth: '480px',
            padding: '2.5rem 2.25rem',
            background: 'rgba(15, 23, 42, 0.92)',
            border: selectedRole === 'admin' 
              ? '1px solid rgba(99, 102, 241, 0.35)' 
              : selectedRole === 'citizen'
                ? '1px solid rgba(16, 185, 129, 0.35)'
                : '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85)',
            position: 'relative',
            borderRadius: 'var(--radius-xl)',
            transition: 'border 0.3s ease'
          }}
        >

          {/* Logo & Platform Name */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: selectedRole === 'admin'
                ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                : 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
              boxShadow: selectedRole === 'admin'
                ? '0 0 25px rgba(99, 102, 241, 0.45)'
                : '0 0 25px rgba(16, 185, 129, 0.45)',
              transition: 'background 0.3s ease, box-shadow 0.3s ease'
            }}>
              <ShieldCheck size={28} color="#ffffff" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                SAHAYAK
              </span>
              <span style={{ 
                background: selectedRole === 'admin'
                  ? 'linear-gradient(135deg, #818cf8, #a78bfa)'
                  : 'linear-gradient(135deg, #10b981, #34d399)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                fontSize: '1.4rem'
              }}>
                360
              </span>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginTop: '0.2rem' }}>
              Municipal Civic Redressal Portal
            </p>
          </div>

          {/* ======================================================== */}
          {/* STAGE 1: CHOOSE OPTION VIEW (GOOGLE LOGIN STYLE)         */}
          {/* ======================================================== */}
          {selectedRole === 'choose' && (
            <div className="animate-fade-in">
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc' }}>
                  Sign in
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  to continue to Sahayak 360
                </p>
              </div>

              {/* 2 Primary Options Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem' }}>
                
                {/* OPTION 1: USER / CITIZEN */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('citizen')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.15rem 1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(16, 185, 129, 0.12)';
                    e.currentTarget.style.borderColor = '#10b981';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#34d399',
                    flexShrink: 0
                  }}>
                    <UserCheck size={24} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                        Login as User / Citizen
                      </span>
                      <span className="badge badge-resolved" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                        Public
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                      Report roads, water, electricity or sanitation issues & track live status
                    </p>
                  </div>

                  <ArrowRight size={18} color="#34d399" />
                </button>

                {/* OPTION 2: ADMIN / MUNICIPAL OFFICER */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('admin')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.15rem 1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.14)';
                    e.currentTarget.style.borderColor = '#6366f1';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(99, 102, 241, 0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#a5b4fc',
                    flexShrink: 0
                  }}>
                    <Building2 size={24} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                        Login as Admin / Officer
                      </span>
                      <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#c7d2fe', fontSize: '0.65rem', padding: '1px 6px', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
                        Official
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                      Executive oversight, department dispatch desks, SLA monitoring & CSV reports
                    </p>
                  </div>

                  <ArrowRight size={18} color="#818cf8" />
                </button>

              </div>

              {/* Public Actions (No login needed) */}
              <div style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem'
              }}>
                <button
                  type="button"
                  onClick={onOpenTrackModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#38bdf8',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Search size={15} /> Track a Grievance with Tracking ID (No Login)
                </button>

                <button
                  type="button"
                  onClick={onContinueAsGuest}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Globe size={14} /> Explore Community Public Portal as Guest
                </button>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 2: CREDENTIALS FLOW (FOR CHOSEN ROLE)              */}
          {/* ======================================================== */}
          {selectedRole !== 'choose' && (
            <div className="animate-fade-in">
              
              {/* Back button to re-choose role */}
              <button
                type="button"
                onClick={handleBackToChoice}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  marginBottom: '1rem'
                }}
              >
                <ArrowLeft size={16} /> Choose another login option
              </button>

              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                  {selectedRole === 'admin' 
                    ? 'Municipal Officer & Admin Login' 
                    : isRegister 
                      ? 'Create Citizen Account' 
                      : 'Citizen Sign In'}
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {selectedRole === 'admin'
                    ? 'Authorized municipal personnel authentication terminal'
                    : isRegister
                      ? 'Register your residential ward for civic updates'
                      : 'Sign in to access your registered civic complaints'}
                </p>
              </div>

              {/* 1-Click Demo Personas for Quick Evaluation */}
              <div style={{
                background: selectedRole === 'admin' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                border: selectedRole === 'admin' ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid rgba(16, 185, 129, 0.25)'
              }}>
                <span style={{
                  fontSize: '0.68rem',
                  color: selectedRole === 'admin' ? '#c7d2fe' : '#34d399',
                  display: 'block',
                  marginBottom: '0.4rem',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  ⚡ 1-Click Instant Sign-In:
                </span>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: selectedRole === 'admin' ? 'repeat(2, 1fr)' : '1fr 1fr',
                  gap: '0.4rem'
                }}>
                  {selectedRole === 'admin' ? (
                    officialDemoUsers.slice(0, 4).map(du => {
                      const isComm = du.role === 'admin';
                      return (
                        <button
                          type="button"
                          key={du.id}
                          onClick={() => {
                            switchDemoUser(du);
                            success(`Logged in as ${du.name}! Loading Admin Interface...`);
                          }}
                          style={{
                            padding: '0.4rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            background: isComm ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                            border: isComm ? '1px solid #6366f1' : '1px solid var(--border-glass)',
                            color: isComm ? '#c7d2fe' : '#38bdf8',
                            fontSize: '0.725rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          <img src={du.avatar} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                          <div style={{ minWidth: 0, overflow: 'hidden' }}>
                            <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff', fontSize: '0.725rem' }}>
                              {du.name.split(' ')[0]} {du.name.split(' ')[1] || ''}
                            </p>
                            <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                              {isComm ? 'Commissioner' : `${du.department?.toUpperCase()}`}
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
                          success(`Logged in as Citizen ${du.name}! Loading User Interface...`);
                        }}
                        style={{
                          padding: '0.4rem 0.6rem',
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
                        <img src={du.avatar} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                        <div>
                          <p style={{ color: '#fff', fontSize: '0.725rem' }}>{du.name}</p>
                          <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>{du.ward.split(' - ')[1] || du.ward}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                
                {selectedRole === 'citizen' && isRegister && (
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
                    {selectedRole === 'admin' ? 'Official Government Email' : 'Email Address'}
                  </label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder={selectedRole === 'admin' ? 'commissioner@city.gov.in / priya.roads@city.gov.in' : 'rahul@citizen.in'}
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
                    placeholder={selectedRole === 'admin' ? "•••••••• (use 'admin123' or 'officer123')" : "•••••••• (use 'citizen123')"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>

                {selectedRole === 'admin' ? (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Municipal Employee / Badge ID (Optional)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. BBMP-ENG-4891"
                      value={badgeId}
                      onChange={(e) => setBadgeId(e.target.value)}
                    />
                  </div>
                ) : isRegister && (
                  <>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Mobile Number (For SMS Tracking)</label>
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
                  className={`btn ${selectedRole === 'admin' ? 'btn-indigo' : 'btn-primary'} btn-lg`}
                  disabled={loading}
                  style={{ marginTop: '0.4rem', gap: '0.5rem' }}
                >
                  {selectedRole === 'admin' ? <KeyRound size={18} /> : <ArrowRight size={18} />}
                  {loading 
                    ? 'Verifying...' 
                    : selectedRole === 'admin' 
                      ? 'Sign In to Admin Interface' 
                      : isRegister 
                        ? 'Create Account & Enter' 
                        : 'Sign In to User Interface'}
                </button>
              </form>

              {/* Citizen Register Toggle */}
              {selectedRole === 'citizen' && (
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
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
                    {isRegister ? 'Already registered? Sign In' : "New citizen? Create an account"}
                  </button>
                </div>
              )}

            </div>
          )}

        </div>
      </div>

      {/* Google-Style Clean Minimalist Footer */}
      <footer style={{
        maxWidth: '480px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 0',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span>© 2026 Sahayak 360</span>
          <span>Helpline: 1912</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={{ cursor: 'pointer' }}>Help</span>
          <span style={{ cursor: 'pointer' }}>Privacy</span>
          <span style={{ cursor: 'pointer' }}>Terms</span>
        </div>
      </footer>

    </div>
  );
};
