import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Download, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Star, 
  Filter, 
  Search, 
  Eye, 
  Truck, 
  Droplets, 
  Zap, 
  Trash2, 
  ShieldAlert,
  ArrowUpDown,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AdminDashboard = ({ 
  complaints = [], 
  analytics = {}, 
  onSelectComplaint 
}) => {
  const { user } = useAuth();
  const { success } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter complaints
  const filtered = complaints.filter(c => {
    if (deptFilter !== 'all' && c.department !== deptFilter) return false;
    if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.trackingId.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.citizen?.name.toLowerCase().includes(q) ||
        c.location?.ward.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Export to CSV function
  const handleExportCSV = () => {
    const headers = ['Tracking ID', 'Title', 'Department', 'Category', 'Priority', 'Status', 'Ward', 'Citizen Name', 'Citizen Phone', 'Created Date', 'SLA Deadline', 'Resolved Date'];
    const rows = filtered.map(c => [
      c.trackingId,
      `"${c.title.replace(/"/g, '""')}"`,
      c.department.toUpperCase(),
      `"${c.category}"`,
      c.priority.toUpperCase(),
      c.status.toUpperCase(),
      `"${c.location?.ward || ''}"`,
      `"${c.citizen?.name || ''}"`,
      c.citizen?.phone || '',
      c.createdAt,
      c.slaDeadline || '',
      c.resolution?.resolvedAt || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sahayak360_Civic_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    success(`Exported ${filtered.length} civic records to CSV report.`);
  };

  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'resolved').length;
  const escalated = complaints.filter(c => c.isEscalated).length;
  const avgSatisfaction = analytics.avgRating || '4.9';

  const deptStats = analytics.departmentStats || [];

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      
      {/* Executive Header */}
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
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
          }}>
            <LayoutDashboard size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
                Municipal Executive Command Center
              </h2>
              <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', border: '1px solid #6366f1' }}>
                Admin Oversight
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Logged in as: {user?.name || 'Dr. Aruna Patel, IAS (Municipal Commissioner)'}
            </p>
          </div>
        </div>

        <button 
          className="btn btn-secondary"
          onClick={handleExportCSV}
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <FileSpreadsheet size={16} color="#10b981" />
          Export CSV Report
        </button>
      </div>

      {/* TOP KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Total Grievances
            </span>
            <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700 }}>● Live</span>
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.4rem' }}>
            {total}
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
            100% Routed by Category
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Resolution Rate
            </span>
            <CheckCircle2 size={18} color="#10b981" />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', marginTop: '0.4rem' }}>
            {total > 0 ? Math.round((resolved / total) * 100) : 0}%
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {resolved} tickets closed
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              SLA Breach Alerts
            </span>
            <AlertTriangle size={18} color="#f43f5e" />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: escalated > 0 ? '#f43f5e' : '#f8fafc', marginTop: '0.4rem' }}>
            {escalated}
          </h3>
          <span style={{ fontSize: '0.75rem', color: escalated > 0 ? '#f43f5e' : '#10b981', fontWeight: 600 }}>
            {escalated > 0 ? 'Requires Immediate Notice' : 'All Wards On-Track'}
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Citizen Satisfaction
            </span>
            <Star size={18} fill="#f59e0b" color="#f59e0b" />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.4rem' }}>
            {avgSatisfaction} / 5.0
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Based on verified ratings
          </span>
        </div>
      </div>

      {/* ANALYTICS VISUALIZATIONS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Department Volume & Resolution Bar Visualization */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.25rem' }}>
            Department Workload & Resolution Performance
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {deptStats.map(dept => {
              const pct = dept.total > 0 ? Math.round((dept.resolved / dept.total) * 100) : 0;
              return (
                <div key={dept.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600, color: '#f8fafc' }}>{dept.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {dept.resolved}/{dept.total} ({pct}%)
                    </span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: dept.color,
                        borderRadius: '4px',
                        transition: 'width 0.5s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority & Ward Breakdown Cards */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
              Severity & Urgency Distribution
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {[
                { label: 'Critical / Hazard', count: complaints.filter(c => c.priority === 'critical').length, color: '#f43f5e' },
                { label: 'High Priority', count: complaints.filter(c => c.priority === 'high').length, color: '#f97316' },
                { label: 'Medium Priority', count: complaints.filter(c => c.priority === 'medium').length, color: '#eab308' },
                { label: 'Low / Routine', count: complaints.filter(c => c.priority === 'low').length, color: '#94a3b8' }
              ].map(p => (
                <div 
                  key={p.label}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: `${p.color}15`,
                    border: `1px solid ${p.color}35`
                  }}
                >
                  <span style={{ fontSize: '0.725rem', color: p.color, fontWeight: 700, textTransform: 'uppercase' }}>
                    {p.label}
                  </span>
                  <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>
                    {p.count}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Top Incident Wards
            </span>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Ward 14 (Indiranagar), Ward 22 (Koramangala), Ward 7 (MG Road), Ward 18 (Whitefield)
            </p>
          </div>
        </div>

      </div>

      {/* MASTER GRIEVANCE MANAGEMENT TABLE */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        
        {/* Table Filters Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
              Master Grievance Register ({filtered.length})
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Live audit table of all civic complaints across city wards.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select 
              className="form-select"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              style={{ width: '150px', padding: '0.45rem 0.65rem', fontSize: '0.8rem' }}
            >
              <option value="all">All Departments</option>
              <option value="roads">Roads</option>
              <option value="water">Water</option>
              <option value="electricity">Electricity</option>
              <option value="sanitation">Sanitation</option>
              <option value="health">Public Health</option>
            </select>

            <select 
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '135px', padding: '0.45rem 0.65rem', fontSize: '0.8rem' }}
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <input 
              type="text" 
              className="form-input"
              placeholder="Search table..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '200px', padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
            />
          </div>
        </div>

        {/* Responsive Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>TRACKING ID</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>ISSUE TITLE</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>DEPARTMENT</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>WARD</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>PRIORITY</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>STATUS</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>FILED BY</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700, textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(cmp => (
                <tr 
                  key={cmp.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '0.85rem 0.5rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#38bdf8' }}>
                    {cmp.trackingId}
                  </td>
                  <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600, color: '#f8fafc', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {cmp.title}
                  </td>
                  <td style={{ padding: '0.85rem 0.5rem', textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
                    {cmp.department}
                  </td>
                  <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {cmp.location?.ward}
                  </td>
                  <td style={{ padding: '0.85rem 0.5rem' }}>
                    <span className={`badge badge-priority-${cmp.priority}`}>
                      {cmp.priority}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 0.5rem' }}>
                    <span className={`badge badge-${cmp.status}`}>
                      {cmp.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-secondary)' }}>
                    {cmp.citizen?.name}
                  </td>
                  <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onSelectComplaint(cmp)}
                      style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                    >
                      <Eye size={12} /> Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
