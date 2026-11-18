/**
 * TraceNest Live Scenarios
 * Uses the published tracenest-node package to execute real async operations
 * and return authentic trace reports.
 */

import TraceNest from 'tracenest-node';

const { createTracer } = TraceNest;

// Helper to simulate asynchronous I/O latency
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Scenario 1: Database Query
 * Simulates:
 * - Connection acquisition from pool
 * - Parameterized query execution with nested index scans
 * - Result row processing and JSON deserialization
 */
export async function runDatabaseQueryScenario(options = {}) {
  const threshold = options.slowThresholdMs || 100;
  const tracer = createTracer({
    name: 'DatabaseQueryService',
    slowOperationThresholdMs: threshold,
    autoWarnSlowOperations: true
  });

  tracer.start();

  try {
    await tracer.trace('PostgreSQL Client Request', async () => {
      tracer.track('Client received incoming SQL execution request', { client: 'pg-pool-v3' });

      // Step 1: Acquire pool connection
      await tracer.trace('Pool: Acquire Connection', async () => {
        tracer.track('Checking available pool slots (idle: 8, max: 20)');
        await sleep(22);
        tracer.track('Connection #4 acquired from pool');
      }, { poolSize: 20, activeConnections: 12 });

      // Step 2: Query execution with nested index lookup
      await tracer.trace('Execute SQL: SELECT * FROM customer_orders WHERE status = $1', async () => {
        tracer.track('SQL query plan generated');

        await tracer.trace('DB Engine: Index Scan on orders_status_idx', async () => {
          await sleep(35);
          tracer.track('Found 142 matching index rows');
        }, { index: 'orders_status_idx', scanType: 'BitmapIndexScan' });

        await tracer.trace('DB Engine: Heap Fetch and Filter', async () => {
          await sleep(25);
          tracer.track('Filter condition evaluated: order_total > 50.00');
        }, { fetchedRows: 142, filteredRows: 88 });

      }, { query: 'SELECT * FROM customer_orders WHERE status = $1', params: ['PENDING'] });

      // Step 3: Result processing
      await tracer.trace('Process & Deserialize Query Results', async () => {
        tracer.track('Deserializing 88 database tuples into domain models');
        await sleep(15);
        tracer.track('Domain models mapped and validated');
      }, { rowCount: 88, format: 'json' });

      // Step 4: Release connection back to pool
      tracer.track('Connection #4 returned to pool');
    }, { service: 'order-query-service', database: 'production_orders_db' });
  } finally {
    tracer.stop();
  }

  return {
    scenario: 'db_query',
    title: 'Database Query Simulation',
    description: 'Traces connection acquisition, nested database index scans, and row deserialization.',
    report: tracer.getReportData(),
    terminalOutput: tracer.report({ silent: true, color: false })
  };
}

/**
 * Scenario 2: API Request
 * Simulates:
 * - Request header and auth token validation
 * - Upstream external service HTTP call
 * - Response payload parsing and ETag cache computation
 */
export async function runApiRequestScenario(options = {}) {
  const threshold = options.slowThresholdMs || 100;
  const tracer = createTracer({
    name: 'ApiGatewayHandler',
    slowOperationThresholdMs: threshold,
    autoWarnSlowOperations: true
  });

  tracer.start();

  try {
    await tracer.trace('HTTP GET /api/v1/user/profile', async () => {
      tracer.track('Incoming HTTP request received', { method: 'GET', path: '/api/v1/user/profile' });

      // 1. Auth & Validation
      await tracer.trace('Validate Request & Auth Token', async () => {
        tracer.track('Verifying JWT signature and claims');
        await sleep(12);
        tracer.track('Token valid: claims for user_id=usr_99812 verified');
      }, { authScheme: 'Bearer JWT', userId: 'usr_99812' });

      // 2. Fetch Upstream Data
      await tracer.trace('Fetch Upstream: User Microservice', async () => {
        tracer.track('Sending HTTP call to http://internal-user-service.local:4000');

        await tracer.trace('HTTP Request: GET /internal/users/usr_99812', async () => {
          await sleep(40);
          tracer.track('HTTP 200 OK received from upstream user service');
        }, { endpoint: 'http://internal-user-service.local:4000', httpStatus: 200 });

        await tracer.trace('Cache Hydration: Redis SET user:usr_99812', async () => {
          await sleep(10);
        }, { ttlSeconds: 300 });

      }, { targetService: 'user-service-cluster' });

      // 3. Process & Format Response
      await tracer.trace('Serialize & Build HTTP Response', async () => {
        tracer.track('Sanitizing sensitive customer PII fields');
        await sleep(14);
        tracer.track('Computed ETag: W/"4f8a-9b1c2d3e"');
      }, { statusCode: 200, contentType: 'application/json' });

    }, { route: '/api/v1/user/profile', clientIp: '192.168.1.104' });
  } finally {
    tracer.stop();
  }

  return {
    scenario: 'api_request',
    title: 'API Request Gateway',
    description: 'Traces incoming REST request handling, JWT verification, microservice proxying, and caching.',
    report: tracer.getReportData(),
    terminalOutput: tracer.report({ silent: true, color: false })
  };
}

/**
 * Scenario 3: Nested Operations
 * Demonstrates a complex 4-level deep call tree representing an e-commerce checkout pipeline:
 * - Order Checkout Workflow
 *   - Customer Verification
 *     - Identity Verification
 *     - Risk Score Calculation
 *   - Pricing & Tax Engine
 *     - Coupon Code Evaluation
 *     - Dynamic Tax Calculation (Third-party Tax API)
 *   - Inventory Reservation
 *     - Acquire Distributed Redis Lock
 *     - Decrement Stock in DB
 *     - Release Redis Lock
 *   - Payment Authorization
 *   - Async Notification Event Dispatch
 */
export async function runNestedOperationsScenario(options = {}) {
  const threshold = options.slowThresholdMs || 100;
  const tracer = createTracer({
    name: 'ECommerceCheckoutPipeline',
    slowOperationThresholdMs: threshold,
    autoWarnSlowOperations: true
  });

  tracer.start();

  try {
    await tracer.trace('E-Commerce Order Checkout Flow', async () => {
      tracer.track('Initiating checkout transaction for Order #ORD-2026-9041');

      // Sub-branch 1: Customer Verification
      await tracer.trace('Step 1: Customer Verification', async () => {
        await tracer.trace('Verify Customer KYC & Status', async () => {
          await sleep(15);
          tracer.track('Account status: ACTIVE');
        }, { accountId: 'ACC-88301' });

        await tracer.trace('Calculate Fraud Risk Score', async () => {
          await sleep(20);
          tracer.track('Risk score evaluated: 0.04 (Low Risk)');
        }, { riskEngine: 'ML-Fraud-v4', score: 0.04 });
      });

      // Sub-branch 2: Pricing & Tax Calculation
      await tracer.trace('Step 2: Pricing & Tax Engine', async () => {
        await tracer.trace('Validate Promotional Coupon', async () => {
          await sleep(10);
          tracer.track('Coupon "DISCOUNT20" applied: -$24.50');
        }, { promoCode: 'DISCOUNT20', discountAmount: 24.50 });

        await tracer.trace('Third-party Tax Calculation Service', async () => {
          tracer.track('Calling external sales tax jurisdiction API');
          await sleep(35);
          tracer.track('Calculated state tax rate: 7.25% ($8.88)');
        }, { provider: 'TaxJar', state: 'CA' });
      });

      // Sub-branch 3: Distributed Inventory Reservation
      await tracer.trace('Step 3: Distributed Inventory Reservation', async () => {
        await tracer.trace('Redis: Acquire Distributed Lock', async () => {
          await sleep(12);
          tracer.track('Lock acquired: lock:inventory:sku-77401');
        }, { lockKey: 'lock:inventory:sku-77401', ttlMs: 5000 });

        await tracer.trace('SQL: UPDATE product_inventory SET stock = stock - 1', async () => {
          await sleep(22);
          tracer.track('Stock updated. Remaining: 43 units');
        }, { sku: 'SKU-77401', quantity: 1 });

        await tracer.trace('Redis: Release Distributed Lock', async () => {
          await sleep(8);
          tracer.track('Lock released successfully');
        }, { lockKey: 'lock:inventory:sku-77401' });
      });

      // Sub-branch 4: Payment Gateway
      await tracer.trace('Step 4: Payment Gateway Authorization', async () => {
        tracer.track('Sending payment intent authorization request');
        await sleep(45);
        tracer.track('Payment captured successfully via Stripe (charge_id: ch_910401)');
      }, { gateway: 'Stripe', amount: 106.38, currency: 'USD' });

      // Sub-branch 5: Event Bus
      await tracer.trace('Step 5: Emit Async Events & Notify', async () => {
        await tracer.trace('Kafka: Publish "order.created" Event', async () => {
          await sleep(12);
        }, { topic: 'orders.v1.created', partition: 3 });

        await tracer.trace('Dispatch Customer Confirmation Email', async () => {
          await sleep(15);
          tracer.track('Email queued on SES queue');
        }, { template: 'order-confirmation-v2' });
      });

      tracer.track('Order #ORD-2026-9041 completed and committed');
    }, { orderId: 'ORD-2026-9041', currency: 'USD', total: 106.38 });
  } finally {
    tracer.stop();
  }

  return {
    scenario: 'nested_ops',
    title: 'Deep Nested Operations',
    description: 'Demonstrates a deep 4-level execution hierarchy with async dependencies, locks, and payments.',
    report: tracer.getReportData(),
    terminalOutput: tracer.report({ silent: true, color: false })
  };
}

/**
 * Scenario 4: Slow Operation
 * Deliberately exceeds the configured slow operation threshold (default 75ms)
 * to demonstrate TraceNest's automated slow operation detection and analysis.
 */
export async function runSlowOperationScenario(options = {}) {
  // Use a strict threshold of 70ms so our 140ms operation is prominently flagged
  const threshold = options.slowThresholdMs || 70;
  const tracer = createTracer({
    name: 'ReportGeneratorService',
    slowOperationThresholdMs: threshold,
    autoWarnSlowOperations: true
  });

  tracer.start();

  try {
    await tracer.trace('Generate Monthly Financial Statement', async () => {
      tracer.track('Starting report batch generation job #JOB-771');

      // Fast step 1: Check cache
      await tracer.trace('Cache Check: Query Redis Key "report:m2026_11"', async () => {
        await sleep(15);
        tracer.track('Cache MISS for key "report:m2026_11"');
      }, { cacheStatus: 'MISS' });

      // Fast step 2: Fetch permissions
      await tracer.trace('Fetch User Authorization Matrix', async () => {
        await sleep(18);
        tracer.track('Permissions verified: role=FINANCE_ADMIN');
      }, { role: 'FINANCE_ADMIN' });

      // INTENTIONALLY SLOW OPERATION: Unindexed Full Table Scan & Heavy Computation
      // Takes ~145ms, comfortably exceeding the 70ms threshold!
      await tracer.trace('Aggregated Ledger Scan (Unindexed Full Table Scan)', async () => {
        tracer.track('Table scan started on 1,420,000 journal entries');

        await tracer.trace('Heavy Computation: Tax Reconciliation Matrix', async () => {
          // Inner delay
          await sleep(75);
          tracer.track('Cross-referencing 42 currency exchange rate tables');
        }, { recordsScanned: 1420000 });

        await tracer.trace('Vector PDF Layout & Table Rasterization', async () => {
          await sleep(65);
          tracer.track('Rendering 14 pages of financial ledger charts');
        }, { pages: 14, format: 'PDF/A' });

        tracer.track('Ledger calculation finalized');
      }, { alert: 'Missing index on ledger_entries.timestamp', estimatedCost: 14500 });

      // Fast step 4: Save to S3
      await tracer.trace('Upload Generated PDF to AWS S3', async () => {
        await sleep(25);
        tracer.track('Uploaded: s3://reports-prod/statements/2026-11.pdf');
      }, { bucket: 'reports-prod', sizeBytes: 2489012 });

      tracer.track('Report job #JOB-771 finalized and emailed');
    }, { jobId: 'JOB-771', exportType: 'FINANCIAL_SUMMARY' });
  } finally {
    tracer.stop();
  }

  return {
    scenario: 'slow_operation',
    title: 'Slow Operation Detection',
    description: 'Deliberately triggers an operation exceeding latency threshold to test automated bottleneck detection.',
    report: tracer.getReportData(),
    terminalOutput: tracer.report({ silent: true, color: false })
  };
}

/**
 * Scenario 5: Error Handling
 * Intentionally triggers a controlled error inside a traced nested operation.
 * TraceNest captures the error, stack trace, status, and duration,
 * while allowing the application to safely catch and handle it without crashing.
 */
export async function runErrorHandlingScenario(options = {}) {
  const threshold = options.slowThresholdMs || 100;
  const tracer = createTracer({
    name: 'PaymentProcessingService',
    slowOperationThresholdMs: threshold,
    autoWarnSlowOperations: true
  });

  tracer.start();

  try {
    // The top-level workflow catches the error gracefully
    await tracer.trace('Execute Payment Transaction', async () => {
      tracer.track('Initializing payment transaction TX-99201');

      await tracer.trace('Validate Payment Request Payload', async () => {
        await sleep(15);
        tracer.track('Currency: USD, Amount: $349.99 valid');
      }, { amount: 349.99, currency: 'USD' });

      // Controlled nested failure: Payment Gateway Connection drops
      try {
        await tracer.trace('Acquire External Bank Connection', async () => {
          tracer.track('Connecting to TLS socket: gateway.chase-paymentech.internal:8443');
          await sleep(30);

          await tracer.trace('Invoke Bank Authorization Protocol', async () => {
            tracer.track('Handshake failed during TLS session resumption');
            await sleep(20);

            // Deliberate error thrown inside monitored context
            const bankError = new Error('BankGatewayTimeoutException: Upstream payment processor did not respond within 3000ms [STATUS: 504_GATEWAY_TIMEOUT]');
            bankError.code = 'ETIMEDOUT';
            bankError.statusCode = 504;
            bankError.details = { gateway: 'ChasePaymentech', attempt: 1, maxRetries: 3 };
            throw bankError;
          });
        });
      } catch (err) {
        // TraceNest has automatically recorded the error on both the inner and outer operations!
        tracer.track('Caught failure in payment execution pipeline: initiating graceful fallback', {
          errorCode: err.code || 'UNKNOWN',
          errorMsg: err.message
        });

        // Graceful fallback operation
        await tracer.trace('Graceful Recovery: Route to Backup Gateway (Stripe Fallback)', async () => {
          tracer.track('Backup route selected: Stripe Europe Secondary Pool');
          await sleep(35);
          tracer.track('Transaction successfully enqueued in Dead-Letter Queue for retry');
        }, { fallbackProvider: 'Stripe', retryScheduled: true });
      }

      tracer.track('Payment transaction flow concluded with fallback action');
    }, { transactionId: 'TX-99201', customerId: 'CUST-4412' });
  } finally {
    tracer.stop();
  }

  return {
    scenario: 'error_handling',
    title: 'Controlled Error Handling',
    description: 'Simulates an upstream gateway failure inside a nested trace, showing automatic exception capture and recovery.',
    report: tracer.getReportData(),
    terminalOutput: tracer.report({ silent: true, color: false })
  };
}

/**
 * Master dispatcher for running any scenario by ID
 */
export async function runScenario(scenarioId, options = {}) {
  switch (scenarioId) {
    case 'db_query':
      return await runDatabaseQueryScenario(options);
    case 'api_request':
      return await runApiRequestScenario(options);
    case 'nested_ops':
      return await runNestedOperationsScenario(options);
    case 'slow_operation':
      return await runSlowOperationScenario(options);
    case 'error_handling':
      return await runErrorHandlingScenario(options);
    default:
      return await runDatabaseQueryScenario(options);
  }
}
