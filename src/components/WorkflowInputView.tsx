import React, { useState } from 'react';

type IconProps = { className?: string };

const Send = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="m22 2-7 20-4-9-9-4 20-7Z" /><path d="M22 2 11 13" />
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

const Sparkles = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
);

interface WorkflowInputViewProps {
  onGenerate: (tasks: string) => void;
  isLoading: boolean;
  error?: string | null;
}

const PLACEHOLDER_TEXT = `Set up account
Setup Main Account for Specialty or Fiduciary business
Verify if all required information is captured
Authorize account to be setup
Communicate bank details to the client
Create client profile detailing risk profile
Update profile with reporting preferences
...`;

export function WorkflowInputView({ onGenerate, isLoading, error }: WorkflowInputViewProps) {
  const [tasks, setTasks] = useState('');

  const handleSubmit = () => {
    if (!tasks.trim() || isLoading) return;
    onGenerate(tasks);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div className="flex items-center space-x-4 animate-fade-in">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/25 animate-float">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Agentic Workflow Architect</h1>
              <p className="text-sm text-gray-500">Transform your process tasks into intelligent multi-agent workflows</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* How it works section - moved above input */}
        <div className="mb-6 grid grid-cols-3 gap-4 animate-fade-in-up">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Paste Tasks</h3>
            <p className="text-sm text-gray-600">Enter your process tasks, one per line. Include all steps from start to finish.</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-purple-600 font-bold">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">AI Analysis</h3>
            <p className="text-sm text-gray-600">Our AI analyzes tasks, groups them logically, and identifies optimal agents.</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-green-600 font-bold">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Get Workflow</h3>
            <p className="text-sm text-gray-600">Receive a complete multi-agent workflow with data sources and touchpoints.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden animate-fade-in-up">
          {/* Input Header */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-blue-100 rounded-xl">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Paste Your Process Tasks</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Describe your end-to-end process and the tasks needed to complete it. AI will help you build the right agents for the job.
                </p>
                </div>
                {/* Removed duplicate instruction */}
            </div>
          </div>

          {/* Textarea */}
          <div className="p-6">
            <textarea
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={PLACEHOLDER_TEXT}
              className="w-full h-80 p-4 bg-gray-50/50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all duration-200 font-mono text-sm leading-relaxed"
              disabled={isLoading}
            />

            {/* Tips */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>Ctrl+Enter to generate</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-fade-in">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50/30 border-t border-gray-100">
            <div className="flex items-center justify-end">
              <button
                onClick={handleSubmit}
                disabled={!tasks.trim() || isLoading}
                className="group flex items-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 ripple"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing & Designing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    <span>Generate Workflow</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Credit */}
      <div className="fixed bottom-4 right-4 text-sm text-gray-400">
        Built by <span className="font-medium text-gray-500">James Helou</span>
      </div>
    </div>
  );
}

export default WorkflowInputView;
