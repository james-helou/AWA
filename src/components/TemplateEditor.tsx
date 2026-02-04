import React, { useState } from 'react';
import { WorkflowTemplate, Agent, DataSource, HumanTouchpoint } from '../types/workflow';

interface TemplateEditorProps {
  template: WorkflowTemplate;
  onGenerate: (modifiedTemplate: WorkflowTemplate) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function TemplateEditor({ template, onGenerate, onCancel, isLoading }: TemplateEditorProps) {
  const [agents, setAgents] = useState<Agent[]>([...template.workflow.agents]);
  const [dataSources, setDataSources] = useState<DataSource[]>([...template.workflow.dataSources]);
  const [touchpoints, setTouchpoints] = useState<HumanTouchpoint[]>([...template.workflow.humanTouchpoints]);
  const [workflowName, setWorkflowName] = useState(template.workflow.name);
  const [workflowDescription, setWorkflowDescription] = useState(template.workflow.description);

  const handleRemoveDataSource = (dsId: string) => {
    setDataSources(dataSources.filter(ds => ds.id !== dsId));
  };

  const handleRemoveTouchpoint = (tpId: string) => {
    setTouchpoints(touchpoints.filter(tp => tp.id !== tpId));
  };

  const handleUpdateDataSource = (dsId: string, field: string, value: string) => {
    setDataSources(dataSources.map(ds => 
      ds.id === dsId ? { ...ds, [field]: value } : ds
    ));
  };

  const handleUpdateTouchpoint = (tpId: string, field: string, value: string | boolean) => {
    setTouchpoints(touchpoints.map(tp => 
      tp.id === tpId ? { ...tp, [field]: value } : tp
    ));
  };

  const handleAddDataSource = () => {
    const newDs: DataSource = {
      id: `ds-${Date.now()}`,
      name: '',
      type: 'api',
      icon: '🔗',
      description: ''
    };
    setDataSources([...dataSources, newDs]);
  };

  const handleAddTouchpoint = () => {
    const newTp: HumanTouchpoint = {
      id: `tp-${Date.now()}`,
      agentId: agents[0]?.id || '',
      name: '',
      type: 'review',
      description: '',
      required: false
    };
    setTouchpoints([...touchpoints, newTp]);
  };

  const handleGenerate = () => {
    const modifiedTemplate: WorkflowTemplate = {
      ...template,
      workflow: {
        ...template.workflow,
        name: workflowName,
        description: workflowDescription,
        agents: agents.map((a, i) => ({ ...a, order: i + 1 })),
        dataSources,
        humanTouchpoints: touchpoints
      }
    };
    onGenerate(modifiedTemplate);
  };

  const getAgentColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 border-blue-300 text-blue-800',
      purple: 'bg-purple-100 border-purple-300 text-purple-800',
      green: 'bg-green-100 border-green-300 text-green-800',
      amber: 'bg-amber-100 border-amber-300 text-amber-800',
      red: 'bg-red-100 border-red-300 text-red-800',
      indigo: 'bg-indigo-100 border-indigo-300 text-indigo-800',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-3">
              <button onClick={onCancel} className="group p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
                </svg>
              </button>
              <span className="text-3xl select-none animate-bounce-subtle">{template.icon}</span>
              <div className="select-none">
                <h1 className="text-lg font-bold gradient-text">Customize Template</h1>
                <p className="text-sm text-gray-500">{template.name}</p>
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isLoading || agents.length === 0}
              className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-200 ripple"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  <span>Generate Workflow</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 animate-fade-in-up">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide select-none">Workflow Info</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 select-none">Name</label>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 select-none">Description</label>
              <input
                type="text"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Agents - Read only display */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide select-none">AI Agents ({agents.length})</h2>
                <p className="text-xs text-gray-500 mt-0.5 select-none">These agents will be created based on your workflow</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {agents.map((agent, idx) => (
              <div key={agent.id} className={`p-4 rounded-xl border-2 select-none transition-all duration-200 hover:shadow-md ${getAgentColor(agent.color)}`} style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white font-bold text-sm shadow-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{agent.name}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{agent.description}</p>
                  </div>
                  <span className="px-2.5 py-1 text-xs bg-white/80 rounded-full font-medium shadow-sm">
                    {agent.type === 'automated' ? '🤖 Auto' : '👤 Human'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Sources */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                </svg>
              </div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide select-none">Data Sources ({dataSources.length})</h2>
            </div>
            <button
              onClick={handleAddDataSource}
              className="group flex items-center space-x-1.5 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-200 ripple"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
              </svg>
              <span>Add Source</span>
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {dataSources.map((ds, idx) => (
              <div key={ds.id} className="p-4 bg-gradient-to-br from-gray-50 to-green-50/30 rounded-xl border-2 border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 animate-scale-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl select-none">{ds.icon || '📄'}</span>
                  <button
                    onClick={() => handleRemoveDataSource(ds.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                <input
                  type="text"
                  value={ds.name}
                  onChange={(e) => handleUpdateDataSource(ds.id, 'name', e.target.value)}
                  className="w-full font-semibold text-gray-900 text-sm bg-white border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 mb-2 transition-all"
                  placeholder="Data source name"
                />
                <input
                  type="text"
                  value={ds.description}
                  onChange={(e) => handleUpdateDataSource(ds.id, 'description', e.target.value)}
                  className="w-full text-xs text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description"
                />
              </div>
            ))}
          </div>
          
          {dataSources.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm select-none">No data sources defined.</p>
              <p className="text-gray-400 text-xs mt-1 select-none">Click "Add Source" to get started</p>
            </div>
          )}
        </div>

        {/* Human Touchpoints */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide select-none">Human Touchpoints ({touchpoints.length})</h2>
            </div>
            <button
              onClick={handleAddTouchpoint}
              className="group flex items-center space-x-1.5 px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all duration-200 ripple"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
              </svg>
              <span>Add Touchpoint</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {touchpoints.map((tp, idx) => (
              <div key={tp.id} className="p-4 bg-gradient-to-br from-amber-50 to-orange-50/30 rounded-xl border-2 border-amber-200 hover:border-amber-300 hover:shadow-md transition-all duration-200 animate-scale-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl select-none">👤</span>
                    <span className="px-2.5 py-1 text-xs bg-amber-200 text-amber-800 rounded-full font-medium select-none">{tp.type}</span>
                    <label className="flex items-center space-x-1.5 text-xs ml-2 px-2 py-1 bg-white rounded-lg border border-gray-200">
                      <input
                        type="checkbox"
                        checked={tp.required}
                        onChange={(e) => handleUpdateTouchpoint(tp.id, 'required', e.target.checked)}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-gray-600 font-medium">Required</span>
                    </label>
                  </div>
                  <button
                    onClick={() => handleRemoveTouchpoint(tp.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                <input
                  type="text"
                  value={tp.name}
                  onChange={(e) => handleUpdateTouchpoint(tp.id, 'name', e.target.value)}
                  className="w-full font-semibold text-gray-900 text-sm bg-white border-2 border-amber-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 mb-2 transition-all"
                  placeholder="Touchpoint name"
                />
                <input
                  type="text"
                  value={tp.description}
                  onChange={(e) => handleUpdateTouchpoint(tp.id, 'description', e.target.value)}
                  className="w-full text-xs text-gray-600 bg-white border-2 border-amber-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  placeholder="Description"
                />
              </div>
            ))}
          </div>
          
          {touchpoints.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm select-none">No human touchpoints.</p>
              <p className="text-gray-400 text-xs mt-1 select-none">The workflow will be fully automated</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 select-none animate-fade-in-up shadow-lg" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Summary</h2>
          <div className="grid grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-white/60 rounded-xl">
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{agents.length}</p>
              <p className="text-xs text-gray-600 font-medium mt-1">Agents</p>
            </div>
            <div className="p-4 bg-white/60 rounded-xl">
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">{dataSources.length}</p>
              <p className="text-xs text-gray-600 font-medium mt-1">Data Sources</p>
            </div>
            <div className="p-4 bg-white/60 rounded-xl">
              <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">{touchpoints.length}</p>
              <p className="text-xs text-gray-600 font-medium mt-1">Human Touchpoints</p>
            </div>
            <div className="p-4 bg-white/60 rounded-xl">
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">{agents.reduce((sum, a) => sum + a.actions.length, 0)}</p>
              <p className="text-xs text-gray-600 font-medium mt-1">Total Actions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
