import React, { useState } from 'react';
import { CONFIG } from '../config';
import { HERO_PREVIEW_TREE } from '../utils/heroPreviewData';
import { formatDuration } from '../utils/formatters';
import { 
  Play, 
  ExternalLink, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronDown, 
  Clock, 
  Sparkles, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  Info
} from 'lucide-react';

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const [collapsedNodes, setCollapsedNodes] = useState({});

  const copyInstall = () => {
    navigator.clipboard.writeText(`npm install ${CONFIG.packageName}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleCollapse = (id) => {
    setCollapsedNodes((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Recursive tree preview renderer
  const renderNode = (node) => {
    const isCollapsed = !!collapsedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="relative group/node select-none">
        <div 
          onClick={() => hasChildren && toggleCollapse(node.id)}
          className={`flex items-center justify-between py-2 px-3 rounded-lg border transition-all duration-150 ${
            hasChildren ? 'cursor-pointer hover:bg-dark-800/60' : ''
          } ${
            node.depth === 0 
              ? 'bg-dark-850/80 border-indigo-500/30 shadow-sm' 
              : 'bg-dark-900/50 border-white/5 hover:border-white/10'
          }`}
          style={{ marginLeft: `${node.depth * 20}px` }}
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            {hasChildren ? (
              <span className="p-0.5 rounded text-zinc-400 group-hover/node:text-zinc-200">
                {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </span>
            ) : (
              <span className="w-4 h-4 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
              </span>
            )}

            <span className="font-mono text-xs text-zinc-200 font-medium truncate">
              {node.name}
            </span>

            {node.metadata && (
              <span className="hidden sm:inline-flex items-center text-[10px] font-mono text-zinc-500 bg-dark-950 px-1.5 py-0.5 rounded border border-zinc-800">
                {Object.keys(node.metadata)[0]}: {String(Object.values(node.metadata)[0])}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
            <span className="inline-flex items-center space-x-1 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
              <Clock className="w-3 h-3 text-cyan-400/80" />
              <span>{formatDuration(node.durationMs)}</span>
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {node.status}
            </span>
          </div>
        </div>

        {/* Child nodes */}
        {hasChildren && !isCollapsed && (
          <div className="mt-1.5 space-y-1.5 border-l border-zinc-800/80 ml-4 pl-1">
            {node.children.map(renderNode)}
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="overview" className="relative pt-12 pb-20 overflow-hidden bg-grid-pattern">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 w-[350px] h-[250px] bg-brand-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Announcement Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-xs font-medium text-brand-primary">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
            </span>
            <span>Published on npm as <span className="font-mono font-semibold text-white">tracenest-node</span> v{CONFIG.version}</span>
          </div>
        </div>

        {/* Hero Headings */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Understand what your <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-primary via-indigo-300 to-brand-accent bg-clip-text text-transparent">
              Node.js code is doing.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-sans">
            Trace asynchronous execution, inspect nested operations, and uncover performance bottlenecks with TraceNest.
          </p>

          {/* Action Buttons & Install Command */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#playground"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-lg bg-gradient-to-r from-brand-primary to-indigo-600 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium text-sm shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 transition-all duration-200"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Try Live Demo</span>
            </a>

            <a
              href={CONFIG.npmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-lg bg-dark-850 hover:bg-dark-800 text-zinc-200 hover:text-white font-medium text-sm border border-zinc-700/80 hover:border-zinc-600 transition-all duration-200"
            >
              <span>View on npm</span>
              <ExternalLink className="w-4 h-4 text-zinc-400" />
            </a>

            {/* Copy Command */}
            <div className="w-full sm:w-auto flex items-center bg-dark-900 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-zinc-300 shadow-inner group">
              <span className="text-zinc-500 mr-2">$</span>
              <span className="text-zinc-200 mr-3">npm install {CONFIG.packageName}</span>
              <button
                onClick={copyInstall}
                className="ml-auto p-1 text-zinc-400 hover:text-white transition-colors"
                title="Copy install command"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Value Props Strip */}
          <div className="mt-12 pt-6 border-t border-white/5 flex flex-wrap justify-center items-center gap-6 text-xs font-mono text-zinc-400">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero External Dependencies</span>
            </div>
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Native AsyncLocalStorage</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Microsecond Precision</span>
            </div>
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Node.js {CONFIG.nodeVersion}</span>
            </div>
          </div>
        </div>

        {/* Realistic Trace-Tree Preview Showcase */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="rounded-xl border border-white/10 bg-dark-900/90 shadow-2xl backdrop-blur-xl overflow-hidden">
            
            {/* Preview Window Header */}
            <div className="px-4 py-3 bg-dark-850 border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="ml-2 font-mono text-xs text-zinc-400 font-medium">
                  Trace Tree Visualization
                </span>
              </div>

              {/* Explicit Preview Disclaimer Badge */}
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-400">
                <Info className="w-3 h-3" />
                <span>Interactive Preview (Illustration) • Run real live traces below</span>
              </div>
            </div>

            {/* Tree Content Preview */}
            <div className="p-4 sm:p-6 space-y-2 bg-dark-950/60 font-mono text-xs">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-zinc-800 text-[11px] text-zinc-500 font-sans">
                <span>Operation Name & Context</span>
                <span>Duration / Status</span>
              </div>

              {HERO_PREVIEW_TREE.map(renderNode)}

              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-zinc-400 text-[11px]">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  <span>Click any branch node to collapse or expand its nested hierarchy</span>
                </div>
                <a
                  href="#playground"
                  className="inline-flex items-center space-x-1 text-brand-primary hover:text-indigo-300 font-medium font-sans"
                >
                  <span>Go to Live Playground</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
