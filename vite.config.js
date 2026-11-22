import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { runScenario } from './api/scenarios.js';

function tracenestApiPlugin() {
  return {
    name: 'tracenest-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost');
        if (url.pathname === '/api/trace') {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

          if (req.method === 'OPTIONS') {
            res.statusCode = 200;
            res.end();
            return;
          }

          try {
            let scenario = url.searchParams.get('scenario') || 'db_query';
            let slowThresholdMs = url.searchParams.get('slowThresholdMs');
            let options = {};
            if (slowThresholdMs) {
              options.slowThresholdMs = parseInt(slowThresholdMs, 10);
            }

            if (req.method === 'POST') {
              let body = '';
              for await (const chunk of req) {
                body += chunk;
              }
              if (body) {
                try {
                  const parsed = JSON.parse(body);
                  if (parsed.scenario) scenario = parsed.scenario;
                  if (parsed.slowThresholdMs) options.slowThresholdMs = parseInt(parsed.slowThresholdMs, 10);
                  if (parsed.options) options = { ...options, ...parsed.options };
                } catch (_) {}
              }
            }

            const startTime = Date.now();
            const result = await runScenario(scenario, options);
            const executionDurationMs = Date.now() - startTime;

            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              serverTimestamp: new Date().toISOString(),
              executionDurationMs,
              ...result
            }));
          } catch (err) {
            console.error('API execution error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({
              success: false,
              error: err.message || 'Server error'
            }));
          }
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), tracenestApiPlugin()],
  server: {
    port: 3000,
    open: false
  }
});
