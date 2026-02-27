import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { AgentNode, AgentNodeType } from '../../types/agentGraph';
import { AGENT_COLORS, AGENT_ICONS } from '../../services/graphTransform';

/** Format latency into a human-readable tag */
function latencyTag(ms?: number): string | null {
  if (ms == null) return null;
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms / 60000)}m`;
}

/**
 * Custom React Flow node renderer — dark-theme glassmorphism cards.
 * Frosted glass panel with colored accent, status pulse, metrics, and hover reveal.
 */
function AgentNodeRenderer({ data, selected }: NodeProps) {
  const node = data as unknown as AgentNode;
  const colors = AGENT_COLORS[node.type as AgentNodeType];
  const icon = AGENT_ICONS[node.type as AgentNodeType];
  const [hovered, setHovered] = useState(false);

  const successRate = node.metrics?.successRate;
  const latMs = node.metrics?.p50LatencyMs;

  // Status color
  const statusColor = successRate && successRate >= 0.95 ? '#22c55e' : successRate && successRate >= 0.8 ? '#fbbf24' : '#ef4444';

  return (
    <div
      role="treeitem"
      aria-label={`${node.type} agent: ${node.label}`}
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="tech-node group relative rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
      style={{
        width: 320,
        background: 'rgba(30, 41, 59, 0.85)',
        backdropFilter: 'blur(12px)',
        border: `1.5px solid ${selected ? '#FFE600' : hovered ? colors.border : 'rgba(148,163,184,0.2)'}`,
        borderLeftWidth: 4,
        borderLeftColor: colors.border,
        boxShadow: selected
          ? `0 0 0 3px rgba(255,230,0,0.25), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`
          : hovered
            ? `0 12px 40px rgba(0,0,0,0.35), 0 0 0 1px ${colors.border}50, inset 0 1px 0 rgba(255,255,255,0.05)`
            : `0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)`,
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Top accent gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
        style={{ background: `linear-gradient(90deg, ${colors.border}, ${colors.border}00)` }}
      />

      {/* Pulsing status dot */}
      <div className="absolute -top-1.5 -right-1.5 z-10">
        <span className="relative flex h-3.5 w-3.5">
          <span
            className="tech-pulse absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: statusColor }}
          />
          <span
            className="relative inline-flex rounded-full h-3.5 w-3.5 border-2"
            style={{ backgroundColor: statusColor, borderColor: 'rgba(15,23,42,0.8)' }}
          />
        </span>
      </div>

      {/* Incoming handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="tech-handle"
        style={{
          background: colors.border,
          width: 11,
          height: 11,
          border: '2.5px solid #1e293b',
          left: -6,
          boxShadow: `0 0 0 2px ${colors.border}40`,
        }}
      />

      {/* Card content */}
      <div className="px-3.5 py-3">
        {/* Title row */}
        <div className="flex items-center gap-2.5 mb-1.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm"
            style={{ background: `${colors.border}25`, border: `1px solid ${colors.border}40`, color: colors.border }}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold text-white block truncate leading-tight" title={node.label}>
              {node.label}
            </span>
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: colors.border }}
            >
              {node.type}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-2.5 pl-[42px]">
          {node.description}
        </p>

        {/* Metrics bar */}
        <div className="flex items-center gap-2.5 pl-[42px]">
          {/* Success rate mini bar */}
          {successRate != null && (
            <div className="flex items-center gap-1.5 flex-1">
              <div className="flex-1 h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${successRate * 100}%`,
                    background: successRate >= 0.95
                      ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                      : successRate >= 0.8
                        ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                        : 'linear-gradient(90deg, #ef4444, #f87171)',
                  }}
                />
              </div>
              <span className="text-[9px] font-semibold text-gray-400 tabular-nums w-8 text-right">
                {(successRate * 100).toFixed(0)}%
              </span>
            </div>
          )}
          {/* Latency */}
          {latMs != null && (
            <span className="text-[9px] font-medium text-gray-500 tabular-nums whitespace-nowrap">
              ⏱ {latencyTag(latMs)}
            </span>
          )}
        </div>

        {/* Tool pills - revealed on hover */}
        {node.tools && node.tools.length > 0 && (
          <div
            className="overflow-hidden transition-all duration-200 pl-[42px]"
            style={{ maxHeight: hovered || selected ? 48 : 0, opacity: hovered || selected ? 1 : 0, marginTop: hovered || selected ? 8 : 0 }}
          >
            <div className="flex flex-wrap gap-1">
              {node.tools.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                  style={{ background: `${colors.border}20`, color: colors.border, border: `1px solid ${colors.border}30` }}
                >
                  {t}
                </span>
              ))}
              {node.tools.length > 4 && (
                <span className="text-[9px] text-gray-500">+{node.tools.length - 4}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Outgoing handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="tech-handle"
        style={{
          background: colors.border,
          width: 11,
          height: 11,
          border: '2.5px solid #1e293b',
          right: -6,
          boxShadow: `0 0 0 2px ${colors.border}40`,
        }}
      />
    </div>
  );
}

export default memo(AgentNodeRenderer);
