# AutoFlow: Architecture Document
**Agentic AI for Autonomous Enterprise Workflows**

## System Overview
AutoFlow is a multi-agent orchestration engine designed to handle complex, multi-step enterprise workflows—specifically Vendor Onboarding and Verification. 

The system utilizes specialized sub-agents that operate sequentially, maintaining memory of the previous steps to ensure an auditable trail of decisions. Human intervention is triggered by exception (e.g., SLA risk or severe compliance violation).

## Agent Roles & Responsibilities
1. **Data Extraction Agent:** Ingests unstructured invoice/contract data (PDF, DOCX) and structures it via OCR parsing models.
2. **Background Check Agent:** Queries external vendor registries and scores vendor legitimacy.
3. **Compliance Engine Agent:** Cross-references the extracted entities against global Anti-Money Laundering (AML) and Sanctions databases.
4. **ERP Integration Agent:** Generates the secure payload and commits the verified vendor record to the central Enterprise Resource Planning system.

## Communication & State Management
The Next.js front-end acts as the Visual Orchestration Layer.
- State is managed via a reactive finite state machine (`pending` -> `active` -> `completed` | `blocked`).
- The system logs every micro-decision made by the agents into an immutable audit trail array.
- When an agent encounters a "high-risk" anomaly, it transitions the state to `blocked` and emits an event to the Human-in-the-loop orchestrator.

## Error-Handling & Escalation Logic
- **Data Anomaly:** If OCR confidence is < 85%, the extraction agent requests a secondary scan.
- **Compliance Breach:** Any entity flagged on a sanctions list instantly halts the pipeline. The system surfaces the exact risk factors to the designated compliance officer via a secure modal. The process cannot proceed without human authorization.
