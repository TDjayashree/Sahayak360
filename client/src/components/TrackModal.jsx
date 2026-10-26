import React, { useState } from 'react';
import { X, Search, AlertCircle, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export const TrackModal = ({ isOpen, onClose, onSelectComplaint }) => {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.getComplaint(trackingId.trim());
      if (res.success && res.complaint) {
        onSelectComplaint(res.complaint);
        onClose();
        setTrackingId('');
      } else {
        setErrorMsg('No grievance found matching this tracking reference.');
      }
    } catch (err) {
      setErrorMsg(`No grievance found for ID "${trackingId}". Try SHK-2026-9041.`);
    } finally {
      setLoading(false);
    }
  };

  const sampleIds = ['SHK-2026-9041', 'SHK-2026-9042', 'SHK-2026-9043', 'SHK-2026-9044'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel-elevated modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          padding: '2rem',
          background: 'rgba(15, 23, 42, 0.95)'
        }}
      >
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

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem',
            color: '#10b981'
          }}>
            <Search size={28} />
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
            Track Civic Grievance
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            Enter your unique reference tracking ID provided during complaint registration.
          </p>
        </div>

        <form onSubmit={handleSearch}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input 
              type="text" 
              className="form-input"
              placeholder="e.g. SHK-2026-9041"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', textTransform: 'uppercase' }}
              autoFocus
              required
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ padding: '0 1.5rem' }}
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </div>

          {errorMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(244, 63, 94, 0.15)',
              color: '#fda4af',
              fontSize: '0.8rem',
              marginBottom: '1rem'
            }}>
              <AlertCircle size={16} />
              {errorMsg}
            </div>
          )}

          {/* Quick sample chips */}
          <div>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
              TEST WITH RECENT GRIEVANCE IDS:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {sampleIds.map(id => (
                <button
                  type="button"
                  key={id}
                  onClick={() => setTrackingId(id)}
                  style={{
                    padding: '0.25rem 0.6rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '4px',
                    color: '#38bdf8',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
