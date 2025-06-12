import { useState, useEffect } from 'react';
import useLogin from '../Hooks/useLogin';

export default function useNotifications(apiUrl, userType) {
  const { isLoggedIn, user } = useLogin();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [logs, setLogs] = useState([]);
  const [sseConnection, setSseConnection] = useState(null);

//   const userRole = user?.userType; // "CUSTOMER" 또는 "SELLER"
  const userRole = userType; // "CUSTOMER" 또는 "SELLER"

  // 1. 로컬 저장된 알림 불러오기
  useEffect(() => {
    if (!userRole) return;
    const stored = localStorage.getItem(`notifications-${userRole}`);
    if (stored) {
      try {
        setNotifications(JSON.parse(stored));
      } catch (e) {
        console.error('알림 복원 실패', e);
      }
    }
  }, [userRole]);

  // 2. 알림 상태 localStorage 저장
  useEffect(() => {
    if (userRole) {
      localStorage.setItem(`notifications-${userRole}`, JSON.stringify(notifications));
    }
  }, [notifications, userRole]);

  // 3. 읽지 않은 알림 개수 계산
  useEffect(() => {
    const count = notifications.filter(n => n.isRead !== 'Y').length;
    setUnreadCount(count);
  }, [notifications]);

  const addLog = (msg, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [{ id: Date.now(), message: msg, type, timestamp }, ...prev.slice(0, 19)]);
  };

  // 4. 알림 목록 로딩
    useEffect(() => {
        if (!isLoggedIn || !userRole) return;
        fetch(`${apiUrl}/api/notifications/list`, {
        credentials: 'include',
        })
        .then(res => res.json())
        .then(data => {
            const result = Array.isArray(data?.data?.notifications)
            ? data.data.notifications
            : Array.isArray(data?.data)
            ? data.data
            : [];
    
            setNotifications(result);
            addLog(`📋 알림 ${result.length}개 불러오기 성공`, 'success');
        })
        .catch(err => {
            addLog(`❌ 알림 목록 실패: ${err.message}`, 'error');
        });
    }, [isLoggedIn, userRole, apiUrl]);
    

  // 5. SSE 연결
  useEffect(() => {
    if (!isLoggedIn || !userRole) return;
    
    const sseUrl =
      userRole === 'SELLER'
        ? `${apiUrl}/api/notifications/seller/connect`
        : `${apiUrl}/api/notifications/customer/connect`;

    addLog('🔌 SSE 연결 시도', 'info');
    setConnectionStatus('connecting');

    const eventSource = new EventSource(sseUrl, { withCredentials: true });

    eventSource.onopen = () => {
      setConnectionStatus('connected');
      addLog('🟢 SSE 연결 성공', 'success');
    };

    eventSource.addEventListener('notification', (event) => {
      try {
        const notification = JSON.parse(event.data);
        addLog('📨 알림 수신됨', 'success');
        setNotifications(prev => [notification, ...prev]);
      } catch (e) {
        addLog(`❌ 알림 파싱 실패: ${e.message}`, 'error');
      }
    });

    eventSource.onerror = (err) => {
      addLog('🚫 SSE 연결 오류', 'error');
      setConnectionStatus('error');
      if (eventSource.readyState === EventSource.CLOSED) {
        setConnectionStatus('disconnected');
        addLog('🔌 SSE 연결 종료됨', 'info');
      }
    };

    setSseConnection(eventSource);

    return () => {
      eventSource.close();
      setSseConnection(null);
      setConnectionStatus('disconnected');
      addLog('🛑 SSE 연결 해제', 'info');
    };
  }, [isLoggedIn, userRole, apiUrl]);

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/api/notifications/${id}/read`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: 'Y' } : n));
        addLog(`✅ 알림 ${id} 읽음 처리`, 'success');
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      addLog(`❌ 읽음 실패: ${err.message}`, 'error');
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
        addLog('📢 모든 알림 읽음 처리 (서버)', 'success');
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      addLog(`❌ 서버 전체 읽음 실패: ${err.message}`, 'error');
    }
  };

  return {
    notifications,
    unreadCount,
    connectionStatus,
    logs,
    markAsRead,
    markAllAsRead,
  };
}
