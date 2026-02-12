import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Workflow, Agent } from '../types/workflow';
import { generateAgentDashboardMockData } from '../services/mockDataGenerator';


interface WorkflowDemoViewProps {
  workflow: Workflow;
  originalTasks: string;
  onBack: () => void;
}

// â”€â”€â”€ Icon Components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ Color Map â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ Mock Data Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
  error?: string;
}

// Generate mock data for an agent via LLM â€” no hardcoded fallback
async function generateAgentMockDataAsync(
  agent: Agent,
  workflowContext: string,
  stepIndex: number,
  totalSteps: number,
): Promise<AgentMockData> {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`ðŸ¤– LLM call attempt ${attempt + 1}/${maxRetries} for step ${stepIndex + 1}/${totalSteps}: ${agent.name}`);

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

      console.log(`âœ… LLM generated ${result.rows.length} rows for "${result.tableTitle}"`);
      return result;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`âš ï¸ Attempt ${attempt + 1} failed for "${agent.name}":`, lastError.message);
      if (attempt < maxRetries - 1) await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }
  }

  // Return error state instead of hardcoded data
  console.error(`âŒ All ${maxRetries} LLM attempts failed for "${agent.name}"`);
  return {
    metrics: [],
    tableTitle: `${agent.name} Dashboard`,
    tableSubtitle: agent.description,
    columns: [],
    rows: [],
    uiType: 'table',
    activityFeed: [],
    processingSteps: agent.actions.map((a) => ({
      label: a,
      detail: 'Waiting...',
      done: false,
    })),
    error: `Failed to generate data: ${lastError?.message || 'Unknown error'}`,
  };
}

// â”€â”€â”€ Status Badge Helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ Agent Dashboard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      console.log(`ðŸ“¦ Using LLM-generated data for step ${index + 1}: ${agent.name}`);
      setMockData(previousAgentData);
      setIsLoadingData(false);
    } else {
      // Parent hasn't finished the LLM call yet â€“ show loading
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
      {/* What This Step Does - Simple Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-blue-900 mb-1">What this step does:</h4>
            <p className="text-sm text-blue-800">{agent.description}</p>
          </div>
        </div>
      </div>

      {/* Screen Header */}
      <div className={`bg-gradient-to-r ${color.gradientFrom} ${color.gradientTo} rounded-xl p-6 border ${color.border}`}>
        <div className="flex items-start space-x-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{mockData.tableTitle}</h3>
            {mockData.tableSubtitle && (
              <p className="text-sm text-gray-700 mb-4">{mockData.tableSubtitle}</p>
            )}
            <div className="grid grid-cols-3 gap-3">
              {mockData.metrics.slice(0, 3).map((m, i) => (
                <div key={i} className={`bg-white/80 backdrop-blur rounded-lg p-3 border ${color.border}`}>
                  <p className="text-xs text-gray-600">{m.label}</p>
                  <p className="text-xl font-bold text-gray-900">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4">
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
              metric.subtext.includes('â†‘') || metric.subtext.includes('+')
                ? 'text-green-600' : metric.subtext.includes('â†“') && metric.subtext.includes('faster')
                ? 'text-green-600' : metric.subtext.includes('â†“')
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
              ðŸ“‹ {mockData.tableTitle}
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                activeTab === 'activity'
                  ? `border-blue-600 text-blue-600 bg-blue-50/50`
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              ðŸ• Activity Feed
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
                    âœ“ Completed ({statusCounts.green})
                  </button>
                )}
                {statusCounts.amber && statusCounts.amber > 0 && (
                  <button
                    onClick={() => setStatusFilter(statusFilter === 'amber' ? null : 'amber')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                      statusFilter === 'amber' ? 'bg-amber-600 text-white ring-2 ring-amber-300' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    â³ Pending ({statusCounts.amber})
                  </button>
                )}
                {statusCounts.red && statusCounts.red > 0 && (
                  <button
                    onClick={() => setStatusFilter(statusFilter === 'red' ? null : 'red')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                      statusFilter === 'red' ? 'bg-red-600 text-white ring-2 ring-red-300' : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    âš  Critical ({statusCounts.red})
                  </button>
                )}
                {statusCounts.blue && statusCounts.blue > 0 && (
                  <button
                    onClick={() => setStatusFilter(statusFilter === 'blue' ? null : 'blue')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                      statusFilter === 'blue' ? 'bg-blue-600 text-white ring-2 ring-blue-300' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                  >
                    ðŸ†• New ({statusCounts.blue})
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
                            <span>View Details â†’</span>
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
        <button className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 flex items-center space-x-2 transition">
          <Download className="w-5 h-5" />
          <span>Export</span>
        </button>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-gray-900">Accuracy</h4>
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">97.8%</p>
          <p className="text-xs text-gray-500 mt-1">Overall precision rate</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-gray-900">Automation</h4>
            <Zap className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">89%</p>
          <p className="text-xs text-gray-500 mt-1">Fully automated tasks</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-gray-900">Performance</h4>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">24%</p>
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
                      <p className="text-xs text-gray-500">Today, 9:15 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-1 rounded-full mt-0.5"><CheckCircle className="w-3.5 h-3.5 text-green-600" /></div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Processing Complete</p>
                      <p className="text-xs text-gray-500">Today, 10:42 AM</p>
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
                onClick={() => { setShowAddModal(false); }}
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
                onClick={() => { setShowReminderModal(false); }}
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
    </div>
  );
}

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€


export function WorkflowDemoView({ workflow, originalTasks, onBack }: WorkflowDemoViewProps) {
  const [activeAgentIndex, setActiveAgentIndex] = useState(0);
  const [agentDataCache, setAgentDataCache] = useState<Map<string, AgentMockData>>(new Map());
  const activeAgent = workflow.agents[activeAgentIndex];

  // When the workflow changes: clear cache and kick off ALL LLM calls in parallel
  useEffect(() => {
    console.log('ðŸ”„ New workflow detected - generating mock data for all agents in parallel');
    setAgentDataCache(new Map());
    setActiveAgentIndex(0);

    let cancelled = false;

    // Fire one LLM call per agent, all in parallel
    const promises = workflow.agents.map((agent, idx) =>
      generateAgentMockDataAsync(agent, originalTasks, idx, workflow.agents.length)
        .then(data => {
          if (!cancelled) {
            console.log(`ðŸ’¾ Pre-fetched data for step ${idx + 1}: ${agent.name}`);
            setAgentDataCache(prev => new Map(prev).set(agent.id, data));
          }
        })
        .catch(err => {
          console.error(`âŒ Pre-fetch failed for step ${idx + 1} (${agent.name}):`, err);
        })
    );

    Promise.allSettled(promises).then(() => {
      if (!cancelled) console.log('âœ… All agent data pre-fetched');
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
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Agentic Workflow Architect</h1>
                <p className="text-sm text-gray-500">{workflow.agents.length}-Step Workflow â€¢ Live Preview</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full border border-amber-200">
                PREVIEW MODE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Step Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center space-x-1">
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
