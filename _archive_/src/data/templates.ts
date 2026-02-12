import { WorkflowTemplate } from '../types/workflow';

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'corporate-actions',
    name: 'Corporate Actions Processing',
    description: 'Automate the processing of corporate actions like tender offers, dividends, and spin-offs',
    category: 'Finance',
    icon: '📊',
    tags: ['finance', 'corporate actions', 'compliance', 'client communication'],
    workflow: {
      name: 'Corporate Actions Intelligence Platform',
      description: 'End-to-end multi-agent system for processing corporate actions, client communication, and settlement',
      agents: [
        {
          id: 'agent-1',
          order: 1,
          name: 'CA Identification & Processing',
          description: 'Monitors data sources, extracts information, and identifies corporate actions requiring processing',
          type: 'automated',
          color: 'blue',
          trigger: { type: 'event', description: 'New document received from any data source' },
          actions: ['Monitor incoming data', 'Extract key information', 'Classify action type', 'Match to client positions'],
          integrations: ['Email Server', 'SEC EDGAR API', 'News Wire Services', 'Position Database'],
          outputs: [
            { name: 'Structured CA Record', type: 'data' },
            { name: 'Affected Client List', type: 'data' }
          ],
          sampleData: {
            type: 'table',
            title: 'Incoming Documents',
            description: 'Example of how the agent would display incoming data sources',
            columns: [
              { key: 'source', label: 'Source', type: 'text' },
              { key: 'subject', label: 'Subject', type: 'text' },
              { key: 'status', label: 'Status', type: 'status' },
              { key: 'received', label: 'Received', type: 'date' }
            ],
            rows: [
              { source: 'Email', subject: 'Voluntary Tender Offer Announcement', status: 'new', received: '2024-11-19 09:23 AM' },
              { source: 'SEC EDGAR', subject: 'Form 8-K: Global Pharma Rights Issue', status: 'processing', received: '2024-11-19 08:15 AM' },
              { source: 'News Wire', subject: 'BREAKING: Energy Solutions Announces Spin-off', status: 'extracted', received: '2024-11-19 07:42 AM' }
            ]
          }
        },
        {
          id: 'agent-2',
          order: 2,
          name: 'Proxy Voting & Client Communication',
          description: 'Manages client notifications, collects elections, and processes proxy votes with human approval',
          type: 'human-in-loop',
          color: 'purple',
          trigger: { type: 'previous-agent', description: 'Corporate action identified and clients matched' },
          actions: ['Generate notifications', 'Send to affected clients', 'Collect responses', 'Validate elections'],
          integrations: ['Email Service', 'Client Portal', 'Compliance System'],
          outputs: [
            { name: 'Election Records', type: 'data' },
            { name: 'Client Notifications', type: 'notification' }
          ],
          sampleData: {
            type: 'table',
            title: 'Client Elections',
            columns: [
              { key: 'client', label: 'Client', type: 'text' },
              { key: 'shares', label: 'Eligible Shares', type: 'text' },
              { key: 'status', label: 'Status', type: 'status' },
              { key: 'election', label: 'Election', type: 'text' }
            ],
            rows: [
              { client: 'Pension Fund Alpha', shares: '50,000', status: 'elected', election: 'Participate - 100%' },
              { client: 'Investment Trust Beta', shares: '75,000', status: 'pending', election: 'N/A' },
              { client: 'Hedge Fund Gamma', shares: '25,000', status: 'elected', election: 'Decline' }
            ]
          }
        },
        {
          id: 'agent-3',
          order: 3,
          name: 'Settlement & Distribution',
          description: 'Processes settlements, manages distributions, and updates records automatically after elections',
          type: 'automated',
          color: 'green',
          trigger: { type: 'previous-agent', description: 'Elections collected and deadline reached' },
          actions: ['Submit to custodian', 'Process transfers', 'Update positions', 'Generate confirmations'],
          integrations: ['Custodian API', 'Accounting System', 'Audit Trail'],
          outputs: [
            { name: 'Settlement Confirmations', type: 'document' },
            { name: 'Updated Positions', type: 'data' }
          ],
          sampleData: {
            type: 'table',
            title: 'Settlement Status',
            columns: [
              { key: 'account', label: 'Account', type: 'text' },
              { key: 'action', label: 'Action', type: 'text' },
              { key: 'amount', label: 'Amount', type: 'money' },
              { key: 'status', label: 'Status', type: 'status' }
            ],
            rows: [
              { account: 'PENSION-001', action: 'Tender 50,000 shares', amount: '$862,500', status: 'settled' },
              { account: 'MUTUAL-156', action: 'Tender 60,000 shares', amount: '$1,035,000', status: 'processing' },
              { account: 'HEDGE-089', action: 'Declined', amount: '$0', status: 'complete' }
            ]
          }
        }
      ],
      dataSources: [
        { id: 'ds-1', name: 'Email', type: 'email', icon: 'Mail', description: 'Corporate announcements via email' },
        { id: 'ds-2', name: 'SEC EDGAR', type: 'api', icon: 'FileText', description: 'SEC filing monitoring' },
        { id: 'ds-3', name: 'News Wire', type: 'api', icon: 'Globe', description: 'Bloomberg/Reuters feeds' },
        { id: 'ds-4', name: 'Position Database', type: 'database', icon: 'Database', description: 'Client holdings data' }
      ],
      humanTouchpoints: [
        { id: 'ht-1', agentId: 'agent-2', name: 'Client Election', type: 'decision', description: 'Clients must decide whether to participate', required: true },
        { id: 'ht-2', agentId: 'agent-2', name: 'Compliance Review', type: 'approval', description: 'Compliance team reviews large transactions', required: false }
      ],
      estimatedComplexity: 'high',
      estimatedBuildTime: '4-6 weeks',
      tags: ['finance', 'compliance', 'multi-agent']
    }
  },
  {
    id: 'invoice-processing',
    name: 'Invoice Processing & Approval',
    description: 'Automate invoice intake, validation, approval routing, and payment processing',
    category: 'Finance',
    icon: '🧾',
    tags: ['finance', 'invoices', 'approvals', 'payments'],
    workflow: {
      name: 'Intelligent Invoice Processing',
      description: 'End-to-end automation for invoice processing with smart routing and approval workflows',
      agents: [
        {
          id: 'agent-1',
          order: 1,
          name: 'Invoice Intake & Extraction',
          description: 'Receives invoices from multiple channels and extracts key data using OCR and AI',
          type: 'automated',
          color: 'blue',
          trigger: { type: 'event', description: 'Invoice received via email, upload, or API' },
          actions: ['Receive invoice', 'OCR processing', 'Extract fields', 'Validate against PO'],
          integrations: ['Email', 'Document Upload Portal', 'OCR Service', 'ERP System'],
          outputs: [
            { name: 'Structured Invoice Data', type: 'data' },
            { name: 'Validation Report', type: 'document' }
          ],
          sampleData: {
            type: 'table',
            title: 'Incoming Invoices',
            columns: [
              { key: 'vendor', label: 'Vendor', type: 'text' },
              { key: 'amount', label: 'Amount', type: 'money' },
              { key: 'status', label: 'Status', type: 'status' },
              { key: 'poMatch', label: 'PO Match', type: 'text' }
            ],
            rows: [
              { vendor: 'Acme Supplies', amount: '$4,500.00', status: 'validated', poMatch: 'PO-2024-001' },
              { vendor: 'Tech Solutions', amount: '$12,350.00', status: 'review', poMatch: 'No match' },
              { vendor: 'Office Plus', amount: '$890.00', status: 'validated', poMatch: 'PO-2024-015' }
            ]
          }
        },
        {
          id: 'agent-2',
          order: 2,
          name: 'Approval Routing',
          description: 'Routes invoices to appropriate approvers based on amount, department, and vendor',
          type: 'human-in-loop',
          color: 'amber',
          trigger: { type: 'previous-agent', description: 'Invoice validated and ready for approval' },
          actions: ['Determine approval chain', 'Send approval requests', 'Track responses', 'Handle escalations'],
          integrations: ['Slack/Teams', 'Email', 'Mobile App', 'Approval Database'],
          outputs: [
            { name: 'Approval Decision', type: 'decision' },
            { name: 'Audit Trail', type: 'data' }
          ],
          sampleData: {
            type: 'table',
            title: 'Pending Approvals',
            columns: [
              { key: 'invoice', label: 'Invoice', type: 'text' },
              { key: 'approver', label: 'Approver', type: 'text' },
              { key: 'amount', label: 'Amount', type: 'money' },
              { key: 'status', label: 'Status', type: 'status' }
            ],
            rows: [
              { invoice: 'INV-2024-0892', approver: 'John Smith (Manager)', amount: '$4,500.00', status: 'approved' },
              { invoice: 'INV-2024-0893', approver: 'Sarah Chen (Director)', amount: '$12,350.00', status: 'pending' },
              { invoice: 'INV-2024-0894', approver: 'Auto-approved', amount: '$890.00', status: 'approved' }
            ]
          }
        },
        {
          id: 'agent-3',
          order: 3,
          name: 'Payment Processing',
          description: 'Processes approved invoices for payment and updates accounting records',
          type: 'automated',
          color: 'green',
          trigger: { type: 'previous-agent', description: 'Invoice approved' },
          actions: ['Schedule payment', 'Process transaction', 'Update ledger', 'Send confirmation'],
          integrations: ['Bank API', 'Accounting System', 'Vendor Portal'],
          outputs: [
            { name: 'Payment Confirmation', type: 'document' },
            { name: 'Ledger Entry', type: 'data' }
          ]
        }
      ],
      dataSources: [
        { id: 'ds-1', name: 'Email', type: 'email', icon: 'Mail', description: 'Invoice emails from vendors' },
        { id: 'ds-2', name: 'Vendor Portal', type: 'api', icon: 'Globe', description: 'Direct vendor submissions' },
        { id: 'ds-3', name: 'ERP System', type: 'database', icon: 'Database', description: 'PO and vendor data' }
      ],
      humanTouchpoints: [
        { id: 'ht-1', agentId: 'agent-2', name: 'Manager Approval', type: 'approval', description: 'Managers approve invoices in their department', required: true },
        { id: 'ht-2', agentId: 'agent-2', name: 'Exception Review', type: 'review', description: 'Review invoices without PO match', required: false }
      ],
      estimatedComplexity: 'medium',
      estimatedBuildTime: '2-3 weeks',
      tags: ['finance', 'automation', 'approvals']
    }
  },
  {
    id: 'customer-onboarding',
    name: 'Customer Onboarding',
    description: 'Streamline new customer setup with automated verification, account creation, and welcome sequences',
    category: 'Operations',
    icon: '👋',
    tags: ['onboarding', 'customers', 'verification', 'automation'],
    workflow: {
      name: 'Automated Customer Onboarding',
      description: 'Seamless onboarding experience with identity verification, account setup, and personalized welcome',
      agents: [
        {
          id: 'agent-1',
          order: 1,
          name: 'Application Processing',
          description: 'Receives applications and performs initial validation and data enrichment',
          type: 'automated',
          color: 'blue',
          trigger: { type: 'event', description: 'New application submitted' },
          actions: ['Validate form data', 'Check for duplicates', 'Enrich with external data', 'Score application'],
          integrations: ['Web Form', 'CRM', 'Data Enrichment API'],
          outputs: [
            { name: 'Validated Application', type: 'data' },
            { name: 'Risk Score', type: 'data' }
          ]
        },
        {
          id: 'agent-2',
          order: 2,
          name: 'Identity Verification',
          description: 'Verifies customer identity through document checks and KYC processes',
          type: 'human-in-loop',
          color: 'amber',
          trigger: { type: 'previous-agent', description: 'Application validated' },
          actions: ['Request ID documents', 'Run KYC checks', 'Verify identity', 'Flag for manual review if needed'],
          integrations: ['ID Verification Service', 'KYC Provider', 'Compliance Database'],
          outputs: [
            { name: 'Verification Result', type: 'decision' },
            { name: 'Compliance Record', type: 'document' }
          ]
        },
        {
          id: 'agent-3',
          order: 3,
          name: 'Account Setup & Welcome',
          description: 'Creates accounts, sets up access, and initiates welcome sequence',
          type: 'automated',
          color: 'green',
          trigger: { type: 'previous-agent', description: 'Identity verified' },
          actions: ['Create account', 'Set up permissions', 'Send credentials', 'Trigger welcome sequence'],
          integrations: ['Account System', 'Email Service', 'CRM'],
          outputs: [
            { name: 'Account Credentials', type: 'document' },
            { name: 'Welcome Email', type: 'notification' }
          ]
        }
      ],
      dataSources: [
        { id: 'ds-1', name: 'Web Application', type: 'api', icon: 'Globe', description: 'Online signup form' },
        { id: 'ds-2', name: 'CRM', type: 'database', icon: 'Database', description: 'Customer database' }
      ],
      humanTouchpoints: [
        { id: 'ht-1', agentId: 'agent-2', name: 'Manual ID Review', type: 'review', description: 'Review flagged identity documents', required: false }
      ],
      estimatedComplexity: 'medium',
      estimatedBuildTime: '2-4 weeks',
      tags: ['onboarding', 'kyc', 'automation']
    }
  },
  {
    id: 'content-moderation',
    name: 'Content Moderation Pipeline',
    description: 'AI-powered content review with human escalation for edge cases',
    category: 'Operations',
    icon: '🛡️',
    tags: ['moderation', 'content', 'safety', 'review'],
    workflow: {
      name: 'Intelligent Content Moderation',
      description: 'Multi-layer content review combining AI analysis with human judgment',
      agents: [
        {
          id: 'agent-1',
          order: 1,
          name: 'AI Content Analysis',
          description: 'Analyzes content for policy violations using ML models',
          type: 'automated',
          color: 'blue',
          trigger: { type: 'event', description: 'New content submitted' },
          actions: ['Text analysis', 'Image classification', 'Policy matching', 'Confidence scoring'],
          integrations: ['Content API', 'ML Models', 'Policy Engine'],
          outputs: [
            { name: 'Analysis Result', type: 'data' },
            { name: 'Confidence Score', type: 'data' }
          ]
        },
        {
          id: 'agent-2',
          order: 2,
          name: 'Human Review Queue',
          description: 'Routes uncertain content to human moderators for review',
          type: 'human-in-loop',
          color: 'purple',
          trigger: { type: 'previous-agent', description: 'Low confidence or edge case detected' },
          actions: ['Queue for review', 'Present context', 'Collect decision', 'Update training data'],
          integrations: ['Moderation Dashboard', 'Annotation Tool'],
          outputs: [
            { name: 'Final Decision', type: 'decision' },
            { name: 'Training Feedback', type: 'data' }
          ]
        },
        {
          id: 'agent-3',
          order: 3,
          name: 'Action & Notification',
          description: 'Executes moderation decisions and notifies relevant parties',
          type: 'automated',
          color: 'green',
          trigger: { type: 'previous-agent', description: 'Decision made' },
          actions: ['Apply content action', 'Notify user', 'Log decision', 'Update metrics'],
          integrations: ['Content Platform', 'Notification Service', 'Analytics'],
          outputs: [
            { name: 'Action Confirmation', type: 'notification' },
            { name: 'Moderation Log', type: 'data' }
          ]
        }
      ],
      dataSources: [
        { id: 'ds-1', name: 'Content Platform', type: 'api', icon: 'Globe', description: 'User-generated content' },
        { id: 'ds-2', name: 'Reports', type: 'manual', icon: 'Flag', description: 'User reports' }
      ],
      humanTouchpoints: [
        { id: 'ht-1', agentId: 'agent-2', name: 'Content Review', type: 'decision', description: 'Human moderator reviews flagged content', required: true }
      ],
      estimatedComplexity: 'medium',
      estimatedBuildTime: '3-4 weeks',
      tags: ['moderation', 'ml', 'human-in-loop']
    }
  },
  {
    id: 'support-ticket',
    name: 'Support Ticket Automation',
    description: 'Intelligent ticket routing, auto-responses, and escalation management',
    category: 'Customer Support',
    icon: '🎫',
    tags: ['support', 'tickets', 'automation', 'routing'],
    workflow: {
      name: 'Smart Support Ticket System',
      description: 'AI-powered ticket triage with automated responses and intelligent routing',
      agents: [
        {
          id: 'agent-1',
          order: 1,
          name: 'Ticket Intake & Classification',
          description: 'Receives tickets and classifies by type, urgency, and sentiment',
          type: 'automated',
          color: 'blue',
          trigger: { type: 'event', description: 'New support ticket created' },
          actions: ['Parse ticket content', 'Classify category', 'Detect urgency', 'Analyze sentiment'],
          integrations: ['Help Desk', 'Email', 'Chat Widget', 'NLP Service'],
          outputs: [
            { name: 'Classified Ticket', type: 'data' },
            { name: 'Suggested Response', type: 'data' }
          ]
        },
        {
          id: 'agent-2',
          order: 2,
          name: 'Auto-Response & Routing',
          description: 'Handles simple tickets automatically and routes complex ones to agents',
          type: 'human-in-loop',
          color: 'purple',
          trigger: { type: 'previous-agent', description: 'Ticket classified' },
          actions: ['Match to knowledge base', 'Send auto-response if confident', 'Route to right team', 'Set SLA'],
          integrations: ['Knowledge Base', 'Agent Queue', 'SLA System'],
          outputs: [
            { name: 'Response', type: 'notification' },
            { name: 'Routing Decision', type: 'decision' }
          ]
        },
        {
          id: 'agent-3',
          order: 3,
          name: 'Resolution & Follow-up',
          description: 'Tracks resolution, sends surveys, and updates knowledge base',
          type: 'automated',
          color: 'green',
          trigger: { type: 'previous-agent', description: 'Ticket resolved' },
          actions: ['Confirm resolution', 'Send satisfaction survey', 'Update knowledge base', 'Close ticket'],
          integrations: ['Survey Tool', 'Knowledge Base', 'Analytics'],
          outputs: [
            { name: 'Resolution Record', type: 'data' },
            { name: 'CSAT Score', type: 'data' }
          ]
        }
      ],
      dataSources: [
        { id: 'ds-1', name: 'Help Desk', type: 'api', icon: 'Headphones', description: 'Support ticket system' },
        { id: 'ds-2', name: 'Knowledge Base', type: 'database', icon: 'Book', description: 'Solution articles' }
      ],
      humanTouchpoints: [
        { id: 'ht-1', agentId: 'agent-2', name: 'Agent Response', type: 'input', description: 'Human agent handles complex tickets', required: false }
      ],
      estimatedComplexity: 'medium',
      estimatedBuildTime: '2-3 weeks',
      tags: ['support', 'automation', 'nlp']
    }
  }
];

export const templateCategories = [
  { id: 'all', name: 'All Templates', icon: '📋' },
  { id: 'Finance', name: 'Finance', icon: '💰' },
  { id: 'Operations', name: 'Operations', icon: '⚙️' },
  { id: 'Customer Support', name: 'Customer Support', icon: '🎧' },
  { id: 'HR', name: 'Human Resources', icon: '👥' },
  { id: 'Sales', name: 'Sales & Marketing', icon: '📈' }
];
