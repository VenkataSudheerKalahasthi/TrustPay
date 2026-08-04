'use strict';

const { socketLogger } = require('../../utils/logger');

/**
 * Registers Socket.IO event handlers for Realtime Notifications & Activity Center.
 * @param {import('socket.io').Server} io 
 */
function registerNotificationSocketHandlers(io) {
  io.on('connection', (socket) => {
    const user = socket.user;
    if (!user) {
      return;
    }

    // Join user notification room `user:{id}`
    const userRoom = `user:${user.id}`;
    socket.join(userRoom);
    socketLogger.info('User joined notification socket room', { userId: user.id, userRoom });

    socket.on('notification:subscribe', () => {
      socket.join(userRoom);
    });
  });
}

module.exports = { registerNotificationSocketHandlers };
