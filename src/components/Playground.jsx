import React, { useState, useEffect } from 'react';
import { CONFIG } from '../config';
import TraceSummary from './TraceSummary';
import TraceTree from './TraceTree';
import TraceTimeline from './TraceTimeline';
import SlowOperations from './SlowOperations';
import ErrorAnalysis from './ErrorAnalysis';
import TerminalView from './TerminalView';
import JsonViewer from './JsonViewer';
import { 
  Play, 
  RefreshCw, 
  Flame, 
  AlertTriangle, 
  Layers, 
  Clock, 
  Terminal, 
  FileJson, 
  Sliders, 
  CheckCircle2, 
  Database, 
  Globe, 
  GitFork, 
  AlertOctagon,
  Sparkles
} from 'lucide-react';

const SCENARIO_ICONS = {
  db_query: Database,
  api_request: Globe,
  nested_ops: GitFork,
  slow_operation: Flame,
  error_handling: AlertOctagon
};

export default function Playground() {
  const [selectedScenario, setSelectedScenario] = useState('db_query');
  const [slowThresholdMs, setSlowThresholdMs] = useState(70);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('tree'); // 'tree', 'timeline', 'diagnostics', 'terminal', 'json'
  
  // Real trace state
  const [traceResult, setTraceResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [executionTimeMs, setExecutionTimeMs] = useState(null);

  // Trigger scenario execution
  const executeScenario = async (scenarioId = selectedScenario) => {
    setLoading(true);
    setErrorMsg(null);
    const startReqTime = Date.now();

    try {
      const response = await fetch(`${CONFIG.apiEndpoint}?scenario=${scenarioId}&slowThresholdMs=${slowThresholdMs}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to execute trace');
      }

      setTraceResult(data);
      setExecutionTimeMs(Date.now() - startReqTime);
    } catch (err) {
      console.error('Failed to run scenario:', err);
      setErrorMsg(err.message || 'Error communicating with backend trace server');
    } finally {
      setLoading(false);
    }
  };

  // Run initial scenario automatically on component mount
  useEffect(() => {
    executeScenario('db_query');
  }, []);

  const handleSelectScenario = (id) => {
    setSelectedScenario(id);
    // If switching to slow_operation, default threshold to 70 for clear demo
    if (id === 'slow_operation' && slowThresholdMs > 80) {
      setSlowThresholdMs(70);
    }
    executeScenario(id);
  };

  const report = traceResult?.report;
  const slowOps = report?.slowOperations || [];
  const errors = report?.errors || [];

  return (
    <section id="playground" className="py-20 bg-dark-950 relative border-t border-white/5">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Serverless Execution</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Interactive Trace Playground
            </h2>
            <p className="mt-2 text-sm text-zinc-400 max-w-2xl font-sans">
              Test authentic TraceNest execution in real-time. Every click invokes the published <code className="text-zinc-200 font-mono">tracenest-node</code> package on a Vercel serverless function.
            </p>
          </div>

          {/* Live Indicator */}
          <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400 self-start md:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Connected to real Node.js runtime</span>
          </div>
        </div>

        {/* Scenario Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {CONFIG.scenarios.map((sc) => {
            const isSelected = selectedScenario === sc.id;
            const Icon = SCENARIO_ICONS[sc.id] || Layers;

            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc.id)}
                disabled={loading}
                className={`text-left p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between relative group ${
                  isSelected
                    ? 'bg-dark-850 border-brand-primary/60 shadow-lg shadow-brand-primary/15 ring-1 ring-brand-primary/40'
                    : 'bg-dark-900/70 border-white/5 hover:border-white/15 hover:bg-dark-850/60'
                } ${loading ? 'opacity-80' : ''}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg border ${
                      isSelected ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/40' : 'bg-dark-950 text-zinc-400 border-zinc-800 group-hover:text-zinc-200'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${sc.badgeColor}`}>
                      {sc.tag}
                    </span>
                  </div>

                  <h3 className={`text-sm font-semibold tracking-tight ${isSelected ? 'text-white' : 'text-zinc-200'}`}>
                    {sc.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed font-sans">
                    {sc.shortDesc}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                  <span className={isSelected ? 'text-brand-accent font-medium' : 'text-zinc-500'}>
                    {isSelected ? (loading ? 'Tracing...' : 'Active Scenario') : 'Click to Run'}
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Playground Control Bar */}
        <div className="p-4 rounded-xl bg-dark-900 border border-white/5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Left: Re-run Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => executeScenario(selectedScenario)}
              disabled={loading}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-brand-primary hover:bg-indigo-600 active:scale-95 text-white font-medium text-xs shadow-md shadow-brand-primary/25 disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Executing Real Trace...' : 'Run Selected Scenario'}</span>
            </button>

            {traceResult && (
              <span className="hidden sm:inline-block text-xs font-mono text-zinc-400">
                Trace ID: <code className="text-zinc-200 font-semibold">{report?.traceId || 'N/A'}</code>
              </span>
            )}
          </div>

          {/* Right: Latency Threshold Slider */}
          <div className="flex items-center space-x-3 text-xs font-mono text-zinc-300">
            <div className="flex items-center space-x-1.5 text-zinc-400">
              <Sliders className="w-3.5 h-3.5" />
              <span>Slow Threshold:</span>
            </div>
            <input
              type="range"
              min="30"
              max="200"
              step="5"
              value={slowThresholdMs}
              onChange={(e) => setSlowThresholdMs(Number(e.target.value))}
              disabled={loading}
              className="w-24 sm:w-32 accent-brand-primary cursor-pointer"
            />
            <span className="px-2 py-0.5 rounded bg-dark-950 border border-zinc-800 text-amber-300 font-bold">
              {slowThresholdMs}ms
            </span>
          </div>

        </div>

        {/* Error notification if API failed */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs font-mono flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertOctagon className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>Execution Error: {errorMsg}</span>
            </div>
            <button
              onClick={() => executeScenario(selectedScenario)}
              className="underline hover:text-white"
            >
              Retry
            </button>
          </div>
        )}

        {/* Live Loading Overlay / Skeleton if needed */}
        {loading && !traceResult && (
          <div className="py-20 flex flex-col items-center justify-center space-y-4 rounded-xl bg-dark-900/50 border border-white/5">
            <div className="w-10 h-10 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-mono text-zinc-400">
              Executing <code className="text-white font-semibold">tracenest-node</code> async pipeline in serverless sandbox...
            </p>
          </div>
        )}

        {/* Result Dashboard */}
        {traceResult && (
          <div className="space-y-6 animate-fade-in">
            
            {/* 1. Summary Cards */}
            <TraceSummary 
              report={report} 
              executionDurationMs={executionTimeMs} 
            />

            {/* 2. Visual Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2 overflow-x-auto">
              <div className="flex items-center space-x-1 sm:space-x-2 font-mono text-xs">
                <button
                  onClick={() => setActiveTab('tree')}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-all ${
                    activeTab === 'tree'
                      ? 'bg-brand-primary/15 text-brand-primary border border-brand-primary/30 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-dark-850'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Trace Tree</span>
                </button>

                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-all ${
                    activeTab === 'timeline'
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-dark-850'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Timeline & Events</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-dark-950 text-zinc-500">
                    {report?.events?.length || 0}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('diagnostics')}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-all ${
                    activeTab === 'diagnostics'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-dark-850'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Bottlenecks & Errors</span>
                  {(slowOps.length > 0 || errors.length > 0) && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                      {slowOps.length + errors.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('terminal')}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-all ${
                    activeTab === 'terminal'
                      ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-dark-850'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>CLI Terminal Output</span>
                </button>

                <button
                  onClick={() => setActiveTab('json')}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-all ${
                    activeTab === 'json'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-dark-850'
                  }`}
                >
                  <FileJson className="w-3.5 h-3.5" />
                  <span>Raw JSON Export</span>
                </button>
              </div>
            </div>

            {/* Tab Panels */}
            <div className="pt-2">
              {activeTab === 'tree' && (
                <TraceTree 
                  tree={report?.tree || []} 
                  slowOperations={slowOps}
                  wallClockTimeMs={report?.summary?.wallClockTimeMs || report?.summary?.totalExecutionTimeMs || 1}
                />
              )}

              {activeTab === 'timeline' && (
                <TraceTimeline 
                  events={report?.events || []} 
                  operations={report?.operations || []}
                  wallClockTimeMs={report?.summary?.wallClockTimeMs || report?.summary?.totalExecutionTimeMs || 1}
                />
              )}

              {activeTab === 'diagnostics' && (
                <div className="space-y-6">
                  <SlowOperations 
                    slowOperations={slowOps} 
                    thresholdMs={slowThresholdMs}
                  />
                  <ErrorAnalysis 
                    errors={errors} 
                  />
                </div>
              )}

              {activeTab === 'terminal' && (
                <TerminalView 
                  terminalOutput={traceResult.terminalOutput} 
                />
              )}

              {activeTab === 'json' && (
                <JsonViewer 
                  report={report} 
                />
              )}
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
