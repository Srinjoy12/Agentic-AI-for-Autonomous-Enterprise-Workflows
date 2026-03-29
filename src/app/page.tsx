'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import DocumentUpload from '@/components/DocumentUpload';
import AgentAuditTrail from '@/components/AgentAuditTrail';
import HumanApprovalModal from '@/components/HumanApprovalModal';

// Dynamic import with SSR disabled to prevent hydration mismatch from Three.js Canvas
const CanvasRevealEffect = dynamic(
  () => import('@/components/CanvasRevealEffect').then(mod => mod.CanvasRevealEffect),
  { ssr: false }
);

export default function Home() {
  const [workflowStarted, setWorkflowStarted] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [triggerResume, setTriggerResume] = useState(false);
  const [documentName, setDocumentName] = useState("Unknown_Document.pdf");
  const [fileContent, setFileContent] = useState("");
  const [fileBase64, setFileBase64] = useState("");
  const [riskReasons, setRiskReasons] = useState<string[]>([]);

  return (
    <main style={{ minHeight: '100vh', padding: '40px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Animated Matrix Background */}
      <div suppressHydrationWarning style={{ position: 'absolute', top: '0px', left: '0px', right: '0px', bottom: '0px', zIndex: 0, opacity: 0.35 }}>
        <CanvasRevealEffect
          animationSpeed={3}
          colors={[
            [255, 255, 255],
            [160, 174, 192],
          ]}
          dotSize={6}
          opacities={[0.3, 0.4, 0.6, 0.8, 1, 1, 1, 1, 1, 1]}
          reverse={false}
          showGradient={true}
        />
        <div style={{ position: 'absolute', top: '0px', left: '0px', right: '0px', bottom: '0px', pointerEvents: 'none', background: 'radial-gradient(circle at center, transparent 0%, var(--background) 100%)' }} />
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', marginTop: '2vh', paddingBottom: '100px', position: 'relative', zIndex: 1 }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '16px', fontWeight: 700, letterSpacing: '-0.03em' }}>
            AutoFlow Orchestrator
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Autonomous multi-agent system for enterprise vendor onboarding. Features real-time self-correction and human-in-the-loop compliance checks.
          </p>
        </div>

        {!workflowStarted ? (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
             <DocumentUpload onUpload={(filename: string, content: string, base64: string) => {
               setDocumentName(filename);
               setFileContent(content);
               setFileBase64(base64);
               setWorkflowStarted(true);
             }} />
          </div>
        ) : (
          <AgentAuditTrail 
            documentName={documentName}
            fileContent={fileContent}
            fileBase64={fileBase64}
            onRequireApproval={(reasons: string[]) => {
              setRiskReasons(reasons);
              setRequiresApproval(true);
            }}
            triggerResume={triggerResume}
          />
        )}
      </div>

      {requiresApproval && (
        <HumanApprovalModal 
          riskReasons={riskReasons}
          onApprove={() => {
            setRequiresApproval(false);
            setTriggerResume(true);
          }}
          onReject={() => {
            setRequiresApproval(false);
            alert("Process escalated to legal team.");
          }}
        />
      )}
    </main>
  );
}
