import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Workflow } from './types/workflow';
import { generateWorkflowWithAI, regenerateWorkflowWithFeedback } from './services/azureOpenAI';
import { WorkflowInputView } from './components/WorkflowInputView';
import { AgentReviewModal } from './components/AgentReviewModal';
import { WorkflowDemoView } from './components/WorkflowDemoView';

/** Feature flags (inlined) */
const features = {
  techGraph: (import.meta.env.VITE_FEATURE_TECH_GRAPH ?? 'true') === 'true',
} as const;

// Lazy-load the technical graph page (only loaded when navigated to)
const TechGraphPage = lazy(() => import('./components/tech/TechGraphPage'));

// App modes
type AppMode = 'input' | 'review' | 'preview' | 'techGraph';

// Restore workflow from sessionStorage on page refresh
const _savedState: { workflow: Workflow; originalTasks: string } | null = (() => {
  try {
    const raw = sessionStorage.getItem('awa-state');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
})();

function App() {
  const [mode, setMode] = useState<AppMode>(_savedState?.workflow ? 'preview' : 'input');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [workflow, setWorkflow] = useState<Workflow | null>(_savedState?.workflow ?? null);
  const [originalTasks, setOriginalTasks] = useState<string>(_savedState?.originalTasks ?? '');
  const [error, setError] = useState<string | null>(null);

  // Persist workflow to sessionStorage so it survives page refresh
  useEffect(() => {
    if (workflow) {
      sessionStorage.setItem('awa-state', JSON.stringify({ workflow, originalTasks }));
    } else {
      sessionStorage.removeItem('awa-state');
    }
  }, [workflow, originalTasks]);

  const handleGenerate = async (tasks: string) => {
    setIsLoading(true);
    setError(null);
    setOriginalTasks(tasks);
    
    try {
      const generatedWorkflow = await generateWorkflowWithAI(tasks);
      setWorkflow(generatedWorkflow);
      setMode('review'); // Go to review mode first
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate workflow');
      console.error('Generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptAgents = () => {
    setMode('preview');
  };

  const handleRequestChanges = async (feedback: string) => {
    if (!workflow) return;
    
    setIsRegenerating(true);
    try {
      const regeneratedWorkflow = await regenerateWorkflowWithFeedback(
        originalTasks,
        workflow,
        feedback
      );
      setWorkflow(regeneratedWorkflow);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate workflow');
      console.error('Regeneration error:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleBack = () => {
    setMode('input');
  };

  // Technical graph mode – lazy-loaded, feature-flagged
  if (mode === 'techGraph' && features.techGraph) {
    return (
      <Suspense
        fallback={
          <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
            <div className="w-10 h-10 border-4 border-[#FFE600] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <TechGraphPage
          scenarioText={originalTasks}
          onBack={() => setMode('preview')}
        />
      </Suspense>
    );
  }

  // Preview mode - show the clean workflow demo view
  if (mode === 'preview' && workflow) {
    return (
      <WorkflowDemoView
        workflow={workflow}
        originalTasks={originalTasks}
        onBack={handleBack}
        onTechGraph={features.techGraph ? () => setMode('techGraph') : undefined}
      />
    );
  }

  // Input mode - show the workflow input form
  return (
    <>
      <WorkflowInputView
        onGenerate={handleGenerate}
        isLoading={isLoading}
        error={error}
      />
      
      {/* Agent Review Modal */}
      {mode === 'review' && workflow && (
        <AgentReviewModal
          workflow={workflow}
          isRegenerating={isRegenerating}
          onAccept={handleAcceptAgents}
          onRequestChanges={handleRequestChanges}
        />
      )}
    </>
  );
}

export default App;
