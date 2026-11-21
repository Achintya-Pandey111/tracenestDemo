import React, { useState } from 'react';
import { formatDuration, formatTime, getEventTypeBadge } from '../utils/formatters';
import { Clock, Filter, Activity, GitCommit, AlertTriangle } from 'lucide-react';

export default function TraceTimeline({ events = [], operations = [], wallClockTimeMs = 1 }) {
  const [filter, setFilter] = useState('all'); // 'all', 'milestones', 'operations'

  const firstTimestamp = events.length > 0 ? events[0].timestamp : Date.now();
  const maxElapsed = Math.max(1, wallClockTimeMs);

  const filteredEvents = events.filter((e) => {
    if (filter === 'milestones') {
      return ['TRACK', 'WARNING', 'ERROR'].includes(e.type);
    }
    if (filter === 'operations') {
      return ['CALL', 'SUCCESS', 'ERROR'].includes(e.type);
    }
    return true;
  });

  return (
    <div className="rounded-xl border border-white/5 bg-dark-900/70 p-4 sm:p-6 space-y-6">
      
      {/* Header and Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white font-sans">
            Execution Timeline & Event Sequence
          </h3>
          <span className="text-xs font-mono text-zinc-400">
            ({events.length} total events)
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-dark-950 p-1 rounded-lg border border-zinc-800 text-xs font-mono">
          <Filter className="w-3 h-3 text-zinc-500 ml-1 mr-0.5" />
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-0.5 rounded transition-colors ${
              filter === 'all' ? 'bg-brand-primary text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setFilter('milestones')}
            className={`px-2 py-0.5 rounded transition-colors ${
              filter === 'milestones' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Milestones (TRACK)
          </button>
          <button
            onClick={() => setFilter('operations')}
            className={`px-2 py-0.5 rounded transition-colors ${
              filter === 'operations' ? 'bg-cyan-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Operation Spans
          </button>
        </div>
      </div>

      {/* Gantt-style Operation Spans Chart */}
      {operations.length > 0 && (
        <div className="space-y-2 pb-4 border-b border-zinc-800/80">
          <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-between mb-1">
            <span>Operation Gantt Latency Distribution</span>
            <span>Elapsed: {formatDuration(wallClockTimeMs)}</span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            {operations.map((op) => {
              const startOffset = Math.max(0, (op.startTime - firstTimestamp));
              const leftPct = Math.min(95, Math.max(0, (startOffset / maxElapsed) * 100));
              const widthPct = Math.min(100 - leftPct, Math.max(3, (op.durationMs / maxElapsed) * 100));

              const isError = op.status === 'ERROR';
              const isSlow = op.durationMs >= 70; // visual highlight

              return (
                <div key={op.id} className="relative group/gantt">
                  <div className="flex items-center justify-between text-[11px] text-zinc-300 py-0.5">
                    <span className="truncate pr-2 max-w-[220px] sm:max-w-[340px]" title={op.name}>
                      {'· '.repeat(op.depth || 0)}{op.name}
                    </span>
                    <span className="text-zinc-400 flex-shrink-0">
                      {formatDuration(op.durationMs)}
                    </span>
                  </div>

                  {/* Gantt track */}
                  <div className="h-2 w-full bg-dark-950 rounded-full overflow-hidden relative border border-white/5">
                    <div
                      className={`absolute top-0 bottom-0 rounded-full transition-all duration-300 ${
                        isError
                          ? 'bg-rose-500'
                          : isSlow
                          ? 'bg-amber-400'
                          : 'bg-gradient-to-r from-brand-primary to-cyan-400'
                      }`}
                      style={{
                        left: `${leftPct}%`,
                        width: `${widthPct}%`
                      }}
                      title={`${op.name}: ${formatDuration(op.durationMs)}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chronological Event Log List */}
      <div className="space-y-2 font-mono text-xs">
        <div className="text-[11px] font-sans font-semibold text-zinc-400 mb-2">
          Step-by-Step Chronological Events Log
        </div>

        <div className="max-h-[420px] overflow-y-auto space-y-1 pr-1">
          {filteredEvents.map((evt, idx) => {
            const badge = getEventTypeBadge(evt.type);
            const isError = evt.type === 'ERROR';
            const isWarn = evt.type === 'WARNING';

            return (
              <div
                key={evt.id || idx}
                className={`flex items-center justify-between p-2 rounded border transition-colors ${
                  isError
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : isWarn
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : 'bg-dark-950/60 border-zinc-800/80 hover:bg-dark-850'
                }`}
                style={{ marginLeft: `${Math.min((evt.depth || 0) * 12, 60)}px` }}
              >
                <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                  <span className="text-[10px] text-zinc-500 w-16 flex-shrink-0">
                    {formatTime(evt.timestamp).split(':').slice(1).join(':')}
                  </span>

                  <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider font-semibold ${badge.bg} ${badge.text} ${badge.border}`}>
                    {badge.label}
                  </span>

                  <span className="text-zinc-200 truncate flex-1">
                    {evt.name}
                  </span>

                  {evt.metadata && (
                    <span className="hidden md:inline-block text-[10px] text-zinc-400 bg-dark-900 px-1.5 py-0.5 rounded border border-zinc-800 truncate max-w-[200px]">
                      {JSON.stringify(evt.metadata)}
                    </span>
                  )}
                </div>

                {typeof evt.durationMs === 'number' && (
                  <span className="text-[11px] text-cyan-400 ml-2 flex-shrink-0">
                    +{formatDuration(evt.durationMs)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
