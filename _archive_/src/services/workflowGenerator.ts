import { Workflow, WorkflowInput, Agent, DataSource, HumanTouchpoint } from '../types/workflow';
import { workflowTemplates } from '../data/templates';

// This is the main generator function
// Currently uses keyword matching - can be swapped for LLM later
export async function generateWorkflow(input: WorkflowInput): Promise<Workflow> {
  const id = `workflow-${Date.now()}`;
  const generatedAt = new Date().toISOString();
  
  if (input.type === 'template') {
    return generateFromTemplate(input.content as { templateId: string }, id, generatedAt);
  }
  
  if (input.type === 'text') {
    return generateFromText(input.content as string, id, generatedAt);
  }
  
  if (input.type === 'form') {
    return generateFromForm(input.content as any, id, generatedAt);
  }
  
  throw new Error('Unsupported input type');
}

// Generate from a pre-built template
function generateFromTemplate(
  selection: { templateId: string; customizations?: Record<string, string> },
  id: string,
  generatedAt: string
): Workflow {
  const template = workflowTemplates.find(t => t.id === selection.templateId);
  
  if (!template) {
    throw new Error(`Template not found: ${selection.templateId}`);
  }
  
  return {
    ...template.workflow,
    id,
    originalPrompt: `Template: ${template.name}`,
    generatedAt
  };
}

// Generate from natural language text using keyword matching
// TODO: Replace with LLM call when available
function generateFromText(text: string, id: string, generatedAt: string): Workflow {
  const lowerText = text.toLowerCase();
  
  // Try to match to an existing template first
  const matchedTemplate = findBestTemplateMatch(lowerText);
  if (matchedTemplate) {
    return {
      ...matchedTemplate.workflow,
      id,
      originalPrompt: text,
      generatedAt,
      name: extractWorkflowName(text) || matchedTemplate.workflow.name,
      description: `Generated from: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`
    };
  }
  
  // If no template matches, build a generic workflow from keywords
  return buildWorkflowFromKeywords(text, id, generatedAt);
}

// Find the best matching template based on keywords
function findBestTemplateMatch(text: string): typeof workflowTemplates[0] | null {
  const scores = workflowTemplates.map(template => {
    let score = 0;
    
    // Check template tags
    template.tags.forEach(tag => {
      if (text.includes(tag.toLowerCase())) {
        score += 10;
      }
    });
    
    // Check template name words
    template.name.toLowerCase().split(' ').forEach(word => {
      if (word.length > 3 && text.includes(word)) {
        score += 5;
      }
    });
    
    // Check template description words
    template.description.toLowerCase().split(' ').forEach(word => {
      if (word.length > 4 && text.includes(word)) {
        score += 2;
      }
    });
    
    return { template, score };
  });
  
  const best = scores.sort((a, b) => b.score - a.score)[0];
  return best.score >= 10 ? best.template : null;
}

// Extract a workflow name from the input text
function extractWorkflowName(text: string): string | null {
  // Look for patterns like "build a X system" or "create X workflow"
  const patterns = [
    /build (?:a |an )?(.+?) (?:system|workflow|process|automation)/i,
    /create (?:a |an )?(.+?) (?:system|workflow|process|automation)/i,
    /automate (?:the |my )?(.+?)(?:\.|$)/i,
    /(?:system|workflow|process) for (.+?)(?:\.|$)/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return capitalizeWords(match[1].trim());
    }
  }
  
  return null;
}

// Build a workflow from detected keywords
function buildWorkflowFromKeywords(text: string, id: string, generatedAt: string): Workflow {
  const lowerText = text.toLowerCase();
  
  // Detect workflow components
  const agents: Agent[] = [];
  const dataSources: DataSource[] = [];
  const humanTouchpoints: HumanTouchpoint[] = [];
  
  // Detect data sources
  if (lowerText.includes('email')) {
    dataSources.push({ id: 'ds-email', name: 'Email', type: 'email', icon: 'Mail', description: 'Email integration' });
  }
  if (lowerText.includes('api') || lowerText.includes('integration')) {
    dataSources.push({ id: 'ds-api', name: 'External API', type: 'api', icon: 'Globe', description: 'API integration' });
  }
  if (lowerText.includes('database') || lowerText.includes('data')) {
    dataSources.push({ id: 'ds-db', name: 'Database', type: 'database', icon: 'Database', description: 'Data storage' });
  }
  if (lowerText.includes('file') || lowerText.includes('document') || lowerText.includes('upload')) {
    dataSources.push({ id: 'ds-file', name: 'File Upload', type: 'file', icon: 'FileText', description: 'Document processing' });
  }
  if (lowerText.includes('webhook')) {
    dataSources.push({ id: 'ds-webhook', name: 'Webhook', type: 'webhook', icon: 'Zap', description: 'Event webhook' });
  }
  
  if (dataSources.length === 0) {
    dataSources.push({ id: 'ds-manual', name: 'Manual Input', type: 'manual', icon: 'Edit', description: 'Manual data entry' });
  }
  
  // Detect actions and build agents
  const actionKeywords = {
    intake: ['receive', 'intake', 'collect', 'gather', 'ingest', 'import', 'get', 'fetch'],
    process: ['process', 'analyze', 'extract', 'transform', 'parse', 'validate', 'classify'],
    review: ['review', 'approve', 'check', 'verify', 'confirm', 'audit'],
    notify: ['notify', 'alert', 'send', 'email', 'communicate', 'inform'],
    execute: ['execute', 'run', 'perform', 'complete', 'finish', 'submit'],
    store: ['store', 'save', 'record', 'update', 'sync', 'archive']
  };
  
  const detectedActions: string[] = [];
  Object.entries(actionKeywords).forEach(([category, keywords]) => {
    if (keywords.some(k => lowerText.includes(k))) {
      detectedActions.push(category);
    }
  });
  
  // Build agents based on detected actions
  let agentOrder = 1;
  
  // Always have an intake agent
  agents.push({
    id: 'agent-1',
    order: agentOrder++,
    name: 'Data Intake & Processing',
    description: 'Receives and processes incoming data from configured sources',
    type: 'automated',
    color: 'blue',
    trigger: { type: 'event', description: 'New data received' },
    actions: ['Receive input', 'Validate data', 'Extract information', 'Prepare for processing'],
    integrations: dataSources.map(ds => ds.name),
    outputs: [{ name: 'Processed Data', type: 'data' }]
  });
  
  // Add review agent if approval/review detected
  if (detectedActions.includes('review') || lowerText.includes('approv') || lowerText.includes('human')) {
    const reviewAgent: Agent = {
      id: `agent-${agentOrder}`,
      order: agentOrder++,
      name: 'Review & Approval',
      description: 'Routes items for human review and collects decisions',
      type: 'human-in-loop',
      color: 'purple',
      trigger: { type: 'previous-agent', description: 'Data processed and ready for review' },
      actions: ['Route for review', 'Collect decision', 'Handle escalations'],
      integrations: ['Review Dashboard', 'Notifications'],
      outputs: [{ name: 'Approval Decision', type: 'decision' }]
    };
    agents.push(reviewAgent);
    
    humanTouchpoints.push({
      id: 'ht-1',
      agentId: reviewAgent.id,
      name: 'Human Review',
      type: 'approval',
      description: 'Human reviews and approves or rejects',
      required: true
    });
  }
  
  // Add execution/completion agent
  agents.push({
    id: `agent-${agentOrder}`,
    order: agentOrder++,
    name: 'Execution & Completion',
    description: 'Executes final actions and records results',
    type: 'automated',
    color: 'green',
    trigger: { type: 'previous-agent', description: 'Previous step completed' },
    actions: ['Execute action', 'Update records', 'Send confirmations', 'Archive results'],
    integrations: ['Target System', 'Notification Service'],
    outputs: [
      { name: 'Completion Record', type: 'data' },
      { name: 'Confirmation', type: 'notification' }
    ]
  });
  
  // Determine complexity
  const complexity = agents.length > 3 ? 'high' : agents.length > 2 ? 'medium' : 'low';
  const buildTime = complexity === 'high' ? '4-6 weeks' : complexity === 'medium' ? '2-4 weeks' : '1-2 weeks';
  
  return {
    id,
    name: extractWorkflowName(text) || 'Custom Workflow',
    description: `Generated from: "${text.substring(0, 150)}${text.length > 150 ? '...' : ''}"`,
    originalPrompt: text,
    generatedAt,
    agents,
    dataSources,
    humanTouchpoints,
    estimatedComplexity: complexity,
    estimatedBuildTime: buildTime,
    tags: detectedActions
  };
}

// Generate from structured form input
function generateFromForm(formData: any, id: string, generatedAt: string): Workflow {
  const { goal, steps, dataSources: dsNames, approvals } = formData;
  
  const agents: Agent[] = steps.map((step: string, index: number) => ({
    id: `agent-${index + 1}`,
    order: index + 1,
    name: capitalizeWords(step),
    description: `Step ${index + 1}: ${step}`,
    type: approvals?.includes(step) ? 'human-in-loop' : 'automated',
    color: getColorForIndex(index),
    trigger: {
      type: index === 0 ? 'event' : 'previous-agent',
      description: index === 0 ? 'Workflow triggered' : 'Previous step completed'
    },
    actions: [`Execute: ${step}`],
    integrations: [],
    outputs: [{ name: `${step} Result`, type: 'data' }]
  }));
  
  const dataSources: DataSource[] = (dsNames || []).map((name: string, index: number) => ({
    id: `ds-${index + 1}`,
    name,
    type: 'api' as const,
    icon: 'Database',
    description: `${name} data source`
  }));
  
  const humanTouchpoints: HumanTouchpoint[] = (approvals || []).map((approval: string, index: number) => ({
    id: `ht-${index + 1}`,
    agentId: agents.find(a => a.name.toLowerCase().includes(approval.toLowerCase()))?.id || agents[0].id,
    name: `Approve: ${approval}`,
    type: 'approval' as const,
    description: `Human approval for ${approval}`,
    required: true
  }));
  
  return {
    id,
    name: capitalizeWords(goal) || 'Custom Workflow',
    description: `Workflow to ${goal}`,
    originalPrompt: `Goal: ${goal}\nSteps: ${steps.join(', ')}`,
    generatedAt,
    agents,
    dataSources,
    humanTouchpoints,
    estimatedComplexity: agents.length > 4 ? 'high' : agents.length > 2 ? 'medium' : 'low',
    estimatedBuildTime: agents.length > 4 ? '4-6 weeks' : agents.length > 2 ? '2-4 weeks' : '1-2 weeks',
    tags: []
  };
}

// Helper functions
function capitalizeWords(str: string): string {
  return str.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

function getColorForIndex(index: number): Agent['color'] {
  const colors: Agent['color'][] = ['blue', 'purple', 'green', 'amber', 'indigo', 'pink', 'cyan', 'red'];
  return colors[index % colors.length];
}

// ============================================
// LLM INTEGRATION PLACEHOLDER
// ============================================
// When you're ready to add LLM support, uncomment and configure this:
//
// import OpenAI from 'openai';
// 
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// 
// async function generateWithLLM(text: string, id: string, generatedAt: string): Promise<Workflow> {
//   const systemPrompt = `You are a workflow architect. Given a user's task description, 
// break it down into an agentic workflow. Return a JSON object with this structure:
// {
//   "name": "Workflow name",
//   "description": "Brief description",
//   "agents": [
//     {
//       "name": "Agent name",
//       "description": "What this agent does",
//       "type": "automated" | "human-in-loop",
//       "trigger": { "type": "event" | "scheduled" | "previous-agent", "description": "..." },
//       "actions": ["action1", "action2"],
//       "integrations": ["system1", "system2"],
//       "outputs": [{ "name": "output name", "type": "data" | "notification" | "document" | "decision" }]
//     }
//   ],
//   "dataSources": [{ "name": "...", "type": "email" | "api" | "database" | "file", "description": "..." }],
//   "humanTouchpoints": [{ "name": "...", "type": "approval" | "decision" | "input" | "review", "description": "..." }],
//   "estimatedComplexity": "low" | "medium" | "high",
//   "tags": ["tag1", "tag2"]
// }`;
// 
//   const response = await openai.chat.completions.create({
//     model: "gpt-4",
//     messages: [
//       { role: "system", content: systemPrompt },
//       { role: "user", content: text }
//     ],
//     response_format: { type: "json_object" }
//   });
// 
//   const generated = JSON.parse(response.choices[0].message.content);
//   
//   // Add IDs and other required fields
//   return {
//     id,
//     originalPrompt: text,
//     generatedAt,
//     ...generated,
//     agents: generated.agents.map((a: any, i: number) => ({
//       ...a,
//       id: `agent-${i + 1}`,
//       order: i + 1,
//       color: getColorForIndex(i)
//     })),
//     dataSources: generated.dataSources.map((ds: any, i: number) => ({
//       ...ds,
//       id: `ds-${i + 1}`,
//       icon: getIconForDataSource(ds.type)
//     })),
//     humanTouchpoints: generated.humanTouchpoints.map((ht: any, i: number) => ({
//       ...ht,
//       id: `ht-${i + 1}`,
//       agentId: generated.agents.find((a: any) => a.type === 'human-in-loop')?.id || 'agent-1',
//       required: true
//     })),
//     estimatedBuildTime: generated.estimatedComplexity === 'high' ? '4-6 weeks' : 
//                         generated.estimatedComplexity === 'medium' ? '2-4 weeks' : '1-2 weeks'
//   };
// }
