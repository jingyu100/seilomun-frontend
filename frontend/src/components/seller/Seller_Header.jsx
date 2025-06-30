import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/seller/Seller_Header.css";
import "../../css/seller/Seller_notification.css"; // 🔥 알림 스타일 통합
import alarm from "../../image/icon/seller_icon/seller_alarm.png";
import menu from "../../image/icon/seller_icon/seller_menu.png";
import order from "../../image/icon/seller_icon/seller_order.png";
import review from "../../image/icon/seller_icon/seller_review.png";
import statistics from "../../image/icon/seller_icon/seller_statistics.png";
import store from "../../image/icon/seller_icon/seller_store.png";
import red from "../../image/icon/seller_icon/seller_red.png";
import green from "../../image/icon/seller_icon/seller_green.png";
import blue from "../../image/icon/seller_icon/seller_blue.png";
import list from "../../image/icon/seller_icon/seller_list.png";
import SellerChatBtn from "./SellerChatBtn";
import useLogin from "../../Hooks/useLogin";
import useNotifications from "../../Hooks/useNotifications";

import api, { API_BASE_URL } from "../../api/config.js";

// 상태 색상 매핑
const statusMap = {
  0: { text: "영업종료", color: red },
  1: { text: "영업중", color: green },
  2: { text: "브레이크타임", color: blue },
};

const menuItems = [
  { icon: store, label: "매장관리", path: "/Seller_newstoreRegistration" },
  { icon: menu, label: "상품관리", path: "/seller/product/management" },
  { icon: review, label: "리뷰관리", path: "/Seller_reviewPage" },
  { icon: statistics, label: "통계보기", path: "/seller/stats" },
];

export default function Seller_Header() {
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn, user } = useLogin();
  const [hoverIndex, setHoverIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isOpen, setIsOpen] = useState("0");
  const [storeName, setStoreName] = useState("");
  const [showStatusOptions, setShowStatusOptions] = useState(false);

  const { notifications, unreadCount, markAsRead, markAllAsRead, connectionStatus } =
    useNotifications(API_BASE_URL, "SELLER");

  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        const response = await api.get("/api/sellers/me");
        const store = response.data.data?.storeName;
        const sellerInfo = response.data.data?.sellerInformationDto;
        if (store) setStoreName(store);
        if (sellerInfo?.isOpen) setIsOpen(sellerInfo.isOpen);
      } catch (err) {
        console.error("❌ 판매자 정보 불러오기 실패:", err);
        setIsOpen("0");
      }
    };
    fetchSellerInfo();
  }, []);

  const handleChangeStatus = async (newStatus) => {
    try {
      await api.put("/api/sellers/me/status", { isOpen: newStatus });
      setIsOpen(newStatus);
      setShowStatusOptions(false);
    } catch (err) {
      console.error("❌ 상태 변경 실패:", err);
      alert("상태 변경에 실패했습니다.");
    }
  };

  const handleLogout = async () => {
    try {
      // 1. 영업 상태를 '0'(영업종료)로 먼저 업데이트
      await api.put("/api/sellers/me/status", { isOpen: "0" });

      // 2. 로그아웃 요청
      await api.post("/api/auth/logout", {
        username: user?.email || localStorage.getItem("username"),
        userType: "SELLER",
      });
    } catch (err) {
      console.warn("⚠ 로그아웃 또는 상태 변경 실패:", err);
    }

    // 3. 로컬 상태 정리 및 이동
    setUser(null);
    setIsLoggedIn(false);
    localStorage.clear();
    navigate("/selogin");
  };

  const handleNotificationClick = async (notification) => {
    await markAsRead(notification.id);
    const content = notification.content || "";

    const orderMatch = content.match(/주문번호:\s*([A-Z0-9]+)/);
    const refundMatch = content.match(/환불번호:\s*(\d+)/);

    if (refundMatch) {
      const refundId = refundMatch[1];
      navigate(`/seller/refunds/${refundId}`);
    } else if (orderMatch) {
      const orderNumber = orderMatch[1];
      navigate(`/seller/orders/number/${orderNumber}`);
    } else if (content.includes("리뷰")) {
      navigate("/Seller_reviewPage");
    } else if (content.includes("상품")) {
      navigate("/seller/product/management");
    } else {
      navigate("/Seller_Main");
    }
  };

  const { text, color } = statusMap[isOpen] || statusMap["0"];

  const getNotificationIcon = (content) => {
    if (content.includes("주문")) return "📦";
    if (content.includes("환불")) return "💰";
    if (content.includes("리뷰")) return "⭐";
    if (content.includes("상품")) return "🛍️";
    return "🔔";
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "🟢 연결됨";
      case "connecting":
        return "🟡 연결중...";
      case "error":
        return "🔴 연결 오류";
      default:
        return "⚪ 연결 안됨";
    }
  };

  return (
    <>
      <div className="seller-container">
        {/* 헤더 */}
        <div className="top-header">
          <div
            className="left-header"
            onClick={() => setShowStatusOptions(!showStatusOptions)}
            style={{ cursor: "pointer", position: "relative" }}
          >
            <img src={list} alt="menu" className="seller_icon" />
            <span className="status-text">{text}</span>
            <img src={color} alt="status-dot" className="red-dot" />
            {showStatusOptions && (
              <div className="status-dropdown">
                {Object.entries(statusMap)
                  .filter(([key]) => key !== isOpen)
                  .map(([key, val]) => (
                    <div
                      key={key}
                      className="status-option"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChangeStatus(key);
                      }}
                    >
                      <img src={val.color} alt="dot" className="red-dot" />
                      <span>{val.text}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="right-header">
            <span>{storeName ? `${storeName} 님` : "판매자"}</span>
            <span>|</span>
            <span onClick={handleLogout} style={{ cursor: "pointer" }}>
              로그아웃
            </span>
          </div>
        </div>

        {/* 좌측 메뉴 */}
        <div className="side-menu">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`menu-item ${
                selectedIndex !== null
                  ? selectedIndex === index
                    ? "focused"
                    : "faded"
                  : hoverIndex !== null
                  ? hoverIndex === index
                    ? ""
                    : "faded"
                  : ""
              }`}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              onClick={() => {
                setSelectedIndex(index);
                if (item.path) navigate(item.path);
              }}
            >
              <img src={item.icon} alt={item.label} />
              <span>{item.label}</span>
            </div>
          ))}

          {/* 🔔 알림 고정 UI 바로 붙이기 */}
          <div className="seller-notification-bar">
            <div className="seller-notification-header">
              <h3>알림</h3>
              <div className="seller-notification-status">
                {getConnectionStatusText()}
              </div>
            </div>
            <div className="seller-notification-list">
              {notifications.length === 0 ? (
                <div className="seller-notification-empty">
                  <div className="seller-notification-empty-icon">🔔</div>
                  <p className="seller-notification-empty-text">알림이 없습니다</p>
                </div>
              ) : (
                notifications.map((noti) => (
                  <div
                    key={noti.id}
                    className={`seller-notification-item ${
                      noti.isRead === "Y" ? "read" : "unread"
                    }`}
                    onClick={() => handleNotificationClick(noti)}
                  >
                    <div className="seller-notification-icon">
                      {getNotificationIcon(noti.content)}
                    </div>
                    <div className="seller-notification-content">{noti.content}</div>
                    <div className="seller-notification-meta">
                      <span>{new Date(noti.createdAt).toLocaleString()}</span>
                      {noti.isRead !== "Y" && (
                        <span className="seller-notification-new-badge">NEW</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
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
          </div>
        </div>
      </div>
      <SellerChatBtn />
    </>
  );
}
