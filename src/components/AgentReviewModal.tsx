import { useState } from 'react';
import { Workflow } from '../types/workflow';

interface AgentReviewModalProps {
  workflow: Workflow;
  isRegenerating: boolean;
  onAccept: () => void;
  onRequestChanges: (feedback: string) => void;
}

export function AgentReviewModal({ 
  workflow, 
  isRegenerating,
  onAccept, 
  onRequestChanges 
}: AgentReviewModalProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSubmitFeedback = () => {
    if (feedback.trim()) {
      onRequestChanges(feedback.trim());
      setFeedback('');
      setShowFeedback(false);
    }
  };

  // Map agent colors to friendly background colors
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    green: 'bg-green-50 border-green-200',
    amber: 'bg-amber-50 border-amber-200',
    red: 'bg-red-50 border-red-200',
    indigo: 'bg-indigo-50 border-indigo-200',
    pink: 'bg-pink-50 border-pink-200',
    cyan: 'bg-cyan-50 border-cyan-200',
  };

  const iconColorClasses: Record<string, string> = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    indigo: 'bg-indigo-500',
    pink: 'bg-pink-500',
    cyan: 'bg-cyan-500',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Review Your AI Team</h2>
              <p className="text-sm text-gray-500">Here's the team of AI assistants we've designed for your workflow</p>
            </div>
          </div>
        </div>

        {/* Agent Cards */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {isRegenerating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium">Redesigning your AI team...</p>
              <p className="text-gray-400 text-sm mt-1">This may take a few moments</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">
                  {workflow.agents.length} AI Assistant{workflow.agents.length !== 1 ? 's' : ''} • {workflow.estimatedBuildTime} to build
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  workflow.estimatedComplexity === 'low' ? 'bg-green-100 text-green-700' :
                  workflow.estimatedComplexity === 'medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {workflow.estimatedComplexity.charAt(0).toUpperCase() + workflow.estimatedComplexity.slice(1)} Complexity
                </span>
              </div>

              <div className="space-y-4">
                {workflow.agents.map((agent, index) => (
                  <div 
                    key={agent.id}
                    className={`rounded-xl border-2 p-5 ${colorClasses[agent.color] || 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Agent Number Badge */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${iconColorClasses[agent.color] || 'bg-gray-500'}`}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                          {agent.type === 'human-in-loop' && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-white/80 text-gray-600 rounded-full border border-gray-200">
                              Needs your input
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">{agent.description}</p>
                        
                        {/* What it does - simplified */}
                        <div className="flex flex-wrap gap-2">
                          {agent.actions.slice(0, 4).map((action, i) => (
                            <span 
                              key={i}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/70 text-gray-700 border border-gray-200"
                            >
                              <svg className="w-3 h-3 mr-1 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 11 12 14 22 4" />
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                              </svg>
                              {action}
                            </span>
                          ))}
                          {agent.actions.length > 4 && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/50 text-gray-500">
                              +{agent.actions.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-medium text-gray-700 mb-2">How it works</h4>
                <p className="text-sm text-gray-600">
                  These AI assistants will work together in sequence. Each one handles a specific part of your process, 
                  passing information to the next. {workflow.humanTouchpoints.length > 0 && (
                    <>You'll be asked to review or approve at {workflow.humanTouchpoints.length} point{workflow.humanTouchpoints.length !== 1 ? 's' : ''} in the process.</>
                  )}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50">
          {showFeedback ? (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                What would you like to change?
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="e.g., I need an agent that specifically handles customer notifications, or I'd like to combine the first two agents..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                rows={3}
                autoFocus
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowFeedback(false);
                    setFeedback('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  disabled={!feedback.trim()}
                  className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Regenerate Team
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFeedback(true)}
                disabled={isRegenerating}
                className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <span>Suggest Changes</span>
              </button>
              
              <button
                onClick={onAccept}
                disabled={isRegenerating}
                className="flex items-center space-x-2 px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 transition disabled:opacity-50"
              >
                <span>Looks Good, Continue</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
