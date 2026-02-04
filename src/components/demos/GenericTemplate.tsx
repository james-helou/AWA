import React, { useState } from 'react';
import { Workflow } from '../../types/workflow';

interface Props {
  workflow: Workflow;
}

// Generic template that adapts to any workflow
export function GenericTemplate({ workflow }: Props) {
  const [activeAgentIndex, setActiveAgentIndex] = useState(0);
  const activeAgent = workflow.agents[activeAgentIndex];

  // Generate mock items based on workflow data sources
  const mockItems = workflow.dataSources.map((ds, i) => ({
    id: `ITEM-${String(i + 1).padStart(3, '0')}`,
    name: ds.name,
    type: ds.type,
    status: i === 0 ? 'new' : i === 1 ? 'processing' : 'completed',
    received: new Date(Date.now() - Math.random() * 86400000).toLocaleString(),
  }));

  // Generate mock records
  const mockRecords = Array.from({ length: 5 }, (_, i) => ({
    id: `REC-${String(i + 1).padStart(3, '0')}`,
    name: `Record ${i + 1}`,
    status: i < 3 ? 'completed' : i === 3 ? 'in_progress' : 'pending',
    value: `$${(Math.random() * 100).toFixed(1)}K`,
    updated: new Date(Date.now() - Math.random() * 86400000 * 3).toLocaleDateString(),
  }));

  const getAgentColor = (color: string, type: 'bg' | 'text' | 'light' | 'border') => {
    const colors: Record<string, Record<string, string>> = {
      blue: { bg: 'bg-blue-600', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-200' },
      purple: { bg: 'bg-purple-600', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-200' },
      green: { bg: 'bg-green-600', text: 'text-green-600', light: 'bg-green-50', border: 'border-green-200' },
      amber: { bg: 'bg-amber-600', text: 'text-amber-600', light: 'bg-amber-50', border: 'border-amber-200' },
      red: { bg: 'bg-red-600', text: 'text-red-600', light: 'bg-red-50', border: 'border-red-200' },
      indigo: { bg: 'bg-indigo-600', text: 'text-indigo-600', light: 'bg-indigo-50', border: 'border-indigo-200' },
    };
    return colors[color]?.[type] || colors.blue[type];
  };

  return (
    <div className="p-6">
      {/* Metrics based on workflow */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Data Sources</span>
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{workflow.dataSources.length}</p>
          <p className="text-xs text-gray-500 mt-1">Connected</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Agents</span>
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <svg className="w-4 h-4 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v10"/><path d="m4.93 4.93 4.24 4.24m5.66 5.66 4.24 4.24"/><path d="M1 12h6m6 0h10"/><path d="m4.93 19.07 4.24-4.24m5.66-5.66 4.24-4.24"/>
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{workflow.agents.length}</p>
          <p className="text-xs text-green-600 mt-1">All active</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Human Touchpoints</span>
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{workflow.humanTouchpoints.length}</p>
          <p className="text-xs text-amber-600 mt-1">{workflow.humanTouchpoints.filter(h => h.required).length} required</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Total Actions</span>
            <div className="p-1.5 bg-green-100 rounded-lg">
              <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{workflow.agents.reduce((sum, a) => sum + a.actions.length, 0)}</p>
          <p className="text-xs text-gray-500 mt-1">Configured</p>
        </div>
      </div>

      {/* Agent Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <div className="flex">
            {workflow.agents.map((agent, idx) => (
              <button
                key={agent.id}
                onClick={() => setActiveAgentIndex(idx)}
                className={`flex-1 px-4 py-4 text-sm font-medium border-b-2 transition ${
                  activeAgentIndex === idx
                    ? `${getAgentColor(agent.color, 'border').replace('border-', 'border-b-')} ${getAgentColor(agent.color, 'text')} ${getAgentColor(agent.color, 'light')}`
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    activeAgentIndex === idx ? `${getAgentColor(agent.color, 'bg')} text-white` : 'bg-gray-200 text-gray-600'
                  }`}>
                    {idx + 1}
                  </span>
                  <span>{agent.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Agent Detail */}
        <div className="p-6">
          <div className={`${getAgentColor(activeAgent.color, 'light')} rounded-lg p-5 border ${getAgentColor(activeAgent.color, 'border')} mb-6`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{activeAgent.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{activeAgent.description}</p>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    activeAgent.type === 'automated' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {activeAgent.type === 'automated' ? '🤖 Automated' : '👤 Human-in-Loop'}
                  </span>
                  <span className="text-xs text-gray-500">{activeAgent.actions.length} actions</span>
                  <span className="text-xs text-gray-500">{activeAgent.integrations.length} integrations</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-100 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Active</span>
              </div>
            </div>
          </div>

          {/* Actions Grid */}
          <h4 className="font-semibold text-gray-900 mb-3">Agent Actions</h4>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {activeAgent.actions.map((action, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-6 h-6 rounded-full ${getAgentColor(activeAgent.color, 'bg')} flex items-center justify-center`}>
                    <span className="text-white text-xs font-bold">{idx + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Step {idx + 1}</span>
                </div>
                <p className="text-sm text-gray-600">{action}</p>
              </div>
            ))}
          </div>

          {/* Integrations */}
          {activeAgent.integrations.length > 0 && (
            <>
              <h4 className="font-semibold text-gray-900 mb-3">Integrations</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {activeAgent.integrations.map((integration, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                    {integration}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Outputs */}
          {activeAgent.outputs.length > 0 && (
            <>
              <h4 className="font-semibold text-gray-900 mb-3">Outputs</h4>
              <div className="grid grid-cols-3 gap-3">
                {activeAgent.outputs.map((output, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <svg className={`w-4 h-4 ${getAgentColor(activeAgent.color, 'text')}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>
                      </svg>
                      <span className="text-sm text-gray-700">{output.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Data Queue / Records */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Processing Queue</h3>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            + Add Item
          </button>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Value</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Updated</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-blue-600">{record.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{record.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    record.status === 'completed' ? 'bg-green-100 text-green-800' :
                    record.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {record.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{record.value}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{record.updated}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Human Touchpoints */}
      {workflow.humanTouchpoints.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 bg-amber-50 border-b border-amber-200">
            <h3 className="font-semibold text-gray-900">👤 Human Touchpoints</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {workflow.humanTouchpoints.map((ht) => (
              <div key={ht.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        ht.type === 'approval' ? 'bg-blue-100 text-blue-800' :
                        ht.type === 'review' ? 'bg-purple-100 text-purple-800' :
                        ht.type === 'decision' ? 'bg-amber-100 text-amber-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ht.type}
                      </span>
                      {ht.required && <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">Required</span>}
                    </div>
                    <p className="font-medium text-gray-900">{ht.name}</p>
                    <p className="text-sm text-gray-600">{ht.description}</p>
                  </div>
                  <button className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium hover:bg-amber-200">
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
