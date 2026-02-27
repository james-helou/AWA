import { AgentGraph, validateAgentGraph, ValidationResult } from '../types/agentGraph';

// ── System prompt (inlined from techGraphPrompt.ts) ──────────────────────────

const TECH_GRAPH_SYSTEM_PROMPT = `You are an Agentic Workflow Architect. Your ONLY job is to output a machine-readable agent network as a single JSON object (the "AgentGraph"). Do NOT include markdown, prose, or explanation — return ONLY the raw JSON object.

──────────────────────────────
SCHEMA
──────────────────────────────
{
  "reasoning": "<FIRST, think step-by-step: identify the goal and distinct stages in the scenario. Map each to agent types. Decide what data flows between them. Plan the hub-and-spoke topology with feedback loops, fan-out, and direct agent-to-agent shortcuts. Write 3-6 sentences of analysis BEFORE generating the graph.>",
  "version": "1.0",
  "scenario": "<short name>",
  "nodes": [ <AgentNode …> ],
  "edges": [ <AgentEdge …> ],
  "notes": ["<optional design notes>"],
  "warnings": ["<optional warnings>"]
}

AgentNode:
  id        – unique slug (e.g. "orchestrator", "researcher-kyc")
  label     – human-readable name
  type      – EXACTLY one of: Orchestrator | Researcher | Integrator | CodeExecutor | Validator | Human
  description – one-sentence purpose
  model?    – LLM model name if relevant (e.g. "gpt-4o")
  temperature? – 0-2 float
  tools?    – list of tool/function names this agent can call
  inputs?   – list of input artifact names
  outputs?  – list of output artifact names
  triggers? – list of trigger descriptions (cron, webhook, event, etc.)
  eventsPublished? – list of event topic names this agent emits
  policies? – { retries?: int, timeoutSec?: number, concurrency?: int }
  metrics?  – { p50LatencyMs?: number, successRate?: 0-1 float, costPerRunUSD?: number }
  ui?       – { x?: number, y?: number, color?: string, icon?: string }

AgentEdge:
  id        – unique slug
  source    – must reference an existing node id
  target    – must reference an existing node id
  kind      – "control" | "data" | "event"
  label?    – short description of what flows
  condition? – guard condition (e.g. "if confidence < 0.8")

──────────────────────────────
AGENT TYPES (use ONLY these six)
──────────────────────────────
1. Orchestrator   – The central hub. Holds the goal, maintains overall state, creates a plan, delegates tasks to spoke agents, and continuously reassesses as results come back. Every other agent ultimately reports to it. State lives here — workers are stateless.
2. Researcher     – Fetches information: web search, vector DB lookups, document retrieval, API queries for data. Called whenever the orchestrator needs external knowledge to proceed.
3. Integrator     – Takes actions in the outside world: sending emails, updating CRMs, calling third-party services, provisioning accounts. The "hands" of the system.
4. CodeExecutor   – Runs code to compute, transform, or analyse data. Used when logic, math, or data transformation needs to happen that can't be done through prompting alone.
5. Validator      – Reviews outputs for correctness, quality, or safety before results are finalised or actions are taken. Acts as a quality gate. Can reject and return work to any worker for refinement.
6. Human          – A defined human-in-the-loop checkpoint: approval, review, decision, or manual input. Placed before irreversible actions or when orchestrator confidence is low.

──────────────────────────────
ARCHITECTURE PHILOSOPHY — HUB-AND-SPOKE
──────────────────────────────
The structure is a HUB-AND-SPOKE graph, NOT a pipeline. The Orchestrator is the hub.

Key interaction patterns you MUST use:
• FEEDBACK LOOPS — A spoke agent returns a result, the orchestrator evaluates it, and may send it back for refinement or pass it to the Validator. The Validator can reject and return to the worker directly.
• PARALLEL FAN-OUT — The orchestrator fans out to multiple workers simultaneously when tasks are independent, then aggregates results when they return. Show this with multiple edges leaving the orchestrator.
• DIRECT AGENT-TO-AGENT — Workers can pass outputs directly to other workers when the orchestrator doesn't need to be in the middle. Common example: Researcher feeds directly into CodeExecutor. Keep these efficient shortcuts.
• ITERATIVE REPLANNING — If a worker hits a dead end or returns unexpected results, the orchestrator revises the plan rather than failing. Show return edges from workers back to orchestrator.
• RETURN EDGES — Every spoke agent should have at least one edge returning results to the orchestrator. The orchestrator decides what happens next based on those results.

Structuring principles:
• The Orchestrator defines a clear goal and a loose plan upfront. It should NOT over-plan because early results change what's needed later.
• Keep agents NARROWLY SCOPED. Each agent does one thing well. Complexity lives in the orchestrator's decision-making, not in individual agents.
• STATE LIVES IN THE ORCHESTRATOR. Workers are mostly stateless — they receive a task, return a result, and don't need to know the bigger picture.
• ALWAYS validate before consequential actions. Anything that writes data, sends a message, or takes an irreversible action should pass through the Validator first.
• Design for failure. Each agent returns structured results (success/fail/error). The orchestrator needs this to replan intelligently.
• Human-in-the-loop is a DEFINED CHECKPOINT — placed before irreversible actions or when confidence is low. It is NOT an afterthought.

──────────────────────────────
ACCURACY & DOMAIN-MAPPING RULES
──────────────────────────────
• CAREFULLY read the business scenario. Every agent you create MUST map to a concrete step described in the scenario.
• Agent labels and descriptions MUST use the EXACT domain terminology from the scenario (e.g. "KYC Document Fetcher" not "data handler", "NAV Calculator" not "compute engine").
• tools[] MUST reference realistic, domain-specific integrations (e.g. "Bloomberg API", "DTCC gateway", "SAP BAPI", "Salesforce REST", "SQL query"). Never use vague placeholders like "tool-1" or "api-call".
• inputs[] and outputs[] MUST name concrete data artifacts from the scenario (e.g. "ISO 15022 message", "entitlement report", "trade confirmation PDF"). Never use generic names like "data" or "result".
• triggers[] should reflect realistic activation mechanisms for the domain (e.g. "SWIFT MX message received", "end-of-day batch", "user submits form").
• metrics MUST be plausible: a fast Researcher ~200-800ms, an LLM-powered orchestrator ~2000-5000ms, a Human checkpoint ~300000-1800000ms. Do NOT give all nodes the same metrics.
• DO NOT invent agents that have no basis in the scenario.
• Each agent's description MUST explain its SPECIFIC role in THIS scenario.
• policies and metrics MUST vary realistically across agents.

──────────────────────────────
TOPOLOGY RULES
──────────────────────────────
• The graph MUST be hub-and-spoke with the Orchestrator at the center — NOT a linear pipeline.
• Every spoke agent MUST have at least one edge back to the Orchestrator (returning results).
• Every edge MUST reference valid node IDs defined in the nodes array.
• Use edge kind="control" for orchestrator commands and sequencing, kind="data" for artifact hand-offs between workers, kind="event" for async notifications / pub-sub.
• Use 4–7 nodes to keep the graph readable.
• ALWAYS include a Validator node before any Integrator that performs irreversible actions.
• Include a Human node when the scenario involves approvals, decisions, or high-stakes actions.
• Keep edge labels SHORT (2-4 words) but SPECIFIC to the domain.
• NEVER produce a purely linear chain (A → B → C → D). Real architectures have the orchestrator at the center with spokes radiating out and returning.
• Include at least one FEEDBACK LOOP (orchestrator → worker → orchestrator with retry/refine).
• Include at least one DIRECT agent-to-agent shortcut (e.g. Researcher → CodeExecutor).
• Use ALL THREE edge kinds (control, data, event).

──────────────────────────────
RESPONSE FORMAT
──────────────────────────────
Return ONLY the JSON object. No markdown fences, no commentary, no extra keys.
The "reasoning" field MUST be the FIRST key in the JSON. Think carefully before generating nodes and edges.`;

// ── Mock AgentGraph (inlined from mockAgentGraph.ts) ─────────────────────────

export const mockAgentGraph: AgentGraph = {
  version: '1.0',
  scenario: 'Corporate Actions Processing',
  nodes: [
    {
      id: 'orchestrator',
      label: 'CA Orchestrator',
      type: 'Orchestrator',
      description: 'Central hub that holds the corporate action processing goal, maintains state across all steps, delegates tasks to spoke agents, and replans when workers return unexpected results.',
      model: 'gpt-4o',
      tools: ['route_task', 'aggregate_results', 'replan_on_failure'],
      inputs: ['corporate_action_notification'],
      outputs: ['processing_status', 'completion_report'],
      triggers: ['webhook: incoming SWIFT message'],
      eventsPublished: ['ca.started', 'ca.completed', 'ca.replanned'],
      policies: { retries: 3, timeoutSec: 300, concurrency: 5 },
      metrics: { p50LatencyMs: 3200, successRate: 0.97, costPerRunUSD: 0.15 },
    },
    {
      id: 'market-researcher',
      label: 'Market Data Researcher',
      type: 'Researcher',
      description: 'Fetches market data, security master records, and regulatory documents from Bloomberg, DTCC, and internal vector stores.',
      tools: ['query_bloomberg_api', 'vector_search_regulations', 'fetch_security_master'],
      inputs: ['security_identifiers', 'action_type'],
      outputs: ['market_data', 'regulatory_docs'],
      policies: { retries: 3, timeoutSec: 30, concurrency: 10 },
      metrics: { p50LatencyMs: 450, successRate: 0.98, costPerRunUSD: 0.03 },
    },
    {
      id: 'entitlement-calculator',
      label: 'Entitlement Calculator',
      type: 'CodeExecutor',
      description: 'Computes entitlements, cash flows, tax withholdings, and position impacts using market data and corporate action parameters.',
      tools: ['calculate_entitlements', 'compute_tax_withholding', 'python_sandbox'],
      inputs: ['market_data', 'regulatory_docs'],
      outputs: ['entitlement_report', 'position_impact'],
      policies: { retries: 1, timeoutSec: 120 },
      metrics: { p50LatencyMs: 2500, successRate: 0.93, costPerRunUSD: 0.05 },
    },
    {
      id: 'quality-validator',
      label: 'Calculation Validator',
      type: 'Validator',
      description: 'Reviews entitlement calculations for correctness against business rules and flags anomalies. Can reject and return to the calculator for refinement.',
      model: 'gpt-4o',
      tools: ['validate_calculations', 'check_anomalies', 'compare_historical'],
      inputs: ['entitlement_report'],
      outputs: ['validation_result', 'confidence_score'],
      eventsPublished: ['ca.validated', 'ca.rejected'],
      policies: { retries: 1, timeoutSec: 60 },
      metrics: { p50LatencyMs: 1800, successRate: 0.98, costPerRunUSD: 0.06 },
    },
    {
      id: 'analyst-review',
      label: 'Senior Analyst Review',
      type: 'Human',
      description: 'Defined human checkpoint for high-value or anomalous corporate actions requiring manual sign-off before irreversible booking.',
      inputs: ['entitlement_report', 'validation_result', 'anomaly_flags'],
      outputs: ['review_decision'],
      triggers: ['event: ca.rejected', 'orchestrator: low confidence'],
      metrics: { p50LatencyMs: 1800000, successRate: 0.99, costPerRunUSD: 25.0 },
    },
    {
      id: 'trade-booker',
      label: 'Trade Booker & Notifier',
      type: 'Integrator',
      description: 'Books the corporate action in the core system, updates positions, generates settlement instructions, and sends notifications to stakeholders.',
      tools: ['book_corporate_action', 'send_email', 'post_slack_message', 'update_positions_db'],
      inputs: ['approved_entitlement_report'],
      outputs: ['booking_confirmation', 'settlement_instructions'],
      eventsPublished: ['ca.booked'],
      policies: { retries: 2, timeoutSec: 60 },
      metrics: { p50LatencyMs: 400, successRate: 0.98, costPerRunUSD: 0.03 },
    },
  ],
  edges: [
    // Orchestrator fans out to spoke agents
    { id: 'e1', source: 'orchestrator', target: 'market-researcher', kind: 'control', label: 'fetch market data' },
    // Direct agent-to-agent shortcut: Researcher feeds into CodeExecutor
    { id: 'e2', source: 'market-researcher', target: 'entitlement-calculator', kind: 'data', label: 'market data' },
    // Researcher reports back to orchestrator
    { id: 'e3', source: 'market-researcher', target: 'orchestrator', kind: 'event', label: 'retrieval complete' },
    // Calculator returns results to orchestrator
    { id: 'e4', source: 'entitlement-calculator', target: 'orchestrator', kind: 'data', label: 'entitlement report' },
    // Orchestrator routes to validator before consequential action
    { id: 'e5', source: 'orchestrator', target: 'quality-validator', kind: 'control', label: 'validate report' },
    // Validator passes — orchestrator sends to integrator
    { id: 'e6', source: 'quality-validator', target: 'orchestrator', kind: 'data', label: 'validation result' },
    // Feedback loop: validator rejects → back to calculator for refinement
    { id: 'e7', source: 'quality-validator', target: 'entitlement-calculator', kind: 'control', label: 'refine calc', condition: 'validation failed' },
    // Orchestrator routes to human when confidence is low
    { id: 'e8', source: 'orchestrator', target: 'analyst-review', kind: 'control', label: 'request review', condition: 'confidence < 0.9' },
    // Human returns decision to orchestrator
    { id: 'e9', source: 'analyst-review', target: 'orchestrator', kind: 'data', label: 'review decision' },
    // Orchestrator sends to integrator after validation / human approval
    { id: 'e10', source: 'orchestrator', target: 'trade-booker', kind: 'control', label: 'book trade' },
    // Integrator reports completion back to orchestrator
    { id: 'e11', source: 'trade-booker', target: 'orchestrator', kind: 'event', label: 'booking confirmed' },
  ],
  notes: [
    'Hub-and-spoke: Orchestrator is the central hub, all workers report back.',
    'Validator acts as quality gate before the Integrator performs irreversible booking.',
    'Direct shortcut: Researcher feeds data straight to CodeExecutor without routing through Orchestrator.',
    'Human checkpoint placed before irreversible trade booking when confidence is low.',
  ],
  warnings: [
    'Human review can introduce ~30 min latency.',
    'Calculator feedback loop is capped at 2 retries before escalation to human.',
  ],
};

// ── Azure OpenAI config ──────────────────────────────────────────────────────

const AZURE_OPENAI_KEY = import.meta.env.VITE_AZURE_OPENAI_KEY;
const AZURE_OPENAI_ENDPOINT = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_MODEL = import.meta.env.VITE_AZURE_OPENAI_MODEL;
const AZURE_OPENAI_API_VERSION = import.meta.env.VITE_AZURE_OPENAI_API_VERSION;

/**
 * Call Azure OpenAI with the technical graph system prompt.
 * Reuses the same env-var–based config as the business generator but with
 * a completely separate system prompt and response contract.
 */
async function callAzureOpenAIForGraph(
  messages: { role: string; content: string }[],
): Promise<string> {
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
      max_completion_tokens: 16000,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Azure OpenAI error (tech graph):', errorText);
    throw new Error(`Failed to generate agent graph: ${response.status} – ${errorText}`);
  }

  const data = await response.json();
  let content: string = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('No response from AI');
  }

  // Strip markdown fences if present
  content = content.trim();
  if (content.startsWith('```json')) content = content.slice(7);
  else if (content.startsWith('```')) content = content.slice(3);
  if (content.endsWith('```')) content = content.slice(0, -3);

  return content.trim();
}

export interface GenerateGraphResult {
  graph: AgentGraph | null;
  validation: ValidationResult;
  raw?: string;
}

/**
 * Generate a technical AgentGraph for the given scenario text.
 * This is a standalone product — it reads ONLY the raw process description
 * and designs an optimal technical agent architecture from scratch.
 */
export async function generateAgentGraph(scenarioText: string): Promise<GenerateGraphResult> {
  const messages = [
    { role: 'system', content: TECH_GRAPH_SYSTEM_PROMPT },
    {
      role: 'user',
      content: `Design a technical agentic workflow graph for the following business scenario. Read the scenario CAREFULLY and architect a hub-and-spoke agent network using the five agent types (Orchestrator, Researcher, Integrator, CodeExecutor, Validator) plus Human checkpoints where needed. Use exact domain terminology from the text.

BUSINESS SCENARIO:
${scenarioText}

REQUIREMENTS:
- The Orchestrator is the CENTRAL HUB — all spoke agents report back to it
- Decompose the scenario into: information gathering (Researcher), computations/transforms (CodeExecutor), external actions (Integrator), quality checks (Validator), and human approvals (Human)
- Use at least 3 different agent types — do NOT make all agents the same type
- Include FEEDBACK LOOPS: workers return results, orchestrator may re-task them
- Include at least one DIRECT agent-to-agent shortcut (e.g. Researcher → CodeExecutor)
- ALWAYS validate before irreversible Integrator actions
- Place Human checkpoints before high-stakes or irreversible actions
- Use all three edge kinds: control (commands), data (artifact hand-off), event (async notifications)
- Use EXACT domain-specific names, tools, and data artifacts from the scenario
- Include realistic metrics (latency, success rate, cost) appropriate for the domain
- Do NOT invent steps or agents that aren't grounded in the scenario
- Every spoke agent must have at least one return edge to the Orchestrator`,
    },
  ];

  const raw = await callAzureOpenAIForGraph(messages);

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      graph: null,
      validation: {
        success: false,
        errors: ['AI response was not valid JSON. Try regenerating.'],
      },
      raw,
    };
  }

  // Strip chain-of-thought reasoning before display (but log it)
  if (typeof (parsed as any).reasoning === 'string') {
    console.log('[Tech Graph] Chain-of-thought:', (parsed as any).reasoning);
    delete (parsed as any).reasoning;
  }

  const validation = validateAgentGraph(parsed);
  return {
    graph: validation.data ?? null,
    validation,
    raw,
  };
}
