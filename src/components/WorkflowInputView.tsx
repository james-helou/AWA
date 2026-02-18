import React, { useState, useEffect } from 'react';
import { EYLogo } from './EYLogo';

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

// ─── Loading Steps ──────────────────────────────────────────────────────────
const LOADING_STEPS = [
  { label: 'Analyzing your tasks', icon: '🔍', detail: 'Reading and understanding each task...' },
  { label: 'Identifying agent roles', icon: '🤖', detail: 'Determining the right AI specialists...' },
  { label: 'Mapping dependencies', icon: '🔗', detail: 'Building connections between agents...' },
  { label: 'Designing workflow', icon: '⚙️', detail: 'Structuring the optimal pipeline...' },
  { label: 'Generating preview', icon: '✨', detail: 'Preparing your workflow simulation...' },
];

function GeneratingOverlay() {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Step through the phases every ~3s
    const stepInterval = setInterval(() => {
      setActiveStep(prev => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 3000);
    return () => clearInterval(stepInterval);
  }, []);

  useEffect(() => {
    // Smooth progress bar — fast at first, slows down near the end
    const tick = setInterval(() => {
      setProgress(prev => {
        if (prev >= 92) return prev; // cap at 92 so it never "finishes" before the real call does
        const remaining = 92 - prev;
        return prev + Math.max(0.15, remaining * 0.02);
      });
    }, 50);
    return () => clearInterval(tick);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-50 via-yellow-50/20 to-gray-100">
      <div className="max-w-md w-full mx-6 text-center">
        {/* Animated logo ring */}
        <div className="relative w-28 h-28 mx-auto mb-8">
          {/* Outer spinning ring */}
          <svg className="absolute inset-0 w-28 h-28 animate-spin" style={{ animationDuration: '3s' }} viewBox="0 0 112 112">
            <circle cx="56" cy="56" r="52" fill="none" stroke="#E5E7EB" strokeWidth="4" />
            <circle cx="56" cy="56" r="52" fill="none" stroke="#FFE600" strokeWidth="4"
              strokeDasharray="327" strokeDashoffset={327 - (327 * progress) / 100}
              strokeLinecap="round" className="transition-all duration-300"
              style={{ filter: 'drop-shadow(0 0 6px rgba(255,230,0,0.4))' }} />
          </svg>
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl" style={{ animation: 'staggerUp 0.3s ease-out' }} key={activeStep}>
              {LOADING_STEPS[activeStep].icon}
            </div>
          </div>
        </div>

        {/* Percentage */}
        <p className="text-3xl font-bold text-ey-dark mb-1 tabular-nums">
          {Math.round(progress)}%
        </p>

        {/* Active step label */}
        <p className="text-lg font-semibold text-gray-900 mb-1" key={`label-${activeStep}`}
           style={{ animation: 'staggerUp 0.3s ease-out' }}>
          {LOADING_STEPS[activeStep].label}
        </p>
        <p className="text-sm text-gray-500 mb-10" key={`detail-${activeStep}`}
           style={{ animation: 'staggerUp 0.3s ease-out' }}>
          {LOADING_STEPS[activeStep].detail}
        </p>

        {/* Step indicators */}
        <div className="flex items-center justify-center space-x-3">
          {LOADING_STEPS.map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                  i < activeStep
                    ? 'bg-green-100 text-green-600 scale-100'
                    : i === activeStep
                    ? 'bg-ey-yellow text-ey-dark scale-110 shadow-lg shadow-ey-yellow/30'
                    : 'bg-gray-100 text-gray-400 scale-90'
                }`}
              >
                {i < activeStep ? '✓' : i + 1}
              </div>
              {i < LOADING_STEPS.length - 1 && (
                <div className={`hidden`} /> // spacing only; line connectors not needed for center layout
              )}
            </div>
          ))}
        </div>

        {/* Step labels row */}
        <div className="flex items-center justify-center space-x-3 mt-2">
          {LOADING_STEPS.map((step, i) => (
            <span key={i} className={`text-[10px] w-10 text-center leading-tight transition-colors duration-300 ${
              i <= activeStep ? 'text-gray-600' : 'text-gray-300'
            }`}>
              {step.label.split(' ').slice(0, 2).join(' ')}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-yellow-50/20 to-gray-100">
      {/* Full-screen loading overlay */}
      {isLoading && <GeneratingOverlay />}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div className="flex items-center space-x-4 animate-fade-in">
            <EYLogo size={44} className="animate-float" />
            <div>
              <h1 className="text-2xl font-bold text-ey-dark">Agentic Workflow Architect</h1>
              <p className="text-sm text-gray-500">Transform your process tasks into intelligent multi-agent workflows</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* How it works section - moved above input */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm" style={{ animation: 'staggerUp 0.4s ease-out both', animationDelay: '100ms' }}>
            <div className="w-8 h-8 bg-ey-yellow rounded-lg flex items-center justify-center mb-3">
              <span className="text-ey-dark font-bold">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Describe Your Process</h3>
            <p className="text-sm text-gray-600">Enter your process as free-form text or list each task line by line — whatever feels natural.</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm" style={{ animation: 'staggerUp 0.4s ease-out both', animationDelay: '200ms' }}>
            <div className="w-8 h-8 bg-ey-yellow rounded-lg flex items-center justify-center mb-3">
              <span className="text-ey-dark font-bold">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">AI Analysis</h3>
            <p className="text-sm text-gray-600">Our AI analyzes tasks, groups them logically, and identifies optimal agents.</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm" style={{ animation: 'staggerUp 0.4s ease-out both', animationDelay: '300ms' }}>
            <div className="w-8 h-8 bg-ey-yellow rounded-lg flex items-center justify-center mb-3">
              <span className="text-ey-dark font-bold">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Preview Simulation</h3>
            <p className="text-sm text-gray-600">See a simulated preview of your multi-agent workflow in action, as it would look when agents are live.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden animate-fade-in-up">
          {/* Input Header */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-ey-yellow/20 rounded-xl">
                <Brain className="w-6 h-6 text-ey-dark" />
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
              className="w-full h-80 p-4 bg-gray-50/50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-ey-yellow/30 focus:border-ey-yellow resize-none transition-all duration-200 font-mono text-sm leading-relaxed"
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
          <div className="p-6 bg-gradient-to-r from-gray-50 to-yellow-50/30 border-t border-gray-100">
            <div className="flex items-center justify-end">
              <button
                onClick={handleSubmit}
                disabled={!tasks.trim() || isLoading}
                className="group flex items-center space-x-2 px-8 py-3.5 bg-ey-yellow text-ey-dark font-semibold rounded-xl hover:bg-ey-yellow-hover disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-ey-yellow/25 hover:shadow-xl hover:shadow-ey-yellow/30 transition-all duration-200 ripple"
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

    </div>
  );
}
