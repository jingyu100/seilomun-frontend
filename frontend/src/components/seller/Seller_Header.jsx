import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/seller/Seller_Header.css";
import alarm from "../../image/icon/seller_icon/seller_alarm.png";
import menu from "../../image/icon/seller_icon/seller_menu.png";
import order from "../../image/icon/seller_icon/seller_order.png";
import review from "../../image/icon/seller_icon/seller_review.png";
import statistics from "../../image/icon/seller_icon/seller_statistics.png";
import store from "../../image/icon/seller_icon/seller_store.png";
import red from "../../image/icon/seller_icon/seller_red.png";
import green from "../../image/icon/seller_icon/seller_green.png";
import list from "../../image/icon/seller_icon/seller_list.png";
import SellerChatBtn from "./SellerChatBtn";

// 왼쪽 메뉴바
const menuItems = [
  { icon: store, label: "매장관리" },
  { icon: order, label: "주문접수" },
  { icon: menu, label: "상품관리", path: "/seller/product/management"},
  { icon: alarm, label: "알림" },
  { icon: review, label: "리뷰관리" },
  { icon: statistics, label: "통계보기" },
];

const Seller_Header = () => {
  const navigate = useNavigate();

  const [hoverIndex, setHoverIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [storeName, setStoreName] = useState("");

  // storeName 불러오기
  useEffect(() => {
    fetch("/api/sellers/me", {
      method: "GET",
      credentials: "include", // ✅ 쿠키 포함
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`응답 실패 (${res.status}): ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ /me 응답 데이터:", data);
        const store = data.data?.storeName;
        if (store) {
          setStoreName(store);
        } else {
          console.warn("⚠ storeName이 응답에 없습니다.");
        }
      })
      .catch((err) => {
        console.error("❌ 판매자 정보 불러오기 실패:", err);
      });
  }, []);

  // 영업중/영업종료 toggle
  const toggleOpenStatus = () => {
    setIsOpen((prev) => !prev);
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    const username = localStorage.getItem("username");
    const userType = "SELLER";

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, userType }),
      });
    } catch (e) {
      console.warn("⚠ 로그아웃 실패 (무시하고 진행):", e);
    }

    localStorage.removeItem("username");
    localStorage.removeItem("sellerId");
    window.location.href = "/selogin";
  };

  return (
    <>
      <div className="seller-container">
        {/* 상단 헤더 */}
        <div className="top-header">
          {/* 좌측: 영업 상태 */}
          <div
            className="left-header"
            onClick={toggleOpenStatus}
            style={{ cursor: "pointer" }}
          >
            <img src={list} alt="menu" className="seller_icon" />
            <span className="status-text">{isOpen ? "영업종료" : "영업중"}</span>
            <img src={isOpen ? red : green} alt="status-dot" className="red-dot" />
          </div>

          {/* 우측: 사용자 정보 */}
          <div className="right-header">
            <span>{storeName ? `${storeName} 님` : "판매자"}</span>
            <span>|</span>
            <span onClick={handleLogout} style={{ cursor: "pointer" }}>
              로그아웃
            </span>
            <span>|</span>
            <span>고객센터</span>
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
                if (item.path) {
                  navigate(item.path);
                }

                if (item.label === "리뷰관리") {
                  navigate("/Seller_reviewPage");
                }
              }}
            >
              <img src={item.icon} alt={item.label} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <SellerChatBtn />
    </>
  );
};

export default Seller_Header;