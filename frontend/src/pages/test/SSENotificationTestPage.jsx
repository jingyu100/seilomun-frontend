import React, {useState, useEffect} from 'react';

const SSENotificationTestPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [sseConnection, setSseConnection] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState('');
    const [apiUrl, setApiUrl] = useState('http://localhost:8080');
    const [logs, setLogs] = useState([]);

    // 로그 추가 함수
    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [{
            id: Date.now(),
            message,
            type,
            timestamp
        }, ...prev.slice(0, 19)]);
    };

    // SSE 연결
    const connectSSE = () => {
        // if (!token) {
        //     addLog('토큰이 없습니다. 먼저 토큰을 입력하세요.', 'error');
        //     return;
        // }

        if (sseConnection) {
            sseConnection.close();
        }

        addLog('SSE 연결 시도 중...', 'info');
        setConnectionStatus('connecting');

        // EventSource는 헤더를 설정할 수 없으므로 쿼리 파라미터로 토큰 전달
        // 또는 쿠키를 사용하거나 백엔드에서 다른 방식으로 인증 구현
        const url = `${apiUrl}/api/notifications/connect`;

        // 또는 토큰 없이 먼저 연결 테스트
        // const url = `${apiUrl}/api/notifications/connect`;

        try {
            const eventSource = new EventSource(url, {
                withCredentials: true // 쿠키를 포함시키려면 true로 설정
            });

            eventSource.onopen = () => {
                addLog('SSE 연결 성공', 'success');
                setConnectionStatus('connected');
            };

            eventSource.onmessage = (event) => {
                addLog(`기본 메시지 수신: ${event.data}`, 'info');
            };

            eventSource.addEventListener('connect', (event) => {
                addLog(`연결 이벤트: ${event.data}`, 'success');
            });

            eventSource.addEventListener('notification', (event) => {
                try {
                    const notification = JSON.parse(event.data);
                    addLog('알림 수신', 'success');
                    setNotifications(prev => [notification, ...prev]);
                } catch (error) {
                    addLog(`알림 파싱 오류: ${error.message}`, 'error');
                }
            });

            eventSource.onerror = (error) => {
                addLog(`SSE 연결 오류: ${error}`, 'error');
                setConnectionStatus('error');

                if (eventSource.readyState === EventSource.CLOSED) {
                    addLog('연결이 닫혔습니다', 'error');
                    setConnectionStatus('disconnected');
                }
            };

            setSseConnection(eventSource);
        } catch (error) {
            addLog(`EventSource 생성 실패: ${error.message}`, 'error');
            setConnectionStatus('disconnected');
        }
    };

    // SSE 연결 해제
    const disconnectSSE = () => {
        if (sseConnection) {
            sseConnection.close();
            setSseConnection(null);
            setConnectionStatus('disconnected');
            addLog('SSE 연결 해제', 'info');
        }
    };

    // 알림 읽음 처리
    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(`${apiUrl}/api/notifications/${notificationId}/read`, {
                method: 'PUT',
                credentials: 'include',  // 쿠키 포함
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                addLog(`알림 ${notificationId} 읽음 처리 성공`, 'success');
                setNotifications(prev =>
                    prev.map(notif =>
                        notif.id === notificationId
                            ? {...notif, isRead: 'Y'}
                            : notif
                    )
                );
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            addLog(`읽음 처리 실패: ${error.message}`, 'error');
        }
    };

    // 컴포넌트 언마운트 시 연결 정리
    useEffect(() => {
        return () => {
            if (sseConnection) {
                sseConnection.close();
            }
        };
    }, [sseConnection]);

    const getStatusColor = () => {
        switch (connectionStatus) {
            case 'connected':
                return '#10b981';
            case 'connecting':
                return '#f59e0b';
            case 'error':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    const getLogTypeColor = (type) => {
        switch (type) {
            case 'success':
                return '#059669';
            case 'error':
                return '#dc2626';
            case 'info':
                return '#2563eb';
            default:
                return '#4b5563';
        }
    };

    return (
        <div style={{minHeight: '100vh', backgroundColor: '#f9fafb', padding: '1rem'}}>
            <div style={{maxWidth: '1200px', margin: '0 auto'}}>
                <h1 style={{fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem'}}>
                    SSE 알림 테스트
                </h1>

                {/* 연결 설정 */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    padding: '1.5rem',
                    marginBottom: '1.5rem'
                }}>
                    <h2 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem'}}>연결 설정</h2>

                    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: '#374151',
                                marginBottom: '0.25rem'
                            }}>
                                API URL
                            </label>
                            <input
                                type="text"
                                value={apiUrl}
                                onChange={(e) => setApiUrl(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem 0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.375rem'
                                }}
                                placeholder="http://localhost:8080"
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: '#374151',
                                marginBottom: '0.25rem'
                            }}>
                                JWT 토큰
                            </label>
                            <textarea
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem 0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.375rem',
                                    resize: 'vertical'
                                }}
                                rows="3"
                                placeholder="Bearer 토큰을 입력하세요 (Bearer 제외)"
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: '#374151',
                                marginBottom: '0.25rem'
                            }}>
                                사용자 ID (참고용)
                            </label>
                            <input
                                type="text"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem 0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.375rem'
                                }}
                                placeholder="사용자 ID"
                            />
                        </div>

                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                <div style={{
                                    width: '0.75rem',
                                    height: '0.75rem',
                                    borderRadius: '50%',
                                    backgroundColor: getStatusColor()
                                }}/>
                                <span style={{color: getStatusColor()}}>
                  {connectionStatus === 'connected' ? '🟢 연결됨' : connectionStatus === 'connecting' ? '🟡 연결 중...' : '⚪ 연결 안 됨'}
                </span>
                            </div>

                            <div style={{display: 'flex', gap: '0.5rem'}}>
                                <button
                                    onClick={connectSSE}
                                    disabled={connectionStatus === 'connected'}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: connectionStatus === 'connected' ? '#9ca3af' : '#3b82f6',
                                        color: 'white',
                                        borderRadius: '0.375rem',
                                        border: 'none',
                                        cursor: connectionStatus === 'connected' ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    연결
                                </button>
                                <button
                                    onClick={disconnectSSE}
                                    disabled={connectionStatus !== 'connected'}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: connectionStatus !== 'connected' ? '#9ca3af' : '#ef4444',
                                        color: 'white',
                                        borderRadius: '0.375rem',
                                        border: 'none',
                                        cursor: connectionStatus !== 'connected' ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    연결 해제
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
                    {/* 알림 목록 */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        padding: '1.5rem'
                    }}>
                        <h2 style={{
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            🔔 알림 목록 ({notifications.length})
                        </h2>

                        <div style={{maxHeight: '24rem', overflowY: 'auto'}}>
                            {notifications.length === 0 ? (
                                <p style={{color: '#6b7280', textAlign: 'center', padding: '2rem 0'}}>알림이 없습니다</p>
                            ) : (
                                notifications.map((notification, index) => (
                                    <div
                                        key={notification.id || index}
                                        style={{
                                            padding: '1rem',
                                            border: '1px solid',
                                            borderColor: notification.isRead === 'Y' ? '#e5e7eb' : '#bfdbfe',
                                            borderRadius: '0.5rem',
                                            backgroundColor: notification.isRead === 'Y' ? '#f9fafb' : '#eff6ff',
                                            marginBottom: '0.75rem'
                                        }}
                                    >
                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                            <div style={{flex: 1}}>
                                                <p style={{
                                                    fontSize: '0.875rem',
                                                    color: notification.isRead === 'Y' ? '#4b5563' : '#1f2937',
                                                    fontWeight: notification.isRead === 'Y' ? 'normal' : '500'
                                                }}>
                                                    {notification.content}
                                                </p>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    marginTop: '0.5rem',
                                                    fontSize: '0.75rem',
                                                    color: '#6b7280'
                                                }}>
                                                    👤 판매자 ID: {notification.senderId}
                                                    <span style={{margin: '0 0.5rem'}}>•</span>
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                disabled={notification.isRead === 'Y'}
                                                style={{
                                                    marginLeft: '1rem',
                                                    padding: '0.5rem',
                                                    borderRadius: '50%',
                                                    border: 'none',
                                                    backgroundColor: 'transparent',
                                                    cursor: notification.isRead === 'Y' ? 'default' : 'pointer',
                                                    color: notification.isRead === 'Y' ? '#9ca3af' : '#2563eb'
                                                }}
                                            >
                                                {notification.isRead === 'Y' ? '✓' : '○'}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* 로그 */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        padding: '1.5rem'
                    }}>
                        <h2 style={{
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            ℹ️ 연결 로그
                        </h2>

                        <div style={{maxHeight: '24rem', overflowY: 'auto'}}>
                            {logs.length === 0 ? (
                                <p style={{color: '#6b7280', textAlign: 'center', padding: '2rem 0'}}>로그가 없습니다</p>
                            ) : (
                                logs.map((log) => (
                                    <div key={log.id} style={{fontSize: '0.875rem', marginBottom: '0.5rem'}}>
                                        <span style={{color: '#9ca3af'}}>[{log.timestamp}]</span>
                                        <span style={{marginLeft: '0.5rem', color: getLogTypeColor(log.type)}}>
                      {log.message}
                    </span>
                                    </div>
                                ))
                            )}
                        </div>

                        {logs.length > 0 && (
                            <button
                                onClick={() => setLogs([])}
                                style={{
                                    marginTop: '1rem',
                                    fontSize: '0.875rem',
                                    color: '#6b7280',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                🗑️ 로그 지우기
                            </button>
                        )}
                    </div>
                </div>

                {/* 사용 방법 */}
                <div style={{
                    marginTop: '1.5rem',
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    padding: '1.5rem'
                }}>
                    <h2 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem'}}>사용 방법</h2>
                    <ol style={{listStyleType: 'decimal', paddingLeft: '1.5rem', color: '#374151'}}>
                        <li style={{marginBottom: '0.5rem'}}>백엔드 API URL을 입력합니다 (기본값: http://localhost:8080)</li>
                        <li style={{marginBottom: '0.5rem'}}>Customer 권한을 가진 JWT 토큰을 입력합니다</li>
                        <li style={{marginBottom: '0.5rem'}}>"연결" 버튼을 클릭하여 SSE 연결을 시작합니다</li>
                        <li style={{marginBottom: '0.5rem'}}>판매자가 새 상품을 등록하면 실시간으로 알림을 받을 수 있습니다</li>
                        <li style={{marginBottom: '0.5rem'}}>알림을 클릭하여 읽음 처리할 수 있습니다</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default SSENotificationTestPage;