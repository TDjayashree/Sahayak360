import React, { useState } from 'react';
import { 
  FileText, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Filter, 
  Star,
  MapPin,
  Search
} from 'lucide-react';
import { ComplaintCard } from '../components/ComplaintCard';
import { useAuth } from '../context/AuthContext';

export const CitizenDashboard = ({ 
  complaints = [], 
  onSelectComplaint, 
  onOpenNewComplaint 
}) => {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter complaints by citizen or show all community complaints if guest
  const citizenComplaints = complaints.filter(c => {
    // If logged in citizen, match citizen ID or show demo citizen's complaints
    if (user && user.role === 'citizen') {
      return c.citizen?.id === user.id || c.citizen?.name === user.name;
    }
    return true;
  });

  const filtered = citizenComplaints.filter(c => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.trackingId.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.location?.ward.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCount = citizenComplaints.length;
  const resolvedCount = citizenComplaints.filter(c => c.status === 'resolved').length;
  const activeCount = citizenComplaints.filter(c => c.status !== 'resolved').length;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      
      {/* Citizen Profile Banner */}
      <div 
        className="glass-panel"
        style={{
          padding: '1.75rem 2rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img 
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
            alt="Citizen Profile"
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #10b981' }} 
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
                {user?.name || 'Rahul Sharma'}
              </h2>
              <span className="badge badge-resolved">Verified Citizen</span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
              <MapPin size={14} color="#10b981" />
              {user?.ward || 'Ward 14 - Indiranagar'} • {user?.phone || '+91 98765 43210'}
            </p>
          </div>
        </div>

        <button 
          className="btn btn-primary"
          onClick={onOpenNewComplaint}
          style={{ padding: '0.65rem 1.4rem' }}
        >
          <PlusCircle size={18} />
          Register New Issue
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Total Grievances Filed
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.25rem' }}>
            {totalCount}
          </h3>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            In Progress / Under Review
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.25rem' }}>
            {activeCount}
          </h3>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Resolved & Closed
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '0.25rem' }}>
            {resolvedCount}
          </h3>
        </div>
      </div>

      {/* Search & Filter Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        
        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All (${totalCount})` },
            { id: 'submitted', label: 'Submitted' },
            { id: 'under_review', label: 'Under Review' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'resolved', label: 'Resolved' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                border: filterStatus === f.id ? '1px solid #10b981' : '1px solid var(--border-glass)',
                background: filterStatus === f.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                color: filterStatus === f.id ? '#34d399' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ width: '260px' }}>
          <input 
            type="text" 
            className="form-input"
            placeholder="Search by ID or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
          />
        </div>

      </div>

      {/* Grievance Grid */}
      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: 'var(--text-muted)'
          }}>
            <FileText size={32} />
          </div>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
            No complaints found in this category
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem', marginBottom: '1.25rem' }}>
            Have a pothole, leak, or sanitation issue in your street? Report it directly to municipal officers.
          </p>
          <button className="btn btn-primary" onClick={onOpenNewComplaint}>
            <PlusCircle size={16} /> File New Complaint
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {filtered.map(cmp => (
            <ComplaintCard 
              key={cmp.id}
              complaint={cmp}
              onClick={onSelectComplaint}
            />
          ))}
        </div>
      )}

    </div>
  );
};
