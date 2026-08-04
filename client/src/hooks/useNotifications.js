import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { notificationService } from '@services/notification.service';
import { SOCKET_URL, STORAGE_KEYS } from '@constants';

export function useNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestNotification, setLatestNotification] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationService.getUserNotifications({ limit: 1 });
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to fetch unread notification count', err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    socket.on('notification:received', (notif) => {
      setLatestNotification(notif);
      setUnreadCount((prev) => prev + 1);
    });

    socket.on('notification:unread_count', ({ unreadCount: count }) => {
      setUnreadCount(count);
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchNotifications]);

  return {
    unreadCount,
    latestNotification,
    refetch: fetchNotifications,
  };
}
