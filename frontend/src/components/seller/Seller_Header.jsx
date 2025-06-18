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
import blue from "../../image/icon/seller_icon/seller_blue.png";
import list from "../../image/icon/seller_icon/seller_list.png";
import SellerChatBtn from "./SellerChatBtn";
import useLogin from "../../Hooks/useLogin";
import axios from "axios";

// 현재 가게 상태
const statusMap = {
  '0': { text: "영업종료", color: red },
  '1': { text: "영업중", color: green },
  '2': { text: "브레이크타임", color: blue },
};

// 왼쪽 메뉴바
const menuItems = [
  { icon: store, label: "매장관리", path: "/Seller_newstoreRegistration" },
  { icon: order, label: "주문접수" },
  { icon: menu, label: "상품관리", path: "/seller/product/management" },
  { icon: alarm, label: "알림" },
  { icon: review, label: "리뷰관리", path: "/Seller_reviewPage" },
  { icon: statistics, label: "통계보기", path: "/seller/stats" },
];

const Seller_Header = () => {
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn, user } = useLogin();

  const [hoverIndex, setHoverIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isOpen, setIsOpen] = useState("0"); // 기본값: 영업종료
  const [storeName, setStoreName] = useState("");
  const [showStatusOptions, setShowStatusOptions] = useState(false);

  // storeName 불러오기
  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        const response = await axios.get("http://localhost/api/sellers/me", {
          withCredentials: true,
        });

        const store = response.data.data?.storeName;
        const sellerInfo = response.data.data?.sellerInformationDto;

        if (store) setStoreName(store);
        if (sellerInfo?.isOpen) setIsOpen(sellerInfo.isOpen);
      } catch (err) {
        console.error("❌ 판매자 정보 불러오기 실패:", err);
        setIsOpen("0"); // 실패 시 영업종료로 설정
      }
    };

    fetchSellerInfo();
  }, []);

  const handleStatusClick = () => {
    setShowStatusOptions((prev) => !prev);
  };

  const handleChangeStatus = async (newStatus) => {
    try {
      await axios.put(
        "http://localhost/api/sellers/me/status",
        { isOpen: newStatus },
        { withCredentials: true }
      );
      setIsOpen(newStatus);
      setShowStatusOptions(false);
    } catch (err) {
      console.error("❌ 상태 변경 실패:", err);
      alert("상태 변경에 실패했습니다.");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost/api/auth/logout",
        {
          username: user?.email || localStorage.getItem("username"),
          userType: "SELLER",
        },
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.warn("⚠ 로그아웃 실패 (무시하고 진행):", err);
    }

    setUser(null);
    setIsLoggedIn(false);
    localStorage.clear();
    navigate("/selogin");
  };

  const { text, color } = statusMap[isOpen] || statusMap['0'];

  return (
    <>
      <div className="seller-container">
        {/* 상단 헤더 */}
        <div className="top-header">
          {/* 좌측: 영업 상태 */}
          <div
            className="left-header"
            onClick={handleStatusClick}
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

          {/* 우측: 사용자 정보 */}
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