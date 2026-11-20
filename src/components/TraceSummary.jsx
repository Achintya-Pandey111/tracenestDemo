import React from 'react';
import { formatDuration } from '../utils/formatters';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Activity, 
  Layers, 
  Flame,
  Percent
} from 'lucide-react';

export default function TraceSummary({ report, executionDurationMs }) {
  if (!report || !report.summary) return null;

  const { summary, slowOperations = [], errors = [] } = report;
  const percentiles = summary.percentiles || {};

  const cards = [
    {
      label: 'Total Operations',
      value: summary.totalOperations,
      subtext: `${summary.totalEvents || 0} lifecycle events recorded`,
      icon: Layers,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20'
    },
    {
      label: 'Successful Operations',
      value: summary.successfulOperations,
      subtext: `${summary.successRate}% success rate`,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      label: 'Failed Operations',
      value: summary.failedOperations,
      subtext: summary.failedOperations > 0 ? `${errors.length} error details captured` : 'Zero errors captured',
      icon: XCircle,
      color: summary.failedOperations > 0 ? 'text-rose-400' : 'text-zinc-500',
      bg: summary.failedOperations > 0 ? 'bg-rose-500/10 border-rose-500/20' : 'bg-dark-900 border-zinc-800'
    },
    {
      label: 'Wall-Clock Time',
      value: formatDuration(summary.wallClockTimeMs || summary.totalExecutionTimeMs),
      subtext: `Cumulative op time: ${formatDuration(summary.sumOperationDurationMs || 0)}`,
      icon: Clock,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20'
    },
    {
      label: 'Average Op Duration',
      value: formatDuration(summary.averageDurationMs),
      subtext: `Min: ${formatDuration(summary.minDurationMs)} | Max: ${formatDuration(summary.maxDurationMs)}`,
      icon: Activity,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20'
    },
    {
      label: 'Slow Operations',
      value: slowOperations.length,
      subtext: slowOperations.length > 0 
        ? `Exceeded ${slowOperations[0]?.thresholdMs || 100}ms threshold` 
        : 'All ops within latency budget',
      icon: Flame,
      color: slowOperations.length > 0 ? 'text-amber-400' : 'text-zinc-500',
      bg: slowOperations.length > 0 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-dark-900 border-zinc-800'
    }
  ];

  return (
    <div className="space-y-4">
      {/* 6 Grid Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="p-4 rounded-xl bg-dark-850/80 border border-white/5 shadow-sm hover:border-white/10 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                  {c.label}
                </span>
                <div className={`p-1.5 rounded-md border ${c.bg} ${c.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <div className={`text-xl sm:text-2xl font-bold font-mono tracking-tight text-white ${c.color}`}>
                  {c.value}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1 truncate">
                  {c.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Latency Percentiles Ribbon */}
      <div className="px-4 py-3 rounded-xl bg-dark-900 border border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center space-x-2 text-zinc-400">
          <Percent className="w-4 h-4 text-brand-primary" />
          <span className="font-semibold text-zinc-300">Latency Percentiles:</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center space-x-1.5">
            <span className="text-zinc-500">P50 (Median):</span>
            <span className="text-cyan-300 font-medium">{formatDuration(percentiles.p50 || 0)}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-zinc-500">P90:</span>
            <span className="text-indigo-300 font-medium">{formatDuration(percentiles.p90 || 0)}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-zinc-500">P95:</span>
            <span className="text-amber-300 font-medium">{formatDuration(percentiles.p95 || 0)}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-zinc-500">P99:</span>
            <span className="text-rose-300 font-medium">{formatDuration(percentiles.p99 || 0)}</span>
          </div>
          {executionDurationMs && (
            <div className="hidden md:flex items-center space-x-1 text-zinc-500 border-l border-zinc-800 pl-4">
              <span>Server Roundtrip:</span>
              <span className="text-zinc-300">{executionDurationMs}ms</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
