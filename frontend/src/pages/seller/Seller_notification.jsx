import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useEffect, useState, useRef} from "react";
import {Link} from "react-router-dom";
import AlarmContents from "../../components/AlarmContents.jsx";
import useLogin from "../../Hooks/useLogin.js";
import useNotifications from "../../Hooks/useNotifications";

const Seller_notification = () => {
    const {isLoggedIn, setIsLoggedIn, user, setUser} = useLogin();

    // 🔹 판매자용 알림 SSE 연결 - "seller" 타입으로 설정
    const {notifications, unreadCount, markAsRead, markAllAsRead} = useNotifications(
        "http://localhost",
        "SELLER"
    );

    const navigate = useNavigate();


    {/* 🔹 알림 및 아이콘 메뉴 */
    }
    <div className="icon-menu">
        <ul className="icon-menuInner">
            <li className="icon-Btn alarm-icon">
                <div className="myAlarm myIcon">
                    <img
                        src="../image/icon/icon-bell.png"
                        alt="alarm"
                        style={{
                            width: "35px",
                            height: "35px",
                        }}
                    />
                </div>
                <em className="headIconCount" id="alarm-cnt">
                    {unreadCount}
                </em>
                <div className="alarm-frame">
                                            <span className="alarm-contents">
                                                <ul className="alarm-inner">
                                                    {notifications.length === 0 ? (
                                                        <li>알림 온 게 없습니다.</li>
                                                    ) : (
                                                        <AlarmContents
                                                            notifications={notifications}
                                                            markAllAsRead={markAllAsRead}
                                                            markAsRead={markAsRead}
                                                        />
                                                    )}
                                                </ul>
                                            </span>
                </div>
            </li>
        </ul>
    </div>
}

export default Seller_notification;