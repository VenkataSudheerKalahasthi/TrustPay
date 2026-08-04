'use strict';

const jwt = require('jsonwebtoken');
const { env } = require('../../config/env');
const prisma = require('../../config/database');
const chatService = require('../../modules/chat/chat.service');
const PresenceEngine = require('../../modules/chat/presenceEngine');
const { socketLogger, auditLogger } = require('../../utils/logger');

/**
 * Registers Socket.IO event handlers for Chat, Realtime Messaging, and Presence.
 * @param {import('socket.io').Server} io 
 */
function registerChatSocketHandlers(io) {
  // Socket JWT Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
      if (!token) {
        socketLogger.warn('Socket connection rejected: No auth token provided', { socketId: socket.id });
        return next(new Error('Authentication token required'));
      }

      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
      if (decoded.type !== 'access') {
        return next(new Error('Invalid token type'));
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.sub },
        select: { id: true, firstName: true, lastName: true, email: true, role: true, isActive: true },
      });

      if (!user || !user.isActive) {
        return next(new Error('Unauthorized or disabled user account'));
      }

      socket.user = user;
      next();
    } catch (err) {
      socketLogger.error('Socket auth failed', { socketId: socket.id, message: err.message });
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', async (socket) => {
    const user = socket.user;
    const socketId = socket.id;

    socketLogger.info('User connected via Socket.IO', { userId: user.id, email: user.email, socketId });

    // Update Presence to ONLINE
    await PresenceEngine.updatePresence(user.id, 'ONLINE', socketId);
    io.emit('presence:update', { userId: user.id, status: 'ONLINE' });

    // Audit Event
    auditLogger.info('SOCKET_CONNECTED', { userId: user.id, socketId, ip: socket.handshake.address });

    // ─── Room Join & Leave ───────────────────────────────────────────────────
    socket.on('conversation:join', async ({ conversationId }, callback) => {
      try {
        const room = `conversation:${conversationId}`;
        socket.join(room);
        socketLogger.info('Joined conversation room', { userId: user.id, conversationId, socketId });
        if (typeof callback === 'function') {
          callback({ success: true, room });
        }
      } catch (err) {
        if (typeof callback === 'function') {
          callback({ success: false, error: err.message });
        }
      }
    });

    socket.on('conversation:leave', ({ conversationId }) => {
      const room = `conversation:${conversationId}`;
      socket.leave(room);
      socketLogger.info('Left conversation room', { userId: user.id, conversationId, socketId });
    });

    // ─── Realtime Message Sending ────────────────────────────────────────────
    socket.on('message:send', async (payload, callback) => {
      try {
        const message = await chatService.sendMessage(user.id, user.role, payload);
        const room = `conversation:${message.conversationId}`;

        // Broadcast live message to conversation room
        io.to(room).emit('message:received', message);

        // Update Delivery Status to DELIVERED for active socket clients
        await chatService.updateDeliveryStatus(message.id, 'DELIVERED');
        io.to(room).emit('message:delivered', { messageId: message.id, conversationId: message.conversationId });

        if (typeof callback === 'function') {
          callback({ success: true, data: message });
        }
      } catch (err) {
        socketLogger.error('Message send failed via socket', { userId: user.id, message: err.message });
        if (typeof callback === 'function') {
          callback({ success: false, error: err.message });
        }
      }
    });

    // ─── Read Receipts ───────────────────────────────────────────────────────
    socket.on('message:read', async ({ conversationId, messageId }) => {
      try {
        await chatService.markConversationAsRead(conversationId, user.id, user.role);
        const room = `conversation:${conversationId}`;
        io.to(room).emit('message:read_update', { conversationId, messageId, readByUserId: user.id });
      } catch (err) {
        socketLogger.error('Read receipt failed', { userId: user.id, message: err.message });
      }
    });

    // ─── Typing Indicators ───────────────────────────────────────────────────
    socket.on('typing:start', ({ conversationId }) => {
      const room = `conversation:${conversationId}`;
      socket.to(room).emit('typing:user_started', { conversationId, userId: user.id, userName: `${user.firstName} ${user.lastName}` });
    });

    socket.on('typing:stop', ({ conversationId }) => {
      const room = `conversation:${conversationId}`;
      socket.to(room).emit('typing:user_stopped', { conversationId, userId: user.id });
    });

    // ─── Presence Heartbeat ──────────────────────────────────────────────────
    socket.on('presence:heartbeat', async () => {
      await PresenceEngine.recordHeartbeat(user.id);
    });

    // ─── Disconnect Handler ──────────────────────────────────────────────────
    socket.on('disconnect', async (reason) => {
      socketLogger.info('User disconnected from Socket.IO', { userId: user.id, socketId, reason });
      await PresenceEngine.updatePresence(user.id, 'OFFLINE', null);
      io.emit('presence:update', { userId: user.id, status: 'OFFLINE' });
      auditLogger.info('SOCKET_DISCONNECTED', { userId: user.id, socketId, reason });
    });
  });
}

module.exports = { registerChatSocketHandlers };
