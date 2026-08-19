'use strict';

/**
 * Socket.IO configuration and initialization.
 *
 * This module configures Socket.IO on the HTTP server.
 * Actual event handlers are registered per-module in their
 * respective socket/ subdirectories in Phase 4.
 */
const { Server } = require('socket.io');
const { env } = require('./env');
const { socketLogger } = require('../utils/logger');

/** @type {import('socket.io').Server | null} */
let io = null;

/**
 * Initialize Socket.IO with the HTTP server.
 * @param {import('http').Server} httpServer
 * @returns {import('socket.io').Server}
 */
function initializeSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()),
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling'],
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
      skipMiddlewares: true,
    },
  });

  // Register Phase 2 Part 5 & Phase 3 Part 1 Handlers
  const { registerChatSocketHandlers } = require('../socket/handlers/chatSocket.handler');
  const { registerNotificationSocketHandlers } = require('../socket/handlers/notificationSocket.handler');
  const { registerCollaborationSocketHandlers } = require('../socket/handlers/collaborationSocket.handler');
  registerChatSocketHandlers(io);
  registerNotificationSocketHandlers(io);
  registerCollaborationSocketHandlers(io);

  socketLogger.info('Socket.IO initialized', {
    transports: ['websocket', 'polling'],
    allowedOrigins: env.ALLOWED_ORIGINS,
  });

  return io;
}

/**
 * Get the shared Socket.IO instance.
 * Throws if called before initializeSocket().
 * @returns {import('socket.io').Server}
 */
function getSocketIO() {
  if (!io) {
    throw new Error('Socket.IO has not been initialized. Call initializeSocket() first.');
  }
  return io;
}

module.exports = { initializeSocket, getSocketIO };
