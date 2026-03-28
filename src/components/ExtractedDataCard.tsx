'use client';
import React from 'react';
import { Database } from 'lucide-react';

export default function ExtractedDataCard({ data, isCompleted }: { data: any, isCompleted: boolean }) {
  if (!data) return null;

  return (
    <div className="glass-panel" style={{ 
      background: 'linear-gradient(135deg, var(--glass-bg), rgba(30, 30, 30, 0.4))',
      border: '1px solid var(--primary)',
      boxShadow: '0 0 20px rgba(255, 255, 255, 0.05)',
      position: 'relative',
      overflow: 'hidden',
      opacity: isCompleted ? 1 : 0.6,
      transition: 'opacity 0.3s ease',
      width: '100%'
    }}>
      <h3 style={{ fontSize: '1.1rem', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Database size={18} color="var(--primary)" />
        Extracted Context
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
           <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Document Status</p>
           <p style={{ margin: 0, fontSize: '0.9rem', color: data.isDocumentValid === false ? '#ef4444' : '#4ade80' }}>
             {data.isDocumentValid === false ? 'Mismatch: ' + data.documentErrorReason : 'Verified Contract Type'}
           </p>
        </div>

        {data.isDocumentValid !== false && (
          <>
            <div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Vendor Legal Name</p>
              <p style={{ margin: 0, fontWeight: 500, color: '#e2e8f0' }}>{data.vendorName}</p>
            </div>

            <div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>AI Risk Score (0-100)</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                <div style={{ 
                  height: '8px', flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' 
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${Math.min(data.riskScore || 0, 100)}%`, 
                    background: data.riskScore >= 80 ? '#ef4444' : data.riskScore >= 50 ? '#facc15' : '#4ade80',
                    transition: 'all 1s ease-out'
                  }} />
                </div>
                <span style={{ fontWeight: 600, color: data.riskScore >= 80 ? '#ef4444' : '#e2e8f0' }}>
                  {data.riskScore}
                </span>
              </div>
            </div>

            <div>
               <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Flagged Compliance Issues</p>
               <p style={{ margin: 0, fontSize: '0.9rem', color: data.isHighRisk ? '#ef4444' : '#4ade80' }}>
                 {data.isHighRisk ? (data.reasons?.[0] || 'High Risk Jurisdiction') : 'None Detected (Cleared)'}
               </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
