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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ey-dark">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '32px 32px',
      }} />

      <div className="relative max-w-lg w-full mx-6 text-center">
        {/* Animated logo ring */}
        <div className="relative w-32 h-32 mx-auto mb-10">
          {/* Glow behind ring */}
          <div className="absolute inset-0 rounded-full blur-xl bg-ey-yellow/20" />
          {/* Track ring */}
          <svg className="absolute inset-0 w-32 h-32" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="58" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
          </svg>
          {/* Progress ring (doesn't spin — just fills) */}
          <svg className="absolute inset-0 w-32 h-32 -rotate-90" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="58" fill="none" stroke="#FFE600" strokeWidth="5"
              strokeDasharray="364.4" strokeDashoffset={364.4 - (364.4 * progress) / 100}
              strokeLinecap="round" className="transition-all duration-300"
              style={{ filter: 'drop-shadow(0 0 8px rgba(255,230,0,0.5))' }} />
          </svg>
          {/* Center percentage */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-white tabular-nums">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Active step label */}
        <div key={`step-${activeStep}`} style={{ animation: 'staggerUp 0.35s ease-out' }}>
          <p className="text-xl font-semibold text-white mb-1.5">
            {LOADING_STEPS[activeStep].label}
          </p>
          <p className="text-sm text-gray-400 mb-12">
            {LOADING_STEPS[activeStep].detail}
          </p>
        </div>

        {/* Step progress bar */}
        <div className="flex items-center justify-center space-x-2 px-4">
          {LOADING_STEPS.map((step, i) => (
            <div key={i} className="flex items-center">
              {/* Step dot */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                i < activeStep
                  ? 'bg-ey-yellow text-ey-dark'
                  : i === activeStep
                  ? 'bg-ey-yellow/20 text-ey-yellow ring-2 ring-ey-yellow'
                  : 'bg-white/10 text-gray-500'
              }`}>
                {i < activeStep ? '✓' : step.icon}
              </div>
              {/* Connector line */}
              {i < LOADING_STEPS.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 transition-colors duration-500 ${
                  i < activeStep ? 'bg-ey-yellow' : 'bg-white/10'
                }`} />
              )}
            </div>
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
          <div className="px-6 py-4">
            <textarea
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={PLACEHOLDER_TEXT}
              className="w-full h-52 p-4 bg-gray-50/50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-ey-yellow/30 focus:border-ey-yellow resize-none transition-all duration-200 font-mono text-sm leading-relaxed"
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
          <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-yellow-50/30 border-t border-gray-100">
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
