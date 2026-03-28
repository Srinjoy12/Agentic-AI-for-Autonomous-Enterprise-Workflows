'use client';
import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';

export default function DocumentUpload({ onUpload }: { onUpload: (filename: string) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="glass-panel" style={{ marginTop: '24px' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '1.2rem', fontWeight: 500 }}>Upload Vendor Document</h3>
      
      {!file ? (
        <>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            accept=".pdf,.docx,.doc,image/*"
          />
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--glass-border)'}`,
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              background: isDragging ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            <UploadCloud size={48} color={isDragging ? 'var(--primary)' : 'var(--text-muted)'} style={{ margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--foreground)', fontWeight: 500, marginBottom: '8px' }}>
              Click to browse or drag your real document here
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Supports PDF, DOCX, PNG (Max 10MB)
            </p>
          </div>
        </>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '8px',
          border: '1px solid var(--glass-border)'
        }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '12px', borderRadius: '8px' }}>
            <FileText size={24} color="var(--primary)" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 500, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              {file.name}
              <CheckCircle size={16} color="#4ade80" />
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              {(file.size / 1024).toFixed(2)} KB • Ready for processing
            </p>
          </div>
          <button className="btn-primary" onClick={() => onUpload(file.name)}>
            Begin Autonomous Workflow
          </button>
        </div>
      )}
    </div>
  );
}
