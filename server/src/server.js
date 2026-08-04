'use strict';

require('dotenv').config();

const http = require('http');
const app = require('./app');
const { env } = require('./config/env');
const { connectDatabase, disconnectDatabase } = require('./config/database');
const { verifySupabaseConnection } = require('./config/supabase');
const { initializeStorageBuckets } = require('./config/storage');
const { initializeSocket } = require('./config/socket');
const { logger } = require('./utils/logger');

const PORT = env.PORT;

async function startServer() {
  try {
    // ─── 1. Connect to Supabase PostgreSQL (via Prisma) ─────────────────────
    await connectDatabase();

    // ─── 2. Verify Supabase Client ───────────────────────────────────────────
    await verifySupabaseConnection();

    // ─── 3. Initialize Supabase Storage Buckets ──────────────────────────────
    await initializeStorageBuckets();

    // ─── 4. Create HTTP Server ───────────────────────────────────────────────
    const httpServer = http.createServer(app);

    // ─── 5. Initialize Socket.IO ─────────────────────────────────────────────
    initializeSocket(httpServer);

    // ─── 6. Start Listening ──────────────────────────────────────────────────
    httpServer.listen(PORT, () => {
      logger.info('─'.repeat(60));
      logger.info(`🚀  TrustPay Server started`);
      logger.info(`📡  Environment : ${env.NODE_ENV}`);
      logger.info(`☁️   Database    : Supabase PostgreSQL (PgBouncer)`);
      logger.info(`🌐  API         : http://localhost:${PORT}/api/${env.API_VERSION}`);
      logger.info(`💊  Health      : http://localhost:${PORT}/api/${env.API_VERSION}/health`);
      logger.info(`🔌  Socket.IO   : ws://localhost:${PORT}`);
      logger.info('─'.repeat(60));
    });

    // ─── 5. Graceful Shutdown ────────────────────────────────────────────────
    const shutdown = async (signal) => {
      logger.warn(`\n⚠️  ${signal} received. Shutting down gracefully...`);

      httpServer.close(async () => {
        logger.info('✅  HTTP server closed');
        await disconnectDatabase();
        logger.info('✅  All connections closed. Goodbye.');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('❌  Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('uncaughtException', (error) => {
      logger.error('❌  Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason) => {
      logger.error('❌  Unhandled Rejection:', reason);
      process.exit(1);
    });
  } catch (error) {
    logger.error('❌  Server startup failed:', error);
    process.exit(1);
  }
}

startServer();
