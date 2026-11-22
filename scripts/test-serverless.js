/**
 * Verification test for Vercel Serverless Function: api/trace.js
 */

import handler from '../api/trace.js';

function createMockReqRes(method, query = {}, body = null) {
  const req = {
    method,
    query,
    body,
    headers: {}
  };

  const res = {
    statusCode: 200,
    headers: {},
    ended: false,
    bodyData: null,
    setHeader(key, val) {
      this.headers[key] = val;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.bodyData = data;
      this.ended = true;
      return this;
    },
    end() {
      this.ended = true;
      return this;
    }
  };

  return { req, res };
}

async function testServerlessFunction() {
  console.log('Testing Vercel Serverless Function api/trace.js...\n');

  // Test 1: GET db_query
  {
    const { req, res } = createMockReqRes('GET', { scenario: 'db_query' });
    await handler(req, res);
    console.log(`Test 1 [GET db_query]: status=${res.statusCode}, success=${res.bodyData?.success}, ops=${res.bodyData?.report?.summary?.totalOperations}`);
    if (res.statusCode !== 200 || !res.bodyData?.success) {
      throw new Error('Test 1 failed');
    }
  }

  // Test 2: GET slow_operation
  {
    const { req, res } = createMockReqRes('GET', { scenario: 'slow_operation', slowThresholdMs: '60' });
    await handler(req, res);
    console.log(`Test 2 [GET slow_operation]: status=${res.statusCode}, slowOps=${res.bodyData?.report?.slowOperations?.length}`);
    if (res.statusCode !== 200 || res.bodyData?.report?.slowOperations?.length === 0) {
      throw new Error('Test 2 failed');
    }
  }

  // Test 3: GET error_handling
  {
    const { req, res } = createMockReqRes('GET', { scenario: 'error_handling' });
    await handler(req, res);
    console.log(`Test 3 [GET error_handling]: status=${res.statusCode}, capturedErrors=${res.bodyData?.report?.errors?.length}`);
    if (res.statusCode !== 200 || res.bodyData?.report?.errors?.length === 0) {
      throw new Error('Test 3 failed');
    }
  }

  // Test 4: POST custom scenario
  {
    const { req, res } = createMockReqRes('POST', {}, { scenario: 'nested_ops', slowThresholdMs: 80 });
    await handler(req, res);
    console.log(`Test 4 [POST nested_ops]: status=${res.statusCode}, success=${res.bodyData?.success}, ops=${res.bodyData?.report?.summary?.totalOperations}`);
    if (res.statusCode !== 200 || !res.bodyData?.success) {
      throw new Error('Test 4 failed');
    }
  }

  // Test 5: Invalid scenario
  {
    const { req, res } = createMockReqRes('GET', { scenario: 'non_existent_scenario' });
    await handler(req, res);
    console.log(`Test 5 [Invalid scenario]: status=${res.statusCode}, success=${res.bodyData?.success}`);
    if (res.statusCode !== 400 || res.bodyData?.success !== false) {
      throw new Error('Test 5 failed: expected 400');
    }
  }

  console.log('\nAll Vercel Serverless Function tests PASSED successfully!');
}

testServerlessFunction().catch(err => {
  console.error('Serverless function test failed:', err);
  process.exit(1);
});
