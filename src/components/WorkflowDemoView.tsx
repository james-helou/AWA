import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Workflow, Agent } from '../types/workflow';
import { generateAgentDashboardMockData } from '../services/mockDataGenerator';
import { EYLogo } from './EYLogo';


interface WorkflowDemoViewProps {
  workflow: Workflow;
  originalTasks: string;
  onBack: () => void;
}

// ─── Icon Components ────────────────────────────────────────────────────────
type IconProps = { className?: string };

const Activity = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);
const ArrowRight = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const Brain = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
    <path d="M9 22h6M12 17v5" />
  </svg>
);
const CheckCircle = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4 12 14.01l-3-3" />
  </svg>
);
const Clock = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
  </svg>
);
const Bell = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const Filter = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const RefreshCw = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);
const Send = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const Download = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const Eye = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const Shield = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const Zap = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const TrendingUp = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);
const BarChart = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);
const XCircle = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);
const ChevronLeft = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

// ─── Color Map ──────────────────────────────────────────────────────────────
const agentColors: Record<string, {
  bg: string; text: string; light: string; border: string;
  gradientFrom: string; gradientTo: string;
}> = {
  blue:   { bg: 'bg-blue-600',   text: 'text-blue-600',   light: 'bg-blue-50',   border: 'border-blue-200',   gradientFrom: 'from-blue-50',   gradientTo: 'to-blue-100' },
  purple: { bg: 'bg-purple-600', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-200', gradientFrom: 'from-purple-50', gradientTo: 'to-purple-100' },
  green:  { bg: 'bg-green-600',  text: 'text-green-600',  light: 'bg-green-50',  border: 'border-green-200',  gradientFrom: 'from-green-50',  gradientTo: 'to-green-100' },
  amber:  { bg: 'bg-amber-600',  text: 'text-amber-600',  light: 'bg-amber-50',  border: 'border-amber-200',  gradientFrom: 'from-amber-50',  gradientTo: 'to-amber-100' },
  red:    { bg: 'bg-red-600',    text: 'text-red-600',    light: 'bg-red-50',    border: 'border-red-200',    gradientFrom: 'from-red-50',    gradientTo: 'to-red-100' },
  indigo: { bg: 'bg-indigo-600', text: 'text-indigo-600', light: 'bg-indigo-50', border: 'border-indigo-200', gradientFrom: 'from-indigo-50', gradientTo: 'to-indigo-100' },
  pink:   { bg: 'bg-pink-600',   text: 'text-pink-600',   light: 'bg-pink-50',   border: 'border-pink-200',   gradientFrom: 'from-pink-50',   gradientTo: 'to-pink-100' },
  cyan:   { bg: 'bg-cyan-600',   text: 'text-cyan-600',   light: 'bg-cyan-50',   border: 'border-cyan-200',   gradientFrom: 'from-cyan-50',   gradientTo: 'to-cyan-100' },
};

function getColor(c: string) {
  return agentColors[c] || agentColors.blue;
}

// ─── Mock Data Helpers ──────────────────────────────────────────────────────
const firstNames = ['Sarah', 'Mike', 'Emily', 'James', 'Lisa', 'David', 'Rachel', 'Tom', 'Anna', 'Chris', 'Maria', 'John', 'Jessica', 'Robert', 'Michelle', 'Carlos', 'Amanda', 'Kevin', 'Nicole', 'Brandon', 'Stephanie', 'Ryan', 'Jennifer', 'Daniel', 'Laura', 'Andrew', 'Samantha', 'Eric', 'Ashley', 'Jason'];
const lastNames = ['Chen', 'Rodriguez', 'Watson', 'Park', 'Thompson', 'Kim', 'Adams', 'Martinez', 'Petrov', "O'Brien", 'Singh', 'Johnson', 'Williams', 'Lee', 'Garcia', 'Patel', 'Taylor', 'Anderson', 'Wilson', 'Moore', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Lopez', 'Gonzalez', 'Clark', 'Lewis', 'Walker'];
const companyNames = ['Acme Corp', 'Vertex Industries', 'Pinnacle Group', 'Horizon Ltd', 'Atlas Partners', 'Summit Holdings', 'Nexus Systems', 'Catalyst Inc', 'Zenith Co', 'Quantum Tech', 'Phoenix Solutions', 'Titan Enterprises', 'Stellar Corp', 'Vanguard Inc', 'Meridian Group'];
const departments = ['Operations', 'Finance', 'Engineering', 'Marketing', 'Sales', 'HR', 'Legal', 'Compliance', 'Product', 'Support'];

// Seeded random for deterministic data generation
let seed = 12345;
function seededRandom() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}
function resetSeed(agentId: string, rowIndex: number) {
  // Create deterministic seed from agent ID and row index
  let hash = 0;
  for (let i = 0; i < agentId.length; i++) {
    hash = ((hash << 5) - hash) + agentId.charCodeAt(i);
    hash = hash & hash;
  }
  seed = Math.abs(hash + rowIndex * 1000);
}

function pickRandom<T>(arr: T[]): T { return arr[Math.floor(seededRandom() * arr.length)]; }
function randBetween(a: number, b: number) { return Math.floor(seededRandom() * (b - a + 1)) + a; }
function randomId(prefix: string, i: number) { return `${prefix}-${String(i + 1).padStart(3, '0')}`; }
function generateRandomName() { return `${pickRandom(firstNames)} ${pickRandom(lastNames)}`; }

interface MockRow { id: string; [key: string]: string | number; }

interface AgentMockData {
  metrics: { label: string; value: string; subtext: string; color: string }[];
  tableTitle: string;
  tableSubtitle: string;
  columns: { key: string; label: string }[];
  rows: MockRow[];
  processingSteps: { label: string; detail: string; done: boolean }[];
  uiType?: string;
  activityFeed?: Array<{ id: string; type: string; message: string; time: string; user?: string; metadata?: any }>;
}

// Generate realistic mock data entirely in TypeScript (no AI calls)
// This builds everything directly from the agent's own actions, name, and integrations
// so each agent's preview is unique and contextual.
function generateRealisticMockData(
  agent: Agent,
  _columns: { key: string; label: string }[],
  workflowContext: string,
  stepIndex: number
): AgentMockData {
  resetSeed(agent.id, 0);
  const numRows = randBetween(5, 7);

  // ── Build columns directly from agent actions ──
  // First column: contextual ID based on agent name
  const agentWords = agent.name.replace(/agent/gi, '').trim().split(/\s+/);
  const idPrefix = agentWords[0]?.substring(0, 3).toUpperCase() || 'ITM';
  const idLabel = agentWords.length > 0 ? `${agentWords[0]} ID` : 'Item ID';

  const columns: { key: string; label: string }[] = [
    { key: 'item_id', label: idLabel },
  ];

  // Derive 3-4 middle columns from the agent's actions
  // Take the first 3 unique "meaningful" actions and create columns for them
  const actionColumns: { key: string; label: string; values: string[] }[] = [];

  for (const action of agent.actions.slice(0, 4)) {
    const lower = action.toLowerCase();

    // Skip generic words, try to extract the meaningful noun/verb
    if (lower.includes('reconcil') || lower.includes('match') || lower.includes('compare')) {
      actionColumns.push({ key: 'match_result', label: 'Match Result', values: ['Matched', 'Partial Match', 'Unmatched', 'Auto-Reconciled', 'Exception'] });
    } else if (lower.includes('update') && (lower.includes('system') || lower.includes('front office') || lower.includes('record'))) {
      const system = lower.includes('front office') ? 'Front Office' : lower.includes('gl') ? 'GL' : lower.includes('book') ? 'Books & Records' : 'System';
      actionColumns.push({ key: 'target_system', label: 'Target System', values: [system, 'PMS', 'OMS', 'Data Warehouse', 'Client Portal', 'Core Banking'] });
      actionColumns.push({ key: 'update_status', label: 'Update Status', values: ['Synced', 'Pending Sync', 'Sync Error', 'Queued', 'Verified'] });
    } else if (lower.includes('transfer') || lower.includes('move') || lower.includes('cash')) {
      actionColumns.push({ key: 'amount', label: 'Amount', values: ['$1,250,000', '$842,750', '$3,100,000', '$475,320', '$2,680,000', '$156,800', '$5,420,100'] });
      actionColumns.push({ key: 'destination', label: 'Destination', values: ['Pooled Bank Acct', 'Client Trust', 'Operating Account', 'Settlement Acct', 'Custodian', 'Wire Transfer'] });
    } else if (lower.includes('setup') || lower.includes('open') || lower.includes('create')) {
      const type = lower.includes('sub account') || lower.includes('sub-account') ? 'Sub-Account' :
                   lower.includes('managed') ? 'Managed Account' :
                   lower.includes('brokerage') ? 'Brokerage' :
                   lower.includes('fiduciary') ? 'Fiduciary' : 'Account';
      actionColumns.push({ key: 'account_type', label: 'Account Type', values: [type, 'Brokerage/Specialty', 'Specialty/Institutional', 'Managed Brokerage', 'Fiduciary Trust', 'Advisory'] });
      actionColumns.push({ key: 'client_name', label: 'Client', values: firstNames.slice(0, 7).map((f, i) => `${f} ${lastNames[i]}`) });
    } else if (lower.includes('advise') || lower.includes('notify') || lower.includes('inform') || lower.includes('alert')) {
      actionColumns.push({ key: 'recipient', label: 'Recipient', values: firstNames.slice(0, 7).map((f, i) => `${f} ${lastNames[i]}`) });
      actionColumns.push({ key: 'notification_type', label: 'Notification', values: ['Cash Available', 'Transfer Complete', 'Action Required', 'Approval Needed', 'Status Update', 'Confirmation'] });
    } else if (lower.includes('implement') || lower.includes('execute') || lower.includes('proposal')) {
      actionColumns.push({ key: 'proposal', label: 'Proposal/Order', values: ['Growth Rebalance', 'Income Allocation', 'Tax Harvest', 'New Investment', 'Sector Rotation', 'Risk Reduction'] });
      actionColumns.push({ key: 'value', label: 'Value', values: ['$2.5M', '$1.8M', '$750K', '$3.2M', '$4.1M', '$920K', '$5.6M'] });
    } else if (lower.includes('report') || lower.includes('perform') || lower.includes('generate')) {
      actionColumns.push({ key: 'report_type', label: 'Report', values: ['Performance', 'Holdings', 'Cash Flow', 'Tax Summary', 'Fee Report', 'Risk Analysis', 'Compliance'] });
      actionColumns.push({ key: 'period', label: 'Period', values: ['Jan 2026', 'Q4 2025', 'FY 2025', 'Feb 2026', 'YTD 2026', 'Monthly', 'Quarterly'] });
    } else if (lower.includes('refer') || lower.includes('escalat') || lower.includes('missing')) {
      actionColumns.push({ key: 'referred_to', label: 'Referred To', values: ['Front Office', 'Banker', 'Compliance', 'Operations Manager', 'Senior Advisor', 'Legal'] });
      actionColumns.push({ key: 'reason', label: 'Reason', values: ['Missing Info', 'Needs Approval', 'Exception', 'Manual Review', 'Documentation Gap', 'Policy Check'] });
    } else if (lower.includes('enter') || lower.includes('order') || lower.includes('trade')) {
      actionColumns.push({ key: 'order_type', label: 'Order Type', values: ['Buy', 'Sell', 'Rebalance', 'Transfer In', 'Transfer Out', 'Exchange'] });
      actionColumns.push({ key: 'security', label: 'Security', values: ['AAPL', 'MSFT', 'GOOGL', 'US Treasury 10Y', 'SPY ETF', 'BND ETF', 'VTI ETF'] });
      actionColumns.push({ key: 'quantity', label: 'Quantity', values: ['500 shares', '1,200 shares', '300 units', '750 shares', '$2M par', '2,500 shares', '800 shares'] });
    } else if (lower.includes('validate') || lower.includes('verify') || lower.includes('check')) {
      actionColumns.push({ key: 'check_result', label: 'Result', values: ['Passed', 'Failed', 'Warning', 'Passed', 'Passed', 'Needs Review'] });
      actionColumns.push({ key: 'details', label: 'Details', values: ['All fields valid', '2 discrepancies', 'Amount mismatch', 'Clean', 'Verified', 'Missing signature'] });
    } else {
      // For any other action, create a column showing the action as a task
      const shortLabel = action.length > 25 ? action.substring(0, 22) + '...' : action;
      const key = `action_${actionColumns.length}`;
      if (!actionColumns.some(c => c.key === key)) {
        actionColumns.push({ key, label: shortLabel, values: ['Complete', 'In Progress', 'Pending', 'Complete', 'Complete', 'Queued'] });
      }
    }
  }

  // Deduplicate columns by key and take up to 4
  const seenKeys = new Set(['item_id', 'status']);
  const uniqueActionCols = actionColumns.filter(c => {
    if (seenKeys.has(c.key)) return false;
    seenKeys.add(c.key);
    return true;
  }).slice(0, 4);

  columns.push(...uniqueActionCols.map(c => ({ key: c.key, label: c.label })));

  // Add integrations as a column if present
  if (agent.integrations.length > 0 && columns.length < 6) {
    columns.push({ key: 'system', label: 'System', });
  }

  columns.push({ key: 'status', label: 'Status' });

  // ── Generate rows ──
  const rows: MockRow[] = [];
  const statusOptions = ['Complete', 'In Progress', 'Pending', 'Complete', 'Complete', 'Processing', 'Complete'];

  for (let i = 0; i < numRows; i++) {
    resetSeed(agent.id, i);
    const row: MockRow = {
      id: `${idPrefix}-${String(i + 1).padStart(3, '0')}`,
      item_id: `${idPrefix}-${String(i + 1).padStart(3, '0')}`,
    };

    // Fill action-derived columns
    uniqueActionCols.forEach(col => {
      row[col.key] = pickRandom(col.values);
    });

    // Fill integration column
    if (agent.integrations.length > 0 && columns.some(c => c.key === 'system')) {
      row['system'] = pickRandom(agent.integrations);
    }

    // Status
    row['status'] = pickRandom(statusOptions);
    row['_statusColor'] = row['status'] === 'Complete' ? 'green'
      : row['status'] === 'Pending' ? 'amber'
      : row['status'] === 'Processing' || row['status'] === 'In Progress' ? 'blue'
      : 'green';

    rows.push(row);
  }

  // ── Screen title from agent name ──
  const screenTitle = `${agent.name} Dashboard`;
  const screenSubtitle = agent.description;

  // ── Metrics derived from agent context ──
  const completedCount = rows.filter(r => r['status'] === 'Complete').length;
  const pendingCount = rows.filter(r => r['status'] === 'Pending').length;
  const inProgressCount = rows.length - completedCount - pendingCount;

  const metrics = [
    { label: 'Total', value: String(rows.length * randBetween(3, 8)), subtext: 'today', color: 'blue' },
    { label: 'Completed', value: String(completedCount * randBetween(2, 5)), subtext: `${Math.round((completedCount / rows.length) * 100)}% success`, color: 'green' },
    { label: 'In Progress', value: String(inProgressCount + randBetween(1, 3)), subtext: 'active now', color: 'amber' },
  ];
  if (pendingCount > 0) {
    metrics.push({ label: 'Pending Review', value: String(pendingCount + randBetween(0, 2)), subtext: 'needs attention', color: 'red' });
  }

  // ── Activity feed from agent actions ──
  const times = ['2 min ago', '5 min ago', '12 min ago', '25 min ago', '1 hour ago'];
  const activityFeed = agent.actions.slice(0, 5).map((action, i) => {
    const row = rows[i % rows.length];
    return {
      id: String(i),
      type: i === 0 ? 'success' as string : i === 2 ? 'warning' as string : 'info' as string,
      message: `${action} — ${row.item_id} (${row.status})`,
      time: times[i] || times[times.length - 1],
      user: pickRandom([...firstNames.slice(0, 5)]) + ' ' + pickRandom([...lastNames.slice(0, 5)]),
    };
  });

  return {
    metrics,
    tableTitle: screenTitle,
    tableSubtitle: screenSubtitle,
    columns,
    rows,
    uiType: 'table',
    activityFeed,
    processingSteps: agent.actions.map((a, i) => ({
      label: a,
      detail: i < agent.actions.length - 1 ? 'Completed' : 'In progress...',
      done: i < agent.actions.length - 1,
    })),
  };
}

// ─── Domain detection for context-aware fallback ─────────────────────────

type DomainProfile = {
  domain: string;
  idLabel: string;
  columns: { key: string; label: string }[];
  sampleIds: string[];
  sampleValues: Record<string, string[]>;
  metrics: { label: string; value: string; subtext: string; color: string }[];
  activityTemplates: string[];
  screenTitle: string;
  screenSubtitle: string;
};

const DOMAIN_PROFILES: DomainProfile[] = [
  {
    domain: 'finance',
    idLabel: 'Transaction ID',
    columns: [
      { key: 'item_id', label: 'Transaction ID' },
      { key: 'account', label: 'Account' },
      { key: 'amount', label: 'Amount' },
      { key: 'counterparty', label: 'Counterparty' },
      { key: 'date', label: 'Date' },
      { key: 'status', label: 'Status' },
    ],
    sampleIds: ['TXN-001', 'TXN-002', 'TXN-003', 'TXN-004', 'TXN-005', 'TXN-006', 'TXN-007'],
    sampleValues: {
      account: ['GL-1001 Operating', 'GL-2040 Payables', 'GL-3010 Revenue', 'GL-1500 Cash Pool', 'GL-4020 Securities', 'GL-2060 Liabilities', 'GL-5010 Equity'],
      amount: ['$1,250,000.00', '$842,750.50', '$3,100,000.00', '$475,320.75', '$2,680,000.00', '$156,800.25', '$5,420,100.00'],
      counterparty: ['Goldman Sachs', 'JP Morgan', 'State Street', 'BNY Mellon', 'Northern Trust', 'Charles Schwab', 'Fidelity'],
      date: ['Feb 12, 2026', 'Feb 11, 2026', 'Feb 10, 2026', 'Feb 09, 2026', 'Feb 08, 2026', 'Feb 07, 2026', 'Feb 12, 2026'],
    },
    metrics: [
      { label: 'Total Volume', value: '$14.2M', subtext: 'today', color: 'blue' },
      { label: 'Reconciled', value: '94%', subtext: 'matched', color: 'green' },
      { label: 'Exceptions', value: '12', subtext: 'pending review', color: 'amber' },
      { label: 'Failed', value: '3', subtext: 'unmatched', color: 'red' },
    ],
    activityTemplates: [
      'Reconciled {id} — {account} matched with {counterparty}',
      'Exception flagged on {id}: amount mismatch of {amount}',
      'Auto-matched {id} to {counterparty} ledger entry',
      'Cash transfer {id} confirmed for {amount}',
      'GL posting completed for {id} — {account}',
    ],
    screenTitle: 'Financial Operations Dashboard',
    screenSubtitle: 'Real-time transaction processing and reconciliation',
  },
  {
    domain: 'investment',
    idLabel: 'Order ID',
    columns: [
      { key: 'item_id', label: 'Order ID' },
      { key: 'client', label: 'Client' },
      { key: 'asset_class', label: 'Asset Class' },
      { key: 'amount', label: 'Amount' },
      { key: 'portfolio', label: 'Portfolio' },
      { key: 'status', label: 'Status' },
    ],
    sampleIds: ['ORD-001', 'ORD-002', 'ORD-003', 'ORD-004', 'ORD-005', 'ORD-006', 'ORD-007'],
    sampleValues: {
      client: ['Hargrove Family Trust', 'Meridian Pension Fund', 'Atlas Foundation', 'Chen Family Office', 'Vanguard Endowment', 'Sterling Partners', 'Pacific Holdings'],
      asset_class: ['US Equities', 'Fixed Income', 'Real Estate', 'Private Equity', 'Commodities', 'Int\'l Equities', 'Alternatives'],
      amount: ['$2,500,000', '$5,100,000', '$750,000', '$3,200,000', '$1,800,000', '$4,600,000', '$920,000'],
      portfolio: ['Growth Aggressive', 'Conservative Income', 'Balanced Moderate', 'Tax-Efficient', 'ESG Focus', 'High Yield', 'Capital Preservation'],
    },
    metrics: [
      { label: 'AUM Managed', value: '$2.4B', subtext: 'total', color: 'blue' },
      { label: 'Orders Executed', value: '47', subtext: 'today', color: 'green' },
      { label: 'Pending Allocation', value: '8', subtext: 'awaiting', color: 'amber' },
      { label: 'Proposals', value: '12', subtext: 'in review', color: 'purple' },
    ],
    activityTemplates: [
      'Investment proposal for {client} approved — {asset_class} allocation',
      'Order {id} executed: {amount} into {portfolio}',
      'Rebalance triggered for {client} — {asset_class} drift detected',
      'Cash available for {client}: {amount} ready for deployment',
      'Portfolio review completed for {client} — {portfolio}',
    ],
    screenTitle: 'Investment Management Dashboard',
    screenSubtitle: 'Portfolio allocation, orders, and client management',
  },
  {
    domain: 'account',
    idLabel: 'Account ID',
    columns: [
      { key: 'item_id', label: 'Account ID' },
      { key: 'client_name', label: 'Client Name' },
      { key: 'account_type', label: 'Account Type' },
      { key: 'custodian', label: 'Custodian' },
      { key: 'opened_date', label: 'Opened' },
      { key: 'status', label: 'Status' },
    ],
    sampleIds: ['ACCT-001', 'ACCT-002', 'ACCT-003', 'ACCT-004', 'ACCT-005', 'ACCT-006', 'ACCT-007'],
    sampleValues: {
      client_name: ['William Hargrove', 'Sophia Chen', 'Marcus Williams', 'Elena Petrov', 'James O\'Brien', 'Amira Hassan', 'Carlos Mendez'],
      account_type: ['Managed Brokerage', 'Sub-Account Fiduciary', 'Specialty/Institutional', 'Brokerage/Specialty', 'Trust Account', 'Retirement IRA', 'Advisory Account'],
      custodian: ['Schwab', 'Fidelity', 'Pershing', 'TD Ameritrade', 'BNY Mellon', 'State Street', 'Northern Trust'],
      opened_date: ['Feb 12, 2026', 'Feb 11, 2026', 'Feb 10, 2026', 'Feb 08, 2026', 'Feb 07, 2026', 'Feb 05, 2026', 'Feb 03, 2026'],
    },
    metrics: [
      { label: 'Accounts Opened', value: '23', subtext: 'this week', color: 'blue' },
      { label: 'Setup Complete', value: '18', subtext: '78% done', color: 'green' },
      { label: 'Pending Info', value: '5', subtext: 'missing docs', color: 'amber' },
      { label: 'Escalated', value: '2', subtext: 'to front office', color: 'red' },
    ],
    activityTemplates: [
      'Account {id} opened for {client_name} — {account_type}',
      'Setup complete: {id} at {custodian} for {client_name}',
      'Pending documentation for {id} — referred to front office',
      'Sub-account created: {account_type} under {client_name}',
      'Custodian transfer initiated for {id} to {custodian}',
    ],
    screenTitle: 'Account Setup Dashboard',
    screenSubtitle: 'New account onboarding and configuration',
  },
  {
    domain: 'compliance',
    idLabel: 'Case ID',
    columns: [
      { key: 'item_id', label: 'Case ID' },
      { key: 'entity', label: 'Entity' },
      { key: 'check_type', label: 'Check Type' },
      { key: 'risk_score', label: 'Risk Score' },
      { key: 'assigned_to', label: 'Assigned To' },
      { key: 'status', label: 'Status' },
    ],
    sampleIds: ['CMP-001', 'CMP-002', 'CMP-003', 'CMP-004', 'CMP-005', 'CMP-006', 'CMP-007'],
    sampleValues: {
      entity: ['Acme Holdings', 'Vertex Capital', 'Pinnacle Trust', 'Horizon Fund', 'Atlas Insurance', 'Summit Partners', 'Zenith Corp'],
      check_type: ['KYC Review', 'AML Screening', 'Sanctions Check', 'Regulatory Filing', 'Risk Assessment', 'Audit Trail', 'Policy Review'],
      risk_score: ['Low (12)', 'Medium (45)', 'Low (8)', 'High (78)', 'Medium (52)', 'Low (15)', 'High (85)'],
      assigned_to: ['Emily Watson', 'Michael Chen', 'Sarah Lopez', 'David Kim', 'Rachel Adams', 'James Park', 'Lisa Zhang'],
    },
    metrics: [
      { label: 'Cases Open', value: '34', subtext: 'active', color: 'blue' },
      { label: 'Cleared', value: '28', subtext: 'this week', color: 'green' },
      { label: 'High Risk', value: '4', subtext: 'escalated', color: 'red' },
      { label: 'Pending Review', value: '6', subtext: 'in queue', color: 'amber' },
    ],
    activityTemplates: [
      'KYC review completed for {entity} — risk score: {risk_score}',
      'AML screening cleared: {id} — {entity}',
      'High-risk alert on {id}: {entity} flagged for {check_type}',
      'Case {id} assigned to {assigned_to} for {check_type}',
      'Regulatory filing submitted for {entity} — auto-verified',
    ],
    screenTitle: 'Compliance & Risk Dashboard',
    screenSubtitle: 'Regulatory checks, screening, and case management',
  },
  {
    domain: 'reporting',
    idLabel: 'Report ID',
    columns: [
      { key: 'item_id', label: 'Report ID' },
      { key: 'report_name', label: 'Report Name' },
      { key: 'client', label: 'Client' },
      { key: 'period', label: 'Period' },
      { key: 'delivered_via', label: 'Delivered Via' },
      { key: 'status', label: 'Status' },
    ],
    sampleIds: ['RPT-001', 'RPT-002', 'RPT-003', 'RPT-004', 'RPT-005', 'RPT-006', 'RPT-007'],
    sampleValues: {
      report_name: ['Monthly Performance', 'Quarterly Holdings', 'Tax Lot Report', 'Fee Summary', 'Risk Analysis', 'Cash Flow Statement', 'Gain/Loss Report'],
      client: ['Hargrove Trust', 'Chen Family Office', 'Meridian Pension', 'Atlas Foundation', 'Sterling Partners', 'Pacific Holdings', 'Vanguard Endowment'],
      period: ['Jan 2026', 'Q4 2025', 'FY 2025', 'Jan 2026', 'Q4 2025', 'Feb 2026', 'Jan 2026'],
      delivered_via: ['Client Portal', 'Email', 'SFTP', 'Client Portal', 'PDF/Email', 'API', 'Client Portal'],
    },
    metrics: [
      { label: 'Reports Generated', value: '156', subtext: 'this month', color: 'blue' },
      { label: 'Delivered', value: '142', subtext: '91% on time', color: 'green' },
      { label: 'In Progress', value: '9', subtext: 'generating', color: 'amber' },
      { label: 'Exceptions', value: '5', subtext: 'data issues', color: 'red' },
    ],
    activityTemplates: [
      'Report {id} generated: {report_name} for {client}',
      'Delivered {report_name} to {client} via {delivered_via}',
      'Data exception in {id} — {report_name} for {client}',
      'Quarterly report batch started: {period}',
      'Client {client} accessed {report_name} on portal',
    ],
    screenTitle: 'Client Reporting Dashboard',
    screenSubtitle: 'Report generation, delivery, and tracking',
  },
  {
    domain: 'operations',
    idLabel: 'Task ID',
    columns: [
      { key: 'item_id', label: 'Task ID' },
      { key: 'task_name', label: 'Task' },
      { key: 'assigned_to', label: 'Assigned To' },
      { key: 'priority', label: 'Priority' },
      { key: 'due_date', label: 'Due Date' },
      { key: 'status', label: 'Status' },
    ],
    sampleIds: ['TSK-001', 'TSK-002', 'TSK-003', 'TSK-004', 'TSK-005', 'TSK-006', 'TSK-007'],
    sampleValues: {
      task_name: ['Update front office system', 'Process cash transfer', 'Reconcile GL entries', 'File regulatory report', 'Review exception queue', 'Update client records', 'Execute trade orders'],
      assigned_to: ['Emily Watson', 'Michael Chen', 'Sarah Lopez', 'David Kim', 'Rachel Adams', 'James Park', 'Lisa Zhang'],
      priority: ['High', 'Medium', 'High', 'Low', 'Medium', 'High', 'Medium'],
      due_date: ['Feb 12, 2026', 'Feb 12, 2026', 'Feb 13, 2026', 'Feb 14, 2026', 'Feb 12, 2026', 'Feb 13, 2026', 'Feb 12, 2026'],
    },
    metrics: [
      { label: 'Tasks Today', value: '42', subtext: 'total queue', color: 'blue' },
      { label: 'Completed', value: '35', subtext: '83% done', color: 'green' },
      { label: 'In Progress', value: '5', subtext: 'active', color: 'amber' },
      { label: 'Blocked', value: '2', subtext: 'needs attention', color: 'red' },
    ],
    activityTemplates: [
      'Task {id} completed: {task_name} by {assigned_to}',
      'New task assigned: {task_name} to {assigned_to} — {priority} priority',
      'Task {id} escalated: {task_name} — overdue',
      'Batch of {task_name} tasks processed automatically',
      'SLA met for {id}: {task_name} completed on time',
    ],
    screenTitle: 'Operations Dashboard',
    screenSubtitle: 'Task management, processing, and workflow status',
  },
];

/** Keywords that map to each domain */
const DOMAIN_KEYWORDS: Record<string, string[]> = {
  finance: ['reconcil', 'ledger', 'gl', 'general ledger', 'books and records', 'journal', 'posting', 'cash', 'transfer', 'bank', 'treasury', 'payment', 'settlement', 'clearing', 'pooled'],
  investment: ['invest', 'portfolio', 'proposal', 'allocation', 'rebalanc', 'equity', 'fixed income', 'securities', 'asset', 'fund', 'aum', 'order', 'trade', 'execute order', 'brokerage'],
  account: ['account', 'setup', 'sub account', 'sub-account', 'onboard', 'fiduciary', 'custod', 'managed account', 'open account', 'new account'],
  compliance: ['compliance', 'regulat', 'kyc', 'aml', 'sanctions', 'risk', 'audit', 'policy', 'screening'],
  reporting: ['report', 'performance', 'statement', 'client report', 'quarterly', 'tax lot', 'fee summary', 'deliver'],
  operations: ['front office', 'back office', 'process', 'workflow', 'operations', 'system update', 'servicer', 'advise client', 'refer back'],
};

/**
 * Detect the best-matching domain profile from agent context.
 * Scores each domain by keyword hits across the agent name, description, actions, and integrations.
 */
function detectDomainProfile(agent: Agent): DomainProfile {
  const blob = [
    agent.name,
    agent.description,
    ...agent.actions,
    ...agent.integrations,
    ...(agent.outputs || []).map(o => o.name),
  ].join(' ').toLowerCase();

  let bestDomain = 'operations'; // default
  let bestScore = 0;

  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (blob.includes(kw)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestDomain = domain;
    }
  }

  return DOMAIN_PROFILES.find(p => p.domain === bestDomain) || DOMAIN_PROFILES[DOMAIN_PROFILES.length - 1];
}

// Determine columns based on agent tasks
function determineColumnsFromTasks(actions: string[], agent?: Agent): { key: string; label: string }[] {
  const columns: { key: string; label: string }[] = [];
  
  // Always include item identifier as first column
  columns.push({ key: 'item_id', label: 'Item ID' });
  
  // Analyze each action and add appropriate columns
  let matchedSpecific = false;
  actions.forEach(action => {
    const a = action.toLowerCase();
    
    if (a.includes('extract') || a.includes('parse')) {
      matchedSpecific = true;
      if (a.includes('email')) columns.push({ key: 'extracted_email', label: 'Extracted Email' });
      if (a.includes('phone')) columns.push({ key: 'extracted_phone', label: 'Extracted Phone' });
      if (a.includes('address')) columns.push({ key: 'extracted_address', label: 'Extracted Address' });
      if (a.includes('age')) columns.push({ key: 'extracted_age', label: 'Age' });
      if (a.includes('height')) columns.push({ key: 'extracted_height', label: 'Height' });
      if (a.includes('weight')) columns.push({ key: 'extracted_weight', label: 'Weight' });
      if (a.includes('name') && !a.includes('rename')) columns.push({ key: 'extracted_name', label: 'Name' });
      if (!columns.some(c => c.key === 'confidence')) {
        columns.push({ key: 'confidence', label: 'Confidence' });
      }
    } else if (a.includes('validate') || a.includes('check') || a.includes('verify') || a.includes('enrich')) {
      matchedSpecific = true;
      columns.push({ key: 'validation_status', label: 'Validation Status' });
      columns.push({ key: 'errors_found', label: 'Errors Found' });
    } else if (a.includes('categorize') || a.includes('classify')) {
      matchedSpecific = true;
      columns.push({ key: 'category', label: 'Category' });
      columns.push({ key: 'confidence_pct', label: 'Confidence %' });
    } else if (a.includes('approve') || a.includes('review') || a.includes('decision') || a.includes('deny')) {
      matchedSpecific = true;
      columns.push({ key: 'decision', label: 'Decision' });
      columns.push({ key: 'reviewer', label: 'Reviewer' });
      columns.push({ key: 'reviewed_date', label: 'Review Date' });
    } else if (a.includes('calculate') || a.includes('score')) {
      matchedSpecific = true;
      columns.push({ key: 'calculated_score', label: 'Score' });
      columns.push({ key: 'risk_level', label: 'Risk Level' });
    } else if (a.includes('route') || a.includes('send') || a.includes('forward') || a.includes('notify')) {
      matchedSpecific = true;
      columns.push({ key: 'destination', label: 'Sent To' });
      columns.push({ key: 'delivery_status', label: 'Delivery Status' });
      columns.push({ key: 'sent_date', label: 'Sent Date' });
    } else if (a.includes('intake') || a.includes('ingest') || a.includes('receive') || a.includes('normalize')) {
      matchedSpecific = true;
      columns.push({ key: 'applicant_name', label: 'Applicant Name' });
      columns.push({ key: 'submitted_by', label: 'Submitted By' });
      columns.push({ key: 'document', label: 'Document' });
    }
  });
  
  // If no specific keyword matched, use domain profile columns
  if (!matchedSpecific && agent) {
    const profile = detectDomainProfile(agent);
    return profile.columns;
  }
  
  if (!columns.some(c => c.key === 'status')) {
    columns.push({ key: 'status', label: 'Status' });
  }
  
  const uniqueColumns = columns.filter((col, index, self) =>
    index === self.findIndex(c => c.key === col.key)
  );
  
  return uniqueColumns;
}

// Generate mock data for an agent – tries LLM first, falls back to deterministic
async function generateAgentMockDataAsync(
  agent: Agent,
  workflowContext: string,
  stepIndex: number,
  totalSteps: number,
  previousAgent?: Agent,
  previousAgentData?: AgentMockData
): Promise<AgentMockData> {
  // ── Try LLM-based generation first ──
  try {
    console.log(`🤖 Calling LLM for step ${stepIndex + 1}/${totalSteps}: ${agent.name}`);

    const aiData = await generateAgentDashboardMockData(
      agent, workflowContext, stepIndex, totalSteps
    );

    const result: AgentMockData = {
      metrics: aiData.metrics || [],
      tableTitle: aiData.tableTitle || `${agent.name} Dashboard`,
      tableSubtitle: aiData.tableSubtitle || agent.description,
      columns: aiData.columns || [{ key: 'id', label: 'ID' }, { key: 'status', label: 'Status' }],
      rows: (aiData.rows || []).map((row: any, i: number) => ({
        ...row,
        id: row.id || `ITEM-${String(i + 1).padStart(3, '0')}`,
        _statusColor: row._statusColor || 'blue',
      })),
      uiType: aiData.uiType || 'table',
      activityFeed: aiData.activityFeed || [],
      processingSteps: agent.actions.map((a, i) => ({
        label: a,
        detail: i < agent.actions.length - 1 ? 'Completed' : 'In progress...',
        done: i < agent.actions.length - 1,
      })),
    };

    console.log(`✅ LLM generated ${result.rows.length} rows for "${result.tableTitle}"`);
    return result;
  } catch (llmError) {
    console.warn('⚠️ LLM mock-data failed, falling back to deterministic:', llmError);
  }

  // ── Deterministic fallback ──
  try {
    console.log(`🎯 Deterministic fallback for step ${stepIndex + 1}/${totalSteps}: ${agent.name}`);
    const columns = determineColumnsFromTasks(agent.actions, agent);
    const result = generateRealisticMockData(agent, columns, workflowContext, stepIndex);
    console.log(`   ✅ Generated ${result.rows.length} rows for "${result.tableTitle}"`);
    return result;
  } catch (error) {
    console.error('Failed to generate mock data:', error);
    
    //Fallback data
    return {
      metrics: [
        { label: 'Total Items', value: '120', subtext: 'processed', color: 'blue' },
        { label: 'Completed', value: '95%', subtext: 'success rate', color: 'green' },
      ],
      tableTitle: 'Dashboard',
      tableSubtitle: agent.description,
      columns: [{ key: 'id', label: 'ID' }, { key: 'name', label: 'Name' }, { key: 'status', label: 'Status' }],
      rows: [{ id: '001', name: generateRandomName(), status: 'Active', _statusColor: 'green' }],
      uiType: 'table',
      activityFeed: [],
      processingSteps: agent.actions.map((a, i) => ({ label: a, detail: i < agent.actions.length - 1 ? 'Done' : 'Processing...', done: i < agent.actions.length - 1 })),
    };
  }
}

// ─── Status Badge Helper ────────────────────────────────────────────────────
function StatusBadge({ status, color }: { status: string; color: string }) {
  const map: Record<string, string> = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    amber: 'bg-amber-100 text-amber-800',
    red: 'bg-red-100 text-red-800',
    purple: 'bg-purple-100 text-purple-800',
  };
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${map[color] || map.blue}`}>
      {status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
    </span>
  );
}

// ─── Agent Dashboard ────────────────────────────────────────────────────────
function AgentDashboard({ 
  agent, 
  index, 
  previousAgentData
}: { 
  agent: Agent; 
  index: number; 
  previousAgentData?: AgentMockData;
}) {
  const [selectedRow, setSelectedRow] = useState<MockRow | null>(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [reminderMessage, setReminderMessage] = useState('');
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'data' | 'activity'>('data');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [mockData, setMockData] = useState<AgentMockData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [approvalStates, setApprovalStates] = useState<Record<string, 'approved' | 'declined' | null>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Check if this agent requires human approval
  const requiresApproval = useMemo(() => {
    const actions = agent.actions.join(' ').toLowerCase();
    return actions.includes('approve') || actions.includes('review') || 
           actions.includes('confirm') || actions.includes('authorize') ||
           actions.includes('verify') && (actions.includes('manual') || actions.includes('human'));
  }, [agent.actions]);

  const handleApproval = (rowId: string, action: 'approved' | 'declined') => {
    setApprovalStates(prev => ({ ...prev, [rowId]: action }));
    // Simulate processing
    setTimeout(() => {
      // In a real app, this would trigger the next workflow step
      console.log(`${action} item ${rowId}`);
    }, 500);
  };

  // Receive pre-fetched LLM data from parent (all calls are made in WorkflowDemoView)
  useEffect(() => {
    if (previousAgentData) {
      console.log(`📦 Using LLM-generated data for step ${index + 1}: ${agent.name}`);
      setMockData(previousAgentData);
      setIsLoadingData(false);
    } else {
      // Parent hasn't finished the LLM call yet – show loading
      setIsLoadingData(true);
      setMockData(null);
    }
  }, [previousAgentData, agent.id, index]);

  const color = getColor(agent.color);

  const metricColorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
  };

  const metricIcon = (c: string) => {
    if (c === 'blue') return <BarChart className="w-4 h-4" />;
    if (c === 'green') return <CheckCircle className="w-4 h-4" />;
    if (c === 'purple') return <Zap className="w-4 h-4" />;
    if (c === 'amber') return <Clock className="w-4 h-4" />;
    if (c === 'red') return <Shield className="w-4 h-4" />;
    return <BarChart className="w-4 h-4" />;
  };

  const handleAction = (label: string) => {
    setProcessingAction(label);
    setTimeout(() => setProcessingAction(null), 2000);
  };

  // Compute status counts for filter badges
  const statusCounts = useMemo(() => {
    if (!mockData) return {};
    const counts: Record<string, number> = {};
    mockData.rows.forEach(r => {
      const s = String(r._statusColor || 'blue');
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [mockData]);

  // Filter rows by search + status
  const filteredRows = useMemo(() => {
    if (!mockData) return [];
    return mockData.rows.filter(row => {
      if (statusFilter && String(row._statusColor) !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return mockData.columns.some(col => String(row[col.key]).toLowerCase().includes(q));
      }
      return true;
    });
  }, [mockData, searchQuery, statusFilter]);

  // Stable random values for bottom stats (avoid re-roll on every render)
  const bottomStats = useMemo(() => {
    resetSeed(agent.id, 999);
    return {
      accuracy: `${randBetween(96, 99)}.${randBetween(1, 9)}%`,
      automation: `${randBetween(80, 95)}%`,
      performance: `↑ ${randBetween(10, 35)}%`,
    };
  }, [agent.id]);

  // Show loading state while data is being generated
  if (isLoadingData || !mockData) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className={`bg-gradient-to-r ${color.gradientFrom} ${color.gradientTo} rounded-xl p-6 border ${color.border}`}>
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="w-5 h-5 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
              <span className="font-medium">Loading screen...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Screen Header */}
      <div className={`bg-gradient-to-r ${color.gradientFrom} ${color.gradientTo} rounded-xl p-6 border ${color.border}`}>
        <div className="flex items-start space-x-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{mockData.tableTitle}</h3>
            {mockData.tableSubtitle && (
              <p className="text-sm text-gray-700">{mockData.tableSubtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mockData.metrics.map((metric, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{metric.label}</span>
              <div className={`p-2 rounded-lg ${metricColorMap[metric.color] || metricColorMap.blue}`}>
                {metricIcon(metric.color)}
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
            <p className={`text-xs mt-1 ${
              metric.subtext.includes('↑') || metric.subtext.includes('+')
                ? 'text-green-600' : metric.subtext.includes('↓') && metric.subtext.includes('faster')
                ? 'text-green-600' : metric.subtext.includes('↓')
                ? 'text-red-600' : 'text-gray-500'
            }`}>{metric.subtext}</p>
          </div>
        ))}
      </div>

      {/* Tabbed Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('data')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                activeTab === 'data'
                  ? `border-blue-600 text-blue-600 bg-blue-50/50`
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 {mockData.tableTitle}
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                activeTab === 'activity'
                  ? `border-blue-600 text-blue-600 bg-blue-50/50`
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              🕐 Activity Feed
            </button>
          </div>
        </div>

        {/* Data Tab */}
        {activeTab === 'data' && (
          <div>
            {/* Search / Filter / Add Toolbar */}
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={`Search ${mockData.tableTitle.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {/* Status Filter Badges */}
                {statusCounts.green && statusCounts.green > 0 && (
                  <button
                    onClick={() => setStatusFilter(statusFilter === 'green' ? null : 'green')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                      statusFilter === 'green' ? 'bg-green-600 text-white ring-2 ring-green-300' : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    ✓ Completed ({statusCounts.green})
                  </button>
                )}
                {statusCounts.amber && statusCounts.amber > 0 && (
                  <button
                    onClick={() => setStatusFilter(statusFilter === 'amber' ? null : 'amber')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                      statusFilter === 'amber' ? 'bg-amber-600 text-white ring-2 ring-amber-300' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    ⏳ Pending ({statusCounts.amber})
                  </button>
                )}
                {statusCounts.red && statusCounts.red > 0 && (
                  <button
                    onClick={() => setStatusFilter(statusFilter === 'red' ? null : 'red')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                      statusFilter === 'red' ? 'bg-red-600 text-white ring-2 ring-red-300' : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    ⚠ Critical ({statusCounts.red})
                  </button>
                )}
                {statusCounts.blue && statusCounts.blue > 0 && (
                  <button
                    onClick={() => setStatusFilter(statusFilter === 'blue' ? null : 'blue')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                      statusFilter === 'blue' ? 'bg-blue-600 text-white ring-2 ring-blue-300' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                  >
                    🆕 New ({statusCounts.blue})
                  </button>
                )}
                {statusFilter && (
                  <button
                    onClick={() => setStatusFilter(null)}
                    className="px-2 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleAction('refresh')}
                  className={`px-3 py-2 text-sm font-medium text-white rounded-lg flex items-center space-x-1.5 transition ${
                    processingAction === 'refresh' ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${processingAction === 'refresh' ? 'animate-spin' : ''}`} />
                  <span>{processingAction === 'refresh' ? 'Refreshing...' : 'Refresh'}</span>
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className={`px-3 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition ${color.bg}`}
                >
                  + Add Entry
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {mockData.columns.map(col => (
                      <th key={col.key} className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{col.label}</th>
                    ))}
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={mockData.columns.length + 1} className="px-5 py-12 text-center text-gray-400 text-sm">
                        No items match your search or filter.
                      </td>
                    </tr>
                  ) : filteredRows.map((row) => (
                    <tr
                      key={row.id as string}
                      onClick={() => setSelectedRow(row)}
                      className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                    >
                      {mockData.columns.map(col => (
                        <td key={col.key} className="px-5 py-4">
                          {col.key === 'id' ? (
                            <span className="text-sm font-semibold text-blue-600">{row[col.key]}</span>
                          ) : col.key === 'status' || col.key === 'urgency' ? (
                            <StatusBadge status={String(row[col.key])} color={String(row._statusColor || 'blue')} />
                          ) : col.key === 'confidence' ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${parseInt(String(row[col.key])) >= 90 ? 'bg-green-500' : parseInt(String(row[col.key])) >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                                  style={{ width: String(row[col.key]) }}
                                />
                              </div>
                              <span className="text-xs font-medium text-gray-600">{row[col.key]}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-800">{row[col.key]}</span>
                          )}
                        </td>
                      ))}
                      <td className="px-5 py-4">
                        {requiresApproval ? (
                          <div className="flex items-center space-x-2">
                            {approvalStates[row.id as string] === 'approved' ? (
                              <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-medium rounded-lg flex items-center space-x-1">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Approved</span>
                              </span>
                            ) : approvalStates[row.id as string] === 'declined' ? (
                              <span className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg flex items-center space-x-1">
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Declined</span>
                              </span>
                            ) : (
                              <>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleApproval(row.id as string, 'approved'); }}
                                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg flex items-center space-x-1 transition"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleApproval(row.id as string, 'declined'); }}
                                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg flex items-center space-x-1 transition"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Decline</span>
                                </button>
                              </>
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedRow(row); }}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 transition"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedRow(row); }}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 transition"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Details →</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Activity Feed Tab */}
        {activeTab === 'activity' && (
          <div>
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-600">Recent activity and updates</span>
              <button
                onClick={() => handleAction('refresh')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-1.5 transition"
              >
                <RefreshCw className={`w-4 h-4 ${processingAction === 'refresh' ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {(mockData.activityFeed || []).map((activity) => (
                <div key={activity.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                        activity.type === 'success' ? 'bg-green-100' :
                        activity.type === 'warning' ? 'bg-amber-100' :
                        activity.type === 'error' ? 'bg-red-100' :
                        'bg-blue-100'
                      }`}>
                        {activity.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                         activity.type === 'warning' ? <Bell className="w-5 h-5 text-amber-600" /> :
                         activity.type === 'error' ? <Shield className="w-5 h-5 text-red-600" /> :
                         <Zap className="w-5 h-5 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                            activity.type === 'success' ? 'bg-green-100 text-green-800' :
                            activity.type === 'warning' ? 'bg-amber-100 text-amber-800' :
                            activity.type === 'error' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {activity.type.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                        <p className="font-medium text-gray-900 text-sm">{activity.message}</p>
                        {activity.user && <p className="text-xs text-gray-500 mt-1">By: {activity.user}</p>}
                        {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {Object.entries(activity.metadata).slice(0, 3).map(([key, val]) => (
                              <span key={key} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                {key}: {String(val)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {(!mockData.activityFeed || mockData.activityFeed.length === 0) && (
                <div className="p-12 text-center text-gray-400">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={() => {
            setReminderMessage(`Reminder: You have pending items requiring attention.\n\nPlease review and take action on outstanding items at your earliest convenience.\n\nItems requiring attention: ${mockData.rows.filter(r => String(r._statusColor) === 'amber').length}\n\nThank you.`);
            setShowReminderModal(true);
          }}
          className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 flex items-center justify-center space-x-2 transition shadow-sm"
        >
          <Send className="w-5 h-5" />
          <span>Send Reminders</span>
        </button>
        <button
          onClick={() => showToast('Export is available when agents are live.')}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 flex items-center space-x-2 transition"
        >
          <Download className="w-5 h-5" />
          <span>Export</span>
        </button>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-gray-900">Accuracy</h4>
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{bottomStats.accuracy}</p>
          <p className="text-xs text-gray-500 mt-1">Overall precision rate</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-gray-900">Automation</h4>
            <Zap className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{bottomStats.automation}</p>
          <p className="text-xs text-gray-500 mt-1">Fully automated tasks</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-gray-900">Performance</h4>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{bottomStats.performance}</p>
          <p className="text-xs text-gray-500 mt-1">Improvement vs last period</p>
        </div>
      </div>

      {/* Row Detail Modal */}
      {selectedRow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedRow(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">Item Details</h2>
                <p className="text-xs text-gray-500 mt-0.5">{selectedRow.id}</p>
              </div>
              <button onClick={() => setSelectedRow(null)} className="text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg p-1 transition">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {mockData.columns.map(col => (
                  <div key={col.key} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{col.label}</p>
                    <p className="text-sm font-bold text-gray-900">{selectedRow[col.key]}</p>
                  </div>
                ))}
              </div>
              <div className={`${color.light} rounded-lg p-4 border ${color.border}`}>
                <h4 className="text-sm font-bold text-gray-900 mb-3">Processing History</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-1 rounded-full mt-0.5"><CheckCircle className="w-3.5 h-3.5 text-green-600" /></div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Received &amp; Classified</p>
                      <p className="text-xs text-gray-500">Today, {randBetween(8, 10)}:{String(randBetween(0, 59)).padStart(2, '0')} AM</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-1 rounded-full mt-0.5"><CheckCircle className="w-3.5 h-3.5 text-green-600" /></div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Processing Complete</p>
                      <p className="text-xs text-gray-500">Today, {randBetween(10, 11)}:{String(randBetween(0, 59)).padStart(2, '0')} AM</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-1 rounded-full mt-0.5"><Activity className="w-3.5 h-3.5 text-blue-600 animate-pulse" /></div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Awaiting Next Step</p>
                      <p className="text-xs text-gray-500">Pending further action</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex space-x-2">
              <button className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-1.5 transition">
                <CheckCircle className="w-4 h-4" />
                <span>Approve</span>
              </button>
              <button onClick={() => setSelectedRow(null)} className="px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-100 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Manual Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Add Manual Entry</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {mockData.columns.filter(c => c.key !== 'id').map(col => (
                <div key={col.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{col.label}</label>
                  {col.key === 'status' || col.key === 'urgency' ? (
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Select...</option>
                      {col.key === 'status'
                        ? ['New', 'Processing', 'Complete', 'Review'].map(o => <option key={o}>{o}</option>)
                        : ['Low', 'Medium', 'High'].map(o => <option key={o}>{o}</option>)
                      }
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder={`Enter ${col.label.toLowerCase()}...`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3 rounded-b-xl">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition">
                Cancel
              </button>
              <button
                onClick={() => { setShowAddModal(false); showToast('Entry added (demo only).'); }}
                className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition ${color.bg} hover:opacity-90`}
              >
                Add Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowReminderModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
              <div>
                <h2 className="text-base font-bold text-gray-900">Send Reminders</h2>
                <p className="text-xs text-gray-500 mt-0.5">Pending items notification</p>
              </div>
              <button onClick={() => setShowReminderModal(false)} className="text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg p-1 transition">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 overflow-y-auto flex-1 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Bell className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {mockData.rows.filter(r => String(r._statusColor) === 'amber').length} Reminders Suggested
                    </h3>
                    <p className="text-xs text-gray-700 mt-1">These items are pending and may require follow-up.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between rounded-t-lg">
                  <h3 className="text-sm font-bold text-gray-900">Reminder Message</h3>
                  <span className="text-xs text-gray-500">Edit before sending</span>
                </div>
                <div className="p-4">
                  <textarea
                    value={reminderMessage}
                    onChange={(e) => setReminderMessage(e.target.value)}
                    className="w-full h-40 px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono resize-none"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex space-x-2">
              <button
                onClick={() => { setShowReminderModal(false); showToast('Reminders sent (demo only).'); }}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 transition"
              >
                <Send className="w-4 h-4" />
                <span>Send Reminders</span>
              </button>
              <button onClick={() => setShowReminderModal(false)} className="px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-100 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
          <div className="bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg flex items-center space-x-2">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────


export function WorkflowDemoView({ workflow, originalTasks, onBack }: WorkflowDemoViewProps) {
  const [activeAgentIndex, setActiveAgentIndex] = useState(0);
  const [agentDataCache, setAgentDataCache] = useState<Map<string, AgentMockData>>(new Map());
  const activeAgent = workflow.agents[activeAgentIndex];

  // When the workflow changes: clear cache and kick off ALL LLM calls in parallel
  useEffect(() => {
    console.log('🔄 New workflow detected - generating mock data for all agents in parallel');
    setAgentDataCache(new Map());
    setActiveAgentIndex(0);

    let cancelled = false;

    // Fire one LLM call per agent, all in parallel
    const promises = workflow.agents.map((agent, idx) =>
      generateAgentMockDataAsync(agent, originalTasks, idx, workflow.agents.length)
        .then(data => {
          if (!cancelled) {
            console.log(`💾 Pre-fetched data for step ${idx + 1}: ${agent.name}`);
            setAgentDataCache(prev => new Map(prev).set(agent.id, data));
          }
        })
        .catch(err => {
          console.error(`❌ Pre-fetch failed for step ${idx + 1} (${agent.name}):`, err);
        })
    );

    Promise.allSettled(promises).then(() => {
      if (!cancelled) console.log('✅ All agent data pre-fetched');
    });

    return () => { cancelled = true; };
  }, [workflow.id, originalTasks]);

  // Get cached data for an agent
  const getCachedAgentData = useCallback((currentIndex: number): AgentMockData | undefined => {
    const agent = workflow.agents[currentIndex];
    return agentDataCache.get(agent.id);
  }, [agentDataCache, workflow.agents]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={onBack} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <EYLogo size={40} />
              <div>
                <h1 className="text-xl font-bold text-ey-dark">Agentic Workflow Architect</h1>
                <p className="text-sm text-gray-500">{workflow.agents.length}-Step Workflow • Live Preview</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1.5 text-xs font-bold bg-ey-yellow text-ey-dark rounded-full border border-ey-yellow-hover">
                PREVIEW MODE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Step Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center space-x-1 overflow-x-auto pb-1">
            {workflow.agents.map((agent, idx) => {
              const c = getColor(agent.color);
              const isActive = activeAgentIndex === idx;
              return (
                <React.Fragment key={agent.id}>
                  <button
                    onClick={() => setActiveAgentIndex(idx)}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? `${c.light} ${c.text} shadow-sm ring-1 ${c.border}`
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      isActive ? `${c.bg} text-white shadow-md` : 'bg-gray-200 text-gray-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-bold leading-tight">{agent.name}</p>
                      <p className="text-xs opacity-75">{agent.actions.length} actions</p>
                    </div>
                  </button>
                  {idx < workflow.agents.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-gray-300 flex-shrink-0 mx-1" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Agent Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeAgent && (
          <AgentDashboard 
            key={activeAgent.id} 
            agent={activeAgent} 
            index={activeAgentIndex} 
            previousAgentData={getCachedAgentData(activeAgentIndex)}
          />
        )}
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-6 pb-8 text-center">
        <p className="text-xs text-gray-400">
          This is a simulated preview with sample data. When built, these agents will process real data automatically.
        </p>
      </div>
    </div>
  );
}
