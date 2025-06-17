import { useState, useEffect, useCallback, useRef } from 'react';
import useLogin from '../Hooks/useLogin';

export default function useNotifications(apiUrl, userType) {
  const { isLoggedIn, user } = useLogin();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [sseConnection, setSseConnection] = useState(null);

  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [maxReconnectAttempts] = useState(5);
  const reconnectTimeoutRef = useRef(null);
  const isUnmountedRef = useRef(false);
  const heartbeatTimeoutRef = useRef(null);

  const userRole = userType;

  const addLog = useCallback((msg, type = 'info') => {
    console.log(`[${userRole}] ${new Date().toLocaleTimeString()} - ${msg}`);
  }, [userRole]);

  const startHeartbeatCheck = useCallback(() => {
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
    }

    heartbeatTimeoutRef.current = setTimeout(() => {
      if (sseConnection && sseConnection.readyState === EventSource.OPEN) {
        addLog('⚠️ 장시간 무응답으로 재연결 시도', 'warning');
        sseConnection.close();
        connectSSE();
      }
    }, 90000);
  }, [sseConnection, addLog]);

  // 로컬 저장된 알림 불러오기
  useEffect(() => {
    if (!userRole) return;
    const stored = localStorage.getItem(`notifications-${userRole}`);
    if (stored) {
      try {
        const parsedNotifications = JSON.parse(stored);
        setNotifications(parsedNotifications);
      } catch (e) {
        addLog(`로컬 알림 복원 실패: ${e.message}`, 'error');
      }
    }
  }, [userRole, addLog]);

  // 알림 상태 localStorage 저장
  useEffect(() => {
    if (userRole && notifications.length > 0) {
      localStorage.setItem(`notifications-${userRole}`, JSON.stringify(notifications));
    }
  }, [notifications, userRole]);

  // 읽지 않은 알림 개수 계산
  useEffect(() => {
    const count = notifications.filter(n => n.isRead !== 'Y').length;
    setUnreadCount(count);
  }, [notifications]);

  const connectSSE = useCallback(() => {
    if (!isLoggedIn || !userRole || isUnmountedRef.current) {
      return;
    }

    if (sseConnection) {
      sseConnection.close();
      setSseConnection(null);
    }

    const sseUrl = userRole === 'SELLER'
        ? `${apiUrl}/api/notifications/seller/connect`
        : `${apiUrl}/api/notifications/customer/connect`;

    addLog(`SSE 연결 시도 (${reconnectAttempts + 1}/${maxReconnectAttempts})`);
    setConnectionStatus('connecting');

    try {
      const eventSource = new EventSource(sseUrl, { withCredentials: true });

      eventSource.onopen = () => {
        if (isUnmountedRef.current) return;
        setConnectionStatus('connected');
        setReconnectAttempts(0);
        addLog('SSE 연결 성공', 'success');
        startHeartbeatCheck();
      };

      eventSource.onmessage = (event) => {
        if (isUnmountedRef.current) return;
        startHeartbeatCheck();

        try {
          const notification = JSON.parse(event.data);
          setNotifications(prev => {
            const filtered = prev.filter(n => n.id !== notification.id);
            return [notification, ...filtered];
          });
        } catch (e) {
          addLog(`메시지 파싱 실패: ${e.message}`, 'error');
        }
      };

      eventSource.addEventListener('notification', (event) => {
        if (isUnmountedRef.current) return;
        startHeartbeatCheck();

        try {
          const notification = JSON.parse(event.data);
          setNotifications(prev => {
            const filtered = prev.filter(n => n.id !== notification.id);
            return [notification, ...filtered];
          });
        } catch (e) {
          addLog(`알림 파싱 실패: ${e.message}`, 'error');
        }
      });

      eventSource.addEventListener('heartbeat', () => {
        if (isUnmountedRef.current) return;
        startHeartbeatCheck();
      });

      eventSource.addEventListener('ping', () => {
        if (isUnmountedRef.current) return;
        startHeartbeatCheck();
      });

      eventSource.onerror = () => {
        if (isUnmountedRef.current) return;

        addLog('SSE 연결 오류', 'error');
        setConnectionStatus('error');

        if (heartbeatTimeoutRef.current) {
          clearTimeout(heartbeatTimeoutRef.current);
        }

        if (eventSource.readyState === EventSource.CLOSED) {
          setConnectionStatus('disconnected');

          if (reconnectAttempts < maxReconnectAttempts) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
            reconnectTimeoutRef.current = setTimeout(() => {
              if (!isUnmountedRef.current) {
                setReconnectAttempts(prev => prev + 1);
                connectSSE();
              }
            }, delay);
          } else {
            addLog('최대 재연결 시도 횟수 초과', 'error');
          }
        }
      };

      setSseConnection(eventSource);

    } catch (error) {
      addLog(`SSE 연결 생성 실패: ${error.message}`, 'error');
      setConnectionStatus('error');
    }
  }, [isLoggedIn, userRole, apiUrl, reconnectAttempts, maxReconnectAttempts, addLog, sseConnection, startHeartbeatCheck]);

  // 알림 목록 로딩
  useEffect(() => {
    if (!isLoggedIn || !userRole) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/notifications/list`, {
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        const result = Array.isArray(data?.data?.notifications)
            ? data.data.notifications
            : Array.isArray(data?.data)
                ? data.data
                : [];

        setNotifications(result);
      } catch (err) {
        addLog(`알림 목록 로딩 실패: ${err.message}`, 'error');
      }
    };

    fetchNotifications();
  }, [isLoggedIn, userRole, apiUrl, addLog]);

  // SSE 연결 관리
  useEffect(() => {
    isUnmountedRef.current = false;

    if (isLoggedIn && userRole) {
      connectSSE();
    }

    return () => {
      isUnmountedRef.current = true;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (heartbeatTimeoutRef.current) {
        clearTimeout(heartbeatTimeoutRef.current);
      }

      if (sseConnection) {
        sseConnection.close();
        setSseConnection(null);
      }

      setConnectionStatus('disconnected');
    };
  }, [isLoggedIn, userRole]);

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/api/notifications/${id}/read`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: 'Y' } : n));
      } else {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      addLog(`읽음 처리 실패: ${err.message}`, 'error');
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/notifications/read-all`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: 'Y' })));
      } else {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      addLog(`전체 읽음 처리 실패: ${err.message}`, 'error');
    }
  };

  const reconnect = useCallback(() => {
    addLog('수동 재연결 시도');
    setReconnectAttempts(0);
    connectSSE();
  }, [connectSSE, addLog]);

  return {
    notifications,
    unreadCount,
    connectionStatus,
    markAsRead,
    markAllAsRead,
    reconnect,
    reconnectAttempts,
    maxReconnectAttempts,
  };
}