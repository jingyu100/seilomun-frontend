import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AlarmContents from "../../components/AlarmContents.jsx";
import useLogin from "../../Hooks/useLogin.js";
import useNotifications from "../../Hooks/useNotifications";
import "../../css/seller/Seller_notification.css";

const Seller_notification = () => {
    const { isLoggedIn, setIsLoggedIn, user, setUser } = useLogin();

    // 판매자용 알림 SSE 연결 - "SELLER" 타입으로 설정
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        connectionStatus,
        reconnect
    } = useNotifications(
        "http://localhost",
        "SELLER"
    );

    const navigate = useNavigate();

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

    // 알림 내용에서 관련 정보 추출하는 함수
    const extractInfoFromContent = (content) => {
        const info = {
            refundId: null,
            orderNumber: null,
            type: 'general'
        };

        if (!content) return info;

        // 주문번호 추출
        const orderNumberMatch = content.match(/주문번호:\s*([A-Z0-9]+)/);
        if (orderNumberMatch) {
            info.orderNumber = orderNumberMatch[1];
        }

        // 환불번호 추출 (환불ID → 환불번호로 변경)
        const refundIdMatch = content.match(/환불번호:\s*(\d+)/);
        if (refundIdMatch) {
            info.refundId = refundIdMatch[1];
        }

        // 알림 타입 결정
        if (content.includes('주문이 들어왔습니다') ||
            content.includes('주문을 수락') ||
            content.includes('주문을 거절')) {
            info.type = 'order';
        } else if (content.includes('환불')) {
            info.type = 'refund';
        } else if (content.includes('리뷰')) {
            info.type = 'review';
        } else if (content.includes('상품')) {
            info.type = 'product';
        }

        return info;
    };

    // 알림 클릭 핸들러
    const handleNotificationClick = async (notification) => {
        try {
            // 먼저 알림을 읽음 처리
            await markAsRead(notification.id);

            const content = notification.content || notification.message || '';
            const info = extractInfoFromContent(content);

            console.log('알림 클릭:', { notification, info });

            // 타입별 라우팅
            switch (info.type) {
                case 'order':
                    if (info.orderNumber) {
                        navigate(`/seller/orders/number/${info.orderNumber}`);
                    } else {
                        console.warn('주문번호를 찾을 수 없습니다:', content);
                        // 주문 목록 페이지로 이동
                        navigate('/seller/orders');
                    }
                    break;

                case 'refund':
                    if (info.refundId) {
                        navigate(`/seller/refunds/${info.refundId}`);
                    } else {
                        console.warn('환불번호를 찾을 수 없습니다:', content);
                        // 환불 목록 페이지로 이동 (구현 필요)
                        navigate('/seller/refunds');
                    }
                    break;

                case 'review':
                    // 리뷰 관리 페이지로 이동
                    navigate('/Seller_reviewPage');
                    break;

                case 'product':
                    // 상품 관리 페이지로 이동
                    navigate('/seller/product/management');
                    break;

                default:
                    // 기본적으로 메인 페이지로
                    navigate('/Seller_Main');
                    break;
            }

        } catch (error) {
            console.error('알림 처리 중 오류:', error);
        }
    };

    // 연결 상태에 따른 스타일 결정
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

    // 알림 타입에 따른 아이콘 반환
    const getNotificationIcon = (content) => {
        if (content.includes('주문')) return '📦';
        if (content.includes('환불')) return '💰';
        if (content.includes('리뷰')) return '⭐';
        if (content.includes('상품')) return '🛍️';
        return '🔔';
    };

    return (
        <div className="seller-notification-container">
            {/* 세로 긴 검은 직사각형 바 */}
            <div className="seller-notification-bar">
                {/* 헤더 */}
                <div className="seller-notification-header">
                    <h3>알림</h3>
                    <div className="seller-notification-status" style={getConnectionStatusStyle()}>
                        {getConnectionStatusText()}
                    </div>
                </div>

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
                                key={`${notification.id}-${index}`}
                                className={`seller-notification-item ${notification.isRead === "Y" ? 'read' : 'unread'}`}
                                onClick={() => handleNotificationClick(notification)}
                                style={{ cursor: 'pointer' }}
                            >
                                {/* 알림 타입 아이콘 */}
                                <div className="seller-notification-icon">
                                    {getNotificationIcon(notification.content || notification.message || '')}
                                </div>

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

                {/* 연결 문제 시 재연결 버튼 */}
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