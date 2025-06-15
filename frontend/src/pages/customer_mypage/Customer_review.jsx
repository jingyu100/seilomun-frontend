import React, { useState } from "react";
import "../../css/customer_mypage/Customer_review.css";
import Footer from "../../components/Footer.jsx";
import Header from "../../components/Header.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";

const Customer_review = () => {

  return (
    <div>
      <div className="header">
        <Header />
      </div>

      <div className="body">
        <SideMenuBtn />

        <div className="mypage-container">
          {/* 사이드 바 */}
          <aside className="mypage-sidebar44">
            
          <div className="title-xl">마이페이지</div>

          <div className="sidebar-section">
            <div className="title-lg">쇼핑정보</div>
            <ul>
            <li onClick={() => window.location.href = '/OrderList'}>주문목록</li>
            <li onClick={() => window.location.href = '/Customer_refund'}>환불/입금 내역</li>
            </ul>
          </div>

          <div className="sidebar-section">
            <div className="title-lg">회원정보</div>
            <ul>
            <li onClick={() => window.location.href = '/change_datapage'}>
              회원정보 변경
            </li>

            <li onClick={() => window.location.href = '/Delivery_destination'}>
              배송지 관리
            </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <div className="title-lg">혜택관리</div>
            <ul>
            <li onClick={() => window.location.href = '/Customer_point'}>
                적립내역
                </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <div className="title-lg">리뷰관리</div>
            <ul>
            <li onClick={() => window.location.href = '/Customer_review'}>
                리뷰관리
              </li>
            </ul>
          </div>
          </aside>

        </div>
        <div className="footer">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Customer_review;
