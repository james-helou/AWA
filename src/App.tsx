import React, { useState } from 'react';
import { Workflow, WorkflowInput } from './types/workflow';
import { generateWorkflow } from './services/workflowGenerator';
import { WorkflowRenderer } from './components/WorkflowRenderer';
import { WorkflowInputView } from './components/WorkflowInputView';
import { DynamicWorkflowDemo } from './components/DynamicWorkflowDemo';

// App modes
type AppMode = 'input' | 'preview' | 'build';

function App() {
  const [mode, setMode] = useState<AppMode>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (input: WorkflowInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const generatedWorkflow = await generateWorkflow(input);
      setWorkflow(generatedWorkflow);
      setMode('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate workflow');
      console.error('Generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setMode('input');
  };

  const handleBuild = () => {
    if (!workflow) return;
    setMode('build');
  };

  // Build mode - show the interactive demo populated with workflow data
  if (mode === 'build' && workflow) {
    return (
      <DynamicWorkflowDemo
        workflow={workflow}
        onBack={() => setMode('preview')}
      />
    );
  }

  // Preview mode - show the generated workflow
  if (mode === 'preview' && workflow) {
    return (
      <WorkflowRenderer
        workflow={workflow}
        onBack={handleBack}
        onBuild={handleBuild}
      />
    );
  }

  // Input mode - show the workflow input form
  return (
    <div>
      <WorkflowInputView
        onGenerate={handleGenerate}
        isLoading={isLoading}
      />
      
      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-white/80 hover:text-white">×</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
