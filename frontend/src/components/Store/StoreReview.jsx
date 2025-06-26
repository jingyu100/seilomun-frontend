import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../css/customer/Store.css";
import axios from "axios";

export default function StoreReview() {
  const { sellerId } = useParams(); // ✅ URL에서 sellerId 받기
  const [reviews, setReviews] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});

  const getFullUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http")
      ? url
      : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${url}`;
  };

  const fetchReviews = async () => {
    try {
      const reviewsRes = await axios.get(`http://3.39.239.179/api/review/${sellerId}`, {
        params: { page: 0, size: 10 },
        withCredentials: true,
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
        const res = await axios.get(`http://3.39.239.179/api/sellers/${sellerId}`, {
          withCredentials: true,
        });
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
                <div style={{ display: "flex", }}>
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
