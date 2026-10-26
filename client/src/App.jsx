import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { NewComplaintPage } from './pages/NewComplaintPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { DepartmentPortal } from './pages/DepartmentPortal';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { ComplaintDetailsModal } from './components/ComplaintDetailsModal';
import { TrackModal } from './components/TrackModal';
import { UnifiedAuthModal } from './components/UnifiedAuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { api } from './services/api';
import { ShieldCheck, Phone, Mail, ExternalLink, Heart, UserCheck, Shield, ArrowRight, RefreshCw, LogOut } from 'lucide-react';

const AppContent = () => {
  const { user, isOfficial, isCitizen, citizenDemoUsers, officialDemoUsers, switchDemoUser, logout } = useAuth();
  const { success } = useToast();

  const [activeTab, setActiveTab] = useState('home');
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalPortal, setAuthModalPortal] = useState('citizen');
  const [guestMode, setGuestMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync tab with role if user switches
  useEffect(() => {
    if (isOfficial) {
      if (activeTab === 'citizen' || activeTab === 'new-complaint' || activeTab === 'home') {
        setActiveTab(user?.role === 'department_officer' ? 'department' : 'admin');
      }
    } else if (isCitizen) {
      if (activeTab === 'admin' || activeTab === 'department') {
        setActiveTab('home');
      }
    }
  }, [user?.role]);

  // Fetch complaints and analytics
  const fetchData = async () => {
    try {
      const [compRes, anaRes] = await Promise.all([
        api.getComplaints(),
        api.getAnalytics()
      ]);

      if (compRes.success && compRes.complaints) {
        setComplaints(compRes.complaints);
      }
      if (anaRes.success && anaRes.analytics) {
        setAnalytics(anaRes.analytics);
      }
    } catch (err) {
      console.warn('API sync warning:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenAuth = (portal = 'citizen') => {
    setAuthModalPortal(portal);
    setShowAuthModal(true);
  };

  const handleLoginSuccess = (portal, loggedUser) => {
    if (portal === 'admin' || loggedUser?.role === 'admin' || loggedUser?.role === 'department_officer') {
      setActiveTab(loggedUser?.role === 'department_officer' ? 'department' : 'admin');
    } else {
      setActiveTab('home');
    }
    fetchData();
  };

  const handleComplaintCreated = (newCmp) => {
    setComplaints(prev => [newCmp, ...prev]);
    setSelectedComplaint(newCmp);
    setActiveTab(isOfficial ? 'department' : 'home');
    fetchData();
  };

  const handleComplaintUpdated = (updatedCmp) => {
    setComplaints(prev => prev.map(c => c.id === updatedCmp.id ? updatedCmp : c));
    setSelectedComplaint(updatedCmp);
    fetchData();
  };

  const handleSignOut = () => {
    logout();
    setGuestMode(false);
    success('Signed out. Returned to Sign In Gateway.');
  };

  // ==========================================================
  // 1. STANDALONE LOGIN PAGE (GOOGLE SIGN-IN STYLE ENTITY)
  // Displayed whenever user is not logged in and not in guest mode
  // ==========================================================
  if (!user && !guestMode) {
    return (
      <>
        <LoginPage 
          onContinueAsGuest={() => setGuestMode(true)}
          onOpenTrackModal={() => setShowTrackModal(true)}
        />
        
        {/* Track Modal for public reference lookup */}
        <TrackModal 
          isOpen={showTrackModal}
          onClose={() => setShowTrackModal(false)}
          onSelectComplaint={(c) => {
            setSelectedComplaint(c);
            setGuestMode(true);
          }}
        />

        {selectedComplaint && (
          <ComplaintDetailsModal 
            complaint={selectedComplaint}
            onClose={() => setSelectedComplaint(null)}
            onComplaintUpdated={handleComplaintUpdated}
          />
        )}
      </>
    );
  }

  // ==========================================================
  // 2. AUTHENTICATED OR GUEST INTERFACE
  // Displays User UI or Admin UI according to logged-in role
  // ==========================================================
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Banner: Shows Current Role / Interface & Sign Out to Login Page */}
      <div style={{
        background: isOfficial ? 'linear-gradient(90deg, #312e81, #1e1b4b)' : 'linear-gradient(90deg, #064e3b, #022c22)',
        borderBottom: isOfficial ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(16, 185, 129, 0.3)',
        padding: '0.45rem 1.5rem',
        fontSize: '0.78rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#f8fafc'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isOfficial ? (
            <>
              <Shield size={14} color="#818cf8" />
              <span style={{ fontWeight: 700, color: '#c7d2fe' }}>ADMIN INTERFACE ACTIVE:</span>
              <span style={{ color: '#e0e7ff' }}>
                Logged in as <strong>{user?.name || 'Administrator'}</strong> ({user?.role === 'admin' ? 'Municipal Commissioner' : `${user?.department?.toUpperCase()} Officer`})
              </span>
            </>
          ) : user ? (
            <>
              <UserCheck size={14} color="#34d399" />
              <span style={{ fontWeight: 700, color: '#6ee7b7' }}>CITIZEN / USER INTERFACE ACTIVE:</span>
              <span style={{ color: '#d1fae5' }}>
                Logged in as Citizen <strong>{user?.name || 'Rahul Sharma'}</strong> ({user?.ward || 'Ward 14 - Indiranagar'})
              </span>
            </>
          ) : (
            <>
              <span style={{ fontWeight: 700, color: '#38bdf8' }}>PUBLIC GUEST EXPLORER</span>
              <span style={{ color: 'var(--text-muted)' }}>Browsing community grievances</span>
            </>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {user ? (
            <button
              onClick={handleSignOut}
              style={{
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fda4af',
                borderRadius: 'var(--radius-sm)',
                padding: '0.2rem 0.65rem',
                fontSize: '0.725rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
              title="Sign out and return to the Login Page"
            >
              <LogOut size={12} /> Sign Out
            </button>
          ) : (
            <button
              onClick={() => setGuestMode(false)}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
            >
              Sign In to Portal
            </button>
          )}
        </div>
      </div>

      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTrackModal={() => setShowTrackModal(true)}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Page Body: Adapts to User UI or Admin UI */}
      <main style={{ flex: 1 }}>
        
        {/* ======================================================== */}
        {/* A. CITIZEN / USER INTERFACE VIEWS                         */}
        {/* ======================================================== */}
        {!isOfficial ? (
          <>
            {activeTab === 'home' && (
              <HomePage 
                complaints={complaints}
                analytics={analytics}
                onSelectComplaint={(c) => setSelectedComplaint(c)}
                onOpenNewComplaint={() => setActiveTab('new-complaint')}
                onOpenTrackModal={() => setShowTrackModal(true)}
              />
            )}

            {activeTab === 'new-complaint' && (
              <NewComplaintPage 
                onComplaintCreated={handleComplaintCreated}
                onCancel={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'citizen' && (
              <CitizenDashboard 
                complaints={complaints}
                onSelectComplaint={(c) => setSelectedComplaint(c)}
                onOpenNewComplaint={() => setActiveTab('new-complaint')}
              />
            )}
          </>
        ) : (
          /* ======================================================== */
          /* B. MUNICIPAL ADMIN & OFFICER INTERFACE VIEWS             */
          /* ======================================================== */
          <>
            {activeTab === 'admin' && (
              <AdminDashboard 
                complaints={complaints}
                analytics={analytics}
                onSelectComplaint={(c) => setSelectedComplaint(c)}
              />
            )}

            {activeTab === 'department' && (
              <DepartmentPortal 
                complaints={complaints}
                onSelectComplaint={(c) => setSelectedComplaint(c)}
              />
            )}
          </>
        )}

      </main>

      {/* Global Modals */}
      {selectedComplaint && (
        <ComplaintDetailsModal 
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onComplaintUpdated={handleComplaintUpdated}
        />
      )}

      <TrackModal 
        isOpen={showTrackModal}
        onClose={() => setShowTrackModal(false)}
        onSelectComplaint={(c) => setSelectedComplaint(c)}
      />

      {/* Quick Switch Modal */}
      <UnifiedAuthModal 
        isOpen={showAuthModal}
        initialPortal={authModalPortal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Municipal Footer */}
      <footer style={{
        background: 'rgba(10, 15, 29, 0.95)',
        borderTop: '1px solid var(--border-glass)',
        padding: '3rem 0 2rem',
        marginTop: 'auto'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
            marginBottom: '2.5rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <ShieldCheck size={22} color="#10b981" />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', color: '#fff' }}>
                  SAHAYAK 360
                </span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Municipal Smart Governance Platform for transparent, SLA-enforced redressal of civic grievances including roads, water pipelines, electricity, and sanitation.
              </p>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  onClick={handleSignOut}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '4px',
                    color: '#f8fafc',
                    fontSize: '0.75rem',
                    padding: '0.35rem 0.65rem',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Return to Sign-In Gateway ➔
                </button>
              </div>
            </div>

            <div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                24x7 Civic Helplines
              </h5>
              <ul style={{ listStyle: 'none', fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>🚨 Municipal Control Room: 1912</li>
                <li>💧 Water Supply Board: 1916</li>
                <li>⚡ Electricity Emergency: 1912</li>
                <li>🗑️ Sanitation Grievance: 14420</li>
              </ul>
            </div>

            <div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Statutory SLA Standards
              </h5>
              <ul style={{ listStyle: 'none', fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>⚡ Electricity / Sparks: 12 Hours</li>
                <li>💧 Water Pipe Burst: 24 Hours</li>
                <li>🗑️ Garbage Dump Removal: 24 Hours</li>
                <li>🛣️ Road Pothole Patching: 48 Hours</li>
              </ul>
            </div>

            <div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Role-Based Interface Mode
              </h5>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                The interface dynamically adapts: public citizens see the Citizen Grievance Portal while certified municipal personnel see the Command Center and Department Dispatch Desks.
              </p>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.775rem',
            color: 'var(--text-muted)'
          }}>
            <p>© 2026 Sahayak 360 Municipal Corporation. All rights reserved.</p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Built with MERN Stack • Powering Transparent Urban Governance
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
