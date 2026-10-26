import React, { useState } from 'react';
import { MapPin, Navigation, Crosshair, Check } from 'lucide-react';

const PRESET_WARDS = [
  { name: 'Ward 14 - Indiranagar', lat: 12.9719, lng: 77.6412, zone: 'East Zone' },
  { name: 'Ward 22 - Koramangala', lat: 12.9352, lng: 77.6245, zone: 'South Zone' },
  { name: 'Ward 12 - HSR Layout', lat: 12.9116, lng: 77.6433, zone: 'South Zone' },
  { name: 'Ward 18 - Whitefield & IT Corridor', lat: 12.9698, lng: 77.7500, zone: 'Mahadevapura' },
  { name: 'Ward 7 - MG Road & Shanthinagar', lat: 12.9756, lng: 77.6066, zone: 'Central Zone' },
  { name: 'Ward 4 - Malleshwaram', lat: 13.0031, lng: 77.5643, zone: 'West Zone' },
  { name: 'Ward 9 - Jayanagar 4th Block', lat: 12.9250, lng: 77.5938, zone: 'South Zone' }
];

export const MapPinSimulator = ({ value, onChange }) => {
  const [selectedWard, setSelectedWard] = useState(value?.ward || PRESET_WARDS[0].name);
  const [coordinates, setCoordinates] = useState({
    lat: value?.latitude || PRESET_WARDS[0].lat,
    lng: value?.longitude || PRESET_WARDS[0].lng
  });
  const [isDetecting, setIsDetecting] = useState(false);

  const handleWardSelect = (ward) => {
    setSelectedWard(ward.name);
    setCoordinates({ lat: ward.lat, lng: ward.lng });
    onChange({
      ward: ward.name,
      latitude: ward.lat,
      longitude: ward.lng
    });
  };

  const handleAutoLocate = () => {
    setIsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(4));
          const lng = parseFloat(pos.coords.longitude.toFixed(4));
          setCoordinates({ lat, lng });
          onChange({
            ward: selectedWard,
            latitude: lat,
            longitude: lng
          });
          setIsDetecting(false);
        },
        () => {
          // Fallback to random slight offset in city
          const offsetLat = 12.9716 + (Math.random() - 0.5) * 0.05;
          const offsetLng = 77.5946 + (Math.random() - 0.5) * 0.05;
          setCoordinates({ lat: parseFloat(offsetLat.toFixed(4)), lng: parseFloat(offsetLng.toFixed(4)) });
          onChange({
            ward: selectedWard,
            latitude: parseFloat(offsetLat.toFixed(4)),
            longitude: parseFloat(offsetLng.toFixed(4))
          });
          setIsDetecting(false);
        },
        { timeout: 5000 }
      );
    } else {
      setIsDetecting(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(15, 23, 42, 0.45)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={18} color="#10b981" />
          <span style={{ fontWeight: 600, fontSize: '0.925rem' }}>Civic Ward & GPS Location</span>
        </div>
        <button
          type="button"
          onClick={handleAutoLocate}
          disabled={isDetecting}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.75rem', gap: '0.35rem' }}
        >
          <Navigation size={13} className={isDetecting ? 'animate-spin' : ''} />
          {isDetecting ? 'Locating...' : 'Auto-Detect GPS'}
        </button>
      </div>

      {/* Ward Pills */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block', fontWeight: 600 }}>
          SELECT MUNICIPAL WARD:
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {PRESET_WARDS.map(w => {
            const isSelected = selectedWard === w.name;
            return (
              <button
                type="button"
                key={w.name}
                onClick={() => handleWardSelect(w)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: isSelected ? '1px solid #10b981' : '1px solid var(--border-glass)',
                  background: isSelected ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#34d399' : 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  transition: 'all 0.2s'
                }}
              >
                {isSelected && <Check size={12} />}
                {w.name.split(' - ')[1] || w.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Map Canvas Simulator */}
      <div 
        style={{
          position: 'relative',
          height: '140px',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #091322 0%, #0d1e38 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Subtle Map Grid Lines */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Pulsing Pin Marker */}
        <div 
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: 'translateY(-10px)'
          }}
        >
          <div 
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.8)',
              animation: 'pulse-border 2s infinite'
            }}
          >
            <MapPin size={20} color="#fff" />
          </div>
          <div 
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.2rem 0.5rem',
              fontSize: '0.7rem',
              fontWeight: 600,
              color: '#f8fafc',
              marginTop: '4px',
              whiteSpace: 'nowrap'
            }}
          >
            {selectedWard}
          </div>
        </div>

        {/* GPS coordinates readout in corner */}
        <div 
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            background: 'rgba(0, 0, 0, 0.6)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.675rem',
            color: '#38bdf8'
          }}
        >
          LAT: {coordinates.lat.toFixed(4)} | LNG: {coordinates.lng.toFixed(4)}
        </div>
      </div>
    </div>
  );
};
