import React, { useState } from 'react';
import { Workflow, Agent, SampleDataConfig } from '../types/workflow';

type IconProps = { className?: string };
const Brain = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" />
  </svg>
);
const Zap = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const Users = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const ArrowRight = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);
const Database = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
);
const Activity = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const Clock = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const agentColors = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'bg-blue-600', badge: 'bg-blue-100 text-blue-700', text: 'text-blue-700' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'bg-purple-600', badge: 'bg-purple-100 text-purple-700', text: 'text-purple-700' },
  green: { bg: 'bg-green-50', border: 'border-green-200', icon: 'bg-green-600', badge: 'bg-green-100 text-green-700', text: 'text-green-700' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'bg-amber-600', badge: 'bg-amber-100 text-amber-700', text: 'text-amber-700' },
  red: { bg: 'bg-red-50', border: 'border-red-200', icon: 'bg-red-600', badge: 'bg-red-100 text-red-700', text: 'text-red-700' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', icon: 'bg-indigo-600', badge: 'bg-indigo-100 text-indigo-700', text: 'text-indigo-700' },
  pink: { bg: 'bg-pink-50', border: 'border-pink-200', icon: 'bg-pink-600', badge: 'bg-pink-100 text-pink-700', text: 'text-pink-700' },
  cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', icon: 'bg-cyan-600', badge: 'bg-cyan-100 text-cyan-700', text: 'text-cyan-700' },
};

interface WorkflowRendererProps {
  workflow: Workflow;
  onBack?: () => void;
  onBuild?: () => void;
}

export function WorkflowRenderer({ workflow, onBack, onBuild }: WorkflowRendererProps) {
  const [activeAgentIndex, setActiveAgentIndex] = useState(0);
  const activeAgent = workflow.agents[activeAgentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header with Back and Build */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onBack} 
                className="group flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition px-3 py-1.5 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
                </svg>
                <span className="text-sm font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/25">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold gradient-text">{workflow.name}</h1>
                  <p className="text-sm text-gray-500">{workflow.description}</p>
                </div>
              </div>
            </div>
            <button onClick={onBuild} className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-200 ripple">
              <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Preview Live Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Original Request */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <p className="text-sm text-gray-700"><span className="font-medium text-blue-700">Your request:</span> "{workflow.originalPrompt}"</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-8">
            <StatItem icon={Brain} color="text-blue-600" bgColor="bg-blue-100" label="Agents" value={workflow.agents.length} delay={0} />
            <StatItem icon={Activity} color="text-purple-600" bgColor="bg-purple-100" label="Actions" value={workflow.agents.reduce((acc, a) => acc + a.actions.length, 0)} delay={0.1} />
            <StatItem icon={Database} color="text-green-600" bgColor="bg-green-100" label="Data Sources" value={workflow.dataSources.length} delay={0.2} />
            <StatItem icon={Users} color="text-amber-600" bgColor="bg-amber-100" label="Human Touchpoints" value={workflow.humanTouchpoints.length} delay={0.3} />
            <div className="flex-1" />
            <div className="flex items-center space-x-2 text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{workflow.estimatedBuildTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Pipeline */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Agent Pipeline</p>
          <div className="flex items-center justify-between">
            {workflow.agents.map((agent, index) => (
              <React.Fragment key={agent.id}>
                <button
                  onClick={() => setActiveAgentIndex(index)}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl border-2 transition-all duration-200 animate-fade-in-up ${
                    activeAgentIndex === index
                      ? `${agentColors[agent.color].bg} ${agentColors[agent.color].border} ${agentColors[agent.color].text} shadow-lg scale-105`
                      : 'border-transparent text-gray-600 hover:bg-gray-100 hover:scale-102'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white shadow-md transition-all ${
                    activeAgentIndex === index ? agentColors[agent.color].icon : 'bg-gray-300'
                  }`}>{agent.order}</div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">{agent.name.split(' ')[0]}</p>
                    <p className="text-xs opacity-75">{agent.type === 'human-in-loop' ? 'Human-in-Loop' : 'Automated'}</p>
                  </div>
                </button>
                {index < workflow.agents.length - 1 && (
                  <div className="flex items-center text-gray-300 animate-fade-in" style={{ animationDelay: `${index * 0.1 + 0.05}s` }}>
                    <div className="w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400"></div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <div className="w-8 h-0.5 bg-gradient-to-r from-gray-400 to-gray-300"></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Detail */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AgentDetail agent={activeAgent} workflow={workflow} />
      </div>
    </div>
  );
}

function StatItem({ icon: Icon, color, bgColor, label, value, delay }: { icon: any; color: string; bgColor: string; label: string; value: number; delay: number }) {
  return (
    <div className="flex items-center space-x-3 animate-fade-in-up" style={{ animationDelay: `${delay}s` }}>
      <div className={`p-2 ${bgColor} rounded-lg`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function AgentDetail({ agent, workflow }: { agent: Agent; workflow: Workflow }) {
  const colors = agentColors[agent.color];
  
  return (
    <div className="space-y-6 animate-fade-in" key={agent.id}>
      <div className={`${colors.bg} rounded-2xl p-6 border-2 ${colors.border} shadow-lg animate-scale-in`}>
        <div className="flex items-start space-x-4">
          <div className={`${colors.icon} p-3.5 rounded-xl shadow-lg`}>
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-900">Agent {agent.order}: {agent.name}</h3>
              <span className={`flex items-center space-x-1.5 px-3 py-1.5 ${colors.badge} rounded-full text-xs font-semibold shadow-sm`}>
                {agent.type === 'human-in-loop' ? <><Users className="w-3.5 h-3.5" /> Human-in-Loop</> : <><Zap className="w-3.5 h-3.5" /> Automated</>}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-4">{agent.description}</p>
            <div className="grid grid-cols-4 gap-4">
              <InfoCard label="Trigger" value={agent.trigger.description} colors={colors} delay={0} />
              <InfoCard label="Actions" value={agent.actions.join(', ')} colors={colors} delay={0.1} />
              <InfoCard label="Integrations" value={agent.integrations.join(', ') || 'None'} colors={colors} delay={0.2} />
              <InfoCard label="Outputs" value={agent.outputs.map(o => o.name).join(', ')} colors={colors} delay={0.3} />
            </div>
          </div>
        </div>
      </div>

      {workflow.humanTouchpoints.filter(ht => ht.agentId === agent.id).length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <div className="p-2 bg-amber-100 rounded-lg mr-2">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            Human Touchpoints
          </h4>
          <div className="space-y-3">
            {workflow.humanTouchpoints.filter(ht => ht.agentId === agent.id).map((ht, idx) => (
              <div key={ht.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200 hover:shadow-md transition-shadow animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{ht.name}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{ht.description}</p>
                </div>
                <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${ht.required ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                  {ht.required ? 'Required' : 'Optional'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {agent.sampleData && <SampleDataPreview config={agent.sampleData} />}

      {agent.order === 1 && workflow.dataSources.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-2">
              <Database className="w-5 h-5 text-green-600" />
            </div>
            Data Sources
          </h4>
          <div className="grid grid-cols-4 gap-4">
            {workflow.dataSources.map((ds, idx) => (
              <div key={ds.id} className="p-4 bg-gradient-to-br from-gray-50 to-green-50/30 rounded-xl border border-gray-200 hover:shadow-md hover:border-green-200 transition-all duration-200 animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-1.5 bg-green-100 rounded-lg">
                    <Database className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{ds.name}</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{ds.description}</p>
                <span className="inline-block px-2.5 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">{ds.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value, colors, delay }: { label: string; value: string; colors: typeof agentColors.blue; delay: number }) {
  return (
    <div className={`bg-white rounded-xl p-4 border-2 ${colors.border} hover:shadow-md transition-all duration-200 animate-fade-in-up`} style={{ animationDelay: `${delay}s` }}>
      <p className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-gray-900 line-clamp-2">{value}</p>
    </div>
  );
}

function SampleDataPreview({ config }: { config: SampleDataConfig }) {
  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800', processing: 'bg-amber-100 text-amber-800', extracted: 'bg-green-100 text-green-800',
    validated: 'bg-green-100 text-green-800', pending: 'bg-amber-100 text-amber-800', elected: 'bg-green-100 text-green-800',
    approved: 'bg-green-100 text-green-800', settled: 'bg-green-100 text-green-800', complete: 'bg-gray-100 text-gray-800', review: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <h4 className="text-lg font-semibold text-gray-900">{config.title}</h4>
          <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded">Sample Data</span>
        </div>
        {config.description && <p className="text-sm text-gray-500 mt-1">{config.description}</p>}
      </div>
      
      {config.type === 'table' && config.columns && config.rows && (
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {config.columns.map(col => (
                <th key={col.key} className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {config.rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {config.columns!.map(col => (
                  <td key={col.key} className="px-5 py-4">
                    {col.type === 'status' ? (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[row[col.key]] || 'bg-gray-100 text-gray-800'}`}>
                        {row[col.key].charAt(0).toUpperCase() + row[col.key].slice(1)}
                      </span>
                    ) : col.type === 'money' ? (
                      <span className="text-sm font-semibold text-green-600">{row[col.key]}</span>
                    ) : (
                      <span className="text-sm text-gray-900">{row[col.key]}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default WorkflowRenderer;
