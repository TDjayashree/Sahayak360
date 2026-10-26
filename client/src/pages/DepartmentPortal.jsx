import React, { useState } from 'react';
import { 
  Building2, 
  Truck, 
  Droplets, 
  Zap, 
  Trash2, 
  ShieldAlert, 
  Filter, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  UserCheck, 
  Search,
  ArrowRight
} from 'lucide-react';
import { ComplaintCard } from '../components/ComplaintCard';
import { useAuth } from '../context/AuthContext';

const DEPARTMENTS = [
  { id: 'roads', name: 'Roads & Infrastructure', icon: Truck, color: '#f59e0b', code: 'RDS', sla: 48 },
  { id: 'water', name: 'Water & Sewerage', icon: Droplets, color: '#0284c7', code: 'WTR', sla: 24 },
  { id: 'electricity', name: 'Electricity & Lighting', icon: Zap, color: '#eab308', code: 'ELC', sla: 12 },
  { id: 'sanitation', name: 'Solid Waste & Sanitation', icon: Trash2, color: '#10b981', code: 'SNT', sla: 24 },
  { id: 'health', name: 'Public Health & Safety', icon: ShieldAlert, color: '#ec4899', code: 'HLT', sla: 36 }
];

export const DepartmentPortal = ({ 
  complaints = [], 
  onSelectComplaint 
}) => {
  const { user } = useAuth();

  // If user is a department officer, default to their department
  const [activeDept, setActiveDept] = useState(user?.department || 'roads');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const currentDeptMeta = DEPARTMENTS.find(d => d.id === activeDept) || DEPARTMENTS[0];
  const DeptIcon = currentDeptMeta.icon;

  // Filter complaints
  const deptComplaints = complaints.filter(c => c.department === activeDept);

  const filtered = deptComplaints.filter(c => {
    if (filterPriority !== 'all' && c.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.trackingId.toLowerCase().includes(q) ||
        c.location?.ward.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalTickets = deptComplaints.length;
  const inProgressTickets = deptComplaints.filter(c => c.status === 'in_progress').length;
  const pendingTickets = deptComplaints.filter(c => c.status === 'submitted' || c.status === 'under_review').length;
  const resolvedTickets = deptComplaints.filter(c => c.status === 'resolved').length;
  const escalatedTickets = deptComplaints.filter(c => c.isEscalated).length;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      
      {/* Department Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
        {DEPARTMENTS.map(d => {
          const Icon = d.icon;
          const isSelected = activeDept === d.id;
          const count = complaints.filter(c => c.department === d.id).length;
          return (
            <button
              key={d.id}
              onClick={() => setActiveDept(d.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                border: isSelected ? `2px solid ${d.color}` : '1px solid var(--border-glass)',
                background: isSelected ? `${d.color}20` : 'rgba(255, 255, 255, 0.03)',
                color: isSelected ? '#fff' : 'var(--text-secondary)',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={18} color={isSelected ? d.color : 'var(--text-muted)'} />
              <span>{d.name}</span>
              <span style={{
                background: isSelected ? d.color : 'rgba(255,255,255,0.1)',
                color: isSelected ? '#fff' : 'var(--text-muted)',
                fontSize: '0.7rem',
                borderRadius: '999px',
                padding: '1px 6px',
                fontWeight: 700
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Department Header Banner */}
      <div 
        className="glass-panel"
        style={{
          padding: '1.75rem 2rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          borderLeft: `5px solid ${currentDeptMeta.color}`,
          background: 'rgba(15, 23, 42, 0.85)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: `${currentDeptMeta.color}25`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: currentDeptMeta.color
          }}>
            <DeptIcon size={30} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
                {currentDeptMeta.name} Operation Desk
              </h2>
              <span className="badge badge-under_review">
                {currentDeptMeta.sla}h Statutory SLA
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Active Officer: {user?.role === 'department_officer' && user.department === activeDept ? user.name : `Divisional Chief (${currentDeptMeta.name})`}
            </p>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total</span>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>{totalTickets}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>In Progress</span>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>{inProgressTickets}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Pending Review</span>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>{pendingTickets}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Resolved</span>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>{resolvedTickets}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        
        {/* Status Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['all', 'submitted', 'under_review', 'in_progress', 'resolved'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                border: filterStatus === st ? '1px solid #38bdf8' : '1px solid var(--border-glass)',
                background: filterStatus === st ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                color: filterStatus === st ? '#38bdf8' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Priority Filter & Search */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select 
            className="form-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            style={{ width: '150px', padding: '0.45rem 0.75rem', fontSize: '0.825rem' }}
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical Only</option>
            <option value="high">High Only</option>
            <option value="medium">Medium Only</option>
            <option value="low">Low Only</option>
          </select>

          <input 
            type="text" 
            className="form-input"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '220px', padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}
          />
        </div>

      </div>

      {/* Work Orders List */}
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
            <CheckCircle2 size={32} color="#10b981" />
          </div>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
            All Grievances Cleared!
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            No tickets currently match this status filter in {currentDeptMeta.name}.
          </p>
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
