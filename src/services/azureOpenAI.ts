import { Workflow, Agent, DataSource, HumanTouchpoint, AgentColor } from '../types/workflow';

const AZURE_OPENAI_KEY = import.meta.env.VITE_AZURE_OPENAI_KEY;
const AZURE_OPENAI_ENDPOINT = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_MODEL = import.meta.env.VITE_AZURE_OPENAI_MODEL;
const AZURE_OPENAI_API_VERSION = import.meta.env.VITE_AZURE_OPENAI_API_VERSION;

const SYSTEM_PROMPT = `You are an expert Agentic AI Workflow Architect. Analyze business processes and design optimal multi-agent workflows.

When given a list of tasks:
1. Analyze tasks to understand the business process
2. Group related tasks into logical stages
3. Identify AI agents needed
4. Design workflow with clear agent responsibilities
5. Identify data sources needed
6. Identify where human touchpoints are required

Respond with ONLY a valid JSON object (no markdown, no explanation):
{
  "name": "Short Name (2-4 words max)",
  "description": "Brief description",
  "estimatedBuildTime": "X-Y weeks",
  "estimatedComplexity": "low|medium|high",
  "tags": ["tag1", "tag2"],
  "agents": [
    {
      "name": "Agent Name",
      "description": "What this agent does",
      "type": "automated|human-in-loop",
      "color": "blue|purple|green|amber|red|indigo|pink|cyan",
      "triggerType": "manual|scheduled|event|previous-agent",
      "triggerDescription": "What triggers this agent",
      "actions": ["Action 1", "Action 2"],
      "integrations": ["System 1", "API 2"],
      "outputs": [
        {"name": "Output Name", "type": "data|notification|document|decision"}
      ]
    }
  ],
  "dataSources": [
    {
      "name": "Data Source Name",
      "type": "email|api|database|file|webhook|manual|scraper",
      "description": "What data this provides"
    }
  ],
  "humanTouchpoints": [
    {
      "name": "Touchpoint Name",
      "type": "approval|decision|input|review",
      "description": "When human involvement is needed",
      "agentName": "Which agent this relates to",
      "required": true
    }
  ]
}

Use 3-6 agents. Each agent should have 2-5 actions. Keep the workflow name SHORT (2-4 words). Return ONLY raw JSON.`;

// Type for raw LLM response
interface LLMWorkflowResponse {
  name: string;
  description: string;
  estimatedBuildTime?: string;
  estimatedComplexity?: 'low' | 'medium' | 'high';
  tags?: string[];
  agents: {
    name: string;
    description?: string;
    type?: 'automated' | 'human-in-loop';
    color?: AgentColor;
    triggerType?: 'manual' | 'scheduled' | 'event' | 'previous-agent';
    triggerDescription?: string;
    actions?: string[];
    integrations?: string[];
    outputs?: { name: string; type: 'data' | 'notification' | 'document' | 'decision' }[];
  }[];
  dataSources?: {
    name: string;
    type?: 'email' | 'api' | 'database' | 'file' | 'webhook' | 'manual' | 'scraper';
    description?: string;
  }[];
  humanTouchpoints?: {
    name: string;
    type?: 'approval' | 'decision' | 'input' | 'review';
    description?: string;
    agentName?: string;
    required?: boolean;
  }[];
}

const DATA_SOURCE_ICONS: Record<string, string> = {
  email: '📧',
  api: '🔌',
  database: '🗄️',
  file: '📁',
  webhook: '🔗',
  manual: '✏️',
  scraper: '🕷️'
};

async function callAzureOpenAI(messages: { role: string; content: string }[]): Promise<string> {
  if (!AZURE_OPENAI_KEY || !AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_MODEL) {
    throw new Error('Azure OpenAI configuration is missing. Check your .env file.');
  }

  const url = `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_MODEL}/chat/completions?api-version=${AZURE_OPENAI_API_VERSION}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': AZURE_OPENAI_KEY,
    },
    body: JSON.stringify({
      messages,
      max_completion_tokens: 4096,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Azure OpenAI error:', errorText);
    throw new Error(`Failed to generate workflow: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  let content = data.choices?.[0]?.message?.content;
  
  if (!content) {
    throw new Error('No response from AI');
  }

  // Clean up potential markdown code blocks
  content = content.trim();
  if (content.startsWith('```json')) {
    content = content.slice(7);
  } else if (content.startsWith('```')) {
    content = content.slice(3);
  }
  if (content.endsWith('```')) {
    content = content.slice(0, -3);
  }
  
  return content.trim();
}

function parseWorkflowResponse(content: string, originalTasks: string): Workflow {
  let llmResponse: LLMWorkflowResponse;
  try {
    llmResponse = JSON.parse(content);
  } catch (parseError) {
    console.error('Failed to parse AI response:', content);
    throw new Error('Failed to parse workflow from AI response');
  }

  // Transform LLM response to proper Workflow type
  const workflowId = `wf-${Date.now()}`;
  
  const agents: Agent[] = (llmResponse.agents || []).map((agent, i) => ({
    id: `agent-${i + 1}`,
    order: i + 1,
    name: agent.name || `Agent ${i + 1}`,
    description: agent.description || '',
    type: agent.type || 'automated',
    color: agent.color || (['blue', 'purple', 'green', 'amber', 'indigo', 'pink'] as AgentColor[])[i % 6],
    trigger: {
      type: agent.triggerType || (i === 0 ? 'manual' : 'previous-agent'),
      description: agent.triggerDescription || ''
    },
    actions: agent.actions || [],
    integrations: agent.integrations || [],
    outputs: (agent.outputs || []).map(o => ({
      name: o.name || 'Output',
      type: o.type || 'data'
    }))
  }));

  const dataSources: DataSource[] = (llmResponse.dataSources || []).map((ds, i) => ({
    id: `ds-${i + 1}`,
    name: ds.name || `Data Source ${i + 1}`,
    type: ds.type || 'api',
    icon: DATA_SOURCE_ICONS[ds.type || 'api'] || '📦',
    description: ds.description || ''
  }));

  const humanTouchpoints: HumanTouchpoint[] = (llmResponse.humanTouchpoints || []).map((ht, i) => {
    // Try to match agentName to an agent ID
    const matchedAgent = agents.find(a => 
      a.name.toLowerCase().includes((ht.agentName || '').toLowerCase()) ||
      (ht.agentName || '').toLowerCase().includes(a.name.toLowerCase())
    );
    return {
      id: `ht-${i + 1}`,
      agentId: matchedAgent?.id || agents[0]?.id || 'agent-1',
      name: ht.name || `Touchpoint ${i + 1}`,
      type: ht.type || 'approval',
      description: ht.description || '',
      required: ht.required !== false
    };
  });

  const workflow: Workflow = {
    id: workflowId,
    name: llmResponse.name || 'Generated Workflow',
    description: llmResponse.description || '',
    originalPrompt: originalTasks,
    generatedAt: new Date().toISOString(),
    agents,
    dataSources,
    humanTouchpoints,
    estimatedComplexity: llmResponse.estimatedComplexity || 'medium',
    estimatedBuildTime: llmResponse.estimatedBuildTime || '2-4 weeks',
    tags: llmResponse.tags || []
  };

  return workflow;
}

export async function generateWorkflowWithAI(tasks: string): Promise<Workflow> {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: `Analyze these tasks and design an optimal multi-agent workflow:\n\n${tasks}` }
  ];
  
  const content = await callAzureOpenAI(messages);
  return parseWorkflowResponse(content, tasks);
}

export async function regenerateWorkflowWithFeedback(
  tasks: string, 
  currentWorkflow: Workflow, 
  feedback: string
): Promise<Workflow> {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: `Analyze these tasks and design an optimal multi-agent workflow:\n\n${tasks}` },
    { role: 'assistant', content: JSON.stringify({
      name: currentWorkflow.name,
      description: currentWorkflow.description,
      estimatedBuildTime: currentWorkflow.estimatedBuildTime,
      estimatedComplexity: currentWorkflow.estimatedComplexity,
      agents: currentWorkflow.agents.map(a => ({
        name: a.name,
        description: a.description,
        type: a.type,
        color: a.color,
        triggerType: a.trigger.type,
        triggerDescription: a.trigger.description,
        actions: a.actions,
        integrations: a.integrations,
        outputs: a.outputs
      })),
      dataSources: currentWorkflow.dataSources.map(ds => ({
        name: ds.name,
        type: ds.type,
        description: ds.description
      })),
      humanTouchpoints: currentWorkflow.humanTouchpoints.map(ht => ({
        name: ht.name,
        type: ht.type,
        description: ht.description,
        required: ht.required
      }))
    }) },
    { role: 'user', content: `The user has reviewed the agents and has this feedback:\n\n"${feedback}"\n\nPlease regenerate the workflow with these changes in mind. Keep the same JSON format.` }
  ];
  
  const content = await callAzureOpenAI(messages);
  return parseWorkflowResponse(content, tasks);
}
