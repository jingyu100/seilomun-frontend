import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../css/customer/Store.css";
import api, { API_BASE_URL, S3_BASE_URL } from "../../api/config";

export default function StoreReview() {
  const { sellerId } = useParams(); // ✅ URL에서 sellerId 받기
  const [reviews, setReviews] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});

  const getFullUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : S3_BASE_URL + url;
  };

  const fetchReviews = async () => {
    try {
      const reviewsRes = await api.get(`/api/review/${sellerId}`, {
        params: { page: 0, size: 10 },
      });

      const reviewsData = reviewsRes.data.data?.["리뷰 조회"]?.reviews || [];
      setReviews(reviewsData);
    } catch (error) {
      console.error("❌ 리뷰 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    const fetchStoreName = async () => {
      try {
        const res = await api.get(`/api/sellers/${sellerId}`);
        setStoreName(res.data.data?.storeName || "해당 가게");
      } catch (error) {
        console.error("❌ 가게 이름 불러오기 실패:", error);
      }
    };

    if (sellerId) {
      fetchStoreName();
      fetchReviews();
    }
  }, [sellerId]);

  return (
    <div className="store-review">
      <div className="store-review-content">
        {reviews.length === 0 ? (
          <p className="no-reviews">아직 작성된 리뷰가 없습니다.</p>
        ) : (
          reviews.map((review, idx) => (
            <div key={idx} className="store-review-card">
              <div className="store-review-header">
                <img
                  src={getFullUrl(review.customerPhoto)}
                  alt="프로필"
                  className="store-customer-photo"
                />
                <div className="store-customer-name">{review.customerName}님</div>
                <div style={{ display: "flex" }}>
                  <div className="store-review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="store-review-rating">⭐ {review.rating} / 5</div>
              </div>

              <div className="store-review-products">
                <strong>구매 상품:</strong> {review.orderItems.join(", ")}
              </div>

              <div className="store-review-comment">{review.reviewContent}</div>
              {review.reviewPhotoUrls.length > 0 && (
                <div className="store-review-images">
                  {review.reviewPhotoUrls.map((url, i) => (
                    <img key={i} src={getFullUrl(url)} alt="리뷰 이미지" />
                  ))}
                </div>
              )}

              {review.comment?.content && (
                <div className="sellerStore-comment-box">
                  <strong>사장님 답글:</strong>
                  <p className="sellerStore-comment-text">{review.comment.content}</p>
                  <p className="sellerStore-comment-date-aa">
                    {new Date(review.comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
