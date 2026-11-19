/**
 * Verification test script for TraceNest live scenarios
 */

import { runScenario } from '../api/scenarios.js';

async function testAllScenarios() {
  console.log('--- TESTING TRACENEST SCENARIOS ---');

  const scenarios = ['db_query', 'api_request', 'nested_ops', 'slow_operation', 'error_handling'];

  for (const s of scenarios) {
    console.log(`\nTesting scenario: ${s}...`);
    const start = Date.now();
    const result = await runScenario(s);
    const duration = Date.now() - start;

    const report = result.report;
    const summary = report.summary;

    console.log(`[PASS] ${result.title} in ${duration}ms`);
    console.log(`  - Trace ID: ${report.traceId}`);
    console.log(`  - Total Ops: ${summary.totalOperations}`);
    console.log(`  - Successful: ${summary.successfulOperations}`);
    console.log(`  - Failed: ${summary.failedOperations}`);
    console.log(`  - Events: ${report.events.length}`);
    console.log(`  - Slow Ops detected: ${report.slowOperations.length}`);
    console.log(`  - Tree Roots: ${report.tree.length}`);
    console.log(`  - Wall-clock: ${summary.wallClockTimeMs}ms`);

    if (s === 'slow_operation') {
      if (report.slowOperations.length === 0) {
        throw new Error('Expected slow operations to be detected in slow_operation scenario!');
      }
      console.log(`  - Verified slow operation: ${report.slowOperations[0].name} (${report.slowOperations[0].durationMs}ms)`);
    }

    if (s === 'error_handling') {
      if (report.errors.length === 0) {
        throw new Error('Expected errors to be captured in error_handling scenario!');
      }
      console.log(`  - Verified captured error: ${report.errors[0].name} -> ${report.errors[0].error.message}`);
    }
  }

  console.log('\nAll scenarios verified successfully with published tracenest-node package!');
}

testAllScenarios().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
