import React, { useEffect, useState } from "react";
import axios from "axios";
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
  const [point, setPoint] = useState(0); // ✅ 포인트 상태 추가
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get("http://localhost/api/customers", {
          withCredentials: true,
        });
  
        const customer = res.data?.data?.customer;
        const points = customer?.points ?? 0;
        const profileImageFileName = customer?.profileImageUrl;
  
        setPoint(points);
  
        if (profileImageFileName) {
          const fullUrl = profileImageFileName.startsWith("http")
            ? profileImageFileName
            : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${profileImageFileName}`; // ✅ 실제 버킷 URL로 변경
          console.log("📷 프로필 이미지 전체 URL:", fullUrl);
          setProfileImage(fullUrl);
        }
      } catch (error) {
        console.error("고객 정보 불러오기 실패:", error);
      }
    };
  
    fetchCustomer();
  }, []);


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
                  주문목록
                </li>
                <li onClick={() => window.location.href = '/Customer_refund'}>
                  환불/입금 내역
                  </li>
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

          <div className="mypage-center">
            <div className="user-info-box">
              <div className="user-left">
              <img
                src={profileImage ? profileImage : logo}
                alt="프로필"
                className="user-profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = logo;
                }}
              />
                <h3>{userName} 고객님 반갑습니다.</h3>
              </div>
              <div className="user-right">
                <a href="/Change_dataPage" className="info-link">
                  회원정보변경 &gt;
                </a>
              </div>
            </div>

            <div
              className="point-box"
              onClick={() => (window.location.href = "/Customer_point")}
              style={{ cursor: "pointer" }} 
            >
              세일로문 포인트 <span className="highlight">{point}</span> P &gt;
            </div>

            <div className="mypage-list-box">
              <div className="list-section">
                <div className="section-header">
                  <div>환불/입금 내역</div>
                  <a href="#">더보기 &gt;</a>
                </div>
                <ul className="record-list">
                  <div className="empty-list-box">
                    <img src={reading_glasses} alt="no data" className="empty-icon" />
                    <p>환불/입금내역이 없습니다.</p>
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
