import { useState, useEffect, useCallback, useRef } from 'react';
import useLogin from '../Hooks/useLogin';

export default function useNotifications(apiUrl, userType) {
  const { isLoggedIn, user } = useLogin();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [logs, setLogs] = useState([]);
  const [sseConnection, setSseConnection] = useState(null);

  // 🔹 재연결 시도 관련 상태
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [maxReconnectAttempts] = useState(5);
  const reconnectTimeoutRef = useRef(null);
  const isUnmountedRef = useRef(false);

  // 🔹 SSE 연결 상태 추적을 위한 추가 상태
  const [receivedCount, setReceivedCount] = useState(0);
  const [lastReceivedTime, setLastReceivedTime] = useState(null);
  const heartbeatTimeoutRef = useRef(null);

  const userRole = userType; // "CUSTOMER" 또는 "SELLER"

  // 🔹 로그 추가 함수 개선
  const addLog = useCallback((msg, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      id: Date.now() + Math.random(),
      message: msg,
      type,
      timestamp,
      userRole
    };

    console.log(`[${userRole}] ${timestamp} - ${msg}`);

    setLogs(prev => [logEntry, ...prev.slice(0, 29)]); // 로그 개수 증가 (30개)
  }, [userRole]);

  // 🔹 하트비트 체크 함수
  const startHeartbeatCheck = useCallback(() => {
    // 기존 타이머 정리
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
    }

    // 60초 후에 하트비트가 없으면 연결 상태 체크
    heartbeatTimeoutRef.current = setTimeout(() => {
      if (sseConnection && sseConnection.readyState === EventSource.OPEN) {
        addLog('⚠️ 60초간 하트비트 없음 - 연결 상태 확인 필요', 'warning');

        // 90초 후에도 아무 메시지가 없으면 재연결
        setTimeout(() => {
          if (sseConnection && sseConnection.readyState === EventSource.OPEN) {
            addLog('🔄 장시간 무응답으로 강제 재연결 시도', 'warning');
            sseConnection.close();
            connectSSE();
          }
        }, 30000);
      }
    }, 60000);
  }, [sseConnection, addLog]);

  // 1. 로컬 저장된 알림 불러오기
  useEffect(() => {
    if (!userRole) return;
    const stored = localStorage.getItem(`notifications-${userRole}`);
    if (stored) {
      try {
        const parsedNotifications = JSON.parse(stored);
        setNotifications(parsedNotifications);
        addLog(`📦 로컬에서 알림 ${parsedNotifications.length}개 복원`, 'info');
      } catch (e) {
        console.error('알림 복원 실패', e);
        addLog(`❌ 로컬 알림 복원 실패: ${e.message}`, 'error');
      }
    }
  }, [userRole, addLog]);

  // 2. 알림 상태 localStorage 저장
  useEffect(() => {
    if (userRole && notifications.length > 0) {
      localStorage.setItem(`notifications-${userRole}`, JSON.stringify(notifications));
    }
  }, [notifications, userRole]);

  // 3. 읽지 않은 알림 개수 계산
  useEffect(() => {
    const count = notifications.filter(n => n.isRead !== 'Y').length;
    setUnreadCount(count);
  }, [notifications]);

  // 🔹 SSE 연결 함수 대폭 개선
  const connectSSE = useCallback(() => {
    if (!isLoggedIn || !userRole || isUnmountedRef.current) {
      addLog('❌ 연결 조건 불충족', 'error');
      return;
    }

    // 기존 연결이 있으면 종료
    if (sseConnection) {
      addLog('🔄 기존 연결 종료 중...', 'info');
      sseConnection.close();
      setSseConnection(null);
    }

    const sseUrl =
        userRole === 'SELLER'
            ? `${apiUrl}/api/notifications/seller/connect`
            : `${apiUrl}/api/notifications/customer/connect`;

    addLog(`🔌 SSE 연결 시도 (${reconnectAttempts + 1}/${maxReconnectAttempts})`, 'info');
    addLog(`🔗 연결 URL: ${sseUrl}`, 'info');
    addLog(`👤 사용자: ${userRole} (로그인: ${isLoggedIn})`, 'info');
    setConnectionStatus('connecting');

    try {
      const eventSource = new EventSource(sseUrl, { withCredentials: true });

      // 🔹 연결 성공
      eventSource.onopen = () => {
        if (isUnmountedRef.current) return;

        setConnectionStatus('connected');
        setReconnectAttempts(0);
        setReceivedCount(0); // 받은 메시지 카운트 리셋
        addLog('🟢 SSE 연결 성공', 'success');
        addLog(`🔍 연결 상태: readyState=${eventSource.readyState}, url=${eventSource.url}`, 'info');

        // 하트비트 체크 시작
        startHeartbeatCheck();
      };

      // 🔹 기본 메시지 이벤트
      eventSource.onmessage = (event) => {
        if (isUnmountedRef.current) return;

        updateLastMessageTime(); // 메시지 시간 업데이트
        const currentCount = receivedCount + 1;
        setReceivedCount(currentCount);
        setLastReceivedTime(new Date());
        addLog(`📨 [${currentCount}] 기본 메시지: ${event.data.substring(0, 50)}...`, 'success');

        // 하트비트 타이머 리셋
        startHeartbeatCheck();

        try {
          const notification = JSON.parse(event.data);
          addLog(`✅ [${currentCount}] 알림 파싱 성공: ${notification.content?.substring(0, 30) || 'N/A'}`, 'success');

          setNotifications(prev => {
            const filtered = prev.filter(n => n.id !== notification.id);
            const newList = [notification, ...filtered];
            addLog(`📋 알림 목록 업데이트: ${newList.length}개 (메시지 #${currentCount})`, 'info');
            addLog(`🔄 상태 업데이트 - 이전: ${prev.length}개, 새로운: ${newList.length}개`, 'info');
            addLog(`🆕 새 알림 ID: ${notification.id}, 내용: ${notification.content?.substring(0, 20)}`, 'info');
            return newList;
          });
        } catch (e) {
          addLog(`❌ [${currentCount}] 메시지 파싱 실패: ${e.message}`, 'error');
        }
      };

      // 🔹 'notification' 타입 이벤트
      eventSource.addEventListener('notification', (event) => {
        if (isUnmountedRef.current) return;

        updateLastMessageTime(); // 메시지 시간 업데이트
        const currentCount = receivedCount + 1;
        setReceivedCount(currentCount);
        setLastReceivedTime(new Date());
        addLog(`📨 [${currentCount}] notification 이벤트: ${event.data.substring(0, 50)}...`, 'success');

        // 하트비트 타이머 리셋
        startHeartbeatCheck();

        try {
          const notification = JSON.parse(event.data);
          addLog(`✅ [${currentCount}] notification 파싱 성공: ${notification.content?.substring(0, 30) || 'N/A'}`, 'success');

          setNotifications(prev => {
            const filtered = prev.filter(n => n.id !== notification.id);
            const newList = [notification, ...filtered];
            addLog(`📋 알림 목록 업데이트: ${newList.length}개 (메시지 #${currentCount})`, 'info');
            addLog(`🔄 상태 업데이트 - 이전: ${prev.length}개, 새로운: ${newList.length}개`, 'info');
            addLog(`🆕 새 알림 ID: ${notification.id}, 내용: ${notification.content?.substring(0, 20)}`, 'info');
            return newList;
          });
        } catch (e) {
          addLog(`❌ [${currentCount}] notification 파싱 실패: ${e.message}`, 'error');
        }
      });

      // 🔹 하트비트 이벤트
      eventSource.addEventListener('heartbeat', (event) => {
        if (isUnmountedRef.current) return;
        updateLastMessageTime(); // 하트비트도 메시지로 간주
        addLog('💓 하트비트 수신 - 연결 정상', 'info');
        setLastReceivedTime(new Date());
        startHeartbeatCheck();
      });

      eventSource.addEventListener('ping', (event) => {
        if (isUnmountedRef.current) return;
        updateLastMessageTime(); // ping도 메시지로 간주
        addLog('🏓 ping 수신 - 연결 정상', 'info');
        setLastReceivedTime(new Date());
        startHeartbeatCheck();
      });

      // 🔹 연결 오류 처리
      eventSource.onerror = (err) => {
        if (isUnmountedRef.current) return;

        addLog(`🚫 SSE 오류 - readyState: ${eventSource.readyState}`, 'error');
        addLog(`🚫 받은 메시지 수: ${receivedCount}`, 'error');
        addLog(`🚫 마지막 수신: ${lastReceivedTime ? lastReceivedTime.toLocaleTimeString() : '없음'}`, 'error');

        setConnectionStatus('error');

        // 하트비트 타이머 정리
        if (heartbeatTimeoutRef.current) {
          clearTimeout(heartbeatTimeoutRef.current);
        }

        if (eventSource.readyState === EventSource.CLOSED) {
          setConnectionStatus('disconnected');
          addLog('🔌 SSE 연결 완전히 종료됨', 'error');

          // 자동 재연결 시도
          if (reconnectAttempts < maxReconnectAttempts) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
            addLog(`🔄 ${delay}ms 후 재연결 시도... (${reconnectAttempts + 1}/${maxReconnectAttempts})`, 'info');

            reconnectTimeoutRef.current = setTimeout(() => {
              if (!isUnmountedRef.current) {
                setReconnectAttempts(prev => prev + 1);
                connectSSE();
              }
            }, delay);
          } else {
            addLog('❌ 최대 재연결 시도 횟수 초과 - 수동 새로고침 필요', 'error');
          }
        } else if (eventSource.readyState === EventSource.CONNECTING) {
          addLog('🔄 재연결 시도 중...', 'info');
        }
      };

      setSseConnection(eventSource);

      // 🔹 연결 후 상태 모니터링 (더 자주 체크) + 메시지 대기 감지
      let lastMessageTime = Date.now();

      const statusCheckInterval = setInterval(() => {
        if (eventSource && !isUnmountedRef.current) {
          const currentTime = new Date().toLocaleTimeString();
          const timeSinceLastMessage = (Date.now() - lastMessageTime) / 1000;

          if (eventSource.readyState === EventSource.OPEN) {
            addLog(`🔍 [${currentTime}] 연결 상태: 정상 (${timeSinceLastMessage.toFixed(1)}초 전 마지막 메시지)`, 'info');

            // 🚨 90초 이상 메시지가 없으면 경고
            if (timeSinceLastMessage > 90) {
              addLog(`⚠️ [${currentTime}] 장시간 메시지 없음! (${timeSinceLastMessage.toFixed(1)}초)`, 'warning');
              addLog(`🔄 서버 연결 상태 확인을 위해 재연결 시도`, 'warning');
              eventSource.close();
              setTimeout(() => connectSSE(), 1000);
              return;
            }
          } else if (eventSource.readyState === EventSource.CONNECTING) {
            addLog(`🔍 [${currentTime}] 연결 상태 체크: 연결중 (readyState=0)`, 'warning');
          } else if (eventSource.readyState === EventSource.CLOSED) {
            addLog(`🔍 [${currentTime}] 연결 상태 체크: 닫힘 (readyState=2)`, 'error');
            clearInterval(statusCheckInterval);
          }
        } else {
          clearInterval(statusCheckInterval);
        }
      }, 30000); // 30초마다 체크

      // 🔹 메시지 수신 시 타임스탬프 업데이트 함수
      const updateLastMessageTime = () => {
        lastMessageTime = Date.now();
      };

      setTimeout(() => {
        if (eventSource && !isUnmountedRef.current) {
          addLog(`📊 연결 1초 후 상태: readyState=${eventSource.readyState}`, 'info');

          if (eventSource.readyState === EventSource.OPEN) {
            addLog('✅ 연결 상태 양호', 'success');
          } else if (eventSource.readyState === EventSource.CONNECTING) {
            addLog('⏳ 연결 시도 중...', 'info');
          } else {
            addLog('❌ 연결 실패 상태', 'error');
          }
        }
      }, 1000);

      // 🔹 정리 함수에 인터벌 추가
      return () => {
        if (statusCheckInterval) {
          clearInterval(statusCheckInterval);
        }
      };

    } catch (error) {
      addLog(`❌ SSE 연결 생성 실패: ${error.message}`, 'error');
      setConnectionStatus('error');
    }
  }, [isLoggedIn, userRole, apiUrl, reconnectAttempts, maxReconnectAttempts, addLog, sseConnection, receivedCount, startHeartbeatCheck]);

  // 4. 알림 목록 로딩
  useEffect(() => {
    if (!isLoggedIn || !userRole) return;

    const fetchNotifications = async () => {
      try {
        addLog('📋 서버에서 알림 목록 요청', 'info');

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
        addLog(`📋 알림 ${result.length}개 불러오기 성공`, 'success');
      } catch (err) {
        addLog(`❌ 알림 목록 실패: ${err.message}`, 'error');
      }
    };

    fetchNotifications();
  }, [isLoggedIn, userRole, apiUrl, addLog]);

  // 5. SSE 연결 관리
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
        addLog('🛑 SSE 연결 해제', 'info');
      }

      setConnectionStatus('disconnected');
    };
  }, [isLoggedIn, userRole]);

  // 🔹 읽음 처리 함수
  const markAsRead = async (id) => {
    try {
      addLog(`✅ 알림 ${id} 읽음 처리 시도`, 'info');

      const res = await fetch(`${apiUrl}/api/notifications/${id}/read`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: 'Y' } : n));
        addLog(`✅ 알림 ${id} 읽음 처리 완료`, 'success');
      } else {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      addLog(`❌ 읽음 실패: ${err.message}`, 'error');
    }
  };

  // 🔹 전체 읽음 처리 함수
  const markAllAsRead = async () => {
    try {
      addLog('📢 모든 알림 읽음 처리 시도', 'info');

      const res = await fetch(`${apiUrl}/api/notifications/read-all`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: 'Y' })));
        addLog('📢 모든 알림 읽음 처리 완료', 'success');
      } else {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      addLog(`❌ 전체 읽음 실패: ${err.message}`, 'error');
    }
  };

  // 🔹 수동 재연결 함수
  const reconnect = useCallback(() => {
    addLog('🔄 수동 재연결 시도', 'info');
    setReconnectAttempts(0);
    setReceivedCount(0);
    connectSSE();
  }, [connectSSE, addLog]);

  return {
    notifications,
    unreadCount,
    connectionStatus,
    logs,
    markAsRead,
    markAllAsRead,
    reconnect,
    reconnectAttempts,
    maxReconnectAttempts,
    receivedCount, // 받은 메시지 수 추가
    lastReceivedTime, // 마지막 수신 시간 추가
  };
}