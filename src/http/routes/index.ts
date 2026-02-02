/**
 * Routes Index
 * Aggregates all route setup functions
 */

import type { FastifyInstance } from 'fastify';
import { ConnectionManager } from '../../core/connection-manager.js';
import { setupHealthRoutes } from './health.js';
import { setupConnectionRoutes } from './connection.js';
import { setupQueryRoutes } from './query.js';
import { setupSchemaRoutes } from './schema.js';
import { setupMcpSseRoutes } from './mcp-sse.js';

/**
 * Setup all routes
 */
export async function setupRoutes(
  fastify: FastifyInstance,
  connectionManager: ConnectionManager
): Promise<void> {
  // Health and info routes (no auth required)
  await setupHealthRoutes(fastify);

  // MCP SSE routes (no auth required, uses its own session management)
  await setupMcpSseRoutes(fastify);

  // Connection routes
  await setupConnectionRoutes(fastify, connectionManager);

  // Query routes
  await setupQueryRoutes(fastify, connectionManager);

  // Schema routes
  await setupSchemaRoutes(fastify, connectionManager);
}
