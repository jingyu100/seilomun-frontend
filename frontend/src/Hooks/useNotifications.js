import { useState, useEffect, useCallback, useRef } from 'react';
import useLogin from '../Hooks/useLogin';

// 전역 SSE 연결 관리를 위한 싱글톤
class NotificationManager {
  constructor() {
    this.connection = null;
    this.currentUserRole = null;
    this.currentApiUrl = null;
    this.isConnecting = false;
    this.reconnectTimeout = null;
    this.heartbeatTimeout = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.subscribers = new Set();
    this.notifications = [];
    this.connectionStatus = 'disconnected';
    this.activeHookCount = 0; // 활성 훅 개수 추적
    this.lastActiveRole = null; // 마지막 활성 역할 추적
  }

  subscribe(callback, userRole) {
    this.subscribers.add(callback);
    this.activeHookCount++;
    this.lastActiveRole = userRole;

    console.log(`[${userRole}] 훅 구독 - 활성 훅 수: ${this.activeHookCount}, 마지막 역할: ${this.lastActiveRole}`);

    // 구독 시 현재 상태 즉시 전달
    callback({
      notifications: this.notifications,
      connectionStatus: this.connectionStatus,
      reconnectAttempts: this.reconnectAttempts
    });

    return () => {
      this.subscribers.delete(callback);
      this.activeHookCount--;
      console.log(`[${userRole}] 훅 구독 해제 - 활성 훅 수: ${this.activeHookCount}`);

      // 모든 훅이 언마운트되면 연결 정리
      if (this.activeHookCount <= 0) {
        console.log('모든 훅이 언마운트됨, 연결 정리');
        this.cleanup();
      }
    };
  }

  notify(data) {
    this.subscribers.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Notification callback error:', error);
      }
    });
  }

  addLog(msg, type = 'info', userRole = 'unknown') {
    console.log(`[${userRole}] ${new Date().toLocaleTimeString()} - ${msg}`);
  }

  cleanup() {
    this.addLog('전역 SSE 연결 정리 시작', 'info', this.currentUserRole || 'unknown');

    if (this.connection) {
      this.addLog(`기존 SSE 연결 종료 (역할: ${this.currentUserRole})`, 'info', this.currentUserRole);
      this.connection.close();
      this.connection = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }

    this.isConnecting = false; // 중요: 연결 상태 리셋
    this.currentUserRole = null;
    this.currentApiUrl = null;
    this.connectionStatus = 'disconnected';
    this.reconnectAttempts = 0;

    this.notify({
      notifications: this.notifications,
      connectionStatus: this.connectionStatus,
      reconnectAttempts: this.reconnectAttempts
    });

    this.addLog('전역 SSE 연결 정리 완료', 'info');
  }

  startHeartbeatCheck() {
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
    }

    this.heartbeatTimeout = setTimeout(() => {
      if (this.connection && this.connection.readyState === EventSource.OPEN) {
        this.addLog('⚠️ 장시간 무응답으로 재연결 시도', 'warning', this.currentUserRole);
        this.connection.close();
        this.connect(this.currentApiUrl, this.currentUserRole, true);
      }
    }, 90000);
  }

  connect(apiUrl, userRole, isLoggedIn = true) {
    // 로그인 상태 체크
    if (!isLoggedIn || !userRole || !apiUrl) {
      this.addLog(`연결 조건 불충족 - 로그인: ${isLoggedIn}, 역할: ${userRole}, API: ${!!apiUrl}`, 'warning', userRole);
      return;
    }

    // 현재 활성 역할과 다르면 무시 (최신 역할만 유효)
    if (this.lastActiveRole && this.lastActiveRole !== userRole) {
      this.addLog(`비활성 역할의 연결 시도 무시 (활성: ${this.lastActiveRole}, 시도: ${userRole})`, 'warning', userRole);
      return;
    }

    // 다른 역할이면 기존 연결 완전 정리 (isConnecting 체크보다 먼저)
    if (this.currentUserRole && this.currentUserRole !== userRole) {
      this.addLog(`역할 변경 감지 (${this.currentUserRole} -> ${userRole}), 기존 연결 완전 정리`, 'info', userRole);
      this.cleanup();
      // 정리 후 잠시 대기 후 연결
      setTimeout(() => this.doConnect(apiUrl, userRole), 50);
      return;
    }

    // 이미 연결 중이고 같은 역할이면 중복 방지
    if (this.isConnecting && this.currentUserRole === userRole) {
      this.addLog(`이미 ${userRole} 역할로 연결 시도 중, 중복 연결 방지`, 'warning', userRole);
      return;
    }

    // 같은 역할로 이미 연결되어 있다면 중복 방지
    if (this.currentUserRole === userRole &&
        this.connection &&
        this.connection.readyState === EventSource.OPEN) {
      this.addLog(`이미 ${userRole} 역할로 연결되어 있음`, 'info', userRole);
      return;
    }

    // 기존 연결이 있다면 정리
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }

    this.doConnect(apiUrl, userRole);
  }

  doConnect(apiUrl, userRole) {
    const sseUrl = userRole === "SELLER"
        ? `${apiUrl}/api/notifications/seller/connect`
        : `${apiUrl}/api/notifications/customer/connect`;

    this.addLog(`SSE 연결 시도 (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts}) - 역할: ${userRole}`, 'info', userRole);

    this.connectionStatus = 'connecting';
    this.isConnecting = true;
    this.currentUserRole = userRole;
    this.currentApiUrl = apiUrl;

    this.notify({
      notifications: this.notifications,
      connectionStatus: this.connectionStatus,
      reconnectAttempts: this.reconnectAttempts
    });

    try {
      const eventSource = new EventSource(sseUrl, { withCredentials: true });

      eventSource.onopen = () => {
        // 연결 성공 시 현재 상태 재확인
        if (this.currentUserRole !== userRole) {
          this.addLog('연결 성공했지만 역할이 변경됨, 연결 종료', 'warning', userRole);
          eventSource.close();
          return;
        }

        this.isConnecting = false;
        this.connectionStatus = 'connected';
        this.reconnectAttempts = 0;
        this.addLog(`SSE 연결 성공 - 역할: ${userRole}`, 'success', userRole);
        this.startHeartbeatCheck();

        this.notify({
          notifications: this.notifications,
          connectionStatus: this.connectionStatus,
          reconnectAttempts: this.reconnectAttempts
        });
      };

      const handleNotification = (event) => {
        if (this.currentUserRole !== userRole) return;
        this.startHeartbeatCheck();

        try {
          const notification = JSON.parse(event.data);
          // 중복 제거
          this.notifications = this.notifications.filter(n => n.id !== notification.id);
          this.notifications.unshift(notification);

          this.notify({
            notifications: [...this.notifications],
            connectionStatus: this.connectionStatus,
            reconnectAttempts: this.reconnectAttempts
          });
        } catch (e) {
          this.addLog(`알림 파싱 실패: ${e.message}`, 'error', userRole);
        }
      };

      eventSource.onmessage = handleNotification;
      eventSource.addEventListener('notification', handleNotification);

      eventSource.addEventListener('heartbeat', () => {
        if (this.currentUserRole !== userRole) return;
        this.startHeartbeatCheck();
      });

      eventSource.addEventListener('ping', () => {
        if (this.currentUserRole !== userRole) return;
        this.startHeartbeatCheck();
      });

      eventSource.onerror = (error) => {
        this.isConnecting = false;
        this.addLog('SSE 연결 오류', 'error', userRole);
        this.connectionStatus = 'error';

        if (this.heartbeatTimeout) {
          clearTimeout(this.heartbeatTimeout);
        }

        // 현재 역할이 변경되었다면 재연결 중단
        if (this.currentUserRole !== userRole) {
          this.addLog(`역할이 변경되어 재연결 중단 (현재: ${this.currentUserRole}, 시도: ${userRole})`, 'info', userRole);
          return;
        }

        const shouldStopReconnection =
            (eventSource.readyState === EventSource.CLOSED &&
                (error?.target?.status === 401 || error?.target?.status === 403));

        if (eventSource.readyState === EventSource.CLOSED) {
          this.connectionStatus = 'disconnected';

          this.notify({
            notifications: this.notifications,
            connectionStatus: this.connectionStatus,
            reconnectAttempts: this.reconnectAttempts
          });

          if (shouldStopReconnection) {
            this.addLog('인증 오류로 재연결 중단', 'info', userRole);
            this.reconnectAttempts = 0;
            return;
          }

          // 현재 역할과 일치하고 재연결 시도 횟수 내에 있을 때만 재연결
          if (this.currentUserRole === userRole && this.reconnectAttempts < this.maxReconnectAttempts) {
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            this.addLog(`${delay}ms 후 재연결 시도 (현재 역할: ${this.currentUserRole})`, 'info', userRole);

            this.reconnectTimeout = setTimeout(() => {
              // 재연결 시점에서 한 번 더 역할 확인
              if (this.currentUserRole === userRole) {
                this.addLog(`재연결 실행 - 역할 확인 통과 (${this.currentUserRole} === ${userRole})`, 'info', userRole);
                this.reconnectAttempts++;
                this.connect(apiUrl, userRole, true);
              } else {
                this.addLog(`재연결 시점에서 역할 변경 감지, 재연결 취소 (현재: ${this.currentUserRole}, 시도: ${userRole})`, 'info', userRole);
                // 역할이 변경되었으므로 이 재연결 시도는 무효화
                return;
              }
            }, delay);
          } else {
            this.addLog(`재연결 조건 불충족 - 현재역할: ${this.currentUserRole}, 시도역할: ${userRole}, 재연결횟수: ${this.reconnectAttempts}/${this.maxReconnectAttempts}`, 'error', userRole);
            if (this.currentUserRole !== userRole) {
              this.addLog(`역할 불일치로 재연결 중단 (현재: ${this.currentUserRole}, 시도: ${userRole})`, 'info', userRole);
            }
          }
        }
      };

      this.connection = eventSource;

    } catch (error) {
      this.isConnecting = false;
      this.addLog(`SSE 연결 생성 실패: ${error.message}`, 'error', userRole);
      this.connectionStatus = 'error';
      this.currentUserRole = null;

      this.notify({
        notifications: this.notifications,
        connectionStatus: this.connectionStatus,
        reconnectAttempts: this.reconnectAttempts
      });
    }
  }

  setNotifications(notifications) {
    this.notifications = notifications;
    this.notify({
      notifications: [...this.notifications],
      connectionStatus: this.connectionStatus,
      reconnectAttempts: this.reconnectAttempts
    });
  }

  updateNotification(id, updates) {
    this.notifications = this.notifications.map(n =>
        n.id === id ? { ...n, ...updates } : n
    );
    this.notify({
      notifications: [...this.notifications],
      connectionStatus: this.connectionStatus,
      reconnectAttempts: this.reconnectAttempts
    });
  }

  updateAllNotifications(updates) {
    this.notifications = this.notifications.map(n => ({ ...n, ...updates }));
    this.notify({
      notifications: [...this.notifications],
      connectionStatus: this.connectionStatus,
      reconnectAttempts: this.reconnectAttempts
    });
  }

  reconnect() {
    if (this.currentApiUrl && this.currentUserRole) {
      this.addLog('수동 재연결 시도', 'info', this.currentUserRole);
      this.reconnectAttempts = 0;
      this.isConnecting = false;
      this.connect(this.currentApiUrl, this.currentUserRole, true);
    }
  }
}

// 전역 인스턴스
const notificationManager = new NotificationManager();

export default function useNotifications(apiUrl, userType) {
  const { isLoggedIn, user } = useLogin();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [maxReconnectAttempts] = useState(5);

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
    }, 100);
  }, [addLog]);

  // 전역 알림 관리자 구독
  useEffect(() => {
    const unsubscribe = notificationManager.subscribe(({ notifications: newNotifications, connectionStatus: newStatus, reconnectAttempts: newAttempts }) => {
      setNotifications(newNotifications);
      setConnectionStatus(newStatus);
      setReconnectAttempts(newAttempts);
    }, userRole);

    return unsubscribe;
  }, [userRole]);

  // 로컬 저장된 알림 불러오기
  useEffect(() => {
    if (!isLoggedIn || !userRole) return;

    const loadStoredNotifications = async () => {
      try {
        const stored = localStorage.getItem(`notifications-${userRole}`);
        if (stored) {
          const parsedNotifications = JSON.parse(stored);
          notificationManager.setNotifications(parsedNotifications);
        }
      } catch (e) {
        addLog(`로컬 알림 복원 실패: ${e.message}`, 'error');
      }
    };

    loadStoredNotifications();
  }, [isLoggedIn, userRole, addLog]);

  // 알림 상태 localStorage 저장
  useEffect(() => {
    if (isLoggedIn && userRole && notifications.length > 0) {
      saveToLocalStorage(`notifications-${userRole}`, notifications);
    }
  }, [isLoggedIn, notifications, userRole, saveToLocalStorage]);

  // 읽지 않은 알림 개수 계산
  useEffect(() => {
    const count = notifications.filter(n => n.isRead !== 'Y').length;
    setUnreadCount(count);
  }, [notifications]);

  // 알림 목록 로딩
  useEffect(() => {
    if (!isLoggedIn || !user || !userRole) return;

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

        notificationManager.setNotifications(result);
      } catch (err) {
        addLog(`알림 목록 로딩 실패: ${err.message}`, 'error');
      }
    };

    fetchNotifications();
  }, [isLoggedIn, user, userRole, apiUrl, addLog]);

  // SSE 연결 관리
  useEffect(() => {
    if (isLoggedIn === false) {
      // 로그아웃 시 연결 정리
      addLog('로그아웃으로 인한 SSE 연결 정리', 'info');

      // 현재 훅의 역할이 관리자의 현재 역할과 일치할 때만 정리
      if (notificationManager.currentUserRole === userRole) {
        notificationManager.cleanup();
        notificationManager.setNotifications([]);
      }
      return;
    }

    if (isLoggedIn === true && user && userRole) {
      // 현재 연결된 역할과 다르면 즉시 정리
      if (notificationManager.currentUserRole && notificationManager.currentUserRole !== userRole) {
        addLog(`역할 변경으로 인한 즉시 연결 정리 (${notificationManager.currentUserRole} -> ${userRole})`, 'info');
        notificationManager.cleanup();
      }

      // 현재 훅이 마지막 활성 역할과 일치할 때만 연결 시도
      if (notificationManager.lastActiveRole === userRole) {
        // 약간의 지연을 두어 연결
        const connectDelay = setTimeout(() => {
          if (isLoggedIn === true && user && userRole && notificationManager.lastActiveRole === userRole) {
            addLog(`연결 시도 - 현재 관리자 역할: ${notificationManager.currentUserRole}, 요청 역할: ${userRole}`, 'info');
            notificationManager.connect(apiUrl, userRole, true);
          }
        }, 100);

        return () => {
          clearTimeout(connectDelay);
        };
      } else {
        addLog(`비활성 역할로 연결 시도 무시 (활성: ${notificationManager.lastActiveRole}, 현재: ${userRole})`, 'info');
      }
    }
  }, [isLoggedIn, user, userRole, apiUrl, addLog]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (localStorageTimeoutRef.current) {
        clearTimeout(localStorageTimeoutRef.current);
      }
    };
  }, []);

  const markAsRead = useCallback(async (id) => {
    if (!isLoggedIn) {
      addLog('로그인이 필요합니다', 'warning');
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/notifications/${id}/read`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        notificationManager.updateNotification(id, { isRead: 'Y' });
      } else {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      addLog(`읽음 처리 실패: ${err.message}`, 'error');
    }
  }, [isLoggedIn, apiUrl, addLog]);

  const markAllAsRead = useCallback(async () => {
    if (!isLoggedIn) {
      addLog('로그인이 필요합니다', 'warning');
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/notifications/read-all`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        notificationManager.updateAllNotifications({ isRead: 'Y' });
      } else {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      addLog(`전체 읽음 처리 실패: ${err.message}`, 'error');
    }
  }, [isLoggedIn, apiUrl, addLog]);

  const reconnect = useCallback(() => {
    if (!isLoggedIn) {
      addLog('로그인이 필요합니다', 'warning');
      return;
    }

    addLog('수동 재연결 시도');
    notificationManager.reconnect();
  }, [isLoggedIn, addLog]);

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