import { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL, STORAGE_KEYS } from '@constants';

export function useChatSocket(conversationId = null) {
  const [connected, setConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlinePresences, setOnlinePresences] = useState({});
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('presence:update', ({ userId, status }) => {
      setOnlinePresences((prev) => ({ ...prev, [userId]: status }));
    });

    socket.on('typing:user_started', ({ conversationId: cId, userId, userName }) => {
      if (cId === conversationId) {
        setTypingUsers((prev) => ({ ...prev, [userId]: userName }));
      }
    });

    socket.on('typing:user_stopped', ({ conversationId: cId, userId }) => {
      if (cId === conversationId) {
        setTypingUsers((prev) => {
          const next = { ...prev };
          delete next[userId];
          return next;
        });
      }
    });

    // Presence Heartbeat Interval
    const heartbeatTimer = setInterval(() => {
      if (socket.connected) {
        socket.emit('presence:heartbeat');
      }
    }, 20000);

    return () => {
      clearInterval(heartbeatTimer);
      socket.disconnect();
    };
  }, [conversationId]);

  // Join Room when conversationId changes
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !connected || !conversationId) return;

    socket.emit('conversation:join', { conversationId });

    return () => {
      socket.emit('conversation:leave', { conversationId });
    };
  }, [conversationId, connected]);

  const sendMessage = useCallback((payload) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current || !connected) {
        reject(new Error('Socket not connected'));
        return;
      }
      socketRef.current.emit('message:send', payload, (res) => {
        if (res && res.success) {
          resolve(res.data);
        } else {
          reject(new Error(res?.error || 'Failed to send message via socket'));
        }
      });
    });
  }, [connected]);

  const startTyping = useCallback(() => {
    if (socketRef.current && connected && conversationId) {
      socketRef.current.emit('typing:start', { conversationId });
    }
  }, [connected, conversationId]);

  const stopTyping = useCallback(() => {
    if (socketRef.current && connected && conversationId) {
      socketRef.current.emit('typing:stop', { conversationId });
    }
  }, [connected, conversationId]);

  const markAsRead = useCallback((messageId) => {
    if (socketRef.current && connected && conversationId) {
      socketRef.current.emit('message:read', { conversationId, messageId });
    }
  }, [connected, conversationId]);

  return {
    connected,
    socket: socketRef.current,
    typingUsers,
    onlinePresences,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
  };
}
