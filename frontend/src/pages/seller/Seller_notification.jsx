import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import AlarmContents from "../../components/AlarmContents.jsx";
import useLogin from "../../Hooks/useLogin.js";
import useNotifications from "../../Hooks/useNotifications";
import "../../css/seller/Seller_notification.css";

const Seller_notification = () => {
    const { isLoggedIn, setIsLoggedIn, user, setUser } = useLogin();

    // 🔹 판매자용 알림 SSE 연결 - "SELLER" 타입으로 설정
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        connectionStatus,
        logs,
        reconnect,
        receivedCount,
        lastReceivedTime
    } = useNotifications(
        "http://localhost",
        "SELLER"
    );

    const navigate = useNavigate();

    // 🔹 디버깅을 위한 상태 추가
    const [debugMode, setDebugMode] = useState(false);
    const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

    // 🔹 notifications 배열이 변경될 때마다 마지막 업데이트 시간 갱신
    useEffect(() => {
        setLastUpdateTime(new Date());
        console.log('📱 판매자 알림 업데이트:', {
            count: notifications.length,
            unread: unreadCount,
            timestamp: new Date().toLocaleTimeString(),
            firstNotification: notifications[0] ? {
                id: notifications[0].id,
                content: notifications[0].content?.substring(0, 30)
            } : null
        });
    }, [notifications, unreadCount]);

    // 🔹 렌더링 횟수 카운트
    const renderCount = useRef(0);
    renderCount.current += 1;

    // 🔹 매 렌더링마다 상태 로깅
    useEffect(() => {
        console.log(`🔄 컴포넌트 렌더링 #${renderCount.current}:`, {
            알림개수: notifications.length,
            읽지않음: unreadCount,
            연결상태: connectionStatus,
            받은메시지: receivedCount,
            마지막수신: lastReceivedTime?.toLocaleTimeString()
        });
    });

    // 🔹 SSE 연결 상태 모니터링
    useEffect(() => {
        console.log('🔌 SSE 연결 상태 변경:', connectionStatus);
    }, [connectionStatus]);

    // 로그인 체크
    if (!isLoggedIn) {
        return (
            <div className="seller-notification-login-wrapper">
                <div className="seller-notification-login-box">
                    <h2>로그인이 필요합니다</h2>
                    <button
                        onClick={() => navigate('/login')}
                        className="seller-notification-login-btn"
                    >
                        로그인하기
                    </button>
                </div>
            </div>
        );
    }

    // 🔹 연결 상태에 따른 스타일 결정
    const getConnectionStatusStyle = () => {
        switch (connectionStatus) {
            case 'connected':
                return { color: '#10b981', fontWeight: 'bold' };
            case 'connecting':
                return { color: '#f59e0b', fontWeight: 'bold' };
            case 'error':
                return { color: '#ef4444', fontWeight: 'bold' };
            default:
                return { color: '#6b7280', fontWeight: 'bold' };
        }
    };

    const getConnectionStatusText = () => {
        switch (connectionStatus) {
            case 'connected':
                return '🟢 연결됨';
            case 'connecting':
                return '🟡 연결중...';
            case 'error':
                return '🔴 연결 오류';
            default:
                return '⚪ 연결 안됨';
        }
    };

    return (
        <div className="seller-notification-container">
            {/* 세로 긴 검은 직사각형 바 */}
            <div className="seller-notification-bar">
                {/* 헤더 */}
                <div className="seller-notification-header">
                    <div className="seller-notification-stats">
                        <span className="seller-notification-total">
                            전체: {notifications.length}
                        </span>
                        <span className="seller-notification-unread">
                            읽지않음: {unreadCount}
                        </span>
                    </div>

                    {/* 🔹 연결 상태 표시 */}
                    <div className="seller-notification-connection">
                        <span style={getConnectionStatusStyle()}>
                            {getConnectionStatusText()}
                        </span>
                        <button
                            onClick={() => setDebugMode(!debugMode)}
                            className="seller-notification-debug-btn"
                            style={{
                                marginLeft: '10px',
                                padding: '2px 6px',
                                fontSize: '12px',
                                background: debugMode ? '#3b82f6' : '#e5e7eb',
                                color: debugMode ? 'white' : '#374151',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            디버그 {debugMode ? 'ON' : 'OFF'}
                        </button>
                        {connectionStatus === 'error' && (
                            <button
                                onClick={reconnect}
                                style={{
                                    marginLeft: '10px',
                                    padding: '4px 8px',
                                    fontSize: '12px',
                                    background: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                재연결
                            </button>
                        )}
                    </div>

                    {/* 🔹 연결 통계 정보 */}
                    <div className="seller-notification-stats-detail">
                        <small style={{ color: '#6b7280', display: 'block' }}>
                            받은 메시지: {receivedCount}개
                        </small>
                        {lastReceivedTime && (
                            <small style={{ color: '#6b7280', display: 'block' }}>
                                마지막 수신: {lastReceivedTime.toLocaleTimeString()}
                            </small>
                        )}
                    </div>

                    {/* 🔹 마지막 업데이트 시간 */}
                    <div className="seller-notification-last-update">
                        <small style={{ color: '#6b7280' }}>
                            마지막 업데이트: {lastUpdateTime.toLocaleTimeString()}
                        </small>
                    </div>
                </div>

                {/* 🔹 디버그 모드일 때 로그 표시 */}
                {debugMode && (
                    <div className="seller-notification-debug" style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '12px',
                        margin: '10px 0',
                        maxHeight: '200px',
                        overflowY: 'auto'
                    }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>SSE 연결 로그:</h4>
                        {logs.length === 0 ? (
                            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>로그가 없습니다.</p>
                        ) : (
                            <div style={{ fontSize: '12px' }}>
                                {logs.slice(0, 10).map((log) => (
                                    <div key={log.id} style={{
                                        marginBottom: '4px',
                                        color: log.type === 'error' ? '#ef4444' :
                                            log.type === 'success' ? '#10b981' : '#374151'
                                    }}>
                                        <span style={{ color: '#6b7280' }}>[{log.timestamp}]</span> {log.message}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 알림 리스트 */}
                <div className="seller-notification-list">
                    {notifications.length === 0 ? (
                        <div className="seller-notification-empty">
                            <div className="seller-notification-empty-icon">🔔</div>
                            <p className="seller-notification-empty-text">알림이 없습니다</p>
                            {connectionStatus !== 'connected' && (
                                <p style={{
                                    fontSize: '12px',
                                    color: '#ef4444',
                                    marginTop: '8px'
                                }}>
                                    실시간 알림 연결이 끊어졌습니다. 페이지를 새로고침해주세요.
                                </p>
                            )}
                        </div>
                    ) : (
                        notifications.map((notification, index) => (
                            <div
                                key={`${notification.id}-${index}`} // 🔹 고유 키 보장
                                className={`seller-notification-item ${notification.isRead === "Y" ? 'read' : 'unread'}`}
                                onClick={() => markAsRead(notification.id)}
                            >
                                {/* 읽지않음 점 */}
                                {notification.isRead !== "Y" && (
                                    <div className="seller-notification-unread-dot"></div>
                                )}

                                {/* 알림 내용 */}
                                <div className={`seller-notification-content ${notification.isRead === "Y" ? 'read' : 'unread'}`}>
                                    {notification.content || notification.message || '알림 내용'}
                                </div>

                                {/* 시간 */}
                                <div className="seller-notification-meta">
                                    <span>
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </span>
                                    {notification.isRead !== "Y" && (
                                        <span className="seller-notification-new-badge">
                                            NEW
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* 하단 액션 */}
                {unreadCount > 0 && (
                    <div className="seller-notification-actions">
                        <button
                            onClick={markAllAsRead}
                            className="seller-notification-mark-all-btn"
                        >
                            모두 읽음 처리 ({unreadCount})
                        </button>
                    </div>
                )}

                {/* 🔹 연결 문제 시 재연결 버튼 */}
                {connectionStatus === 'error' && (
                    <div className="seller-notification-reconnect" style={{
                        padding: '12px',
                        textAlign: 'center',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        margin: '10px 0'
                    }}>
                        <p style={{
                            margin: '0 0 8px 0',
                            color: '#dc2626',
                            fontSize: '14px'
                        }}>
                            실시간 알림 연결에 문제가 발생했습니다.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                background: '#dc2626',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            페이지 새로고침
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Seller_notification;