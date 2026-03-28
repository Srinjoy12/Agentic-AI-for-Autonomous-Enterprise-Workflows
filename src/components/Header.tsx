import React from 'react';
import { Layers, Bell, Settings, CircleUser } from 'lucide-react';

export default function Header() {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '64px',
      background: 'rgba(10, 10, 10, 0.7)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--glass-border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.02em', margin: 0, color: 'var(--foreground)' }}>
          AutoFlow
        </h2>
      </div>
      
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}>
          <Bell size={18} color="var(--text-muted)" />
        </button>
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}>
          <Settings size={18} color="var(--text-muted)" />
        </button>
        <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)' }} />
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CircleUser size={24} color="var(--text-muted)" />
        </button>
      </div>
    </header>
  );
}
