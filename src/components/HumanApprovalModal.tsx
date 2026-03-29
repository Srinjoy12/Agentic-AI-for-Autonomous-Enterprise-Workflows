'use client';
import React from 'react';
import { AlertTriangle, ShieldCheck, XCircle } from 'lucide-react';

export default function HumanApprovalModal({ riskReasons, onApprove, onReject }: { riskReasons: string[], onApprove: () => void, onReject: () => void }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '540px',
        width: '100%',
        margin: '20px',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 40px rgba(239, 68, 68, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Warning Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '16px', borderRadius: '50%' }}>
            <AlertTriangle size={36} color="#ef4444" />
          </div>
          <div>
            <h2 style={{ margin: 0, color: '#ef4444', fontSize: '1.4rem' }}>Human Approval Required</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Process blocked by Compliance Engine</p>
          </div>
        </div>

        {/* Dynamic Risk Factors from Gemini */}
        <div style={{ background: 'rgba(20,20,20,0.5)', borderRadius: '8px', padding: '20px', marginBottom: '24px', border: '1px solid var(--surface-border)' }}>
          <p style={{ margin: '0 0 12px', fontWeight: 600, color: '#e2e8f0' }}>Risk Factors Detected by AI:</p>
          <ul style={{ margin: 0, paddingLeft: '24px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.95rem' }}>
            {riskReasons.length > 0 ? (
              riskReasons.map((reason, idx) => (
                <li key={idx}>
                  <span style={{ color: '#ef4444' }}>{reason}</span>
                </li>
              ))
            ) : (
              <>
                <li>Vendor location is within a restricted jurisdiction <span style={{color:'#ef4444'}}>(Risk Tier 2)</span>.</li>
                <li>Ultimate Beneficial Owner (UBO) verification data is inconclusive.</li>
              </>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={onReject}
            style={{ 
              flex: 1, 
              background: 'transparent', 
              border: '1px solid var(--glass-border)',
              color: 'var(--foreground)',
              padding: '14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          >
            <XCircle size={20} /> Reject & Escalate
          </button>
          
          <button 
            onClick={onApprove}
            style={{ 
              flex: 1, 
              background: '#ef4444', 
              border: 'none',
              color: '#fff',
              padding: '14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#dc2626'}
            onMouseOut={e => e.currentTarget.style.background = '#ef4444'}
          >
            <ShieldCheck size={20} /> Authorize Exception
          </button>
        </div>

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}} />
    </div>
  );
}
