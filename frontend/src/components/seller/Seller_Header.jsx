import React, { useState } from "react";
import "../../css/seller/Seller_Header.css";
import alarm from "../../image/icon/seller_icon/seller_alarm.png";
import menu from "../../image/icon/seller_icon/seller_menu.png";
import order from "../../image/icon/seller_icon/seller_order.png";
import review from "../../image/icon/seller_icon/seller_review.png";
import statistics from "../../image/icon/seller_icon/seller_statistics.png";
import store from "../../image/icon/seller_icon/seller_store.png";
import red from "../../image/icon/seller_icon/seller_red.png";
import list from "../../image/icon/seller_icon/seller_list.png";

const menuItems = [
  { icon: store, label: "매장관리" },
  { icon: order, label: "주문접수" },
  { icon: menu, label: "상품관리" },
  { icon: alarm, label: "알림" },
  { icon: review, label: "리뷰관리" },
  { icon: statistics, label: "통계보기" },
];

const Seller_Header = () => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <div className="seller-container">
      {/* 상단 헤더 */}
      <div className="top-header">
        <div className="left-header">
          <img src={list} alt="menu" className="seller_icon" />
          <span className="status-text">영업종료</span>
          <img src={red} alt="red-dot" className="red-dot" />
        </div>
        <div className="right-header">
          <span>판매자 님</span>
          <span>|</span>
          <span>로그아웃</span>
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
            onClick={() => setSelectedIndex(index)}
          >
            <img src={item.icon} alt={item.label} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Seller_Header;
