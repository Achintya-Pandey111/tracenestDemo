import React, { useState } from 'react';
import { FileJson, Copy, Check, Download } from 'lucide-react';

export default function JsonViewer({ report = null }) {
  const [copied, setCopied] = useState(false);

  const jsonString = report ? JSON.stringify(report, null, 2) : '{}';

  const copyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tracenest-report-${report?.traceId || 'export'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-white/5 bg-dark-900/90 shadow-2xl overflow-hidden font-mono text-xs">
      
      {/* Titlebar with Actions */}
      <div className="px-4 py-2.5 bg-dark-850 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileJson className="w-4 h-4 text-brand-primary" />
          <span className="text-zinc-300 text-xs font-semibold font-sans">
            Raw Trace Report (JSON Export)
          </span>
          {report?.traceId && (
            <span className="hidden sm:inline-block text-[11px] text-zinc-500 font-mono">
              ID: {report.traceId}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={copyJson}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-dark-800 hover:bg-dark-750 text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors text-[11px]"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy JSON</span>
              </>
            )}
          </button>

          <button
            onClick={downloadJson}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary hover:text-indigo-300 border border-brand-primary/30 transition-colors text-[11px] font-medium"
          >
            <Download className="w-3 h-3" />
            <span>Download JSON</span>
          </button>
        </div>
      </div>

      {/* Code Viewer Body */}
      <div className="p-4 bg-black/75 overflow-x-auto max-h-[500px]">
        <pre className="text-zinc-300 font-mono text-[11px] sm:text-xs leading-relaxed">
          {jsonString}
        </pre>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-dark-950 border-t border-zinc-850 text-[11px] text-zinc-500 flex items-center justify-between">
        <span>Valid TraceNest schema • Compatible with <code className="text-zinc-400">tracenest CLI</code></span>
        <span>Size: {(new Blob([jsonString]).size / 1024).toFixed(1)} KB</span>
      </div>

    </div>
  );
}
