import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  PlusCircle, 
  Truck, 
  Droplets, 
  Zap, 
  Trash2, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Star, 
  Building2, 
  Sparkles,
  MapPin,
  Check
} from 'lucide-react';
import { ComplaintCard } from '../components/ComplaintCard';

const DEPARTMENTS = [
  {
    id: 'roads',
    name: 'Roads & Infrastructure',
    icon: Truck,
    color: '#f59e0b',
    sla: '48h SLA',
    description: 'Potholes, broken footpaths, road caving, fallen signage, speed bumps',
    issues: '24 Active Crews'
  },
  {
    id: 'water',
    name: 'Water Supply & Drainage',
    icon: Droplets,
    color: '#0284c7',
    sla: '24h SLA',
    description: 'Pipeline burst, contaminated water supply, clogged drains, missing manhole covers',
    issues: 'Emergency Valves Active'
  },
  {
    id: 'electricity',
    name: 'Electricity & Streetlights',
    icon: Zap,
    color: '#eab308',
    sla: '12h SLA',
    description: 'Dead streetlights, dangling live wires, transformer sparking, dark corridors',
    issues: 'Night Patrols Active'
  },
  {
    id: 'sanitation',
    name: 'Sanitation & Solid Waste',
    icon: Trash2,
    color: '#10b981',
    sla: '24h SLA',
    description: 'Overflowing dumpsters, uncollected garbage, illegal debris dumping, carcass removal',
    issues: 'Compactor Fleet Deployed'
  },
  {
    id: 'health',
    name: 'Public Health & Environment',
    icon: ShieldAlert,
    color: '#ec4899',
    sla: '36h SLA',
    description: 'Mosquito breeding, sewage overflow, stray animal menace, biomedical waste',
    issues: 'Fogging Operations On'
  }
];

export const HomePage = ({ 
  complaints = [], 
  analytics = {}, 
  onSelectComplaint, 
  onOpenNewComplaint, 
  onOpenTrackModal 
}) => {
  const [quickTrackInput, setQuickTrackInput] = useState('');

  const handleQuickTrackSubmit = (e) => {
    e.preventDefault();
    if (!quickTrackInput.trim()) return;
    const match = complaints.find(
      c => c.trackingId.toLowerCase() === quickTrackInput.trim().toLowerCase()
    );
    if (match) {
      onSelectComplaint(match);
      setQuickTrackInput('');
    } else {
      onOpenTrackModal();
    }
  };

  const recentComplaints = complaints.slice(0, 4);
  const resolvedSample = complaints.find(c => c.status === 'resolved' && c.resolution);

  return (
    <div style={{ paddingBottom: '4rem' }}>
      
      {/* HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '4.5rem 0 3.5rem',
        overflow: 'hidden',
        textAlign: 'center'
      }}>
        <div className="container">
          
          {/* Pill Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.9rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '1.25rem',
            letterSpacing: '0.04em'
          }}>
            <Sparkles size={15} /> NEXT-GEN CIVIC GRIEVANCE & RESOLUTION ENGINE
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            maxWidth: '920px',
            margin: '0 auto 1.25rem',
            background: 'linear-gradient(180deg, #ffffff 30%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Civic Governance, Re-Imagined. <br />
            <span style={{
              background: 'linear-gradient(135deg, #10b981 0%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Report. Track. Resolve.
            </span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 2.25rem',
            lineHeight: 1.6
          }}>
            Empowering citizens to report broken roads, water leaks, power failures, and sanitation hazards directly to municipal department heads with automated SLA enforcement and real-time tracking.
          </p>

          {/* Quick Actions Bar */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <button 
              className="btn btn-primary btn-lg"
              onClick={onOpenNewComplaint}
              style={{ boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)' }}
            >
              <PlusCircle size={20} />
              Report a Civic Grievance
            </button>

            {/* Quick Track Input form */}
            <form onSubmit={handleQuickTrackSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                className="form-input"
                placeholder="Track ID (e.g. SHK-2026-9041)"
                value={quickTrackInput}
                onChange={(e) => setQuickTrackInput(e.target.value.toUpperCase())}
                style={{ 
                  width: '260px', 
                  fontFamily: 'var(--font-mono)', 
                  textTransform: 'uppercase',
                  background: 'rgba(15, 23, 42, 0.8)' 
                }}
              />
              <button type="submit" className="btn btn-secondary">
                <Search size={16} />
              </button>
            </form>
          </div>

          {/* LIVE METRICS TICKER */}
          <div 
            className="glass-panel"
            style={{
              maxWidth: '960px',
              margin: '0 auto',
              padding: '1.25rem 2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.5rem',
              background: 'rgba(17, 24, 39, 0.65)'
            }}
          >
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Total Grievances Registered
              </p>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.2rem' }}>
                {analytics.total || 48}
              </h3>
              <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>↑ 100% Routed Automatically</span>
            </div>

            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Resolution Success Rate
              </p>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '0.2rem' }}>
                {analytics.resolutionRate ? `${analytics.resolutionRate}%` : '92%'}
              </h3>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Verified with photo proof</span>
            </div>

            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Average SLA Turnaround
              </p>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.2rem' }}>
                18.4 Hours
              </h3>
              <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>Target &lt; 24h</span>
            </div>

            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Citizen Satisfaction
              </p>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                {analytics.avgRating || '4.9'} <Star size={20} fill="#f59e0b" color="#f59e0b" />
              </h3>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Verified citizen feedback</span>
            </div>
          </div>

        </div>
      </section>

      {/* DEPARTMENT CARDS DIRECTORY */}
      <section style={{ padding: '2.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              Civic Departments & Issue Portals
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
              Complaints are instantly routed directly to designated divisional engineers with statutory SLAs.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {DEPARTMENTS.map(dept => {
              const Icon = dept.icon;
              return (
                <div 
                  key={dept.id}
                  className="glass-panel"
                  style={{
                    padding: '1.5rem',
                    transition: 'all 0.25s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = dept.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-glass)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: `${dept.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: dept.color
                      }}>
                        <Icon size={22} />
                      </div>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: dept.color,
                        background: `${dept.color}15`,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        {dept.sla}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
                      {dept.name}
                    </h4>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                      {dept.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {dept.issues}
                    </span>
                    <button 
                      onClick={onOpenNewComplaint}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: dept.color,
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      Report <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BEFORE & AFTER RESOLUTION SHOWCASE */}
      {resolvedSample && (
        <section style={{ padding: '2rem 0' }}>
          <div className="container">
            <div 
              className="glass-panel"
              style={{
                padding: '2rem',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.8) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <CheckCircle2 size={20} color="#10b981" />
                <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#34d399', fontSize: '0.85rem' }}>
                  Verified Resolution Spotlight
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#38bdf8' }}>
                    {resolvedSample.trackingId} • {resolvedSample.location?.ward}
                  </span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: '0.4rem 0 0.75rem' }}>
                    {resolvedSample.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                    "{resolvedSample.resolution?.resolutionNote || 'Work inspected and completed according to municipal engineering standards.'}"
                  </p>
                  
                  {resolvedSample.feedback && (
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700 }}>
                        <Star size={16} fill="#f59e0b" />
                        <span>Citizen Rating: {resolvedSample.feedback.rating}/5</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#e2e8f0', marginTop: '0.2rem', fontStyle: 'italic' }}>
                        "{resolvedSample.feedback.comment}"
                      </p>
                    </div>
                  )}

                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => onSelectComplaint(resolvedSample)}
                    style={{ marginTop: '1rem' }}
                  >
                    View Complete Audit Trail ↗
                  </button>
                </div>

                {/* Evidence & Resolution Proof Images */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#f43f5e', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                      BEFORE (Reported Leak):
                    </span>
                    <img 
                      src={resolvedSample.attachments?.[0]?.url || '/evidence/water_pipe_leak.jpg'} 
                      alt="Before" 
                      style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(244, 63, 94, 0.3)' }} 
                      onError={(e) => { e.target.src = '/evidence/water_pipe_leak.jpg'; }}
                    />
                  </div>

                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#10b981', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                      AFTER (Fixed Proof):
                    </span>
                    <img 
                      src={resolvedSample.resolution?.proofImage || '/evidence/water_repair_proof.jpg'} 
                      alt="After" 
                      style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.4)' }} 
                      onError={(e) => { e.target.src = '/evidence/water_repair_proof.jpg'; }}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      )}

      {/* RECENT COMMUNITY GRIEVANCES */}
      <section style={{ padding: '2.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                Live Community Grievances
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Transparent public tracker of active civic issues being addressed across the city.
              </p>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={onOpenTrackModal}
            >
              Search by ID
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {recentComplaints.map(cmp => (
              <ComplaintCard 
                key={cmp.id}
                complaint={cmp}
                onClick={onSelectComplaint}
              />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS 4-STEP TIMELINE */}
      <section style={{ padding: '3rem 0', background: 'rgba(0, 0, 0, 0.2)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              How Sahayak 360 Works
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
              Guaranteed accountability and transparency from submission to resolution.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[
              { num: '01', title: 'Citizen Reports', text: 'Snap a picture, choose civic category, drop a pin on your ward map, and hit submit.' },
              { num: '02', title: 'Automated Routing', text: 'Engine routes the ticket to the respective department head with SLA assignment.' },
              { num: '03', title: 'On-Site Fix', text: 'Field engineers are dispatched with work orders and upload photographic proof.' },
              { num: '04', title: 'Citizen Verification', text: 'Citizen receives SMS/alert, verifies the work, and rates the municipal service.' }
            ].map((step, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '1.5rem', position: 'relative' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'rgba(16, 185, 129, 0.35)',
                  display: 'block',
                  lineHeight: 1,
                  marginBottom: '0.75rem'
                }}>
                  {step.num}
                </span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
