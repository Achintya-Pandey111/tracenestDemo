/**
 * Realistic preview data for the Hero section.
 * Clearly labeled as an illustration to distinguish from the real live tracing playground.
 */

export const HERO_PREVIEW_TREE = [
  {
    id: 'op_root_hero',
    name: 'HTTP POST /api/v2/orders/checkout',
    durationMs: 94.21,
    status: 'SUCCESS',
    depth: 0,
    startTime: 1732281000000,
    endTime: 1732281000094,
    metadata: { route: '/api/v2/orders/checkout', status: 200 },
    children: [
      {
        id: 'op_auth_hero',
        name: 'Auth: Verify Session & Scope',
        durationMs: 14.85,
        status: 'SUCCESS',
        depth: 1,
        startTime: 1732281000002,
        endTime: 1732281000017,
        metadata: { userId: 'usr_premium_881' },
        children: []
      },
      {
        id: 'op_db_hero',
        name: 'Database: Reserve Inventory & Lock',
        durationMs: 38.64,
        status: 'SUCCESS',
        depth: 1,
        startTime: 1732281000018,
        endTime: 1732281000057,
        metadata: { table: 'inventory_locks', rowsLocked: 3 },
        children: [
          {
            id: 'op_db_idx_hero',
            name: 'Index Scan: inventory_sku_idx',
            durationMs: 18.22,
            status: 'SUCCESS',
            depth: 2,
            startTime: 1732281000021,
            endTime: 1732281000039,
            metadata: { scanType: 'IndexOnlyScan', cost: 12.4 },
            children: []
          },
          {
            id: 'op_db_write_hero',
            name: 'Write WAL: UPDATE inventory SET reserved = reserved + 1',
            durationMs: 16.12,
            status: 'SUCCESS',
            depth: 2,
            startTime: 1732281000040,
            endTime: 1732281000056,
            metadata: { syncCommit: true },
            children: []
          }
        ]
      },
      {
        id: 'op_stripe_hero',
        name: 'External HTTP: Stripe Payment Intent (POST)',
        durationMs: 40.12,
        status: 'SUCCESS',
        depth: 1,
        startTime: 1732281000058,
        endTime: 1732281000098,
        metadata: { provider: 'Stripe API v2024-04-10', status: 'succeeded' },
        children: []
      }
    ]
  }
];
