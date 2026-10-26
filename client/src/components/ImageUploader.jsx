import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, FileText, X, CheckCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const ImageUploader = ({ onFilesUploaded, existingFiles = [] }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filesList, setFilesList] = useState(existingFiles);
  const fileInputRef = useRef(null);
  const { success, error } = useToast();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadSelectedFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadSelectedFiles(e.target.files);
    }
  };

  const uploadSelectedFiles = async (files) => {
    setUploading(true);
    try {
      const res = await api.uploadFiles(files);
      if (res.success && res.files) {
        const updated = [...filesList, ...res.files];
        setFilesList(updated);
        onFilesUploaded(updated);
        success(`${res.files.length} attachment(s) verified & uploaded.`);
      }
    } catch (err) {
      error(err.message || 'Failed to upload attachments.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFile = (idx) => {
    const updated = filesList.filter((_, i) => i !== idx);
    setFilesList(updated);
    onFilesUploaded(updated);
  };

  return (
    <div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        multiple 
        accept="image/png,image/jpeg,image/webp,application/pdf"
        style={{ display: 'none' }} 
      />

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? '#10b981' : 'var(--border-glass)'}`,
          background: isDragging ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.5)',
          borderRadius: 'var(--radius-md)',
          padding: '1.75rem 1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.25s ease'
        }}
      >
        {uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Loader2 size={32} className="animate-spin" color="#10b981" />
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Uploading proof documents...</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399'
            }}>
              <UploadCloud size={24} />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.925rem', color: '#f8fafc' }}>
                Click to upload or drag & drop photo proof
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                High-res photos of pothole, water leak, garbage, or PDF documents (Max 10MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Preview Grid */}
      {filesList.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
          {filesList.map((file, idx) => {
            const isImage = file.mimeType?.startsWith('image') || file.filename?.match(/\.(jpg|jpeg|png|webp)$/i);
            return (
              <div 
                key={idx}
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-glass)',
                  padding: '0.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                {isImage ? (
                  <img 
                    src={file.url} 
                    alt={file.originalName || 'Preview'} 
                    style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '4px' }}>
                    <FileText size={32} color="#38bdf8" />
                  </div>
                )}
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.35rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                  {file.originalName || file.filename}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                  title="Remove"
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
