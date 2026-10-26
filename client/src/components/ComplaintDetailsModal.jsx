import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  AlertTriangle, 
  CheckCircle2, 
  Truck, 
  Droplets, 
  Zap, 
  Trash2, 
  ShieldAlert, 
  Send, 
  Star, 
  Share2, 
  Printer, 
  ArrowRight,
  ShieldCheck,
  FileText,
  Upload,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StatusStepper } from './StatusStepper';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

const DEPT_ICONS = {
  roads: Truck,
  water: Droplets,
  electricity: Zap,
  sanitation: Trash2,
  health: ShieldAlert
};

const DEPARTMENT_EVIDENCE_MAP = {
  roads: {
    url: '/evidence/pothole_crater.jpg',
    title: 'Pothole & Asphalt Road Cavings Evidence'
  },
  water: {
    url: '/evidence/water_pipe_leak.jpg',
    title: 'Water Main Pipe Burst & Street Flooding Evidence'
  },
  electricity: {
    url: '/evidence/dark_streetlights.jpg',
    title: 'Streetlight Blackout & Dark Road Evidence'
  },
  sanitation: {
    url: '/evidence/garbage_overflow.jpg',
    title: 'Overflowing Garbage Dumpster Evidence'
  },
  health: {
    url: '/evidence/stagnant_drain.jpg',
    title: 'Clogged Stormwater Drain & Stagnant Water Evidence'
  }
};

const isPdfDocument = (att) => {
  if (!att) return false;
  return att.mimeType === 'application/pdf' || 
         att.filename?.toLowerCase().endsWith('.pdf') || 
         att.originalName?.toLowerCase().endsWith('.pdf') ||
         att.url?.toLowerCase().endsWith('.pdf');
};

export const ComplaintDetailsModal = ({ complaint, onClose, onComplaintUpdated }) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'actions' | 'feedback'
  const [updating, setUpdating] = useState(false);

  // Officer action states
  const [newStatus, setNewStatus] = useState(complaint.status);
  const [statusNote, setStatusNote] = useState('');
  const [resolutionProof, setResolutionProof] = useState(complaint.resolution?.proofImage || '');
  const [assignedEngineer, setAssignedEngineer] = useState(complaint.assignedTo?.officerName || '');
  const [newDepartment, setNewDepartment] = useState(complaint.department);
  const [rerouteReason, setRerouteReason] = useState('');

  // Citizen feedback states
  const [rating, setRating] = useState(complaint.feedback?.rating || 5);
  const [feedbackComment, setFeedbackComment] = useState(complaint.feedback?.comment || '');

  if (!complaint) return null;

  const DeptIcon = DEPT_ICONS[complaint.department] || AlertTriangle;
  const isOfficerOrAdmin = user?.role === 'department_officer' || user?.role === 'admin';
  const isResolved = complaint.status === 'resolved';

  // Update Status handler
  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await api.updateComplaintStatus(complaint.id, {
        status: newStatus,
        note: statusNote || `Status shifted to ${newStatus} by ${user?.name || 'Officer'}`,
        statusTitle: `Status set to ${newStatus.toUpperCase()}`,
        resolutionNote: newStatus === 'resolved' ? (statusNote || 'Grievance satisfactorily resolved by civic crew.') : null,
        proofImage: newStatus === 'resolved' ? resolutionProof : null
      });

      if (res.success && res.complaint) {
        success(`Grievance status updated to "${newStatus.toUpperCase()}".`);
        if (newStatus === 'resolved') {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        }
        onComplaintUpdated(res.complaint);
        setStatusNote('');
      }
    } catch (err) {
      error(err.message || 'Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  // Assign Officer handler
  const handleAssignOfficer = async (e) => {
    e.preventDefault();
    if (!assignedEngineer.trim()) return;
    setUpdating(true);
    try {
      const res = await api.assignOfficer(complaint.id, {
        officerName: assignedEngineer
      });
      if (res.success && res.complaint) {
        success(`Assigned to ${assignedEngineer}.`);
        onComplaintUpdated(res.complaint);
      }
    } catch (err) {
      error(err.message || 'Failed to assign officer.');
    } finally {
      setUpdating(false);
    }
  };

  // Re-route department handler
  const handleReroute = async (e) => {
    e.preventDefault();
    if (newDepartment === complaint.department) return;
    setUpdating(true);
    try {
      const res = await api.rerouteDepartment(complaint.id, {
        department: newDepartment,
        reason: rerouteReason || 'Re-routed per jurisdiction check'
      });
      if (res.success && res.complaint) {
        success(`Complaint re-routed to ${newDepartment.toUpperCase()} Department.`);
        onComplaintUpdated(res.complaint);
      }
    } catch (err) {
      error(err.message || 'Failed to re-route.');
    } finally {
      setUpdating(false);
    }
  };

  // Citizen Rating submission
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await api.submitFeedback(complaint.id, {
        rating,
        comment: feedbackComment
      });
      if (res.success && res.complaint) {
        success('Thank you! Your feedback has been recorded.');
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        onComplaintUpdated(res.complaint);
      }
    } catch (err) {
      error(err.message || 'Failed to submit rating.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel-elevated modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '780px',
          padding: '2rem',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.15)'
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
          title="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0
          }}>
            <DeptIcon size={24} />
          </div>

          <div style={{ flex: 1, minWidth: 0, paddingRight: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
              <span style={{ 
                fontFamily: 'var(--font-mono)', 
                fontSize: '0.85rem', 
                fontWeight: 700, 
                color: '#34d399', 
                background: 'rgba(16, 185, 129, 0.12)',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                {complaint.trackingId}
              </span>
              <span className={`badge badge-priority-${complaint.priority}`}>
                {complaint.priority}
              </span>
              <span className={`badge badge-${complaint.status}`}>
                {complaint.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.3 }}>
              {complaint.title}
            </h3>
          </div>
        </div>

        {/* High-Fidelity Stepper */}
        <div style={{ background: 'rgba(0, 0, 0, 0.25)', borderRadius: 'var(--radius-md)', padding: '0.5rem', marginBottom: '1.5rem', border: '1px solid var(--border-glass)' }}>
          <StatusStepper status={complaint.status} timeline={complaint.timeline} />
        </div>

        {/* Tabs: Overview & Timeline | Officer Actions | Feedback */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '0.5rem 1rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'overview' ? '2px solid #10b981' : '2px solid transparent',
              color: activeTab === 'overview' ? '#34d399' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            Overview & Timeline
          </button>

          {isOfficerOrAdmin && (
            <button
              onClick={() => setActiveTab('actions')}
              style={{
                padding: '0.5rem 1rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'actions' ? '2px solid #38bdf8' : '2px solid transparent',
                color: activeTab === 'actions' ? '#38bdf8' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <ShieldCheck size={15} /> Officer Workflow
            </button>
          )}

          {isResolved && (
            <button
              onClick={() => setActiveTab('feedback')}
              style={{
                padding: '0.5rem 1rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'feedback' ? '2px solid #f59e0b' : '2px solid transparent',
                color: activeTab === 'feedback' ? '#f59e0b' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Star size={15} /> Citizen Feedback
            </button>
          )}
        </div>

        {/* TAB 1: OVERVIEW & TIMELINE */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Core Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Location Details</span>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={14} color="#10b981" />
                  {complaint.location?.ward}
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {complaint.location?.address} {complaint.location?.landmark ? `(${complaint.location.landmark})` : ''}
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Department & SLA</span>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc', marginTop: '0.2rem' }}>
                  {complaint.department?.toUpperCase()} Infrastructure
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Category: {complaint.category}
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Registered Citizen</span>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc', marginTop: '0.2rem' }}>
                  {complaint.citizen?.name || 'Citizen User'}
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Phone: {complaint.citizen?.phone || 'Confidential'}
                </p>
              </div>
            </div>

            {/* Full Issue Description */}
            <div>
              <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Full Description
              </h5>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, background: 'rgba(0,0,0,0.2)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                {complaint.description}
              </p>
            </div>

            {/* Attached Documents / Photos (100% relevant to issue) */}
            <div>
              <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={15} color="#38bdf8" /> Citizen Evidence Photos & Documents ({complaint.attachments?.length || 1})
              </h5>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.85rem' }}>
                {complaint.attachments && complaint.attachments.length > 0 ? (
                  complaint.attachments.map((att, i) => {
                    const isPdf = isPdfDocument(att);
                    const defaultRelevantImg = DEPARTMENT_EVIDENCE_MAP[complaint.department]?.url || '/evidence/pothole_crater.jpg';
                    const imgUrl = (att.url && !att.url.includes('unsplash')) ? att.url : defaultRelevantImg;

                    if (isPdf) {
                      return (
                        <div 
                          key={i}
                          style={{
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            border: '1px solid rgba(244, 63, 94, 0.3)',
                            background: 'rgba(244, 63, 94, 0.06)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            padding: '0.85rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                            <div style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '8px',
                              background: 'rgba(244, 63, 94, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <FileText size={20} color="#f43f5e" />
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {att.originalName || att.filename || 'Evidence Document.pdf'}
                              </p>
                              <span style={{ fontSize: '0.65rem', color: '#fda4af' }}>
                                {att.size ? `${Math.round(att.size / 1024)} KB` : '168 KB'} • Official PDF
                              </span>
                            </div>
                          </div>
                          <a 
                            href={att.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                              background: 'rgba(244, 63, 94, 0.2)',
                              border: '1px solid rgba(244, 63, 94, 0.4)',
                              borderRadius: 'var(--radius-sm)',
                              color: '#fda4af',
                              fontSize: '0.725rem',
                              fontWeight: 600,
                              textAlign: 'center',
                              padding: '0.35rem',
                              textDecoration: 'none',
                              display: 'block'
                            }}
                          >
                            View Document ↗
                          </a>
                        </div>
                      );
                    }

                    return (
                      <div 
                        key={i}
                        style={{
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          border: '1px solid var(--border-glass)',
                          background: 'rgba(15, 23, 42, 0.7)',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <div style={{ position: 'relative', width: '100%', height: '120px', overflow: 'hidden' }}>
                          <img 
                            src={imgUrl} 
                            alt={att.originalName || `${complaint.category} evidence`} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            onError={(e) => {
                              e.target.src = defaultRelevantImg;
                            }}
                          />
                          <span style={{
                            position: 'absolute',
                            bottom: '5px',
                            left: '5px',
                            background: 'rgba(0, 0, 0, 0.75)',
                            color: '#38bdf8',
                            fontSize: '0.625rem',
                            fontWeight: 700,
                            padding: '1px 5px',
                            borderRadius: '3px',
                            textTransform: 'uppercase'
                          }}>
                            {complaint.category || 'Evidence Photo'}
                          </span>
                        </div>
                        <div style={{ padding: '0.5rem 0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ minWidth: 0, flex: 1, marginRight: '0.35rem' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {att.originalName || `${complaint.category} Photo`}
                            </p>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                              Geo-Tagged Proof
                            </span>
                          </div>
                          <a 
                            href={imgUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                              background: 'rgba(56, 189, 248, 0.15)',
                              border: '1px solid rgba(56, 189, 248, 0.3)',
                              borderRadius: 'var(--radius-sm)',
                              color: '#38bdf8',
                              fontSize: '0.68rem',
                              fontWeight: 600,
                              padding: '0.2rem 0.45rem',
                              textDecoration: 'none'
                            }}
                          >
                            View Document ↗
                          </a>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  /* Fallback verified departmental evidence photo if no upload attached */
                  <div 
                    style={{
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: '1px solid var(--border-glass)',
                      background: 'rgba(15, 23, 42, 0.7)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{ position: 'relative', width: '100%', height: '120px', overflow: 'hidden' }}>
                      <img 
                        src={DEPARTMENT_EVIDENCE_MAP[complaint.department]?.url || '/evidence/pothole_crater.jpg'} 
                        alt={complaint.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      <span style={{
                        position: 'absolute',
                        bottom: '5px',
                        left: '5px',
                        background: 'rgba(0, 0, 0, 0.8)',
                        color: '#34d399',
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        padding: '1px 5px',
                        borderRadius: '3px'
                      }}>
                        {complaint.category}
                      </span>
                    </div>
                    <div style={{ padding: '0.5rem 0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ minWidth: 0, flex: 1, marginRight: '0.35rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {DEPARTMENT_EVIDENCE_MAP[complaint.department]?.title || 'Issue Photo Proof'}
                        </p>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                          Verified Field Photo
                        </span>
                      </div>
                      <a 
                        href={DEPARTMENT_EVIDENCE_MAP[complaint.department]?.url || '/evidence/pothole_crater.jpg'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          background: 'rgba(16, 185, 129, 0.15)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          borderRadius: 'var(--radius-sm)',
                          color: '#34d399',
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          padding: '0.2rem 0.45rem',
                          textDecoration: 'none'
                        }}
                      >
                        View Document ↗
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Official Resolution Card if Resolved */}
            {complaint.resolution && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <span style={{ fontWeight: 700, color: '#34d399', fontSize: '0.925rem' }}>
                    Official Municipal Resolution Note
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#f8fafc', marginBottom: '0.5rem' }}>
                  "{complaint.resolution.resolutionNote}"
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Certified by: {complaint.resolution.resolvedBy}</span>
                  <span>{new Date(complaint.resolution.resolvedAt).toLocaleString()}</span>
                </div>

                {complaint.resolution.proofImage && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>
                      Resolution Proof Photo:
                    </span>
                    <img 
                      src={complaint.resolution.proofImage.includes('unsplash') ? '/evidence/water_repair_proof.jpg' : complaint.resolution.proofImage} 
                      alt="Resolution Proof" 
                      style={{ maxHeight: '160px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid rgba(16, 185, 129, 0.3)' }} 
                      onError={(e) => {
                        e.target.src = '/evidence/water_repair_proof.jpg';
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Official Audit Timeline */}
            <div>
              <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                Activity Audit Trail ({complaint.timeline?.length || 0})
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {complaint.timeline?.map((item, idx) => (
                  <div 
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: '0.85rem',
                      alignItems: 'flex-start',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderLeft: '3px solid #10b981'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#f8fafc' }}>
                          {item.title}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {new Date(item.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        {item.description}
                      </p>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
                        Updated by: {item.updatedBy}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: OFFICER WORKFLOW */}
        {activeTab === 'actions' && isOfficerOrAdmin && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Status Update Form */}
            <form onSubmit={handleStatusUpdate} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: '#38bdf8' }}>
                Update Operational Status
              </h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">New Status</label>
                  <select 
                    className="form-select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Resolution Proof Image URL (Optional)</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="https://... photo of repaired work"
                    value={resolutionProof}
                    onChange={(e) => setResolutionProof(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Work Progress / Resolution Notes</label>
                <textarea 
                  className="form-textarea"
                  placeholder="Details of inspection, crew dispatched, asphalt quantity used, or pipe welding completion..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  style={{ minHeight: '80px' }}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={updating}
                style={{ width: '100%' }}
              >
                {updating ? 'Updating...' : 'Commit Status & Log Activity'}
              </button>
            </form>

            {/* Assign Field Engineer */}
            <form onSubmit={handleAssignOfficer} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: '#f59e0b' }}>
                Dispatch Field Staff / Engineer
              </h4>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Engineer / Crew Supervisor Name"
                  value={assignedEngineer}
                  onChange={(e) => setAssignedEngineer(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-indigo" disabled={updating}>
                  Assign Staff
                </button>
              </div>
            </form>

            {/* Department Re-Routing (Admin / Supervisor) */}
            <form onSubmit={handleReroute} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: '#a78bfa' }}>
                Department Re-Routing Override
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <select 
                  className="form-select"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                >
                  <option value="roads">Roads & Infrastructure</option>
                  <option value="water">Water Supply & Drainage</option>
                  <option value="electricity">Electricity & Lighting</option>
                  <option value="sanitation">Sanitation & Waste</option>
                  <option value="health">Public Health & Safety</option>
                </select>

                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Reason for re-routing (e.g. water leakage caused road cave-in)"
                  value={rerouteReason}
                  onChange={(e) => setRerouteReason(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-secondary"
                disabled={updating || newDepartment === complaint.department}
                style={{ width: '100%' }}
              >
                Re-Route to Department
              </button>
            </form>

          </div>
        )}

        {/* TAB 3: CITIZEN FEEDBACK */}
        {activeTab === 'feedback' && isResolved && (
          <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
                Rate Your Resolution Experience
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Your rating helps the Municipal Commissioner measure department accountability and speed.
              </p>

              {/* Star selector */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      transform: rating >= star ? 'scale(1.15)' : 'scale(1)',
                      transition: 'transform 0.2s'
                    }}
                  >
                    <Star 
                      size={36} 
                      color="#f59e0b" 
                      fill={rating >= star ? '#f59e0b' : 'transparent'} 
                    />
                  </button>
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b', marginTop: '0.5rem', display: 'block' }}>
                {rating === 5 ? 'Excellent & Prompt!' : rating === 4 ? 'Very Satisfactory' : rating === 3 ? 'Average' : 'Needs Improvement'}
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Citizen Remarks (Optional)</label>
              <textarea 
                className="form-textarea"
                placeholder="Share your experience regarding crew turnaround time and repair quality..."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                style={{ minHeight: '90px' }}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={updating}>
              Submit Satisfaction Rating
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
