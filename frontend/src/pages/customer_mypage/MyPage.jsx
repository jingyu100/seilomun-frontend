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
  const { user } = useLogin();
  const userName = user?.nickname || "회원";
  const [point, setPoint] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [recentReviews, setRecentReviews] = useState([]);
  const [recentPoints, setRecentPoints] = useState([]); // ✅ 포인트 내역

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get("http://3.39.239.179/api/customers", {
          withCredentials: true,
        });

        const customer = res.data?.data?.customer;
        const points = customer?.points ?? 0;
        const profileImageFileName = customer?.profileImageUrl;

        setPoint(points);

        if (profileImageFileName) {
          const fullUrl = profileImageFileName.startsWith("http")
            ? profileImageFileName
            : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${profileImageFileName}`;
          setProfileImage(fullUrl);
        }
      } catch (error) {
        console.error("고객 정보 불러오기 실패:", error);
      }
    };

    const fetchRecentReviews = async () => {
      try {
        const res = await axios.get("http://3.39.239.179/api/review/myReviews", {
          params: { page: 0, size: 5 },
          withCredentials: true,
        });
        const data = res.data.data["내가 쓴 리뷰"];
        setRecentReviews(data.myReviews || []);
      } catch (err) {
        console.error("최근 리뷰 불러오기 실패:", err);
      }
    };

    const fetchRecentPoints = async () => {
      try {
        const res = await axios.get("http://3.39.239.179/api/customers/points", {
          withCredentials: true,
        });
        const data = res.data?.data?.pointHistory || [];
        const sorted = [...data].sort(
          (a, b) => new Date(b.createTime) - new Date(a.createTime)
        );
        setRecentPoints(sorted.slice(0, 8));
      } catch (err) {
        console.error("포인트 내역 조회 실패:", err);
      }
    };

    fetchCustomer();
    fetchRecentReviews();
    fetchRecentPoints(); // ✅ 실행
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
            <div onClick={() => (window.location.href = "/mypage")} className="title-xl">마이페이지</div>
            <div className="sidebar-section">
              <div className="title-lg">쇼핑정보</div>
              <ul>
                <li onClick={() => (window.location.href = "/OrderList")}>주문목록</li>
                <li onClick={() => (window.location.href = "/Customer_refund")}>환불/입금 내역</li>
              </ul>
            </div>
            <div className="sidebar-section">
              <div className="title-lg">회원정보</div>
              <ul>
                <li onClick={() => (window.location.href = "/change_datapage")}>회원정보 변경</li>
                <li onClick={() => (window.location.href = "/Delivery_destination")}>배송지 관리</li>
              </ul>
            </div>
            <div className="sidebar-section">
              <div className="title-lg">혜택관리</div>
              <ul>
                <li onClick={() => (window.location.href = "/Customer_point")}>적립내역</li>
              </ul>
            </div>
            <div className="sidebar-section">
              <div className="title-lg">리뷰관리</div>
              <ul>
                <li onClick={() => (window.location.href = "/Customer_review")}>리뷰관리</li>
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

            <div className="mypage-list-box-mypage">
              {/* ✅ 적립내역 */}
              <div className="list-section-mypage">
                <div className="section-header-mypage">
                  <div>적립내역</div>
                  <a href="/Customer_point">더보기 &gt;</a>
                </div>
                <ul className="record-list-mypage">
                  {recentPoints.length === 0 ? (
                    <div className="empty-list-box-mypage">
                      <img src={reading_glasses} alt="no data" className="empty-icon" />
                      <p>적립내역이 없습니다.</p>
                    </div>
                  ) : (
                    recentPoints.map((item) => (
                      <li key={item.pointId} style={{ marginTop: "3px", display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                        <span>
                          {new Date(item.createTime).toLocaleDateString("ko-KR", {
                            year: "2-digit",
                            month: "2-digit",
                            day: "2-digit",
                          })}
                        </span>
                        <span style={{ color: item.pointType === 'C' || item.pointType === 'U' ? 'red' : 'black' }}>
                          {item.pointAmount.toLocaleString()}P
                        </span>
                        <span>
                          {item.pointType === 'A'
                            ? '적립'
                            : item.pointType === 'U'
                            ? '사용'
                            : item.pointType === 'C'
                            ? '취소 환수'
                            : '기타'}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              {/* ✅ 상품 리뷰 내역 */}
              <div className="list-section-mypage">
                <div className="section-header-mypage">
                  <div>상품 리뷰 내역</div>
                  <a href="/Customer_review">더보기 &gt;</a>
                </div>
                <ul className="record-list-mypage">
                  {recentReviews.length === 0 ? (
                    <div className="empty-list-box-mypage">
                      <img src={reading_glasses} alt="no data" className="empty-icon" />
                      <p>리뷰 내역이 없습니다.</p>
                    </div>
                  ) : (
                    recentReviews.map((review) => (
                      <li key={review.reviewId}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                            <div className="mypage-review-storename">{review.storeName}</div>
                            <div className="mypage-review-rating">⭐ {review.rating} / 5</div>
                            <div className="date-number">
                              {new Date(review.createdAt).toLocaleDateString("ko-KR", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              }).replace(/\./g, "-").replace(/\s/g, "")}
                            </div>
                          </div>
                          <div className="mypage-review-content">
                            {review.reviewContent.length > 10
                              ? review.reviewContent.slice(0, 10) + "..."
                              : review.reviewContent}
                          </div>
                        </div>
                      </li>
                    ))
                  )}
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
