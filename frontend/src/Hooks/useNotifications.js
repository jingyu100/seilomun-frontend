import { useState, useEffect, useCallback, useRef } from 'react';
import useLogin from '../Hooks/useLogin';

export default function useNotifications(apiUrl, userType) {
  const { isLoggedIn, user } = useLogin();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [maxReconnectAttempts] = useState(5);

  // ref로 관리하여 재렌더링 방지
  const sseConnectionRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const isUnmountedRef = useRef(false);
  const heartbeatTimeoutRef = useRef(null);
  const isConnectingRef = useRef(false);
  const localStorageTimeoutRef = useRef(null);

  const userRole = userType;

  const addLog = useCallback((msg, type = 'info') => {
    console.log(`[${userRole}] ${new Date().toLocaleTimeString()} - ${msg}`);
  }, [userRole]);

  // localStorage 비동기 저장
  const saveToLocalStorage = useCallback((key, data) => {
    if (localStorageTimeoutRef.current) {
      clearTimeout(localStorageTimeoutRef.current);
    }

    localStorageTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        addLog(`로컬 저장 실패: ${e.message}`, 'error');
      }
    }, 100); // 100ms 지연으로 메인 스레드 블록킹 방지
  }, [addLog]);

  const startHeartbeatCheck = useCallback(() => {
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
    }

    heartbeatTimeoutRef.current = setTimeout(() => {
      if (sseConnectionRef.current && sseConnectionRef.current.readyState === EventSource.OPEN) {
        addLog('⚠️ 장시간 무응답으로 재연결 시도', 'warning');
        sseConnectionRef.current.close();
        connectSSE();
      }
    }, 90000);
  }, [addLog]); // connectSSE는 의존성에서 제거

  // 로컬 저장된 알림 불러오기 (초기화 시 한 번만)
  useEffect(() => {
    if (!userRole) return;

    const loadStoredNotifications = async () => {
      try {
        const stored = localStorage.getItem(`notifications-${userRole}`);
        if (stored) {
          const parsedNotifications = JSON.parse(stored);
          setNotifications(parsedNotifications);
        }
      } catch (e) {
        addLog(`로컬 알림 복원 실패: ${e.message}`, 'error');
      }
    };

    loadStoredNotifications();
  }, [userRole, addLog]);

  // 알림 상태 localStorage 저장 (비동기)
  useEffect(() => {
    if (userRole && notifications.length > 0) {
      saveToLocalStorage(`notifications-${userRole}`, notifications);
    }
  }, [notifications, userRole, saveToLocalStorage]);

  // 읽지 않은 알림 개수 계산
  useEffect(() => {
    const count = notifications.filter(n => n.isRead !== 'Y').length;
    setUnreadCount(count);
  }, [notifications]);

  const connectSSE = useCallback(() => {
    // 중복 연결 방지
    if (!isLoggedIn || !userRole || isUnmountedRef.current || isConnectingRef.current) {
      return;
    }

    // 기존 연결 정리
    if (sseConnectionRef.current) {
      sseConnectionRef.current.close();
      sseConnectionRef.current = null;
    }

    const sseUrl = userRole === 'SELLER'
        ? `${apiUrl}/api/notifications/seller/connect`
        : `${apiUrl}/api/notifications/customer/connect`;

    addLog(`SSE 연결 시도 (${reconnectAttempts + 1}/${maxReconnectAttempts})`);
    setConnectionStatus('connecting');
    isConnectingRef.current = true;

    try {
      const eventSource = new EventSource(sseUrl, { withCredentials: true });

      eventSource.onopen = () => {
        if (isUnmountedRef.current) return;

        isConnectingRef.current = false;
        setConnectionStatus('connected');
        setReconnectAttempts(0);
        addLog('SSE 연결 성공', 'success');
        startHeartbeatCheck();
      };

      const handleNotification = (event) => {
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
      };

      eventSource.onmessage = handleNotification;
      eventSource.addEventListener('notification', handleNotification);

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

        isConnectingRef.current = false;
        addLog('SSE 연결 오류', 'error');
        setConnectionStatus('error');

        if (heartbeatTimeoutRef.current) {
          clearTimeout(heartbeatTimeoutRef.current);
        }

        if (eventSource.readyState === EventSource.CLOSED) {
          setConnectionStatus('disconnected');

          if (reconnectAttempts < maxReconnectAttempts) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
            addLog(`${delay}ms 후 재연결 시도`);

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

      sseConnectionRef.current = eventSource;

    } catch (error) {
      isConnectingRef.current = false;
      addLog(`SSE 연결 생성 실패: ${error.message}`, 'error');
      setConnectionStatus('error');
    }
  }, [isLoggedIn, userRole, apiUrl, reconnectAttempts, maxReconnectAttempts, addLog, startHeartbeatCheck]);

  // 알림 목록 로딩 (초기화 시 한 번만)
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

  // SSE 연결 관리 (로그인 상태와 userRole 변경 시에만)
  useEffect(() => {
    isUnmountedRef.current = false;

    if (isLoggedIn && userRole) {
      // 약간의 지연을 두어 다른 초기화가 완료된 후 연결
      const connectDelay = setTimeout(() => {
        if (!isUnmountedRef.current) {
          connectSSE();
        }
      }, 100);

      return () => {
        clearTimeout(connectDelay);
      };
    }

    return () => {
      // cleanup 로직은 그대로 유지
    };
  }, [isLoggedIn, userRole]); // connectSSE 의존성 제거

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (heartbeatTimeoutRef.current) {
        clearTimeout(heartbeatTimeoutRef.current);
      }

      if (localStorageTimeoutRef.current) {
        clearTimeout(localStorageTimeoutRef.current);
      }

      if (sseConnectionRef.current) {
        sseConnectionRef.current.close();
        sseConnectionRef.current = null;
      }

      setConnectionStatus('disconnected');
    };
  }, []);

  const markAsRead = useCallback(async (id) => {
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
  }, [apiUrl, addLog]);

  const markAllAsRead = useCallback(async () => {
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
  }, [apiUrl, addLog]);

  const reconnect = useCallback(() => {
    addLog('수동 재연결 시도');
    setReconnectAttempts(0);
    isConnectingRef.current = false; // 연결 상태 초기화
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