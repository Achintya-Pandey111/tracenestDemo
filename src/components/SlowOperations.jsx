import React from 'react';
import { formatDuration } from '../utils/formatters';
import { Flame, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function SlowOperations({ slowOperations = [], thresholdMs = 100 }) {
  const hasSlow = slowOperations.length > 0;

  return (
    <div className="rounded-xl border border-white/5 bg-dark-900/70 p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Flame className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-white font-sans">
            Slow Operation Analysis
          </h3>
        </div>

        <span className="text-xs font-mono px-2 py-0.5 rounded bg-dark-950 text-amber-400 border border-amber-500/30">
          Threshold: ≥ {thresholdMs}ms
        </span>
      </div>

      {!hasSlow ? (
        <div className="py-8 px-4 rounded-lg bg-emerald-950/10 border border-emerald-500/20 flex flex-col items-center justify-center text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
          <h4 className="text-sm font-semibold text-zinc-100 font-sans">
            All Operations Within Latency Budget
          </h4>
          <p className="text-xs text-zinc-400 mt-1 max-w-md">
            Every asynchronous operation in this trace completed faster than the configured threshold of <code className="text-emerald-300 font-mono">{thresholdMs}ms</code>.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-xs text-zinc-400 font-sans">
            Detected <span className="font-semibold text-amber-300 font-mono">{slowOperations.length}</span> operation(s) that exceeded latency budget:
          </div>

          <div className="space-y-2">
            {slowOperations.map((op, idx) => {
              const deltaMs = op.durationMs - op.thresholdMs;
              const deltaPct = Math.round((deltaMs / op.thresholdMs) * 100);

              return (
                <div
                  key={op.id || idx}
                  className="p-3 rounded-lg bg-dark-950/80 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs"
                >
                  <div className="flex items-start space-x-2.5">
                    <span className="p-1 rounded bg-amber-500/10 text-amber-400 mt-0.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <div className="text-zinc-100 font-semibold">
                        {op.name}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5 flex items-center space-x-2">
                        <span>Depth: {op.depth}</span>
                        <span>•</span>
                        <span>Threshold: {op.thresholdMs}ms</span>
                        <span>•</span>
                        <span className="text-amber-400 font-medium">+{deltaMs.toFixed(1)}ms (+{deltaPct}%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto flex-shrink-0">
                    <span className="text-sm font-bold text-amber-300 bg-amber-950/40 px-2.5 py-1 rounded border border-amber-500/30">
                      {formatDuration(op.durationMs)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-lg bg-dark-950 border border-zinc-800 text-[11px] text-zinc-400 font-mono flex items-center justify-between">
            <span>Configured via: <code className="text-indigo-400">TraceNest.start(&#123; slowOperationThresholdMs: {thresholdMs} &#125;)</code></span>
            <span className="text-zinc-500 hidden sm:inline">Calculated via detectSlowOperations()</span>
          </div>
        </div>
      )}
    </div>
  );
}
