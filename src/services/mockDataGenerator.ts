// src/services/mockDataGenerator.ts
// Service to generate AI-powered mock data for each agent's dashboard preview.
// One LLM call per agent – called after the initial workflow generation.

import { Agent } from '../types/workflow';

// Types for the raw LLM response before normalisation
export interface AIMockData {
  activityFeed?: Array<{ id: string; type: string; message: string; time: string; user?: string; metadata?: any }>;
  rows?: Array<Record<string, any>>;
  metrics?: Array<{ label: string; value: string; subtext: string; color: string }>;
  tableTitle?: string;
  tableSubtitle?: string;
  columns?: Array<{ key: string; label: string }>;
  uiType?: string;
  [key: string]: any;
}

/** Pre-built entity pool shared across all agent mock-data calls */
export interface SharedEntityPool {
  clientNames: string[];
  accountIds: string[];
  transactionIds: string[];
  amounts: string[];
  dates: string[];
  products: string[];
  regions: string[];
  staffNames: string[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

// Get Azure OpenAI configuration from environment variables
function getAzureConfig() {
  const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
  const model = import.meta.env.VITE_AZURE_OPENAI_MODEL;
  const apiVersion = import.meta.env.VITE_AZURE_OPENAI_API_VERSION;
  const apiKey = import.meta.env.VITE_AZURE_OPENAI_KEY;

  if (!endpoint || !model || !apiKey) {
    throw new Error('Azure OpenAI configuration missing – check VITE_AZURE_OPENAI_* env vars');
  }

  return {
    url: `${endpoint}/openai/deployments/${model}/chat/completions?api-version=${apiVersion}`,
    apiKey,
  };
}

/** Strip markdown fences and extract the first JSON object from raw LLM text */
function extractJSON(raw: string): Record<string, any> {
  let text = raw.trim();
  // Remove ```json … ``` wrappers
  if (text.startsWith('```json')) text = text.slice(7);
  else if (text.startsWith('```')) text = text.slice(3);
  if (text.endsWith('```')) text = text.slice(0, -3);
  text = text.trim();

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object found in LLM response');

  return JSON.parse(text.slice(start, end + 1));
}

/** Validate & normalise the parsed response so the UI never crashes */
function normaliseResponse(parsed: Record<string, any>, agent: Agent): AIMockData {
  // Ensure metrics is an array with correct shape
  const metrics = Array.isArray(parsed.metrics)
    ? parsed.metrics.map((m: any) => ({
        label: String(m.label ?? ''),
        value: String(m.value ?? '0'),
        subtext: String(m.subtext ?? ''),
        color: ['blue', 'green', 'amber', 'red', 'purple'].includes(m.color) ? m.color : 'blue',
      }))
    : [];

  // Ensure columns is an array with correct shape
  const columns = Array.isArray(parsed.columns)
    ? parsed.columns.map((c: any) => ({
        key: String(c.key ?? 'field'),
        label: String(c.label ?? c.key ?? 'Field'),
      }))
    : [{ key: 'id', label: 'ID' }, { key: 'status', label: 'Status' }];

  // Ensure every row has all column keys + an id + _statusColor
  const columnKeys = columns.map((c: any) => c.key);
  const rows = Array.isArray(parsed.rows)
    ? parsed.rows.map((row: any, i: number) => {
        const clean: Record<string, any> = {};
        // Copy over all column keys (default to '')
        for (const key of columnKeys) {
          clean[key] = row[key] != null ? row[key] : '';
        }
        clean.id = row.id || `ITEM-${String(i + 1).padStart(3, '0')}`;
        clean._statusColor =
          ['green', 'amber', 'red', 'blue', 'purple'].includes(row._statusColor)
            ? row._statusColor
            : 'blue';
        return clean;
      })
    : [];

  // Ensure activityFeed is well-formed
  const activityFeed = Array.isArray(parsed.activityFeed)
    ? parsed.activityFeed.map((a: any, i: number) => ({
        id: String(a.id ?? i),
        type: ['success', 'warning', 'info', 'error'].includes(a.type) ? a.type : 'info',
        message: String(a.message ?? ''),
        time: String(a.time ?? ''),
        user: a.user ? String(a.user) : undefined,
        metadata: a.metadata,
      }))
    : [];

  return {
    tableTitle: String(parsed.tableTitle || `${agent.name} Dashboard`),
    tableSubtitle: String(parsed.tableSubtitle || agent.description),
    metrics,
    columns,
    rows,
    activityFeed,
    uiType: 'table',
  };
}

// ─── Main export ────────────────────────────────────────────────────────────

/**
 * Generate a shared entity pool via the LLM so every agent references the
 * same client names, account IDs, etc.  Falls back to deterministic defaults
 * if the LLM call fails.
 */
export async function generateSharedEntityPool(
  workflowContext: string,
): Promise<SharedEntityPool> {
  const { url, apiKey } = getAzureConfig();

  const prompt = `You are generating a SHARED ENTITY POOL for a multi-agent workflow demo.
Every agent dashboard in this demo will reference the SAME entities to ensure cross-agent consistency.

WORKFLOW CONTEXT:
${workflowContext}

Generate a JSON object with the following arrays. Use names, IDs and values that are
realistic for the business domain described above.

{
  "clientNames": ["<6 realistic client/counterparty names for this domain>"],
  "accountIds": ["<6 account/portfolio IDs with a domain-appropriate prefix, e.g. ACCT-XXXX>"],
  "transactionIds": ["<6 transaction/case IDs with a domain-appropriate prefix, e.g. TXN-XXXX>"],
  "amounts": ["<6 realistic dollar/currency amounts as strings, e.g. '$1,250,000'>"],
  "dates": ["<6 recent dates in YYYY-MM-DD format>"],
  "products": ["<4-6 product/instrument/asset names relevant to this domain>"],
  "regions": ["<4 geographic regions or offices>"],
  "staffNames": ["<6 realistic staff member names>"]
}

Return ONLY raw JSON. No explanation, no markdown fences.`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You generate realistic mock entity data for enterprise demos. Return ONLY valid JSON.' },
          { role: 'user', content: prompt },
        ],
        max_completion_tokens: 2000,
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) throw new Error(`Azure OpenAI ${res.status}`);
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty response');

    const parsed = extractJSON(content);
    // Validate arrays exist, fall back to defaults for any missing
    return {
      clientNames:    Array.isArray(parsed.clientNames)    ? parsed.clientNames    : FALLBACK_POOL.clientNames,
      accountIds:     Array.isArray(parsed.accountIds)     ? parsed.accountIds     : FALLBACK_POOL.accountIds,
      transactionIds: Array.isArray(parsed.transactionIds) ? parsed.transactionIds : FALLBACK_POOL.transactionIds,
      amounts:        Array.isArray(parsed.amounts)        ? parsed.amounts        : FALLBACK_POOL.amounts,
      dates:          Array.isArray(parsed.dates)          ? parsed.dates          : FALLBACK_POOL.dates,
      products:       Array.isArray(parsed.products)       ? parsed.products       : FALLBACK_POOL.products,
      regions:        Array.isArray(parsed.regions)        ? parsed.regions        : FALLBACK_POOL.regions,
      staffNames:     Array.isArray(parsed.staffNames)     ? parsed.staffNames     : FALLBACK_POOL.staffNames,
    };
  } catch (err) {
    console.warn('⚠️ Failed to generate shared entity pool, using fallback:', err);
    return FALLBACK_POOL;
  }
}

const FALLBACK_POOL: SharedEntityPool = {
  clientNames: ['Meridian Capital Group', 'Atlas Financial Holdings', 'Pinnacle Investments LLC', 'Crossbridge Partners', 'Vanguard Institutional', 'BlackRock Fund Advisors'],
  accountIds: ['ACCT-4521', 'ACCT-7834', 'ACCT-1290', 'ACCT-5678', 'ACCT-3345', 'ACCT-9012'],
  transactionIds: ['TXN-20240115-001', 'TXN-20240115-002', 'TXN-20240115-003', 'TXN-20240115-004', 'TXN-20240115-005', 'TXN-20240115-006'],
  amounts: ['$1,250,000', '$3,400,000', '$890,500', '$2,175,000', '$5,600,000', '$720,000'],
  dates: ['2024-01-15', '2024-01-14', '2024-01-13', '2024-01-12', '2024-01-11', '2024-01-10'],
  products: ['US Treasury Bond', 'Corporate Bond A', 'Equity Index Fund', 'FX Forward'],
  regions: ['New York', 'London', 'Singapore', 'Frankfurt'],
  staffNames: ['Sarah Chen', 'James Morrison', 'Priya Patel', 'David Kim', 'Maria Rodriguez', 'Alex Thompson'],
};

/** Format the shared pool as a prompt-friendly string */
function formatEntityPoolForPrompt(pool: SharedEntityPool): string {
  return `===  SHARED ENTITY POOL (use ONLY these names/IDs across ALL agents)  ===
Client Names     : ${pool.clientNames.join(', ')}
Account IDs      : ${pool.accountIds.join(', ')}
Transaction IDs  : ${pool.transactionIds.join(', ')}
Amounts          : ${pool.amounts.join(', ')}
Dates            : ${pool.dates.join(', ')}
Products         : ${pool.products.join(', ')}
Regions          : ${pool.regions.join(', ')}
Staff Names      : ${pool.staffNames.join(', ')}

CRITICAL: Reuse these exact names, IDs, and values in your mock data so that
data is CONSISTENT when the user navigates between agent dashboards.
Pick a subset for this agent's rows — do NOT use all of them in every agent.`;
}

/**
 * Generate realistic mock dashboard data for one agent via the LLM.
 *
 * The prompt gives the model full context about the agent (name, actions,
 * integrations, outputs) and the overall workflow so it can produce
 * domain-appropriate data — financial figures for a finance agent,
 * compliance records for a compliance agent, etc.
 *
 * Includes one automatic retry on transient / parse failures.
 */
export async function generateAgentDashboardMockData(
  agent: Agent,
  workflowContext: string,
  stepIndex: number,
  totalSteps: number,
  sharedPool?: SharedEntityPool,
): Promise<AIMockData> {
  const { url, apiKey } = getAzureConfig();

  const userPrompt = `You are generating SAMPLE DATA for a live dashboard preview of an AI agent
that is part of a larger multi-agent workflow.

===  THIS AGENT  ===
Agent name   : ${agent.name}
Description  : ${agent.description}
Type         : ${agent.type}
Step         : ${stepIndex + 1} of ${totalSteps}
Actions      :
${agent.actions.map((a, i) => `  ${i + 1}. ${a}`).join('\n')}
Integrations : ${agent.integrations.join(', ') || 'none'}
Outputs      : ${agent.outputs.map(o => `${o.name} (${o.type})`).join(', ') || 'none'}

===  FULL WORKFLOW CONTEXT  ===
${workflowContext}

${sharedPool ? formatEntityPoolForPrompt(sharedPool) : ''}

===  INSTRUCTIONS  ===
Generate a JSON object representing what an operator would see on this agent's
dashboard in a real production environment.

CRITICAL RULES:
- The data MUST be specific to what THIS agent does (its actions and integrations).
- Table columns should reflect the actual data this agent works with — not generic
  columns. Think: what fields would an operator need to see for these specific actions?
- Metrics should quantify this agent's specific work, not generic counts.
- Activity feed messages should reference the agent's actual actions and realistic
  entity names from the business domain described above.
- IDs should follow a prefix that makes sense for this agent's domain
  (e.g. ACCT- for accounts, TXN- for transactions, ORD- for orders, RPT- for reports).
- Amounts, dates, names, and values must be plausible for the business domain.
- Think about what the PREVIOUS step would have passed to this agent and what
  this agent passes to the NEXT step.

RETURN FORMAT:
{
  "tableTitle": "<screen title reflecting this agent's function>",
  "tableSubtitle": "<one-line description of what the operator sees>",
  "metrics": [
    // 3-4 KPI cards. Each: { "label", "value" (string), "subtext", "color" }
    // colors: "blue" totals, "green" success, "amber" pending, "red" failures
  ],
  "columns": [
    // 4-6 columns. First: { "key":"id", "label":"<domain-specific ID label>" }.
    // Last: { "key":"status", "label":"Status" }.
    // Middle: fields specific to THIS agent's actions and domain.
  ],
  "rows": [
    // EXACTLY 6 rows. Every row has ALL column keys + "_statusColor".
    // "_statusColor": "green" | "amber" | "red" | "blue".
    // Mix: ~3 green, ~2 amber, ~1 red. Use diverse names, realistic values.
  ],
  "activityFeed": [
    // 5 entries: { "id", "type" (success|warning|info|error), "message", "time", "user" }
    // Times: "2 min ago", "8 min ago", "23 min ago", "1 hour ago", "3 hours ago"
    // Messages should directly reference this agent's actions.
  ]
}

Return ONLY raw JSON. No explanation, no markdown fences.`;

  const body = {
    messages: [
      {
        role: 'system',
        content:
          'You are a mock-data generator for enterprise software dashboards. ' +
          'You receive full context about a multi-agent workflow and must generate ' +
          'realistic, domain-specific data for one specific agent\'s dashboard. ' +
          'The data should reflect what a real operator would see — correct terminology, ' +
          'plausible values, and fields that match the agent\'s actual responsibilities. ' +
          'Return ONLY valid JSON matching the requested schema.',
      },
      { role: 'user', content: userPrompt },
    ],
    max_completion_tokens: 4000,
    temperature: 0.6,
    response_format: { type: 'json_object' as const },
  };

  // Retry once on failure (transient network / malformed JSON)
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Azure OpenAI ${res.status}: ${errText}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('Empty response from LLM');

      const parsed = extractJSON(content);
      return normaliseResponse(parsed, agent);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`Mock-data attempt ${attempt + 1} failed for "${agent.name}":`, lastError.message);
      // Brief pause before retry
      if (attempt === 0) await new Promise(r => setTimeout(r, 500));
    }
  }

  throw lastError!;
}
