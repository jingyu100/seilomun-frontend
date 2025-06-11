import React from "react";
import "../../css/customer_mypage/MyPage.css";
import Footer from "../../components/Footer.jsx";
import Header from "../../components/Header.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";
import logo from "../../image/logo/spLogo.png";
import reading_glasses from "../../image/reading_glasses.png";
import useLogin from "../../Hooks/useLogin.js";

const MyPage = () => {
  const { user } = useLogin(); // ✅ 전역 user 정보 가져오기
  const userName = user?.nickname || "회원"; // ✅ fallback 이름 설정

  return (
    <div>
      <div className="header">
        <Header />
      </div>

      <div className="body">
        <SideMenuBtn />
        <div className="mypage-area">
          <aside className="mypage-sidebar22">
            <div className="title-xl">마이페이지</div>

            <div className="sidebar-section">
              <div className="title-lg">쇼핑정보</div>
              <ul>
                <li onClick={() => (window.location.href = "/OrderList")}>
                  주문목록/배송조회
                </li>
                <li>환불/입금 내역</li>
              </ul>
            </div>

            <div className="sidebar-section">
              <div className="title-lg">회원정보</div>
              <ul>
                <li onClick={() => (window.location.href = "/change_datapage")}>
                  회원정보 변경
                </li>
                <li onClick={() => (window.location.href = "/Delivery_destination")}>
                  배송지 관리
                </li>
              </ul>
            </div>

            <div className="sidebar-section">
              <div className="title-lg">혜택관리</div>
              <ul>
                <li>적립내역</li>
              </ul>
            </div>

            <div className="sidebar-section">
              <div className="title-lg">리뷰관리</div>
              <ul>
                <li>리뷰관리</li>
              </ul>
            </div>
          </aside>

          <div className="mypage-center">
            <div className="user-info-box">
              <div className="user-left">
                <img src={logo} alt="프로필" className="user-profile" />
                <h3>{userName} 고객님 반갑습니다.</h3>
              </div>
              <div className="user-right">
                <a href="/Change_dataPage" className="info-link">
                  회원정보변경 &gt;
                </a>
              </div>
            </div>

            <div className="point-box">
              세일로문 포인트 <span className="highlight">12000</span> P &gt;
            </div>

            <div className="mypage-list-box">
              <div className="list-section">
                <div className="section-header">
                  <div>주문 내역</div>
                  <a href="#">더보기 &gt;</a>
                </div>
                <ul className="record-list">
                  <div className="empty-list-box">
                    <img src={reading_glasses} alt="no data" className="empty-icon" />
                    <p>주문 내역이 없습니다.</p>
                  </div>
                </ul>
              </div>

              <div className="list-section">
                <div className="section-header">
                  <div>상품 리뷰 내역</div>
                  <a href="#">더보기 &gt;</a>
                </div>
                <ul className="record-list">
                  <div className="empty-list-box">
                    <img src={reading_glasses} alt="no data" className="empty-icon" />
                    <p>리뷰 내역이 없습니다.</p>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="footer">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MyPage;
