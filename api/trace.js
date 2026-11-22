/**
 * Vercel Serverless Function: /api/trace
 *
 * Runs authentic TraceNest tracing scenarios using the published tracenest-node package.
 * Returns full trace reports, hierarchical trees, timeline events, and terminal output.
 */

import { runScenario } from './scenarios.js';

export default async function handler(req, res) {
  // Set CORS headers for local development and cross-origin invocation
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Extract query parameters and body
    let scenario = 'db_query';
    let options = {};

    if (req.query && req.query.scenario) {
      scenario = req.query.scenario;
    }

    if (req.query && req.query.slowThresholdMs) {
      options.slowThresholdMs = parseInt(req.query.slowThresholdMs, 10);
    }

    // Handle POST body if present
    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (_) {
          body = {};
        }
      }
      if (body) {
        if (body.scenario) scenario = body.scenario;
        if (body.slowThresholdMs) options.slowThresholdMs = parseInt(body.slowThresholdMs, 10);
        if (body.options) options = { ...options, ...body.options };
      }
    }

    // Validate scenario ID
    const validScenarios = ['db_query', 'api_request', 'nested_ops', 'slow_operation', 'error_handling'];
    if (!validScenarios.includes(scenario)) {
      res.status(400).json({
        success: false,
        error: `Invalid scenario '${scenario}'. Expected one of: ${validScenarios.join(', ')}`
      });
      return;
    }

    const startTime = Date.now();
    const result = await runScenario(scenario, options);
    const executionDurationMs = Date.now() - startTime;

    res.status(200).json({
      success: true,
      serverTimestamp: new Date().toISOString(),
      executionDurationMs,
      ...result
    });
  } catch (error) {
    console.error('Trace execution failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while executing trace'
    });
  }
}
