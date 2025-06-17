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
      if (!sellerId) return;

      try {
        // 가게명 불러오기
        const sellerRes = await axios.get("/api/sellers/me", {
          withCredentials: true,
        });
        setStoreName(sellerRes.data.data?.storeName || "내 가게");

        // 리뷰 목록 불러오기
        const reviewsRes = await axios.get(`/api/reviews/${sellerId}`, {
          params: { page: 0, size: 10 },
          withCredentials: true,
        });
        setReviews(reviewsRes.data["리뷰 조회"]?.reviews || []);
      } catch (error) {
        console.error("리뷰 또는 가게 정보 불러오기 실패:", error);
      }
    };

    fetchData();
  }, []);

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
