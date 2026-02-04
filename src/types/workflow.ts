// Core workflow schema - this is what the generator produces
// and what the renderer consumes

export interface Workflow {
  id: string;
  name: string;
  description: string;
  originalPrompt: string;
  generatedAt: string;
  
  agents: Agent[];
  dataSources: DataSource[];
  humanTouchpoints: HumanTouchpoint[];
  
  // Metadata
  estimatedComplexity: 'low' | 'medium' | 'high';
  estimatedBuildTime: string;
  tags: string[];
}

export interface Agent {
  id: string;
  order: number;
  name: string;
  description: string;
  type: 'automated' | 'human-in-loop';
  color: AgentColor;
  
  // What starts this agent
  trigger: {
    type: 'manual' | 'scheduled' | 'event' | 'previous-agent';
    description: string;
  };
  
  // What this agent does
  actions: string[];
  
  // What systems it connects to
  integrations: string[];
  
  // What it produces
  outputs: {
    name: string;
    type: 'data' | 'notification' | 'document' | 'decision';
  }[];
  
  // Sample data to show in preview
  sampleData?: SampleDataConfig;
}

export type AgentColor = 'blue' | 'purple' | 'green' | 'amber' | 'red' | 'indigo' | 'pink' | 'cyan';

export interface DataSource {
  id: string;
  name: string;
  type: 'email' | 'api' | 'database' | 'file' | 'webhook' | 'manual' | 'scraper';
  icon: string;
  description: string;
}

export interface HumanTouchpoint {
  id: string;
  agentId: string;
  name: string;
  type: 'approval' | 'decision' | 'input' | 'review';
  description: string;
  required: boolean;
}

export interface SampleDataConfig {
  type: 'table' | 'cards' | 'timeline' | 'list';
  title: string;
  description?: string;
  columns?: { key: string; label: string; type?: 'text' | 'status' | 'date' | 'money' }[];
  rows?: Record<string, any>[];
  items?: { title: string; subtitle?: string; status?: string; metadata?: Record<string, string> }[];
}

// Input types - different ways users can create workflows
export interface WorkflowInput {
  type: 'text' | 'template' | 'form' | 'file';
  content: string | TemplateSelection | FormData | FileUpload;
}

export interface TemplateSelection {
  templateId: string;
  customization?: string;
  customizations?: Record<string, string>;
  modifiedWorkflow?: Omit<Workflow, 'id' | 'originalPrompt' | 'generatedAt'>;
}

export interface FormData {
  goal: string;
  steps: string[];
  dataSources: string[];
  approvals: string[];
}

export interface FileUpload {
  fileName: string;
  content: string;
  mimeType: string;
}

// Template for pre-built workflows
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  tags: string[];
  previewImage?: string;
  workflow: Omit<Workflow, 'id' | 'originalPrompt' | 'generatedAt'>;
}
