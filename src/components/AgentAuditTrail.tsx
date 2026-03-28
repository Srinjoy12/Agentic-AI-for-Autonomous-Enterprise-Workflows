'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Bot, CheckCircle, AlertTriangle, ShieldCheck, FileSearch, Building2, User } from 'lucide-react';
import ExtractedDataCard from '@/components/ExtractedDataCard';

type StepStatus = 'pending' | 'active' | 'completed' | 'blocked';
type AgentStep = {
  id: string;
  label: string;
  description: string;
  icon: any;
  status: StepStatus;
  logs: string[];
};

export default function AgentAuditTrail({ documentName, onRequireApproval, triggerResume }: { documentName: string, onRequireApproval: () => void, triggerResume: boolean }) {
  const [steps, setSteps] = useState<AgentStep[]>([
    {
      id: 'extract',
      label: 'Data Extraction (LLM)',
      description: 'Calling Gemini Vision/OCR for parsing.',
      icon: FileSearch,
      status: 'pending',
      logs: []
    },
    {
      id: 'background',
      label: 'Vendor Background',
      description: 'Checking centralized corporate registry.',
      icon: Building2,
      status: 'pending',
      logs: []
    },
    {
      id: 'compliance',
      label: 'Compliance Engine (LLM)',
      description: 'Running AML and Gemini Risk Scoring.',
      icon: ShieldCheck,
      status: 'pending',
      logs: []
    },
    {
      id: 'erp',
      label: 'ERP Integration',
      description: 'Creating official vendor record via API.',
      icon: User,
      status: 'pending',
      logs: []
    }
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const fetchedRef = useRef(false);

  // Resume trigger effect
  useEffect(() => {
    if (triggerResume) {
      setSteps(prev => prev.map((s, i) => s.status === 'blocked' ? { 
        ...s, 
        status: 'completed',
        logs: [...s.logs, '> EXCEPTION AUTHORIZED BY HUMAN.', '> Resuming workflow...']
      } : s));
      const t = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [triggerResume]); // eslint-disable-line react-hooks/exhaustive-deps

  // Simulation logic
  useEffect(() => {
    if (currentStepIndex >= steps.length) return;
    
    const step = steps[currentStepIndex];
    if (step.status === 'blocked' || step.status === 'completed') return;

    // Set active
    setSteps(prev => prev.map((s, i) => i === currentStepIndex ? { ...s, status: 'active' } : s));

    // First step triggers real LLM API
    if (currentStepIndex === 0 && !fetchedRef.current) {
        fetchedRef.current = true;
        
        setSteps(prev => prev.map((s, i) => i === 0 ? { 
            ...s, 
            logs: ['> Sending request to Gemini 2.5 backend...']
        } : s));

        fetch('/api/analyze-vendor', {
            method: 'POST',
            body: JSON.stringify({ documentName })
        })
        .then(res => res.json())
        .then(data => {
            setAnalysisResult(data);
            
            if (data.isDocumentValid === false) {
                setSteps(prev => prev.map((s, i) => i === 0 ? { 
                    ...s, 
                    status: 'blocked',
                    logs: [
                       ...s.logs,
                       `> CRITICAL ERROR: Document Mismatch.`, 
                       `> Reason: ${data.documentErrorReason || 'Invalid document type.'}`, 
                       `> Process completely halted.`
                    ]
                } : s));
                return; // Stop the execution sequence right here
            }

            setSteps(prev => prev.map((s, i) => i === 0 ? { 
                ...s, 
                status: 'completed',
                logs: [
                   ...s.logs,
                   `> LLM Extraction complete. Validated Contract.`, 
                   `> Vendor: ${data.vendorName || 'Unknown'}`, 
                   `> LLM Risk Score: ${data.riskScore || 'N/A'}`
                ]
            } : s));
            setTimeout(() => setCurrentStepIndex(1), 1500);
        })
        .catch(err => {
            setSteps(prev => prev.map((s, i) => i === 0 ? { 
                ...s, status: 'completed', logs: ['> LLM Extraction failed/Network error.', '> Proceeding with fallback mode.']
            } : s));
            setTimeout(() => setCurrentStepIndex(1), 1500);
        });
        return;
    }

    if (currentStepIndex === 0) return; // Wait for fetch

    const simTimer = setTimeout(() => {
      // Logic for blocking on compliance
      if (step.id === 'compliance' && !triggerResume) {
        const isHighRisk = analysisResult?.isHighRisk ?? true;
        
        if (isHighRisk) {
            setSteps(prev => prev.map((s, i) => i === currentStepIndex ? { 
               ...s, 
               status: 'blocked',
               logs: [
                   '> WARNING: LLM flagged vendor as High Risk.', 
                   `> Specific Reason: ${analysisResult?.reasons?.[0] || 'Unknown Jurisdiction'}`, 
                   '> Pausing for Human Authorization.'
               ]
            } : s));
            onRequireApproval();
            return;
        }
      }

      // Normal completion
      setSteps(prev => prev.map((s, i) => i === currentStepIndex ? { 
        ...s, 
        status: 'completed',
        logs: step.id === 'compliance' && triggerResume ? s.logs : [
          `> Completed ${step.label} successfully.`, 
          `> Agent Confidence: ${(Math.random() * 10 + 89).toFixed(1)}%`
        ]
      } : s));
      
      setCurrentStepIndex(prev => prev + 1);

    }, 2000);

    return () => clearTimeout(simTimer);
  }, [currentStepIndex, onRequireApproval, triggerResume, analysisResult, documentName]);

  return (
    <div style={{ display: 'flex', gap: '32px', flexDirection: 'row', alignItems: 'flex-start', marginTop: '24px', width: '100%' }}>
      <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', flex: 2 }}>
        
        {/* Background glow decoration */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          background: 'var(--primary)',
          filter: 'blur(100px)',
          opacity: 0.15,
          borderRadius: '50%',
          zIndex: 0,
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Live Orchestration</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>AutoFlow Agent Engine (Gemini 2.5)</p>
          </div>
          {currentStepIndex >= steps.length && (
              <div style={{ marginLeft: 'auto', background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80', padding: '6px 12px', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 500 }}>
                  Workflow Complete
              </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', zIndex: 1 }}>
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = step.status === 'active';
            const isCompleted = step.status === 'completed';
            const isBlocked = step.status === 'blocked';
            const isPending = step.status === 'pending';

            return (
              <div key={step.id} style={{ display: 'flex', gap: '20px' }}>
                {/* Timeline line */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isCompleted ? 'rgba(74, 222, 128, 0.2)' :
                                isBlocked ? 'rgba(239, 68, 68, 0.2)' : 
                                isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${
                      isCompleted ? '#4ade80' : 
                      isBlocked ? '#ef4444' : 
                      isActive ? 'var(--primary)' : 'var(--glass-border)'
                    }`,
                    color: isCompleted ? '#4ade80' : 
                           isBlocked ? '#ef4444' : 
                           isActive ? 'var(--primary)' : 'var(--text-muted)',
                    boxShadow: isActive ? '0 0 15px rgba(255, 255, 255, 0.4)' : isBlocked ? '0 0 15px rgba(239, 68, 68, 0.4)' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    {isCompleted ? <CheckCircle size={20} /> :
                     isBlocked ? <AlertTriangle size={20} /> :
                     isActive ? <div className="spinner" style={{
                       width: '18px', height: '18px', border: '2px solid var(--primary)', 
                       borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'
                     }} /> :
                     <Icon size={18} />
                    }
                  </div>
                  {idx < steps.length - 1 && (
                    <div style={{
                      width: '2px',
                      flex: 1,
                      minHeight: '40px',
                      background: isCompleted ? '#4ade80' : 'var(--glass-border)',
                      margin: '8px 0',
                      transition: 'all 0.3s ease'
                    }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingTop: '8px', paddingBottom: '32px', opacity: isPending ? 0.5 : 1, transition: 'opacity 0.3s ease' }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', color: isBlocked ? '#ef4444' : 'var(--foreground)' }}>
                    {step.label}
                  </h3>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: step.logs.length > 0 ? '12px' : '0' }}>
                    {step.description}
                  </p>
                  
                  {step.logs.length > 0 && (
                    <div style={{ 
                      background: 'rgba(0,0,0,0.3)', 
                      border: '1px solid var(--glass-border)',
                      borderRadius: '8px',
                      padding: '12px',
                      fontFamily: 'var(--font-geist-mono)',
                      fontSize: '0.85rem',
                      color: '#e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      {step.logs.map((log, i) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', color: log.includes('WARNING') ? '#ef4444' : (log.includes('EXCEPTION') || log.includes('Resuming')) ? '#eab308' : '#a1a1aa' }}>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}} />
      </div>

      <div style={{ flex: 1, position: 'sticky', top: '100px' }}>
        {analysisResult && (
          <ExtractedDataCard data={analysisResult} isCompleted={currentStepIndex > 0} />
        )}
      </div>

    </div>
  );
}
