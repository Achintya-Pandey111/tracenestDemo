import React, { useState } from 'react';
import { formatDuration, getStatusColor } from '../utils/formatters';
import { 
  ChevronRight, 
  ChevronDown, 
  Clock, 
  Flame, 
  AlertTriangle, 
  Layers, 
  ChevronsUpDown,
  Tag
} from 'lucide-react';

export default function TraceTree({ tree = [], slowOperations = [], wallClockTimeMs = 1 }) {
  const [collapsed, setCollapsed] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);

  const slowOpIds = new Set(slowOperations.map((op) => op.id));

  const toggleNode = (id) => {
    setCollapsed((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    setCollapsed({});
  };

  const collapseAll = () => {
    const all = {};
    const traverse = (nodes) => {
      for (const n of nodes) {
        if (n.children && n.children.length > 0) {
          all[n.id] = true;
          traverse(n.children);
        }
      }
    };
    traverse(tree);
    setCollapsed(all);
  };

  const renderTreeNode = (node) => {
    const isCollapsed = !!collapsed[node.id];
    const hasChildren = node.children && node.children.length > 0;
    const isSlow = slowOpIds.has(node.id);
    const isError = node.status === 'ERROR';
    const statusStyle = getStatusColor(node.status);

    // Percentage of total wall clock time
    const durationPct = Math.min(100, Math.max(2, Math.round((node.durationMs / (wallClockTimeMs || 1)) * 100)));

    return (
      <div key={node.id} className="relative group/tree select-none">
        <div
          className={`relative flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg border transition-all duration-150 ${
            isError
              ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50'
              : isSlow
              ? 'bg-amber-950/15 border-amber-500/30 hover:border-amber-500/50'
              : node.depth === 0
              ? 'bg-dark-850/80 border-indigo-500/30'
              : 'bg-dark-900/60 border-white/5 hover:border-white/10'
          }`}
          style={{ marginLeft: `${Math.min(node.depth * 22, 140)}px` }}
        >
          {/* Duration Progress Indicator bar at bottom of card */}
          <div
            className={`absolute bottom-0 left-0 h-0.5 rounded-b-lg transition-all ${
              isError ? 'bg-rose-500' : isSlow ? 'bg-amber-500' : 'bg-brand-primary'
            }`}
            style={{ width: `${durationPct}%` }}
          />

          {/* Left: Collapse toggle & Operation title */}
          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
            {hasChildren ? (
              <button
                onClick={() => toggleNode(node.id)}
                className="p-1 rounded text-zinc-400 hover:text-white hover:bg-dark-800 transition-colors"
                title={isCollapsed ? 'Expand branch' : 'Collapse branch'}
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            ) : (
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="font-mono text-xs font-semibold text-zinc-100 truncate">
                  {node.name}
                </span>

                {isSlow && (
                  <span className="inline-flex items-center space-x-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>SLOW</span>
                  </span>
                )}

                {isError && (
                  <span className="inline-flex items-center space-x-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    <span>FAILED</span>
                  </span>
                )}
              </div>

              {/* Node Metadata / Error snippet */}
              <div className="flex items-center space-x-2 mt-1 flex-wrap gap-y-1">
                <span className="text-[10px] font-mono text-zinc-500">ID: {node.id.split('_').pop()}</span>
                {node.metadata && Object.keys(node.metadata).length > 0 && (
                  <div className="flex items-center space-x-1">
                    <Tag className="w-2.5 h-2.5 text-zinc-500" />
                    {Object.entries(node.metadata).slice(0, 2).map(([k, v]) => (
                      <span key={k} className="text-[10px] font-mono bg-dark-950 px-1 py-0.2 rounded border border-zinc-800 text-zinc-400">
                        {k}: {String(v)}
                      </span>
                    ))}
                  </div>
                )}
                {isError && node.error && (
                  <span className="text-[11px] font-sans text-rose-400 font-medium truncate">
                    {node.error.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Duration & Status Badge */}
          <div className="flex items-center space-x-2.5 mt-2 sm:mt-0 sm:ml-4 flex-shrink-0 self-end sm:self-auto">
            <span className="inline-flex items-center space-x-1 text-xs font-mono text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>{formatDuration(node.durationMs)}</span>
            </span>

            <span className={`inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} mr-1.5`} />
              {node.status}
            </span>
          </div>
        </div>

        {/* Children rendering */}
        {hasChildren && !isCollapsed && (
          <div className="mt-1.5 space-y-1.5 border-l border-zinc-800/80 ml-4 pl-1">
            {node.children.map(renderTreeNode)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-white/5 bg-dark-900/70 p-4 sm:p-6 space-y-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-brand-primary" />
          <h3 className="text-sm font-semibold text-white font-sans">
            Hierarchical Execution Tree
          </h3>
          <span className="text-xs font-mono text-zinc-400">
            ({tree.length} root branch{tree.length === 1 ? '' : 'es'})
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={expandAll}
            className="px-2.5 py-1 text-xs font-mono bg-dark-800 hover:bg-dark-750 text-zinc-300 rounded border border-zinc-700 transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-2.5 py-1 text-xs font-mono bg-dark-800 hover:bg-dark-750 text-zinc-300 rounded border border-zinc-700 transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Tree Content */}
      <div className="space-y-2 font-mono text-xs overflow-x-auto py-1">
        {tree.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 font-sans">
            No operation hierarchy to display. Run a scenario to populate.
          </div>
        ) : (
          tree.map(renderTreeNode)
        )}
      </div>
    </div>
  );
}
