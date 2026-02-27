import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeChange,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toPng, toSvg } from 'html-to-image';

import type { AgentGraph, AgentNode, AgentNodeType } from '../../types/agentGraph';
import { validateAgentGraph } from '../../types/agentGraph';
import { generateAgentGraph, mockAgentGraph } from '../../services/techGraphService';
import {
  transformToReactFlow,
  saveNodePositions,
  loadNodePositions,
  AGENT_COLORS,
  AGENT_ICONS,
} from '../../services/graphTransform';
import AgentNodeRenderer from './AgentNodeRenderer';
import { EYLogo } from '../EYLogo';

// ── Telemetry (inlined) ──────────────────────────────────────────────────────

type TelemetryEvent =
  | 'tech_graph_generate'
  | 'tech_graph_validate_fail'
  | 'tech_graph_node_select'
  | 'tech_graph_export_png'
  | 'tech_graph_export_svg'
  | 'tech_graph_export_json';

function fireTelemetry(event: TelemetryEvent, payload: Record<string, unknown> = {}): void {
  // eslint-disable-next-line no-console
  console.info(`[telemetry] ${event}`, payload);
}

// ── Export helpers (inlined) ─────────────────────────────────────────────────

function downloadBlob(href: string, filename: string): void {
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function exportToPng(element: HTMLElement, scenario: string): Promise<void> {
  const dataUrl = await toPng(element, { backgroundColor: '#1e1e2e', quality: 1, pixelRatio: 2 });
  downloadBlob(dataUrl, `${slugify(scenario)}-agent-graph.png`);
  fireTelemetry('tech_graph_export_png', { scenario });
}

async function exportToSvg(element: HTMLElement, scenario: string): Promise<void> {
  const dataUrl = await toSvg(element, { backgroundColor: '#1e1e2e' });
  downloadBlob(dataUrl, `${slugify(scenario)}-agent-graph.svg`);
  fireTelemetry('tech_graph_export_svg', { scenario });
}

function exportToJson(graph: AgentGraph): void {
  const json = JSON.stringify(graph, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  downloadBlob(url, `${slugify(graph.scenario)}-agent-graph.json`);
  URL.revokeObjectURL(url);
  fireTelemetry('tech_graph_export_json', { scenario: graph.scenario });
}

// ── Graph Legend (inlined — dark theme) ──────────────────────────────────────

const LEGEND_TYPES: AgentNodeType[] = ['Orchestrator', 'Researcher', 'Integrator', 'CodeExecutor', 'Validator', 'Human'];
const EDGE_KINDS = [
  { kind: 'control', label: 'Control', color: '#94a3b8', dash: '' },
  { kind: 'data', label: 'Data', color: '#818cf8', dash: 'border-dashed' },
  { kind: 'event', label: 'Event', color: '#fbbf24', dash: 'border-dotted' },
];

function GraphLegend() {
  return (
    <div
      className="absolute bottom-4 left-4 z-20 rounded-xl shadow-2xl border border-slate-700/50 p-3"
      style={{ background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(12px)' }}
      role="region"
      aria-label="Graph legend"
    >
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Agent Types</h4>
      <div className="grid grid-cols-3 gap-x-3 gap-y-1 mb-3">
        {LEGEND_TYPES.map((t) => (
          <div key={t} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ background: AGENT_COLORS[t].border }} />
            <span className="text-[11px] text-slate-400">{t}</span>
          </div>
        ))}
      </div>
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Edge Kinds</h4>
      <div className="flex gap-3">
        {EDGE_KINDS.map((e) => (
          <div key={e.kind} className="flex items-center gap-1.5">
            <span className={`w-5 h-0 border-t-2 ${e.dash}`} style={{ borderColor: e.color }} />
            <span className="text-[11px] text-slate-400">{e.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Stats Summary Bar ────────────────────────────────────────────────────────

function StatsSummary({ graph }: { graph: AgentGraph }) {
  // Exclude Human nodes from cost and latency — they represent manual steps, not compute costs
  const automatedNodes = graph.nodes.filter(n => n.type !== 'Human');
  const totalCost = automatedNodes.reduce((sum, n) => sum + (n.metrics?.costPerRunUSD ?? 0), 0);
  const avgSuccess = automatedNodes.filter(n => n.metrics?.successRate != null).reduce((acc, n, _, arr) => acc + (n.metrics!.successRate! / arr.length), 0);

  // Bottleneck = spoke node with worst impact score (high latency + low success rate).
  // Exclude the Orchestrator — it's the hub, not a bottleneck candidate.
  // Include Human nodes — a 30-min human wait IS a real bottleneck.
  const spokeNodes = graph.nodes.filter(n => n.type !== 'Orchestrator');
  const bottleneck = spokeNodes.length > 0
    ? spokeNodes.reduce((worst, n) => {
        // Impact score: latency * (1 + failure_probability).  Nodes that are both slow
        // AND unreliable score highest. A fast but flaky node can also be a bottleneck.
        const score = (n.metrics?.p50LatencyMs ?? 0) * (1 + (1 - (n.metrics?.successRate ?? 1)));
        const worstScore = (worst.metrics?.p50LatencyMs ?? 0) * (1 + (1 - (worst.metrics?.successRate ?? 1)));
        return score > worstScore ? n : worst;
      }, spokeNodes[0])
    : graph.nodes[0];

  const criticalPathMs = automatedNodes.reduce((sum, n) => sum + (n.metrics?.p50LatencyMs ?? 0), 0);

  const formatLatency = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  return (
    <div
      className="absolute top-4 right-4 z-20 rounded-xl shadow-2xl border border-slate-700/50 px-4 py-3"
      style={{ background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(12px)' }}
    >
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Pipeline Stats</h4>
      <div className="flex gap-5">
        <div className="text-center">
          <div className="text-sm font-bold text-emerald-400">${totalCost.toFixed(2)}</div>
          <div className="text-[9px] text-slate-500 uppercase">Cost/Run</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-indigo-400">{(avgSuccess * 100).toFixed(1)}%</div>
          <div className="text-[9px] text-slate-500 uppercase">Avg Success</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-amber-400">{formatLatency(criticalPathMs)}</div>
          <div className="text-[9px] text-slate-500 uppercase">Total Latency</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-rose-400 truncate max-w-[80px]" title={bottleneck.label}>{bottleneck.label.split(' ')[0]}</div>
          <div className="text-[9px] text-slate-500 uppercase">Bottleneck</div>
        </div>
      </div>
    </div>
  );
}

// ── Details Panel (inlined — dark theme) ─────────────────────────────────────

function DetailsPanel({ node, onClose }: { node: AgentNode | null; onClose: () => void }) {
  if (!node) return null;

  const colors = AGENT_COLORS[node.type as AgentNodeType];
  const icon = AGENT_ICONS[node.type as AgentNodeType];

  return (
    <aside
      role="complementary"
      aria-label={`Details for ${node.label}`}
      className="w-80 overflow-y-auto flex-shrink-0 shadow-2xl border-l border-slate-700/50"
      style={{ background: '#0f172a', fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-slate-700/50" style={{ background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ background: `${colors.border}25`, border: `1px solid ${colors.border}40`, color: colors.border }}
            >
              {icon}
            </span>
            <div>
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{ background: `${colors.border}20`, color: colors.border }}
              >
                {node.type}
              </span>
              <h3 className="text-sm font-semibold text-gray-100 mt-0.5">{node.label}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 p-1 rounded"
            aria-label="Close details panel"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-4 py-3 space-y-4 text-sm">
        <DetailSection title="Description">
          <p className="text-slate-400">{node.description}</p>
        </DetailSection>

        {(node.model || node.temperature != null) && (
          <DetailSection title="Model">
            <div className="flex flex-wrap gap-2">
              {node.model && <DetailBadge>{node.model}</DetailBadge>}
              {node.temperature != null && <DetailBadge>temp: {node.temperature}</DetailBadge>}
            </div>
          </DetailSection>
        )}

        {node.tools && node.tools.length > 0 && (
          <DetailSection title="Tools">
            <div className="flex flex-wrap gap-1">
              {node.tools.map((t) => <DetailBadge key={t} color={colors}>{t}</DetailBadge>)}
            </div>
          </DetailSection>
        )}

        {node.inputs && node.inputs.length > 0 && (
          <DetailSection title="Inputs">
            <ul className="list-disc list-inside text-slate-400 space-y-0.5">
              {node.inputs.map((inp) => <li key={inp}>{inp}</li>)}
            </ul>
          </DetailSection>
        )}

        {node.outputs && node.outputs.length > 0 && (
          <DetailSection title="Outputs">
            <ul className="list-disc list-inside text-slate-400 space-y-0.5">
              {node.outputs.map((out) => <li key={out}>{out}</li>)}
            </ul>
          </DetailSection>
        )}

        {node.triggers && node.triggers.length > 0 && (
          <DetailSection title="Triggers">
            <ul className="text-slate-400 space-y-0.5">
              {node.triggers.map((tr) => (
                <li key={tr} className="flex items-start gap-1"><span className="text-amber-500">⚡</span> {tr}</li>
              ))}
            </ul>
          </DetailSection>
        )}

        {node.eventsPublished && node.eventsPublished.length > 0 && (
          <DetailSection title="Events Published">
            <div className="flex flex-wrap gap-1">
              {node.eventsPublished.map((ev) => (
                <span key={ev} className="text-xs px-2 py-0.5 rounded-full bg-amber-900/30 text-amber-400 font-mono border border-amber-800/30">{ev}</span>
              ))}
            </div>
          </DetailSection>
        )}

        {node.policies && (
          <DetailSection title="Policies">
            <div className="grid grid-cols-3 gap-2 text-center">
              {node.policies.retries != null && <MetricCard label="Retries" value={String(node.policies.retries)} />}
              {node.policies.timeoutSec != null && <MetricCard label="Timeout" value={`${node.policies.timeoutSec}s`} />}
              {node.policies.concurrency != null && <MetricCard label="Concurrency" value={String(node.policies.concurrency)} />}
            </div>
          </DetailSection>
        )}

        {node.metrics && (
          <DetailSection title="Metrics">
            <div className="grid grid-cols-3 gap-2 text-center">
              {node.metrics.p50LatencyMs != null && (
                <MetricCard
                  label="p50 Latency"
                  value={node.metrics.p50LatencyMs >= 60000 ? `${(node.metrics.p50LatencyMs / 60000).toFixed(0)}m` : `${node.metrics.p50LatencyMs}ms`}
                />
              )}
              {node.metrics.successRate != null && <MetricCard label="Success" value={`${(node.metrics.successRate * 100).toFixed(1)}%`} />}
              {node.metrics.costPerRunUSD != null && <MetricCard label="Cost/Run" value={`$${node.metrics.costPerRunUSD.toFixed(2)}`} />}
            </div>
          </DetailSection>
        )}
      </div>
    </aside>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">{title}</h4>
      {children}
    </div>
  );
}

function DetailBadge({ children, color }: { children: React.ReactNode; color?: { border: string } }) {
  return (
    <span
      className="text-[11px] px-2 py-0.5 rounded-full font-medium"
      style={{ background: color ? `${color.border}15` : 'rgba(51,65,85,0.5)', color: color?.border ?? '#94a3b8', border: `1px solid ${color ? `${color.border}30` : 'rgba(71,85,105,0.3)'}` }}
    >
      {children}
    </span>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800/60 rounded-lg p-2 border border-slate-700/30">
      <div className="text-xs font-semibold text-slate-200">{value}</div>
      <div className="text-[10px] text-slate-500">{label}</div>
    </div>
  );
}

// ── Node types for React Flow ────────────────────────────────────────────────
const nodeTypes = { agentNode: AgentNodeRenderer };

// ── Inner component (needs ReactFlowProvider ancestor) ───────────────────────

interface TechGraphInnerProps {
  scenarioText: string;
  onBack: () => void;
}

function TechGraphInner({ scenarioText, onBack }: TechGraphInnerProps) {
  const { fitView } = useReactFlow();
  const flowRef = useRef<HTMLDivElement>(null);

  // Raw AgentGraph state
  const [graph, setGraph] = useState<AgentGraph | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // React Flow states
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Selected node for details panel
  const [selectedNode, setSelectedNode] = useState<AgentNode | null>(null);

  // ── Load / sync graph → nodes/edges ─────────────────────────────────────
  const applyGraph = useCallback(
    (g: AgentGraph, useCache = false) => {
      setGraph(g);
      setValidationErrors([]);
      // Only use cached positions when explicitly requested (e.g. loading mock).
      // For AI-generated graphs, always run dagre to get a clean layout.
      const saved = useCache ? loadNodePositions(g.scenario) : null;
      const { nodes: n, edges: e } = transformToReactFlow(g, saved ?? undefined);
      setNodes(n);
      setEdges(e);
      // Fit view after a tick to let React Flow measure
      setTimeout(() => fitView({ padding: 0.15, duration: 400 }), 100);
    },
    [fitView, setNodes, setEdges],
  );

  // ── Generate from AI ────────────────────────────────────────────────────
  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setValidationErrors([]);
    setSelectedNode(null);

    fireTelemetry('tech_graph_generate', { scenario: scenarioText });

    try {
      const result = await generateAgentGraph(scenarioText);

      if (!result.validation.success) {
        fireTelemetry('tech_graph_validate_fail', {
          scenario: scenarioText,
          errors: result.validation.errors,
        });
        setValidationErrors(result.validation.errors ?? ['Unknown validation error']);
        setToastMessage('Validation failed — you can load a sample graph instead.');
        return;
      }

      applyGraph(result.graph!);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate agent graph');
    } finally {
      setIsLoading(false);
    }
  }, [scenarioText, applyGraph]);

  // ── Auto-generate on mount if we have scenario text ─────────────────────
  const hasGeneratedRef = useRef(false);
  useEffect(() => {
    // Guard against React StrictMode double-mount in dev
    if (hasGeneratedRef.current) return;
    hasGeneratedRef.current = true;

    if (scenarioText) {
      handleGenerate();
    } else {
      // No scenario — load mock (allow cached positions for mock)
      applyGraph(mockAgentGraph, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load mock fallback ──────────────────────────────────────────────────
  const handleLoadMock = useCallback(() => {
    applyGraph(mockAgentGraph);
    setValidationErrors([]);
    setToastMessage(null);
    setError(null);
  }, [applyGraph]);

  // ── Validate JSON ───────────────────────────────────────────────────────
  const handleValidate = useCallback(() => {
    if (!graph) return;
    const result = validateAgentGraph(graph);
    if (result.success) {
      setToastMessage('✓ Graph JSON is valid');
      setValidationErrors([]);
    } else {
      fireTelemetry('tech_graph_validate_fail', {
        scenario: graph.scenario,
        errors: result.errors,
      });
      setValidationErrors(result.errors ?? []);
      setToastMessage('Validation errors found');
    }
  }, [graph]);

  // ── Node selection ──────────────────────────────────────────────────────
  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const agentNode = node.data as unknown as AgentNode;
      setSelectedNode(agentNode);
      fireTelemetry('tech_graph_node_select', {
        scenario: graph?.scenario,
        nodeId: agentNode.id,
      });
    },
    [graph],
  );

  // ── Persist positions on drag end (debounced via onNodesChange) ─────────
  const handleNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => {
      onNodesChange(changes);
      // After a position change, persist
      const hasDrag = changes.some((c) => c.type === 'position' && (c as any).dragging === false);
      if (hasDrag && graph) {
        // Build updated positions from current nodes after the change
        requestAnimationFrame(() => {
          const posMap: Record<string, { x: number; y: number }> = {};
          // We read from the DOM-level nodes after change; useNodesState will have them on next render.
          // Use a small delay to read final positions.
          setTimeout(() => {
            const currentNodes = document.querySelectorAll<HTMLElement>('[data-id]');
            currentNodes.forEach((el) => {
              const id = el.getAttribute('data-id');
              const transform = el.style.transform;
              if (id && transform) {
                const match = transform.match(/translate\(([\d.-]+)px,\s*([\d.-]+)px\)/);
                if (match) {
                  posMap[id] = { x: parseFloat(match[1]), y: parseFloat(match[2]) };
                }
              }
            });
            if (Object.keys(posMap).length > 0) {
              saveNodePositions(graph.scenario, posMap);
            }
          }, 50);
        });
      }
    },
    [onNodesChange, graph],
  );

  // ── Export handlers ─────────────────────────────────────────────────────
  const handleExportPng = useCallback(async () => {
    const el = flowRef.current?.querySelector('.react-flow__viewport') as HTMLElement | null;
    if (el && graph) await exportToPng(el, graph.scenario);
  }, [graph]);

  const handleExportSvg = useCallback(async () => {
    const el = flowRef.current?.querySelector('.react-flow__viewport') as HTMLElement | null;
    if (el && graph) await exportToSvg(el, graph.scenario);
  }, [graph]);

  const handleExportJson = useCallback(() => {
    if (graph) exportToJson(graph);
  }, [graph]);

  // ── Keyboard navigation ─────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!graph) return;
      if (e.key === 'Escape') setSelectedNode(null);
    },
    [graph],
  );

  // ── Toast auto-dismiss ──────────────────────────────────────────────────
  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 6000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  // ── Render ──────────────────────────────────────────────────────────────

  // MiniMap node color
  const miniMapNodeColor = useCallback((node: Node) => {
    const agentNode = node.data as unknown as AgentNode;
    return AGENT_COLORS[agentNode.type as AgentNodeType]?.border ?? '#64748b';
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col" style={{ background: '#0f172a' }} onKeyDown={handleKeyDown}>
      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 py-2 bg-[#2E2E38] text-white border-b border-slate-700/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Back to business view"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <EYLogo variant="light" />
          <div className="h-5 w-px bg-gray-600" />
          <h1 className="text-sm font-semibold tracking-wide">Technical Agent Graph</h1>
          {graph && (
            <span className="text-xs text-gray-400 ml-2">
              {graph.scenario} · {graph.nodes.length} nodes · {graph.edges.length} edges
            </span>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <ToolbarButton onClick={handleGenerate} disabled={isLoading} label="Regenerate">
            <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </ToolbarButton>
          <ToolbarButton onClick={handleValidate} disabled={!graph} label="Validate JSON">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => fitView({ padding: 0.15, duration: 400 })} disabled={!graph} label="Fit to view">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </ToolbarButton>
          <div className="h-5 w-px bg-gray-600" />
          <ToolbarButton onClick={handleExportJson} disabled={!graph} label="Export JSON">
            JSON
          </ToolbarButton>
          <ToolbarButton onClick={handleExportPng} disabled={!graph} label="Export PNG">
            PNG
          </ToolbarButton>
          <ToolbarButton onClick={handleExportSvg} disabled={!graph} label="Export SVG">
            SVG
          </ToolbarButton>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Graph canvas */}
        <div className="flex-1 relative" ref={flowRef}>
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-30 flex items-center justify-center" style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)' }}>
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#FFE600] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-200">Generating agent graph…</p>
                <p className="text-xs text-slate-500 mt-1">Analyzing scenario topology</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div className="absolute inset-0 z-30 flex items-center justify-center" style={{ background: 'rgba(15,23,42,0.9)' }}>
              <div className="max-w-md text-center p-6">
                <div className="w-12 h-12 rounded-full bg-red-900/40 flex items-center justify-center mx-auto mb-3 border border-red-800/30">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-200 mb-1">Generation Error</p>
                <p className="text-xs text-slate-500 mb-4">{error}</p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={handleGenerate}
                    className="px-4 py-2 text-xs font-medium bg-[#FFE600] text-[#2E2E38] rounded-lg hover:bg-yellow-400 transition-colors"
                  >
                    Retry
                  </button>
                  <button
                    onClick={handleLoadMock}
                    className="px-4 py-2 text-xs font-medium bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 border border-slate-700 transition-colors"
                  >
                    Load Sample Graph
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Validation errors */}
          {validationErrors.length > 0 && !isLoading && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 max-w-lg w-full">
              <div className="bg-red-950/80 border border-red-800/50 rounded-xl p-3 shadow-2xl backdrop-blur-sm">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-red-300 mb-1">Validation Errors</p>
                    <ul className="text-[11px] text-red-400 space-y-0.5 max-h-32 overflow-y-auto">
                      {validationErrors.map((e, i) => (
                        <li key={i}>• {e}</li>
                      ))}
                    </ul>
                    <button
                      onClick={handleLoadMock}
                      className="mt-2 text-[11px] text-red-300 underline hover:text-red-200"
                    >
                      Load sample graph instead
                    </button>
                  </div>
                  <button
                    onClick={() => setValidationErrors([])}
                    className="text-red-600 hover:text-red-400"
                    aria-label="Dismiss"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!graph && !isLoading && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-3">No graph loaded</p>
                <button
                  onClick={handleLoadMock}
                  className="px-4 py-2 text-xs font-medium bg-[#FFE600] text-[#2E2E38] rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  Load Sample Graph
                </button>
              </div>
            </div>
          )}

          {/* React Flow */}
          {(nodes.length > 0 || isLoading) && (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={handleNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={handleNodeClick}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.15 }}
              minZoom={0.1}
              maxZoom={2}
              proOptions={{ hideAttribution: true }}
              className="tech-graph-canvas"
            >
              <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="rgba(148,163,184,0.15)" />
              <Controls showInteractive={false} className="!bg-slate-800/80 !shadow-2xl !border-slate-700/50 !rounded-xl [&>button]:!bg-slate-800 [&>button]:!border-slate-700/50 [&>button]:!text-slate-400 [&>button:hover]:!bg-slate-700" />
              <MiniMap
                nodeColor={miniMapNodeColor}
                maskColor="rgba(0,0,0,0.3)"
                className="!bg-slate-900/80 !border-slate-700/50 !rounded-xl !shadow-2xl"
                pannable
                zoomable
              />
            </ReactFlow>
          )}

          {/* Legend */}
          {graph && <GraphLegend />}

          {/* Stats Summary */}
          {graph && <StatsSummary graph={graph} />}

          {/* Toast */}
          {toastMessage && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40">
              <div className="bg-slate-800/90 backdrop-blur text-slate-200 text-xs px-4 py-2 rounded-xl shadow-2xl border border-slate-700/50 flex items-center gap-2">
                <span>{toastMessage}</span>
                <button onClick={() => setToastMessage(null)} className="text-slate-500 hover:text-slate-300">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Details panel */}
        <DetailsPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
      </div>
    </div>
  );
}

// ── Toolbar button helper ────────────────────────────────────────────────────

function ToolbarButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="px-2.5 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
    >
      {children}
    </button>
  );
}

// ── Exported page component (wrapped in provider) ────────────────────────────

interface TechGraphPageProps {
  scenarioText: string;
  onBack: () => void;
}

export default function TechGraphPage({ scenarioText, onBack }: TechGraphPageProps) {
  return (
    <ReactFlowProvider>
      <TechGraphInner scenarioText={scenarioText} onBack={onBack} />
    </ReactFlowProvider>
  );
}
