import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  PlusCircle, 
  Search, 
  Bell, 
  UserCheck, 
  ChevronDown, 
  LayoutDashboard, 
  FileText, 
  Building2, 
  Sparkles,
  LogOut,
  CheckCircle,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  User,
  Shield,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const Navbar = ({ 
  activeTab, 
  setActiveTab, 
  onOpenTrackModal, 
  onOpenAuth 
}) => {
  const { user, citizenDemoUsers, officialDemoUsers, switchDemoUser, logout, isOfficial, isCitizen } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.getNotifications({
        userId: user?.id,
        role: user?.role,
        department: user?.department
      });
      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      // silent
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <nav className="glass-nav" style={{
      borderBottom: isOfficial ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid var(--border-glass)',
      background: isOfficial ? 'rgba(10, 15, 35, 0.92)' : 'rgba(10, 15, 29, 0.88)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        
        {/* Brand Logo & Portal Badge */}
        <div 
          onClick={() => setActiveTab(isOfficial ? 'admin' : 'home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: isOfficial ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isOfficial ? '0 0 20px rgba(99, 102, 241, 0.4)' : '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            <ShieldCheck size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                SAHAYAK
              </span>
              <span style={{ 
                background: isOfficial ? 'linear-gradient(135deg, #818cf8, #a78bfa)' : 'linear-gradient(135deg, #10b981, #34d399)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                fontSize: '1.25rem'
              }}>
                360
              </span>
            </div>
            
            {/* Dynamic Interface Mode Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: isOfficial ? '#a5b4fc' : '#34d399',
                background: isOfficial ? 'rgba(99, 102, 241, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                padding: '1px 6px',
                borderRadius: '4px'
              }}>
                {isOfficial ? '🏛️ ADMIN CONSOLE' : '👤 USER INTERFACE'}
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CENTER NAVIGATION: ADAPTIVE BASED ON CITIZEN VS ADMIN    */}
        {/* ======================================================== */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          
          {/* A. CITIZEN / USER INTERFACE NAVIGATION */}
          {!isOfficial ? (
            <>
              <button 
                className={`btn btn-sm ${activeTab === 'home' ? 'btn-secondary' : ''}`}
                onClick={() => setActiveTab('home')}
                style={{ 
                  background: activeTab === 'home' ? 'rgba(255,255,255,0.1)' : 'transparent', 
                  color: activeTab === 'home' ? '#34d399' : 'var(--text-secondary)' 
                }}
              >
                Home
              </button>

              <button 
                className={`btn btn-sm ${activeTab === 'new-complaint' ? 'btn-secondary' : ''}`}
                onClick={() => setActiveTab('new-complaint')}
                style={{ 
                  background: activeTab === 'new-complaint' ? 'rgba(255,255,255,0.1)' : 'transparent', 
                  color: activeTab === 'new-complaint' ? '#34d399' : 'var(--text-secondary)' 
                }}
              >
                <PlusCircle size={15} />
                Report Issue
              </button>

              <button 
                className={`btn btn-sm ${activeTab === 'citizen' ? 'btn-secondary' : ''}`}
                onClick={() => setActiveTab('citizen')}
                style={{ 
                  background: activeTab === 'citizen' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: activeTab === 'citizen' ? '#34d399' : 'var(--text-secondary)' 
                }}
              >
                <FileText size={15} />
                My Complaints
              </button>
            </>
          ) : (
            /* B. MUNICIPAL ADMIN & OFFICER INTERFACE NAVIGATION */
            <>
              <button 
                className={`btn btn-sm ${activeTab === 'admin' ? 'btn-secondary' : ''}`}
                onClick={() => setActiveTab('admin')}
                style={{ 
                  background: activeTab === 'admin' ? 'rgba(99,102,241,0.25)' : 'transparent',
                  color: activeTab === 'admin' ? '#a5b4fc' : 'var(--text-secondary)',
                  border: activeTab === 'admin' ? '1px solid rgba(99,102,241,0.4)' : '1px solid transparent'
                }}
              >
                <LayoutDashboard size={15} />
                Command Center
              </button>

              <button 
                className={`btn btn-sm ${activeTab === 'department' ? 'btn-secondary' : ''}`}
                onClick={() => setActiveTab('department')}
                style={{ 
                  background: activeTab === 'department' ? 'rgba(56,189,248,0.2)' : 'transparent',
                  color: activeTab === 'department' ? '#38bdf8' : 'var(--text-secondary)' 
                }}
              >
                <Building2 size={15} />
                Department Queue
              </button>
            </>
          )}

        </div>

        {/* ======================================================== */}
        {/* RIGHT CONTROLS: ACTION CTA + NOTIFICATIONS + PORTAL ACCESS */}
        {/* ======================================================== */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          
          {/* Quick Track ID Button (Universal) */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenTrackModal}
            title="Track Grievance by Reference ID"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <Search size={15} />
            Track ID
          </button>

          {/* Citizen: Quick Report Issue Button */}
          {!isOfficial && (
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setActiveTab('new-complaint')}
              style={{ borderRadius: 'var(--radius-full)', padding: '0.45rem 1rem' }}
            >
              <PlusCircle size={15} />
              Report Issue
            </button>
          )}



          {/* Notifications Bell */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                setShowRoleDropdown(false);
              }}
              style={{
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-glass)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  background: '#f43f5e',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  borderRadius: '999px',
                  padding: '1px 5px',
                  minWidth: '17px',
                  textAlign: 'center',
                  boxShadow: '0 0 8px rgba(244, 63, 94, 0.6)'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifDropdown && (
              <div 
                className="glass-panel-elevated animate-fade-in"
                style={{
                  position: 'absolute',
                  top: '48px',
                  right: '0',
                  width: '340px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  padding: '1rem',
                  zIndex: 200
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Civic Notifications</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllRead}
                      style={{ background: 'none', border: 'none', color: '#10b981', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem 0' }}>
                    No alerts at the moment.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {notifications.map(notif => (
                      <div 
                        key={notif.id}
                        style={{
                          padding: '0.65rem',
                          borderRadius: 'var(--radius-sm)',
                          background: notif.read ? 'rgba(255,255,255,0.02)' : 'rgba(16, 185, 129, 0.08)',
                          borderLeft: notif.read ? '2px solid transparent' : '2px solid #10b981'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>{notif.title}</p>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                          {notif.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active User Account Pill */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowNotifDropdown(false);
              }}
              style={{
                background: isOfficial ? 'rgba(99, 102, 241, 0.18)' : 'rgba(16, 185, 129, 0.18)',
                border: isOfficial ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                color: '#fff'
              }}
            >
              <img 
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                alt="Avatar" 
                style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block' }}>
                  {user?.name?.split(' ')[0] || 'Rahul'}
                </span>
                <span style={{ fontSize: '0.65rem', color: isOfficial ? '#c7d2fe' : '#34d399', fontWeight: 600 }}>
                  {user?.role === 'admin' ? 'Commissioner' : user?.role === 'department_officer' ? `${user.department?.toUpperCase()} Officer` : 'Citizen'}
                </span>
              </div>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {/* User Account & Login Switcher Menu */}
            {showRoleDropdown && (
              <div 
                className="glass-panel-elevated animate-fade-in"
                style={{
                  position: 'absolute',
                  top: '46px',
                  right: '0',
                  width: '320px',
                  maxHeight: '520px',
                  overflowY: 'auto',
                  padding: '1rem',
                  zIndex: 200
                }}
              >
                {/* Active user status banner */}
                <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem', border: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img src={user?.avatar} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: '0.825rem', fontWeight: 700, color: '#f8fafc' }}>{user?.name}</p>
                      <p style={{ fontSize: '0.7rem', color: isOfficial ? '#a5b4fc' : '#34d399' }}>
                        {isOfficial ? `Municipal ${user?.role === 'admin' ? 'Commissioner' : `${user?.department?.toUpperCase()} Officer`}` : `Citizen (${user?.ward})`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Details & Role-Specific Profiles */}
                {!isOfficial ? (
                  /* Citizen Account Menu */
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.7rem', color: '#34d399', textTransform: 'uppercase', fontWeight: 800 }}>
                        👤 Citizen Profile
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {citizenDemoUsers.map(du => {
                        const isCurrent = user?.id === du.id;
                        return (
                          <div
                            key={du.id}
                            onClick={() => {
                              switchDemoUser(du);
                              setShowRoleDropdown(false);
                              setActiveTab('home');
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.65rem',
                              padding: '0.45rem',
                              borderRadius: 'var(--radius-sm)',
                              cursor: 'pointer',
                              background: isCurrent ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                              border: isCurrent ? '1px solid #10b981' : '1px solid transparent'
                            }}
                          >
                            <img src={du.avatar} alt={du.name} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>{du.name}</p>
                              <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{du.ward}</p>
                            </div>
                            {isCurrent && <CheckCircle size={14} color="#10b981" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Municipal Officer & Admin Account Menu */
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.7rem', color: '#818cf8', textTransform: 'uppercase', fontWeight: 800 }}>
                        🏛️ Officer Credentials
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {officialDemoUsers.map(du => {
                        const isCurrent = user?.id === du.id;
                        const isComm = du.role === 'admin';
                        return (
                          <div
                            key={du.id}
                            onClick={() => {
                              switchDemoUser(du);
                              setShowRoleDropdown(false);
                              if (isComm) setActiveTab('admin');
                              else setActiveTab('department');
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.65rem',
                              padding: '0.45rem',
                              borderRadius: 'var(--radius-sm)',
                              cursor: 'pointer',
                              background: isCurrent ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                              border: isCurrent ? '1px solid #6366f1' : '1px solid transparent'
                            }}
                          >
                            <img src={du.avatar} alt={du.name} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>{du.name}</p>
                              <p style={{ fontSize: '0.68rem', color: isComm ? '#a78bfa' : '#38bdf8' }}>
                                {isComm ? 'Municipal Commissioner' : `${du.department?.toUpperCase()} Dept Chief`}
                              </p>
                            </div>
                            {isCurrent && <CheckCircle size={14} color="#818cf8" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer Controls: Sign Out Only */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <button 
                    onClick={() => {
                      logout();
                      setShowRoleDropdown(false);
                      setActiveTab('home');
                    }}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      background: 'rgba(244, 63, 94, 0.12)', 
                      border: '1px solid rgba(244, 63, 94, 0.3)', 
                      borderRadius: 'var(--radius-sm)', 
                      color: '#fda4af', 
                      fontSize: '0.8rem', 
                      fontWeight: 600, 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '0.35rem' 
                    }}
                  >
                    <LogOut size={14} /> Sign Out & Return to Login
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </nav>
  );
};
