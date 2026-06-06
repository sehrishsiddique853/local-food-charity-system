import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
} from '../services/notificationService';

const NOTIFICATIONS_READ_EVENT = 'notifications:read';

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
      const unreadNotifications = loadedNotifications.filter((notification) => !notification.isRead);

      setNotifications(loadedNotifications);
      setUnreadCount(unreadNotifications.length);

      if (unreadNotifications.length > 0) {
        const readResult = await markAllNotificationsRead();

        if (handleUnauthorized(readResult)) {
          return;
        }

        if (!readResult.ok) {
          throw new Error(readResult.data.error?.message || 'Unable to update notifications.');
        }

        setUnreadCount(0);
        window.dispatchEvent(
          new CustomEvent(NOTIFICATIONS_READ_EVENT, { detail: { unreadCount: 0 } })
        );
        return;
      }

      setUnreadCount(0);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load notifications.');
    } finally {
      setIsLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    if (loadList) {
      loadNotifications();
      return undefined;
    }

    loadUnreadCount();
    const unreadCountTimer = window.setInterval(loadUnreadCount, 30000);

    const handleNotificationsRead = (event) => {
      setUnreadCount(event.detail?.unreadCount || 0);
    };

    window.addEventListener(NOTIFICATIONS_READ_EVENT, handleNotificationsRead);

    return () => {
      window.clearInterval(unreadCountTimer);
      window.removeEventListener(NOTIFICATIONS_READ_EVENT, handleNotificationsRead);
    };
  }, [loadList, loadNotifications, loadUnreadCount]);

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
  };
};
