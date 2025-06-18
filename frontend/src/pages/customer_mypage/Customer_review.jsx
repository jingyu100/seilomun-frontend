import React, { useEffect, useState } from "react";
import "../../css/customer_mypage/Customer_review.css";
import Footer from "../../components/Footer.jsx";
import Header from "../../components/Header.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";
import axios from "axios";

export default function Customer_review() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const res = await axios.get("http://localhost/api/review/myReviews", {
          params: { page: 0, size: 10 },
          withCredentials: true,
        });
        const data = res.data.data["내가 쓴 리뷰"];
        setReviews(data.myReviews);
      } catch (err) {
        console.error("❌ 리뷰 조회 실패:", err);
      }
    };

    fetchMyReviews();
  }, []);

  return (
    <div>
      <div className="header">
        <Header />
      </div>

      <div className="body">
        <SideMenuBtn />

        <div className="mypage-container">
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
                <li onClick={() => window.location.href = '/change_datapage'}>회원정보 변경</li>
                <li onClick={() => window.location.href = '/Delivery_destination'}>배송지 관리</li>
              </ul>
            </div>
            <div className="sidebar-section">
              <div className="title-lg">혜택관리</div>
              <ul>
                <li onClick={() => window.location.href = '/Customer_point'}>적립내역</li>
              </ul>
            </div>
            <div className="sidebar-section">
              <div className="title-lg">리뷰관리</div>
              <ul>
                <li onClick={() => window.location.href = '/Customer_review'}>리뷰관리</li>
              </ul>
            </div>
          </aside>

          <div className="mypage-review">
            <h2 className="mypage-review-text">내가 작성한 리뷰</h2>
            {reviews.length === 0 ? (
              <p>작성한 리뷰가 없습니다.</p>
            ) : (
              <ul>
                {reviews.map((review) => (
                  <div key={review.reviewId} className="mypage-review-box">
                    <div className="customer-review-storename">{review.storeName}</div>
                    <div className="customer-review-rating">⭐ {review.rating} / 5</div>
                    {review.orderItems && (
                      <p><strong>주문상품 : </strong> {review.orderItems.join(", ")}</p>
                    )}
                    {review.reviewPhotoUrls.length > 0 && (
                      <div className="mypage-review-images">
                        {review.reviewPhotoUrls.map((url, idx) => (
                          <img key={idx} src={`https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${url}`} alt="리뷰 이미지" />
                        ))}
                      </div>
                    )}                      
                    <div className="customer-review-content">{review.reviewContent}</div>

                    {review.comment && (
                      <div className="mypage-review-comment">
                        <strong>판매자님의 답글 : </strong> {review.comment.content}
                      </div>
                    )}
                  </div>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="footer">
          <Footer />
        </div>
      </div>
    </div>
  );
}
