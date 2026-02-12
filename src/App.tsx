import React, { useState } from 'react';
import { Workflow } from './types/workflow';
import { generateWorkflowWithAI, regenerateWorkflowWithFeedback } from './services/azureOpenAI';
import { WorkflowInputView } from './components/WorkflowInputView';
import { AgentReviewModal } from './components/AgentReviewModal';
import { WorkflowDemoView } from './components/WorkflowDemoView';

// App modes
type AppMode = 'input' | 'review' | 'preview';

function App() {
  const [mode, setMode] = useState<AppMode>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [originalTasks, setOriginalTasks] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

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

  // Preview mode - show the clean workflow demo view
  if (mode === 'preview' && workflow) {
    return (
      <WorkflowDemoView
        workflow={workflow}
        originalTasks={originalTasks}
        onBack={handleBack}
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
