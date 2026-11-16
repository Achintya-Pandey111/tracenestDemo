/**
 * TraceNest Demo - Central Configuration
 *
 * All external links and package metadata are managed here.
 * To point to your GitHub repository, replace the githubUrl value below.
 */

export const CONFIG = {
  // Package details
  packageName: 'tracenest-node',
  version: '1.0.0',
  description: 'Lightweight Node.js async execution tracing, nested operation monitoring, and performance analysis library',
  license: 'MIT',
  nodeVersion: '>=20.0.0',
  
  // Official Links
  npmUrl: 'https://www.npmjs.com/package/tracenest-node',

  /**
   * GITHUB REPOSITORY URL:
   * Configured to official repository.
   */
  githubUrl: 'https://github.com/Achintya-Pandey111/tracenestDemo',

  // Fallback placeholder displayed when githubUrl is not configured
  githubPlaceholder: 'https://github.com/your-username/tracenest-demo',

  // Author details
  author: {
    name: 'Achintya Pandey',
    npmProfile: 'https://www.npmjs.com/~achintya-102',
  },

  // API Endpoints (relative to current host for Vercel and local dev)
  apiEndpoint: '/api/trace',

  // Playground Scenario definitions
  scenarios: [
    {
      id: 'db_query',
      name: 'Database Query',
      tag: 'I/O & Index Scans',
      shortDesc: 'Connection pool checkout, parameterized query, index scans, and JSON row deserialization.',
      badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    },
    {
      id: 'api_request',
      name: 'API Gateway Request',
      tag: 'Microservices & Auth',
      shortDesc: 'JWT claim verification, upstream internal proxy request, cache hydration, and ETag header formatting.',
      badgeColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
    },
    {
      id: 'nested_ops',
      name: 'Deep Nested Pipeline',
      tag: '4-Level Hierarchy',
      shortDesc: 'Multi-tier e-commerce checkout flow with KYC verification, tax engine, distributed Redis locks, and events.',
      badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    },
    {
      id: 'slow_operation',
      name: 'Slow Operation Detection',
      tag: 'Bottleneck Detection',
      shortDesc: 'Intentionally triggers an unindexed full table scan (>70ms) to demonstrate latency threshold alarms.',
      badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    },
    {
      id: 'error_handling',
      name: 'Error Handling & Recovery',
      tag: 'Resilience & Stack Traces',
      shortDesc: 'Simulates an upstream bank payment timeout; TraceNest captures full stack trace while allowing graceful recovery.',
      badgeColor: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
    }
  ]
};
