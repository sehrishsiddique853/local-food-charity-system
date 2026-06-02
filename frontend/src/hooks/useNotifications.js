import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/notificationService';

export const useNotifications = ({ loadList = true } = {}) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(loadList);
  const [errorMessage, setErrorMessage] = useState('');

  const handleUnauthorized = useCallback((result) => {
    if (result.status === 401) {
      navigate(ROUTES.login);
      return true;
    }

    return false;
  }, [navigate]);

  const loadUnreadCount = useCallback(async () => {
    try {
      const result = await getUnreadNotificationCount();

      if (handleUnauthorized(result)) {
        return;
      }

      if (result.ok) {
        setUnreadCount(result.data.data?.unreadCount || 0);
      }
    } catch {
      setUnreadCount(0);
    }
  }, [handleUnauthorized]);

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await getNotifications();

      if (handleUnauthorized(result)) {
        return;
      }

      if (!result.ok) {
        throw new Error(result.data.error?.message || 'Unable to load notifications.');
      }

      const loadedNotifications = result.data.data?.notifications || [];
      setNotifications(loadedNotifications);
      setUnreadCount(loadedNotifications.filter((notification) => !notification.isRead).length);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load notifications.');
    } finally {
      setIsLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    if (loadList) {
      loadNotifications();
    } else {
      loadUnreadCount();
    }
  }, [loadList, loadNotifications, loadUnreadCount]);

  const markRead = async (notificationId) => {
    const result = await markNotificationRead(notificationId);

    if (handleUnauthorized(result)) {
      return;
    }

    if (!result.ok) {
      setErrorMessage(result.data.error?.message || 'Unable to update notification.');
      return;
    }

    setNotifications((current) =>
      current.map((notification) =>
        notification._id === notificationId ? { ...notification, isRead: true } : notification
      )
    );
    setUnreadCount((current) => Math.max(current - 1, 0));
  };

  const markAllRead = async () => {
    const result = await markAllNotificationsRead();

    if (handleUnauthorized(result)) {
      return;
    }

    if (!result.ok) {
      setErrorMessage(result.data.error?.message || 'Unable to update notifications.');
      return;
    }

    setNotifications((current) =>
      current.map((notification) => ({ ...notification, isRead: true }))
    );
    setUnreadCount(0);
  };

  const groupedNotifications = useMemo(() => ({
    unread: notifications.filter((notification) => !notification.isRead),
    read: notifications.filter((notification) => notification.isRead),
  }), [notifications]);

  return {
    notifications,
    groupedNotifications,
    unreadCount,
    isLoading,
    errorMessage,
    markRead,
    markAllRead,
  };
};
