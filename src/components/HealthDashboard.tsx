'use client';
import React from 'react';
import { Activity, ShieldAlert, BarChart3 } from 'lucide-react';

export default function HealthDashboard() {
  return (
    <div className="glass-panel" style={{ 
      padding: '16px 24px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      marginBottom: '40px',
      background: 'rgba(20, 20, 20, 0.4)',
      backdropFilter: 'blur(20px)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Activity size={20} color="#4ade80" />
        <div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Health</p>
          <p style={{ margin: 0, fontWeight: 600, color: '#e2e8f0' }}>Optimal</p>
        </div>
      </div>

      <div style={{ width: '1px', background: 'var(--glass-border)' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <BarChart3 size={20} color="var(--primary)" />
        <div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Queue (24h)</p>
          <p style={{ margin: 0, fontWeight: 600, color: '#e2e8f0' }}>1,402 Processed <span style={{ color: '#4ade80', marginLeft: '6px' }}>(+12%)</span></p>
        </div>
      </div>

      <div style={{ width: '1px', background: 'var(--glass-border)' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ShieldAlert size={20} color="#facc15" />
        <div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Exceptions</p>
          <p style={{ margin: 0, fontWeight: 600, color: '#facc15' }}>3 Pending Review</p>
        </div>
      </div>
    </div>
  );
}
