import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import AlarmContents from "../../components/AlarmContents.jsx";
import useLogin from "../../Hooks/useLogin.js";
import useNotifications from "../../Hooks/useNotifications";
import "../../css/seller/Seller_notification.css"; // CSS 파일 import

const Seller_notification = () => {
    const { isLoggedIn, setIsLoggedIn, user, setUser } = useLogin();

    // 🔹 판매자용 알림 SSE 연결 - "SELLER" 타입으로 설정
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(
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
                </div>

                {/* 알림 리스트 */}
                <div className="seller-notification-list">
                    {notifications.length === 0 ? (
                        <div className="seller-notification-empty">
                            <div className="seller-notification-empty-icon">🔔</div>
                            <p className="seller-notification-empty-text">알림이 없습니다</p>
                        </div>
                    ) : (
                        notifications.map((notification, index) => (
                            <div
                                key={notification.id || index}
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
                            모두 읽음 처리
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Seller_notification;