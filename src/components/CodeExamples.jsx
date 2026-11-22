import React, { useState } from 'react';
import { CONFIG } from '../config';
import { Code2, Copy, Check, Terminal, FileCode, Layers, Server } from 'lucide-react';

const CODE_TABS = [
  {
    id: 'quickstart',
    name: 'Quick Start',
    icon: Code2,
    lang: 'javascript',
    code: `const TraceNest = require('tracenest-node');

async function main() {
  // 1. Initialize and start a tracing session
  TraceNest.start({
    name: 'OrderProcessingService',
    slowOperationThresholdMs: 50
  });

  // 2. Trace asynchronous or synchronous functions
  const order = await TraceNest.trace('Process Customer Order', async () => {
    TraceNest.track('Validating account permissions');

    // Automatically nested child operation
    const result = await TraceNest.trace('Query Database', async () => {
      // Async database or I/O call
      await new Promise((resolve) => setTimeout(resolve, 20));
      return { id: 'ORD-901', status: 'PENDING' };
    });

    return result;
  });

  // 3. Print execution summary report to terminal
  TraceNest.report();

  // 4. Optionally export structured JSON report
  TraceNest.exportJSON('./trace-report.json');
}

main();`
  },
  {
    id: 'nested',
    name: 'Nested Execution Trees',
    icon: Layers,
    lang: 'javascript',
    code: `const TraceNest = require('tracenest-node');

TraceNest.start({ name: 'CheckoutPipeline', slowOperationThresholdMs: 100 });

// Parent-child relationships are automatically tracked via AsyncLocalStorage
await TraceNest.trace('E-Commerce Checkout', async () => {
  // Child 1
  await TraceNest.trace('Customer KYC Verification', async () => {
    TraceNest.track('Checking credit rating');
    await TraceNest.trace('Credit Bureau API', async () => {
      // Third-party network call
    });
  });

  // Child 2
  await TraceNest.trace('Inventory Reservation', async () => {
    TraceNest.track('Acquiring distributed Redis lock');
    await TraceNest.trace('SQL: UPDATE inventory SET stock = stock - 1', async () => {
      // Database write
    });
  });

  // Child 3
  await TraceNest.trace('Stripe Payment Authorization', async () => {
    // Gateway call
  });
});

// Retrieve raw hierarchical tree structure
const { tree, summary, slowOperations } = TraceNest.getReportData();
console.log('Total Operations:', summary.totalOperations);
console.log('Wall-Clock Latency:', summary.wallClockTimeMs, 'ms');`
  },
  {
    id: 'express',
    name: 'Express Middleware',
    icon: Server,
    lang: 'javascript',
    code: `const express = require('express');
const TraceNest = require('tracenest-node');

const app = express();

TraceNest.start({
  name: 'UserAPIGateway',
  slowOperationThresholdMs: 100
});

// Mount TraceNest express middleware
// Automatically isolates every HTTP request in its own AsyncLocalStorage context
app.use(TraceNest.expressMiddleware({
  ignorePaths: ['/health', '/metrics']
}));

app.get('/users/:id', async (req, res) => {
  // All subroutines within this route handler automatically nest beneath the request!
  const user = await TraceNest.trace('Fetch User Profile', async () => {
    return await TraceNest.trace('SQL: SELECT * FROM users WHERE id = $1', async () => {
      return db.findUser(req.params.id);
    });
  });

  res.json(user);
});

// Mount error handler middleware
app.use(TraceNest.expressErrorMiddleware());

app.listen(3000, () => console.log('Server running with TraceNest'));`
  },
  {
    id: 'manual',
    name: 'Manual begin() / end()',
    icon: FileCode,
    lang: 'javascript',
    code: `const TraceNest = require('tracenest-node');

TraceNest.start();

// For event-driven streams, callbacks, or manual lifecycle management
const operation = TraceNest.begin('Stream Data Processing', {
  streamId: 'stream_8819',
  bufferSize: 65536
});

try {
  operation.annotate('source', 's3://bucket/events.log');
  operation.track('Stream chunk #1 received');

  // Process data...
  operation.track('Stream chunk #2 received');

  // Mark operation finished successfully
  operation.end();
} catch (err) {
  // Explicitly fail operation with error & stack trace
  operation.fail(err);
  throw err;
}`
  },
  {
    id: 'cli',
    name: 'CLI Inspection',
    icon: Terminal,
    lang: 'bash',
    code: `# 1. Install TraceNest globally or use npx
npm install -g tracenest-node

# 2. View formatted report from an exported JSON trace
npx tracenest report ./trace-report.json

# 3. Adjust slow operation threshold on the fly
npx tracenest report ./trace-report.json --threshold 50

# 4. Output summary statistics only
npx tracenest summary ./trace-report.json

# 5. Run a script with TraceNest auto-started and export JSON
npx tracenest run ./app.js --output ./trace.json`
  }
];

export default function CodeExamples() {
  const [activeTab, setActiveTab] = useState('quickstart');
  const [copied, setCopied] = useState(false);

  const currentTab = CODE_TABS.find((t) => t.id === activeTab) || CODE_TABS[0];

  const copyCode = () => {
    navigator.clipboard.writeText(currentTab.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="docs" className="py-20 bg-dark-900/50 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-xs font-mono text-brand-primary mb-3">
            <Code2 className="w-3.5 h-3.5" />
            <span>Developer Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Built for Real-World Node.js Backends
          </h2>
          <p className="mt-4 text-base text-zinc-400 font-sans">
            Minimal API footprint. No complex decorators, monkey-patching, or invasive agents required.
          </p>
        </div>

        {/* Tabs Bar */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center space-x-2 border-b border-white/5 pb-3 overflow-x-auto">
            {CODE_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-mono text-xs transition-all flex-shrink-0 ${
                    isActive
                      ? 'bg-brand-primary/15 text-brand-primary border border-brand-primary/30 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-dark-850'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Code Container */}
          <div className="mt-4 rounded-xl border border-white/10 bg-dark-950 shadow-2xl overflow-hidden font-mono text-xs">
            
            {/* Code Window Header */}
            <div className="px-4 py-3 bg-dark-850 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-zinc-400 text-xs font-sans font-medium">
                  {currentTab.name} • {currentTab.lang}
                </span>
              </div>

              <button
                onClick={copyCode}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-dark-800 hover:bg-dark-750 text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors text-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Body */}
            <div className="p-4 sm:p-6 overflow-x-auto bg-black/60">
              <pre className="text-zinc-300 font-mono text-xs sm:text-sm leading-relaxed">
                <code>{currentTab.code}</code>
              </pre>
            </div>

            {/* Code Footer */}
            <div className="px-4 py-2.5 bg-dark-900 border-t border-white/5 text-[11px] text-zinc-500 flex items-center justify-between">
              <span>Import: <code className="text-zinc-300">const TraceNest = require('tracenest-node')</code></span>
              <span className="hidden sm:inline">Supports CommonJS and ES Modules</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
