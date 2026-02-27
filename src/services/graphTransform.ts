import dagre from 'dagre';
import type { Node, Edge, MarkerType } from '@xyflow/react';
import type { AgentGraph, AgentNode, AgentEdge, AgentNodeType } from '../types/agentGraph';

// ── Color palette per agent type ─────────────────────────────────────────────

export const AGENT_COLORS: Record<AgentNodeType, { bg: string; border: string; text: string; badge: string }> = {
  Orchestrator: { bg: '#f5f3ff', border: '#8b5cf6', text: '#6d28d9', badge: '#ede9fe' },
  Researcher:   { bg: '#f0fdfa', border: '#14b8a6', text: '#0f766e', badge: '#ccfbf1' },
  Integrator:   { bg: '#eff6ff', border: '#3b82f6', text: '#1d4ed8', badge: '#dbeafe' },
  CodeExecutor: { bg: '#f0fdf4', border: '#22c55e', text: '#15803d', badge: '#dcfce7' },
  Validator:    { bg: '#fdf2f8', border: '#ec4899', text: '#be185d', badge: '#fce7f3' },
  Human:        { bg: '#fff7ed', border: '#f97316', text: '#c2410c', badge: '#ffedd5' },
};

export const AGENT_ICONS: Record<AgentNodeType, string> = {
  Orchestrator: 'O',
  Researcher:   'R',
  Integrator:   'I',
  CodeExecutor: 'C',
  Validator:    'V',
  Human:        'H',
};

// ── Node width / height for dagre ────────────────────────────────────────────

const NODE_WIDTH = 330;
const NODE_HEIGHT = 140;

// ── Transform AgentGraph → React Flow nodes & edges ──────────────────────────

export interface GraphTransformResult {
  nodes: Node[];
  edges: Edge[];
}

/**
 * Convert the AgentGraph schema into React Flow–compatible nodes and edges.
 * If a node has saved positions in `savedPositions`, use those.
 * Otherwise, run a Dagre auto-layout pass.
 */
export function transformToReactFlow(
  graph: AgentGraph,
  savedPositions?: Record<string, { x: number; y: number }>,
): GraphTransformResult {
  const needsLayout = !savedPositions || Object.keys(savedPositions).length === 0;

  let layoutPositions: Record<string, { x: number; y: number }> = {};

  if (needsLayout) {
    layoutPositions = computeDagreLayout(graph.nodes, graph.edges);
  }

  const nodes: Node[] = graph.nodes.map((n) => {
    const pos = savedPositions?.[n.id] ?? layoutPositions[n.id] ?? { x: 0, y: 0 };
    return {
      id: n.id,
      type: 'agentNode', // maps to custom node renderer
      position: pos,
      data: { ...n } as AgentNode,
      // Accessibility
      ariaLabel: `${n.type} agent: ${n.label}`,
    };
  });

  const edges: Edge[] = graph.edges.map((e) => {
    const kindStyle = edgeStyleForKind(e.kind);
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      type: 'smoothstep',
      animated: e.kind === 'data' || e.kind === 'event', // flowing animation on data & event edges
      label: e.label ?? '',
      labelShowBg: true,
      labelBgPadding: [8, 4] as [number, number],
      labelBgBorderRadius: 8,
      labelBgStyle: {
        fill: kindStyle.labelBg,
        stroke: kindStyle.labelBorder,
        strokeWidth: 1,
      },
      labelStyle: {
        fontSize: 10,
        fontWeight: 600,
        fill: kindStyle.labelText,
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      style: kindStyle.css,
      markerEnd: { type: 'arrowclosed' as MarkerType, color: kindStyle.markerColor, width: 16, height: 16 },
      data: { ...e } as AgentEdge,
      ariaLabel: `${e.kind} edge from ${e.source} to ${e.target}${e.label ? ': ' + e.label : ''}`,
    };
  });

  return { nodes, edges };
}

// ── Edge styling by kind ─────────────────────────────────────────────────────

interface EdgeKindStyle {
  css: React.CSSProperties;
  markerColor: string;
  labelBg: string;
  labelBorder: string;
  labelText: string;
}

function edgeStyleForKind(kind: string): EdgeKindStyle {
  switch (kind) {
    case 'data':
      return {
        css: { stroke: '#818cf8', strokeWidth: 2, strokeDasharray: '6 4' },
        markerColor: '#a5b4fc',
        labelBg: 'rgba(49, 46, 129, 0.6)',
        labelBorder: 'rgba(99, 102, 241, 0.3)',
        labelText: '#a5b4fc',
      };
    case 'event':
      return {
        css: { stroke: '#fbbf24', strokeWidth: 2, strokeDasharray: '3 4' },
        markerColor: '#fcd34d',
        labelBg: 'rgba(120, 53, 15, 0.5)',
        labelBorder: 'rgba(245, 158, 11, 0.3)',
        labelText: '#fcd34d',
      };
    case 'control':
    default:
      return {
        css: { stroke: '#64748b', strokeWidth: 2 },
        markerColor: '#94a3b8',
        labelBg: 'rgba(30, 41, 59, 0.7)',
        labelBorder: 'rgba(100, 116, 139, 0.3)',
        labelText: '#94a3b8',
      };
  }
}

// ── Dagre auto-layout ────────────────────────────────────────────────────────

function computeDagreLayout(
  nodes: AgentGraph['nodes'],
  edges: AgentGraph['edges'],
): Record<string, { x: number; y: number }> {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'LR', nodesep: 100, ranksep: 160 });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((n) => {
    g.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });
  edges.forEach((e) => {
    g.setEdge(e.source, e.target);
  });

  dagre.layout(g);

  const positions: Record<string, { x: number; y: number }> = {};
  nodes.forEach((n) => {
    const nodeWithPosition = g.node(n.id);
    positions[n.id] = {
      x: nodeWithPosition.x - NODE_WIDTH / 2,
      y: nodeWithPosition.y - NODE_HEIGHT / 2,
    };
  });

  return positions;
}

// ── Position persistence ─────────────────────────────────────────────────────

// Version key — bump this whenever node dimensions or layout params change
// to invalidate stale cached positions.
const POSITION_CACHE_VERSION = 'v3';
const POSITION_STORAGE_PREFIX = `awa-tech-positions-${POSITION_CACHE_VERSION}-`;

// Clear stale position caches from previous versions
(function clearLegacyCaches() {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('awa-tech-positions-') && !key.startsWith(POSITION_STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch { /* ignore */ }
})();

export function saveNodePositions(scenario: string, positions: Record<string, { x: number; y: number }>): void {
  try {
    localStorage.setItem(`${POSITION_STORAGE_PREFIX}${scenario}`, JSON.stringify(positions));
  } catch { /* localStorage full — ignore */ }
}

export function loadNodePositions(scenario: string): Record<string, { x: number; y: number }> | null {
  try {
    const raw = localStorage.getItem(`${POSITION_STORAGE_PREFIX}${scenario}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
