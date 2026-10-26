import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Truck, 
  Droplets, 
  Zap, 
  Trash2, 
  ShieldAlert, 
  MapPin, 
  AlertTriangle, 
  FileText, 
  Send,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ImageUploader } from '../components/ImageUploader';
import { MapPinSimulator } from '../components/MapPinSimulator';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

const DEPARTMENTS = [
  {
    id: 'roads',
    name: 'Roads & Infrastructure',
    icon: Truck,
    color: '#f59e0b',
    categories: [
      'Potholes & Road Cavings',
      'Broken Footpaths / Pavers',
      'Street Sign & Signal Damage',
      'Unauthorized Road Digging',
      'Illegal Speed Breaker'
    ]
  },
  {
    id: 'water',
    name: 'Water Supply & Drainage',
    icon: Droplets,
    color: '#0284c7',
    categories: [
      'Pipeline Burst / Leakage',
      'Contaminated / Muddy Water',
      'Low Pressure Water Supply',
      'Blocked Stormwater Drainage',
      'Missing / Broken Manhole Cover'
    ]
  },
  {
    id: 'electricity',
    name: 'Electricity & Streetlights',
    icon: Zap,
    color: '#eab308',
    categories: [
      'Dark Street / Dead Streetlights',
      'Dangling Live Electrical Cable',
      'Transformer Sparking / Breakdown',
      'Damaged Electric Pole',
      'Open Feeder Pillar Box'
    ]
  },
  {
    id: 'sanitation',
    name: 'Sanitation & Solid Waste',
    icon: Trash2,
    color: '#10b981',
    categories: [
      'Overflowing Community Bin / Dumpster',
      'Door-to-Door Garbage Vehicle Missed',
      'Illegal Debris / Construction Waste',
      'Animal Carcass Removal',
      'Public Toilet Sanitation Issue'
    ]
  },
  {
    id: 'health',
    name: 'Public Health & Environment',
    icon: ShieldAlert,
    color: '#ec4899',
    categories: [
      'Mosquito Breeding / Dengue Fogging',
      'Foul Odor / Stagnant Sewage',
      'Stray Dog Menace / Vaccination',
      'Hazardous / Biomedical Waste Dumping',
      'Unhygienic Food Stall Complaints'
    ]
  }
];

export const NewComplaintPage = ({ onComplaintCreated, onCancel }) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [department, setDepartment] = useState('roads');
  const [category, setCategory] = useState('Potholes & Road Cavings');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [address, setAddress] = useState(user?.address || '100 Feet Rd, Indiranagar');
  const [landmark, setLandmark] = useState('Near Metro Station');
  const [locationDetails, setLocationDetails] = useState({
    ward: user?.ward || 'Ward 14 - Indiranagar',
    latitude: 12.9719,
    longitude: 77.6412
  });
  const [citizenName, setCitizenName] = useState(user?.name || 'Rahul Sharma');
  const [citizenPhone, setCitizenPhone] = useState(user?.phone || '+91 98765 43210');
  const [citizenEmail, setCitizenEmail] = useState(user?.email || 'rahul@citizen.in');
  const [attachments, setAttachments] = useState([]);

  const activeDeptObj = DEPARTMENTS.find(d => d.id === department) || DEPARTMENTS[0];

  const handleDeptSelect = (deptId) => {
    setDepartment(deptId);
    const d = DEPARTMENTS.find(item => item.id === deptId);
    if (d && d.categories.length > 0) {
      setCategory(d.categories[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      error('Please provide a title and detailed description.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title,
        description,
        department,
        category,
        priority,
        location: {
          address,
          landmark,
          ward: locationDetails.ward,
          latitude: locationDetails.latitude,
          longitude: locationDetails.longitude
        },
        citizen: {
          id: user?.id || 'guest-citizen',
          name: citizenName,
          phone: citizenPhone,
          email: citizenEmail
        },
        attachments
      };

      const res = await api.createComplaint(payload);
      if (res.success && res.complaint) {
        success(`Grievance registered! Tracking ID: ${res.complaint.trackingId}`);
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
        onComplaintCreated(res.complaint);
      }
    } catch (err) {
      error(err.message || 'Failed to submit grievance.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem', maxWidth: '860px' }}>
      
      {/* Back button */}
      <button 
        onClick={onCancel}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.875rem',
          cursor: 'pointer',
          marginBottom: '1.25rem'
        }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* Main Container Card */}
      <div className="glass-panel-elevated" style={{ padding: '2.25rem', background: 'rgba(15, 23, 42, 0.85)' }}>
        
        {/* Wizard Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(16, 185, 129, 0.12)',
            color: '#34d399',
            fontSize: '0.75rem',
            fontWeight: 700,
            marginBottom: '0.5rem'
          }}>
            <Sparkles size={14} /> OFFICIAL CIVIC GRIEVANCE REGISTRATION
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>
            Report a Civic Grievance
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Fill in the details below. Our automated engine will instantly route it to the respective municipal division.
          </p>
        </div>

        {/* Form Stepper indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          {[
            { n: 1, label: 'Department' },
            { n: 2, label: 'Location' },
            { n: 3, label: 'Details' },
            { n: 4, label: 'Evidence & Submit' }
          ].map(s => {
            const isDone = s.n < step;
            const isCur = s.n === step;
            return (
              <button
                key={s.n}
                type="button"
                onClick={() => setStep(s.n)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  border: isCur ? '1px solid #10b981' : '1px solid var(--border-glass)',
                  background: isCur ? 'rgba(16, 185, 129, 0.2)' : isDone ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  color: isCur ? '#34d399' : isDone ? '#f8fafc' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <span>{isDone ? '✓' : s.n}.</span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* STEP 1: DEPARTMENT & ISSUE CATEGORY */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#f8fafc' }}>
              Step 1: Select Civic Department
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
              {DEPARTMENTS.map(d => {
                const Icon = d.icon;
                const isSelected = department === d.id;
                return (
                  <div
                    key={d.id}
                    onClick={() => handleDeptSelect(d.id)}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? `${d.color}20` : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? `2px solid ${d.color}` : '1px solid var(--border-glass)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: `${d.color}25`,
                      color: d.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={22} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isSelected ? '#fff' : 'var(--text-secondary)' }}>
                      {d.name.split(' & ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Sub-Category selector */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.75rem' }}>
                Select Specific Issue Category for {activeDeptObj.name}:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {activeDeptObj.categories.map(cat => {
                  const isCatSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: 'var(--radius-full)',
                        border: isCatSelected ? `1px solid ${activeDeptObj.color}` : '1px solid var(--border-glass)',
                        background: isCatSelected ? `${activeDeptObj.color}25` : 'rgba(255, 255, 255, 0.04)',
                        color: isCatSelected ? '#fff' : 'var(--text-secondary)',
                        fontSize: '0.825rem',
                        fontWeight: isCatSelected ? 600 : 400,
                        cursor: 'pointer'
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => setStep(2)}
              >
                Proceed to Location <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION & WARD */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#f8fafc' }}>
              Step 2: Incident Location & Ward
            </h4>

            <div style={{ marginBottom: '1.25rem' }}>
              <MapPinSimulator 
                value={locationDetails}
                onChange={(loc) => setLocationDetails(prev => ({ ...prev, ...loc }))}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Street / House Address</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="e.g. 100 Feet Rd, Opposite Metro Pillar 142"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Prominent Landmark</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="e.g. Near Barista Cafe"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setStep(1)}
              >
                <ArrowLeft size={16} /> Back
              </button>

              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => setStep(3)}
              >
                Proceed to Details <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ISSUE DETAILS & PRIORITY */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#f8fafc' }}>
              Step 3: Issue Description & Urgency
            </h4>

            <div className="form-group">
              <label className="form-label">Complaint Title / Summary *</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="e.g. Severe deep pothole cluster causing vehicle skids"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description of Civic Problem *</label>
              <textarea 
                className="form-textarea"
                placeholder="Describe how long the issue has persisted, severity, impact on traffic or public hygiene, and exact spots..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Urgency & Hazard Level</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.65rem' }}>
                {[
                  { id: 'low', label: 'Low', desc: 'Minor flaw, routine fix' },
                  { id: 'medium', label: 'Medium', desc: 'Standard civic issue' },
                  { id: 'high', label: 'High', desc: 'Traffic delay / dirty water' },
                  { id: 'critical', label: 'Critical / Hazard', desc: 'Life safety / road collapse' }
                ].map(p => {
                  const isSel = priority === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setPriority(p.id)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: isSel ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSel ? `2px solid ${p.id === 'critical' ? '#f43f5e' : p.id === 'high' ? '#f97316' : '#10b981'}` : '1px solid var(--border-glass)',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <span className={`badge badge-priority-${p.id}`} style={{ marginBottom: '0.25rem' }}>
                        {p.label}
                      </span>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {p.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setStep(2)}
              >
                <ArrowLeft size={16} /> Back
              </button>

              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => setStep(4)}
              >
                Proceed to Evidence <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: EVIDENCE ATTACHMENT & SUBMIT */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="animate-fade-in">
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#f8fafc' }}>
              Step 4: Attach Photo Evidence & Confirm Contact
            </h4>

            {/* Image Uploader */}
            <div style={{ marginBottom: '1.5rem' }}>
              <ImageUploader 
                existingFiles={attachments}
                onFilesUploaded={(files) => setAttachments(files)}
              />
            </div>

            {/* Citizen Details Pre-fill */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.75rem' }}>
                Citizen Contact (For SMS & Resolution Updates)
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Citizen Name</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Phone (WhatsApp/SMS)</label>
                  <input 
                    type="tel" 
                    className="form-input"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-input"
                    value={citizenEmail}
                    onChange={(e) => setCitizenEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Summary preview badge */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase' }}>
                  Target Department Routing:
                </span>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                  {activeDeptObj.name} ({category})
                </p>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                📍 {locationDetails.ward}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setStep(3)}
              >
                <ArrowLeft size={16} /> Back
              </button>

              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={submitting}
                style={{ padding: '0.75rem 2.25rem' }}
              >
                {submitting ? 'Registering & Routing...' : 'Submit Grievance Now 🚀'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
