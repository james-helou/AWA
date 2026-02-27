import { z } from 'zod';

// ── Enums / literals ────────────────────────────────────────────────────────

export const AgentNodeType = z.enum([
  'Orchestrator',
  'Researcher',
  'Integrator',
  'CodeExecutor',
  'Validator',
  'Human',
]);
export type AgentNodeType = z.infer<typeof AgentNodeType>;

export const EdgeKind = z.enum(['control', 'data', 'event']);
export type EdgeKind = z.infer<typeof EdgeKind>;

// ── Node sub-schemas ────────────────────────────────────────────────────────

export const NodePoliciesSchema = z.object({
  retries: z.number().int().min(0).optional(),
  timeoutSec: z.number().min(0).optional(),
  concurrency: z.number().int().min(1).optional(),
}).optional();
export type NodePolicies = z.infer<typeof NodePoliciesSchema>;

export const NodeMetricsSchema = z.object({
  p50LatencyMs: z.number().min(0).optional(),
  successRate: z.number().min(0).max(1).optional(),
  costPerRunUSD: z.number().min(0).optional(),
}).optional();
export type NodeMetrics = z.infer<typeof NodeMetricsSchema>;

export const NodeUiSchema = z.object({
  x: z.number().optional(),
  y: z.number().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
}).optional();
export type NodeUi = z.infer<typeof NodeUiSchema>;

// ── Node ─────────────────────────────────────────────────────────────────────

export const AgentNodeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  type: AgentNodeType,
  description: z.string(),
  model: z.string().nullable().optional(),
  temperature: z.number().min(0).max(2).nullable().optional(),
  tools: z.array(z.string()).nullable().optional(),
  inputs: z.array(z.string()).nullable().optional(),
  outputs: z.array(z.string()).nullable().optional(),
  triggers: z.array(z.string()).nullable().optional(),
  eventsPublished: z.array(z.string()).nullable().optional(),
  policies: NodePoliciesSchema.nullable(),
  metrics: NodeMetricsSchema.nullable(),
  ui: NodeUiSchema.nullable(),
});
export type AgentNode = z.infer<typeof AgentNodeSchema>;

// ── Edge ─────────────────────────────────────────────────────────────────────

export const AgentEdgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  kind: EdgeKind,
  label: z.string().nullable().optional(),
  condition: z.string().nullable().optional(),
});
export type AgentEdge = z.infer<typeof AgentEdgeSchema>;

// ── Top-level AgentGraph ─────────────────────────────────────────────────────

export const AgentGraphSchema = z.object({
  reasoning: z.string().optional(),          // chain-of-thought (stripped before display)
  version: z.string(),
  scenario: z.string(),
  nodes: z.array(AgentNodeSchema).min(1),
  edges: z.array(AgentEdgeSchema),
  notes: z.array(z.string()).optional(),
  warnings: z.array(z.string()).optional(),
}).superRefine((data, ctx) => {
  // Validate that all edge source/target reference existing node IDs
  const nodeIds = new Set(data.nodes.map((n) => n.id));
  data.edges.forEach((edge, i) => {
    if (!nodeIds.has(edge.source)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Edge "${edge.id}" references unknown source node "${edge.source}"`,
        path: ['edges', i, 'source'],
      });
    }
    if (!nodeIds.has(edge.target)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Edge "${edge.id}" references unknown target node "${edge.target}"`,
        path: ['edges', i, 'target'],
      });
    }
  });
});
export type AgentGraph = z.infer<typeof AgentGraphSchema>;

// ── Validation helper ────────────────────────────────────────────────────────

export interface ValidationResult {
  success: boolean;
  data?: AgentGraph;
  errors?: string[];
}

export function validateAgentGraph(raw: unknown): ValidationResult {
  const result = AgentGraphSchema.safeParse(raw);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.issues.map(
      (issue) => `${issue.path.join('.')}: ${issue.message}`
    ),
  };
}
