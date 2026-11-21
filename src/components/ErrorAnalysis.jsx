import React, { useState } from 'react';
import { formatDuration } from '../utils/formatters';
import { AlertOctagon, CheckCircle2, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';

export default function ErrorAnalysis({ errors = [] }) {
  const [expandedStacks, setExpandedStacks] = useState({});
  const [copiedIdx, setCopiedIdx] = useState(null);

  const hasErrors = errors.length > 0;

  const toggleStack = (idx) => {
    setExpandedStacks((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const copyStack = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="rounded-xl border border-white/5 bg-dark-900/70 p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-white font-sans">
            Error Diagnostics & Stack Traces
          </h3>
        </div>

        <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
          hasErrors 
            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        }`}>
          {hasErrors ? `${errors.length} Captured Error${errors.length > 1 ? 's' : ''}` : '0 Errors'}
        </span>
      </div>

      {!hasErrors ? (
        <div className="py-8 px-4 rounded-lg bg-emerald-950/10 border border-emerald-500/20 flex flex-col items-center justify-center text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
          <h4 className="text-sm font-semibold text-zinc-100 font-sans">
            Zero Failures Captured
          </h4>
          <p className="text-xs text-zinc-400 mt-1 max-w-md font-sans">
            All traced operations resolved without throwing unhandled exceptions. TraceNest is continuously monitoring for rejected Promises and runtime errors.
          </p>
        </div>
      ) : (
        <div className="space-y-3 font-mono text-xs">
          <p className="text-xs text-zinc-400 font-sans">
            TraceNest intercepted and recorded the following thrown exceptions during the async execution lifecycle without crashing the server:
          </p>

          <div className="space-y-3">
            {errors.map((item, idx) => {
              const err = item.error || {};
              const isStackOpen = !!expandedStacks[idx];

              return (
                <div
                  key={idx}
                  className="rounded-lg bg-dark-950 border border-rose-500/30 overflow-hidden shadow-sm"
                >
                  {/* Error Title Header */}
                  <div className="p-3 bg-rose-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-500/20">
                    <div className="flex items-start space-x-2">
                      <span className="p-0.5 rounded bg-rose-500/20 text-rose-400 mt-0.5">
                        <AlertOctagon className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="font-semibold text-rose-300">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          Op ID: {item.operationId} • Latency before failure: {formatDuration(item.durationMs)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold uppercase">
                        {err.name || 'Error'}
                      </span>
                    </div>
                  </div>

                  {/* Error Message */}
                  <div className="p-3 bg-dark-900/90 text-zinc-200">
                    <span className="text-rose-400 font-bold mr-2">Message:</span>
                    <span>{err.message}</span>
                  </div>

                  {/* Stack Trace Toggle & Body */}
                  {err.stack && (
                    <div className="border-t border-zinc-800">
                      <div className="px-3 py-2 bg-dark-950/80 flex items-center justify-between text-[11px] text-zinc-400">
                        <button
                          onClick={() => toggleStack(idx)}
                          className="flex items-center space-x-1.5 hover:text-zinc-200 transition-colors"
                        >
                          {isStackOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          <span>{isStackOpen ? 'Hide Stack Trace' : 'View Stack Trace'}</span>
                        </button>

                        <button
                          onClick={() => copyStack(err.stack, idx)}
                          className="flex items-center space-x-1 hover:text-white transition-colors"
                        >
                          {copiedIdx === idx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Stack</span>
                            </>
                          )}
                        </button>
                      </div>

                      {isStackOpen && (
                        <pre className="p-3 bg-black/60 text-[11px] font-mono text-zinc-400 overflow-x-auto whitespace-pre-wrap max-h-48 border-t border-zinc-900">
                          {err.stack}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
