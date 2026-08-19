'use strict';

const collaborationService = require('../../modules/collaboration/collaboration.service');
const { socketLogger } = require('../../utils/logger');

function registerCollaborationSocketHandlers(io) {
  io.on('connection', (socket) => {
    const user = socket.user;
    if (!user) {
      return;
    }

    // Join Workspace Room
    socket.on('workspace:join', ({ workspaceId }, callback) => {
      const room = `workspace:${workspaceId}`;
      socket.join(room);
      socketLogger.info('User joined workspace room', { userId: user.id, workspaceId });
      if (typeof callback === 'function') {
        callback({ success: true, room });
      }
    });

    // Leave Workspace Room
    socket.on('workspace:leave', ({ workspaceId }) => {
      const room = `workspace:${workspaceId}`;
      socket.leave(room);
    });

    // Planning Board Sync Event
    socket.on('planning:update', async ({ workspaceId, data }, callback) => {
      try {
        const workspace = await collaborationService.updatePlanningBoard(user.id, workspaceId, data);
        const room = `workspace:${workspaceId}`;
        io.to(room).emit('planning:updated', { workspaceId, workspace, updatedByUserId: user.id });
        if (typeof callback === 'function') {
          callback({ success: true, data: workspace });
        }
      } catch (err) {
        socketLogger.error('Planning board socket update failed', { userId: user.id, workspaceId, error: err.message });
        if (typeof callback === 'function') {
          callback({ success: false, error: err.message });
        }
      }
    });

    // E-signature Live Broadcast
    socket.on('contract:sign', async ({ workspaceId, signatureType, signatureData }, callback) => {
      try {
        const workspace = await collaborationService.signContract(user.id, workspaceId, { signatureType, signatureData });
        const room = `workspace:${workspaceId}`;
        io.to(room).emit('contract:signed', { workspaceId, workspace, signedByUserId: user.id });
        if (typeof callback === 'function') {
          callback({ success: true, data: workspace });
        }
      } catch (err) {
        if (typeof callback === 'function') {
          callback({ success: false, error: err.message });
        }
      }
    });
  });
}

module.exports = { registerCollaborationSocketHandlers };
