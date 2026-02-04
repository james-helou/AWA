import React, { useState } from 'react';
import { WorkflowTemplate, WorkflowInput } from '../types/workflow';
import { workflowTemplates } from '../data/templates';
import { TemplateEditor } from './TemplateEditor';

type IconProps = { className?: string };
const Send = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="m22 2-7 20-4-9-9-4 20-7Z" /><path d="M22 2 11 13" />
  </svg>
);
const Zap = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const Brain = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" />
  </svg>
);
const Activity = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

interface WorkflowInputViewProps {
  onGenerate: (input: WorkflowInput) => void;
  isLoading: boolean;
}

export function WorkflowInputView({ onGenerate, isLoading }: WorkflowInputViewProps) {
  const [textInput, setTextInput] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<WorkflowTemplate | null>(null);

  const handleSubmitText = () => {
    if (!textInput.trim()) return;
    onGenerate({ type: 'text', content: textInput });
  };

  const handleOpenTemplateEditor = (template: WorkflowTemplate) => {
    setEditingTemplate(template);
  };

  const handleGenerateFromTemplate = (modifiedTemplate: WorkflowTemplate) => {
    onGenerate({ 
      type: 'template', 
      content: { 
        templateId: modifiedTemplate.id,
        modifiedWorkflow: modifiedTemplate.workflow
      } 
    });
  };

  const handleSelectTemplate = (template: WorkflowTemplate) => {
    if (selectedTemplate?.id === template.id) {
      setSelectedTemplate(null);
    } else {
      setSelectedTemplate(template);
    }
  };

  // Show template editor if user is customizing a template
  if (editingTemplate) {
    return (
      <TemplateEditor
        template={editingTemplate}
        onGenerate={handleGenerateFromTemplate}
        onCancel={() => setEditingTemplate(null)}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center space-x-4 animate-fade-in">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/25 animate-float">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Agentic Workflow Planner</h1>
              <p className="text-sm text-gray-500">Describe your task or choose a template to generate a workflow</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 mb-6 card-hover animate-fade-in-up">
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Describe Your Workflow</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Tell us what you want to automate. Include details about data sources, steps, and any human approvals needed.
          </p>
          
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Example: I want to automate invoice processing. Invoices come via email, need to be validated against purchase orders, routed to managers for approval if over $5000, then processed for payment..."
            className="w-full h-32 p-4 bg-gray-50/50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all duration-200"
          />
          
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmitText}
              disabled={!textInput.trim() || isLoading}
              className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 ripple"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  <span>Generate Workflow</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-amber-100 rounded-lg">
                <Zap className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Or Start from a Template</h2>
            </div>
          </div>
          
          <div className="p-5">
            <div className="grid grid-cols-3 gap-4">
              {workflowTemplates.map((template, index) => (
                <div
                  key={template.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 animate-fade-in-up ${
                    selectedTemplate?.id === template.id
                      ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10 scale-[1.02]'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{template.icon}</span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">{template.category}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                  <div className="flex items-center space-x-1">
                    <div className="flex -space-x-1">
                      {[...Array(Math.min(template.workflow.agents.length, 3))].map((_, i) => (
                        <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-white text-[8px] text-white flex items-center justify-center font-bold">{i + 1}</div>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">{template.workflow.agents.length} agents</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedTemplate && (
            <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-200 animate-fade-in">
              <div className="flex items-start space-x-4">
                <span className="text-4xl animate-bounce-subtle">{selectedTemplate.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{selectedTemplate.name}</h3>
                      <p className="text-sm text-gray-600">{selectedTemplate.workflow.agents.length} agents • {selectedTemplate.workflow.dataSources.length} data sources • {selectedTemplate.workflow.estimatedBuildTime}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedTemplate(null)} 
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6 6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{selectedTemplate.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedTemplate.workflow.agents.map((agent, idx) => (
                      <span key={idx} className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-full shadow-sm hover:shadow transition-shadow animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-1.5"></span>
                        {agent.name}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleOpenTemplateEditor(selectedTemplate)}
                      disabled={isLoading}
                      className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-200 ripple"
                    >
                      <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      <span>Open & Customize</span>
                    </button>
                    <p className="text-xs text-gray-500">
                      Edit agents, data sources, and touchpoints before generating
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkflowInputView;
