import React from 'react';
import { 
  GitFork, 
  Workflow, 
  BarChart3, 
  Flame, 
  AlertOctagon, 
  FileJson, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

const FEATURES = [
  {
    icon: GitFork,
    title: 'Async Execution Tracking',
    subtitle: 'Built on Node.js AsyncLocalStorage',
    description: 'Tracks async context transparently across callbacks, Promises, async/await, timers, and I/O event loops with zero runtime boilerplate.',
    badge: 'Core Engine',
    color: 'from-indigo-500/20 to-purple-500/20 text-indigo-400 border-indigo-500/30'
  },
  {
    icon: Workflow,
    title: 'Nested Trace Hierarchy',
    subtitle: 'Automatic Parent-Child Linking',
    description: 'Captures deeply nested subroutine hierarchies without manual context passing. Inspect parent operations and their child executions in real time.',
    badge: 'Hierarchical',
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30'
  },
  {
    icon: BarChart3,
    title: 'Performance Analysis',
    subtitle: 'Microsecond-Level Durations',
    description: 'High-resolution latency benchmarking with process.hrtime. Computes total wall-clock time, cumulative op time, and P50, P90, P95, and P99 percentiles.',
    badge: 'Metrics',
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30'
  },
  {
    icon: Flame,
    title: 'Slow Operation Detection',
    subtitle: 'Automated Latency Regressions',
    description: 'Define custom duration thresholds in milliseconds. TraceNest automatically flags sluggish queries, slow HTTP calls, and computation bottlenecks.',
    badge: 'Bottlenecks',
    color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30'
  },
  {
    icon: AlertOctagon,
    title: 'Error Tracking & Preservation',
    subtitle: 'Zero Error Swallowing',
    description: 'Intercepts exceptions, records failure states, operation context, and serialized stack traces, then safely re-throws to preserve application flow.',
    badge: 'Diagnostics',
    color: 'from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30'
  },
  {
    icon: FileJson,
    title: 'JSON Trace Export & CLI',
    subtitle: 'Archival & CI/CD Benchmarks',
    description: 'Export structured trace reports as JSON files for external dashboards, CI/CD performance regression gates, or inspect directly via the tracenest CLI.',
    badge: 'Observability',
    color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 border-t border-white/5 bg-dark-900/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-xs font-mono text-brand-primary mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Architecture & Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Designed for Modern Node.js Performance
          </h2>
          <p className="mt-4 text-base text-zinc-400 leading-relaxed font-sans">
            TraceNest provides transparent execution observability without heavy APM agents, proprietary daemons, or runtime overhead.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-xl border border-white/5 hover:border-white/15 bg-dark-850/60 hover:bg-dark-850 p-6 transition-all duration-200 hover:-translate-y-1 shadow-lg shadow-black/20"
              >
                {/* Glow highlight on hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br border ${feature.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-dark-950 text-zinc-400 border border-zinc-800">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white tracking-tight group-hover:text-brand-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs font-mono text-zinc-400 mt-1 mb-3">
                  {feature.subtitle}
                </p>

                <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Technical Highlights Banner */}
        <div className="mt-12 p-6 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/30 via-dark-850 to-cyan-950/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white font-sans">Pure Standard Library Implementation</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Built strictly using <code className="text-indigo-300 font-mono">node:async_hooks</code>, <code className="text-indigo-300 font-mono">node:perf_hooks</code>, and <code className="text-indigo-300 font-mono">node:crypto</code>. No native addons, no monkey-patching.
              </p>
            </div>
          </div>
          <a
            href="#docs"
            className="flex-shrink-0 px-4 py-2 text-xs font-mono font-medium bg-dark-800 hover:bg-dark-750 text-zinc-200 hover:text-white rounded-lg border border-zinc-700 transition-colors"
          >
            Explore API Reference →
          </a>
        </div>

      </div>
    </section>
  );
}
