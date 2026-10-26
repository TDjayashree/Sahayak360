import React from 'react';
import { 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Truck, 
  Droplets, 
  Zap, 
  Trash2, 
  ShieldAlert,
  ArrowRight,
  Star
} from 'lucide-react';

const DEPT_ICONS = {
  roads: Truck,
  water: Droplets,
  electricity: Zap,
  sanitation: Trash2,
  health: ShieldAlert
};

const DEPT_COLORS = {
  roads: '#f59e0b',
  water: '#0284c7',
  electricity: '#eab308',
  sanitation: '#10b981',
  health: '#ec4899'
};

export const ComplaintCard = ({ complaint, onClick }) => {
  const DeptIcon = DEPT_ICONS[complaint.department] || AlertTriangle;
  const deptColor = DEPT_COLORS[complaint.department] || '#10b981';

  // Check SLA deadline status
  const now = new Date();
  const slaDate = complaint.slaDeadline ? new Date(complaint.slaDeadline) : null;
  const isOverdue = slaDate && slaDate < now && complaint.status !== 'resolved';

  const formatStatus = (st) => {
    switch (st) {
      case 'submitted': return 'Submitted';
      case 'under_review': return 'Under Review';
      case 'in_progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      default: return st;
    }
  };

  const DEPT_FALLBACK_IMAGES = {
    roads: '/evidence/pothole_crater.jpg',
    water: '/evidence/water_pipe_leak.jpg',
    electricity: '/evidence/dark_streetlights.jpg',
    sanitation: '/evidence/garbage_overflow.jpg',
    health: '/evidence/stagnant_drain.jpg'
  };

  const rawImage = complaint.attachments?.find(
    a => (a.mimeType?.startsWith('image') || a.url?.match(/\.(jpg|jpeg|png|webp)/i)) && !a.url?.includes('unsplash')
  );
  const firstImageUrl = rawImage?.url || DEPT_FALLBACK_IMAGES[complaint.department] || '/evidence/pothole_crater.jpg';

  return (
    <div 
      className="glass-panel"
      onClick={() => onClick(complaint)}
      style={{
        padding: '1.25rem',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '0.85rem'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-glass)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
    >
      {/* Top Department Accent Border */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: deptColor
        }}
      />

      {/* Header: Tracking ID + Department + Priority */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              background: `${deptColor}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: deptColor
            }}>
              <DeptIcon size={15} />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {complaint.trackingId}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span className={`badge badge-priority-${complaint.priority}`}>
              {complaint.priority}
            </span>
            <span className={`badge badge-${complaint.status}`}>
              {formatStatus(complaint.status)}
            </span>
          </div>
        </div>

        {/* Title */}
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem', lineHeight: 1.3 }}>
          {complaint.title}
        </h4>

        {/* Description snippet */}
        <p style={{
          fontSize: '0.825rem',
          color: 'var(--text-secondary)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: '0.5rem'
        }}>
          {complaint.description}
        </p>

        {/* Relevant photo preview */}
        <div style={{ width: '100%', height: '110px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '0.5rem' }}>
          <img 
            src={firstImageUrl} 
            alt={complaint.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = DEPT_FALLBACK_IMAGES[complaint.department] || '/evidence/pothole_crater.jpg';
            }}
          />
        </div>
      </div>

      {/* Bottom Footer: Ward, Time, SLA, Action */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', maxWidth: '65%' }}>
            <MapPin size={13} color="#10b981" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {complaint.location?.ward || 'City Ward'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={12} />
            <span>
              {new Date(complaint.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* SLA Escalation or Feedback Star */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
          {complaint.feedback?.rating ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 600 }}>
              <Star size={13} fill="#f59e0b" />
              <span>{complaint.feedback.rating}/5 Rated</span>
            </div>
          ) : isOverdue ? (
            <span style={{ color: '#f43f5e', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <AlertTriangle size={12} /> SLA Overdue
            </span>
          ) : (
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Assigned: {complaint.assignedTo ? complaint.assignedTo.officerName : 'Auto-Routing'}
            </span>
          )}

          <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            Track <ArrowRight size={12} />
          </span>
        </div>
      </div>

    </div>
  );
};
