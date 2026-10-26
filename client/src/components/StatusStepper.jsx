import React from 'react';
import { CheckCircle2, Clock, Wrench, CheckCheck, AlertCircle } from 'lucide-react';

const STEPS = [
  { key: 'submitted', label: 'Submitted', icon: Clock },
  { key: 'under_review', label: 'Under Review', icon: AlertCircle },
  { key: 'in_progress', label: 'In Progress', icon: Wrench },
  { key: 'resolved', label: 'Resolved', icon: CheckCheck }
];

export const StatusStepper = ({ status, timeline = [] }) => {
  const getStepIndex = (st) => {
    switch (st) {
      case 'submitted': return 0;
      case 'under_review': return 1;
      case 'in_progress': return 2;
      case 'resolved': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  // Find timestamps for each step if available in timeline
  const getStepTime = (key) => {
    const item = timeline.slice().reverse().find(t => t.status === key);
    if (!item) return null;
    return new Date(item.timestamp).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ width: '100%', padding: '1.25rem 0.5rem' }}>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        
        {/* Background connector line */}
        <div 
          style={{
            position: 'absolute',
            top: '20px',
            left: '5%',
            right: '5%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.08)',
            zIndex: 1,
            borderRadius: '2px'
          }}
        />

        {/* Progress active connector line */}
        <div 
          style={{
            position: 'absolute',
            top: '20px',
            left: '5%',
            width: `${(currentIndex / (STEPS.length - 1)) * 90}%`,
            height: '4px',
            background: 'linear-gradient(90deg, #10b981, #34d399)',
            zIndex: 2,
            borderRadius: '2px',
            transition: 'width 0.4s ease-in-out',
            boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
          }}
        />

        {STEPS.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isUpcoming = idx > currentIndex;
          const StepIcon = step.icon;
          const time = getStepTime(step.key);

          let circleBg = 'rgba(30, 41, 59, 0.9)';
          let borderColor = 'rgba(255, 255, 255, 0.15)';
          let iconColor = 'var(--text-muted)';
          let shadow = 'none';

          if (isDone) {
            circleBg = '#10b981';
            borderColor = '#10b981';
            iconColor = '#ffffff';
          } else if (isCurrent) {
            circleBg = 'rgba(16, 185, 129, 0.2)';
            borderColor = '#34d399';
            iconColor = '#34d399';
            shadow = '0 0 18px rgba(16, 185, 129, 0.6)';
          }

          return (
            <div 
              key={step.key} 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 3,
                minWidth: '75px',
                textAlign: 'center'
              }}
            >
              <div 
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: circleBg,
                  border: `2px solid ${borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: shadow,
                  transition: 'all 0.3s ease'
                }}
              >
                {isDone ? (
                  <CheckCircle2 size={20} color="#ffffff" />
                ) : (
                  <StepIcon size={20} color={iconColor} />
                )}
              </div>

              <span 
                style={{
                  marginTop: '0.6rem',
                  fontSize: '0.8rem',
                  fontWeight: isCurrent ? 700 : 500,
                  color: isCurrent ? '#34d399' : isDone ? '#f8fafc' : 'var(--text-muted)'
                }}
              >
                {step.label}
              </span>

              {time && (
                <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  {time}
                </span>
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
};
