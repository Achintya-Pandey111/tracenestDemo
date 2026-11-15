# TraceNest Demo Website

[![npm version](https://img.shields.io/npm/v/tracenest-node.svg?color=6366f1&label=tracenest-node)](https://www.npmjs.com/package/tracenest-node)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-indigo.svg)](https://nodejs.org/)
[![Vercel Deployment](https://img.shields.io/badge/deployed%20on-Vercel-black.svg?logo=vercel)](https://vercel.com)

A modern, production-grade interactive demo website for the published npm package **[`tracenest-node`](https://www.npmjs.com/package/tracenest-node)**. Built with React, Vite, Tailwind CSS, and Vercel Serverless Functions.

The website provides an interactive developer playground where visitors can execute real-time asynchronous tracing, inspect nested parent-child call hierarchies, analyze microsecond latencies, detect slow operations, and diagnose errors directly from their browser.

---

## 🌟 Key Features

- **Real TraceNest Integration**: Installs and invokes the actual published `tracenest-node` npm package. Zero mock data or simulated responses.
- **Interactive Trace Playground**: Run 5 production-style scenarios on demand:
  1. **Database Query**: Connection pool checkout, parameterized SQL queries, index scans, and row deserialization.
  2. **API Request**: Request verification, JWT validation, microservice proxying, cache hydration, and ETag calculation.
  3. **Deep Nested Operations**: Multi-tier e-commerce checkout workflow (KYC, tax calculations, distributed Redis locks, and Kafka events).
  4. **Slow Operation Detection**: Triggers an intentionally slow operation (>70ms) to demonstrate TraceNest's automated latency bottleneck alerts.
  5. **Controlled Error Handling**: Intercepts and captures an upstream payment gateway timeout (`ETIMEDOUT`) with serialized stack traces while gracefully recovering.
- **Hierarchical Trace Tree**: Expandable/collapsible visualization of nested operations with status indicators and microsecond durations.
- **Execution Timeline**: Chronological Gantt latency bars and lifecycle milestone events (`START`, `CALL`, `TRACK`, `SUCCESS`, `WARNING`, `ERROR`, `END`).
- **Bottlenecks & Errors Dashboard**: Detailed breakdown of slow operations and runtime exceptions with stack traces.
- **TraceNest CLI Terminal Output**: Authentic terminal report matching `TraceNest.report()` and the `tracenest` CLI.
- **Raw JSON Trace Export**: Complete structured JSON trace export with copy and instant download options.
- **Modern Developer UI**: Linear/Vercel/Raycast-inspired dark theme, glassmorphism, responsive layout, and subtle micro-interactions.
- **Centralized Configuration**: Configurable GitHub URL and package settings in `src/config.js`.

---

## 📸 Screenshots

*(Add screenshots of your deployed demo website here)*

```
+-----------------------------------------------------------------------------------+
|  TraceNest v1.0.0                                          [npm v1.0.0] [GitHub]  |
|                                                                                   |
|                   Understand what your Node.js code is doing.                     |
|      Trace asynchronous execution, inspect nested operations, and uncover         |
|                       performance bottlenecks with TraceNest.                     |
|                                                                                   |
|    [ Try Live Demo ]  [ View on npm ]  $ npm install tracenest-node  [Copy]       |
+-----------------------------------------------------------------------------------+
|  [ Database Query ] [ API Request ] [ Deep Nested ] [ Slow Ops ] [ Error Flow ]   |
|                                                                                   |
|  Summary:  6 Operations | 100% Success | 103ms Wall-Clock | P95: 71.6ms           |
|                                                                                   |
|  Hierarchical Trace Tree:                                                         |
|  └── PostgreSQL Client Request [103.21ms]                                         |
|      ├── Pool: Acquire Connection [22.14ms]                                       |
|      ├── Execute SQL: SELECT * FROM customer_orders [60.51ms]                     |
|      │   ├── DB Engine: Index Scan on orders_status_idx [35.21ms]                 |
|      │   └── DB Engine: Heap Fetch and Filter [25.10ms]                           |
|      └── Process & Deserialize Query Results [15.34ms]                            |
+-----------------------------------------------------------------------------------+
```

---

## 🛠 Tech Stack

- **Runtime & Library**: Node.js `>=20.0.0`, [`tracenest-node@1.0.0`](https://www.npmjs.com/package/tracenest-node)
- **Frontend Framework**: React 18, Vite 6
- **Styling**: Tailwind CSS, PostCSS, Lucide Icons
- **Backend Architecture**: Vercel Serverless Functions (`api/trace.js`)
- **Deployment**: Vercel

---

## 📦 How This Demo Uses TraceNest

This demo does not use simulated reports. Each scenario execution runs the real TraceNest engine in the backend:

```javascript
import TraceNest from 'tracenest-node';

const { createTracer } = TraceNest;

// 1. Create an isolated Tracer instance
const tracer = createTracer({
  name: 'DatabaseQueryService',
  slowOperationThresholdMs: 70,
  autoWarnSlowOperations: true
});

tracer.start();

// 2. Trace execution with automatic AsyncLocalStorage context propagation
await tracer.trace('PostgreSQL Client Request', async () => {
  tracer.track('Acquiring connection from pool');

  await tracer.trace('Execute SQL Query', async () => {
    await tracer.trace('DB Engine: Index Scan', async () => {
      // Async database operation
    });
  });
});

tracer.stop();

// 3. Extract comprehensive report payload
const report = tracer.getReportData();
const terminalOutput = tracer.report({ silent: true, color: false });
```

---

## 📂 Project Structure

```
tracenestDemo/
├── api/
│   ├── trace.js               # Vercel Serverless Function entrypoint (/api/trace)
│   └── scenarios.js           # 5 real TraceNest scenarios using tracenest-node
├── public/
│   ├── favicon.svg            # Custom SVG favicon
│   └── logo.svg               # TraceNest logo icon
├── src/
│   ├── components/
│   │   ├── Navbar.jsx         # Header navigation, npm badge, copy command, GitHub link
│   │   ├── Hero.jsx           # Value prop, interactive preview, install command
│   │   ├── Features.jsx       # 6 capability cards with icons and descriptions
│   │   ├── Playground.jsx     # Scenario selectors, live controls, status tabs
│   │   ├── TraceSummary.jsx   # 6 high-density metric cards & percentiles ribbon
│   │   ├── TraceTree.jsx      # Hierarchical interactive collapsible tree
│   │   ├── TraceTimeline.jsx  # Gantt chart & chronological milestone event log
│   │   ├── SlowOperations.jsx # Highlighted slow operations analysis card
│   │   ├── ErrorAnalysis.jsx  # Intercepted errors, failed ops, and stack traces
│   │   ├── TerminalView.jsx   # TraceNest CLI formatted output mockup
│   │   ├── JsonViewer.jsx     # Syntax-highlighted JSON viewer with copy/download
│   │   ├── CodeExamples.jsx   # Developer Experience snippets for 5 patterns
│   │   └── Footer.jsx         # Footer with links, config, and license notice
│   ├── utils/
│   │   ├── formatters.js      # Formatters for durations, timestamps, and colors
│   │   └── heroPreviewData.js # Static illustration tree for Hero section
│   ├── config.js              # Centralized configuration (GitHub URL, package info)
│   ├── App.jsx                # Root application layout
│   ├── main.jsx               # React entrypoint
│   └── index.css              # Tailwind and dark theme CSS directives
├── scripts/
│   ├── test-api.js            # Verification script for all 5 scenarios
│   └── test-serverless.js     # Verification script for the Vercel handler
├── index.html                 # HTML template with Google Fonts
├── vite.config.js             # Vite configuration with built-in /api/trace dev plugin
├── tailwind.config.js         # Tailwind configuration & custom dark palette
├── postcss.config.js          # PostCSS configuration
├── vercel.json                # Vercel deployment configuration
├── package.json               # Dependencies and build scripts
└── README.md                  # Comprehensive documentation
```

---

## 🚀 Getting Started Locally

### Prerequisites

- **Node.js**: `>= 20.0.0`
- **npm**: `>= 9.0.0`

### 1. Installation

Clone your repository and install dependencies:

```bash
git clone <your-repository-url>
cd tracenestDemo
npm install
```

### 2. Verify Scenarios Locally

Run the verification test suite to confirm that `tracenest-node` executes all 5 scenarios and the serverless function handler:

```bash
npm run test:api
node scripts/test-serverless.js
```

### 3. Start Local Development Server

Run the Vite development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note on Local API Handling**: `vite.config.js` includes a built-in development middleware that handles `/api/trace` requests directly. You do not need to install the Vercel CLI or run a separate backend server for local testing.

### 4. Build for Production

To build the static frontend bundle:

```bash
npm run build
```

The production assets will be output to the `dist/` directory.

---

## 🌐 Vercel Deployment Instructions

Deploying this demo to Vercel is straightforward:

### Method 1: Deploy with Vercel Web Dashboard (Recommended)

1. Push your repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of TraceNest demo website"
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. Go to [https://vercel.com/new](https://vercel.com/new).
3. Import your GitHub repository.
4. Vercel will automatically detect the settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Serverless Functions**: Automatically deployed from `api/`
5. Click **Deploy**.
6. Once deployed, update your GitHub repository URL in `src/config.js` if you haven't already:
   ```javascript
   export const CONFIG = {
     // ...
     githubUrl: 'https://github.com/<your-username>/<your-repo-name>',
   };
   ```

### Method 2: Deploy with Vercel CLI

If you have the Vercel CLI installed globally:

```bash
# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## ⚙️ Configuring Your GitHub Repository Link

In `src/config.js`, update the `githubUrl` property:

```javascript
export const CONFIG = {
  packageName: 'tracenest-node',
  version: '1.0.0',
  npmUrl: 'https://www.npmjs.com/package/tracenest-node',

  // Set your public GitHub repo URL here:
  githubUrl: 'https://github.com/your-username/tracenest-demo',

  // ...
};
```

If `githubUrl` is empty or left as the placeholder, the UI displays a clean helper modal explaining where and how to configure it.

---

## 🔗 Official Links

- **npm Package**: [https://www.npmjs.com/package/tracenest-node](https://www.npmjs.com/package/tracenest-node)
- **Author**: Achintya Pandey ([npm Profile](https://www.npmjs.com/~achintya-102))

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
