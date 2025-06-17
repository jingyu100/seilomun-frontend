import React, { useEffect, useState } from "react";
import Seller_Header from "../../components/seller/Seller_Header.jsx";
import "../../css/seller/Seller_reviewPage.css";
import axios from "axios";

const Seller_reviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const sellerId = localStorage.getItem("sellerId");
      console.log("📌 sellerId:", sellerId);

      if (!sellerId) {
        alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
        return;
      }

      try {
        const sellerRes = await axios.get(`http://localhost/api/sellers/${sellerId}`, {
          withCredentials: true,
        });
        console.log("🏪 가게 응답:", sellerRes.data);
        setStoreName(sellerRes.data.data?.storeName || "내 가게");

        const reviewsRes = await axios.get(`http://localhost/api/review/${sellerId}`, {
          params: { page: 0, size: 10 },
          withCredentials: true,
        });

        console.log("📦 리뷰 전체 응답:", reviewsRes.data);
        const reviewsData = reviewsRes.data.data?.["리뷰 조회"]?.reviews || [];
        setReviews(reviewsData);
      } catch (error) {
        console.error("❌ 에러 (전체):", error);
        console.error("❌ error.response:", error.response);
        console.error("❌ error.message:", error.message);
      }
    };

    fetchData();
  }, []); // ✅ 딱 한 번 실행

  

  return (
    <div className="seller-review-page">
      <Seller_Header />
      <div className="review-content-wrapper">
        <h2 className="review-title">리뷰 관리</h2>

        {reviews.length === 0 ? (
          <p className="no-reviews">아직 작성된 리뷰가 없습니다.</p>
        ) : (
          reviews.map((review, idx) => (
            <div key={idx} className="review-card">
              <div className="review-header">
                <img src={review.customerPhoto} alt="프로필" className="customer-photo" />
                <div>
                  <div className="customer-name">{review.customerName}</div>
                  <div className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="review-rating">⭐ {review.rating} / 5</div>

              <div className="review-products">
                <strong>구매 상품:</strong> {review.orderItems.join(", ")}
              </div>

              <div className="review-content">{review.reviewContent}</div>

              {review.reviewPhotoUrls.length > 0 && (
                <div className="review-images">
                  {review.reviewPhotoUrls.map((url, i) => (
                    <img key={i} src={url} alt="리뷰 이미지" />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Seller_reviewPage;
