import React, { useEffect, useState } from "react";
import Seller_Header from "../../components/seller/Seller_Header.jsx";
import "../../css/seller/Seller_reviewPage.css";
import api, { API_BASE_URL } from "../../api/config.js";

const Seller_reviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [commentInputs, setCommentInputs] = useState({});

  const getFullUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http")
      ? url
      : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${url}`;
  };

  // 답글 내용 변경 핸들러
  const handleCommentChange = (reviewId, text) => {
    setCommentInputs((prev) => ({ ...prev, [reviewId]: text }));
  };

  // 리뷰 다시 불러오기
  const fetchReviews = async (sellerId) => {
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

  // 답글 등록 핸들러
  const handleSubmitComment = async (reviewId) => {
    try {
      const content = commentInputs[reviewId];
      if (!content || content.trim() === "") return;

      const res = await api.post(`/api/review/comment/${reviewId}`, {
        reviewComment: content,
      });

      console.log("✅ 댓글 등록 성공:", res.data);
      alert("답글이 등록되었습니다.");
      setCommentInputs((prev) => ({ ...prev, [reviewId]: "" }));

      const sellerId = localStorage.getItem("sellerId");
      if (sellerId) await fetchReviews(sellerId); // 댓글 등록 후 리뷰 새로 불러오기
    } catch (err) {
      console.error("❌ 댓글 등록 실패:", err);
      console.error("📛 응답 내용:", err.response?.data);
    }
  };

  // 초기 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      const sellerId = localStorage.getItem("sellerId");
      console.log("📌 sellerId:", sellerId);

      if (!sellerId) {
        alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
        return;
      }

      try {
        const sellerRes = await api.get(`/api/sellers/${sellerId}`);
        setStoreName(sellerRes.data.data?.storeName || "내 가게");

        await fetchReviews(sellerId);
      } catch (error) {
        console.error("❌ 에러 (전체):", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="seller-review-page">
      <Seller_Header />
      <div className="review-content-wrapper">
        <div className="status-review-header">
          <h1 className="review-title">리뷰 관리</h1>
          <p className="review-subtitle">소비자의 리뷰를 확인 및 답글을 등록해보세요</p>
        </div>

        {reviews.length === 0 ? (
          <p className="no-reviews">아직 작성된 리뷰가 없습니다.</p>
        ) : (
          reviews.map((review, idx) => {
            console.log("🔍 리뷰 객체 확인:", review);

            return (
              <div key={idx} className="review-card">
                <div className="review-header">
                  <img
                    src={getFullUrl(review.customerPhoto)}
                    alt="프로필"
                    className="customer-photo"
                  />
                  <div className="customer-name">{review.customerName}님</div>
                  <div>
                    <div className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                    <div className="review-rating">⭐ {review.rating} / 5</div>
                  </div>
                </div>

                <div className="review-products">
                  <strong>구매 상품:</strong> {review.orderItems.join(", ")}
                </div>

                <div className="review-content">{review.reviewContent}</div>
                {review.reviewPhotoUrls.length > 0 && (
                  <div className="review-images">
                    {review.reviewPhotoUrls.map((url, i) => (
                      <img key={i} src={getFullUrl(url)} alt="리뷰 이미지" />
                    ))}
                  </div>
                )}

                {/* 등록된 답글 표시 */}
                {review.comment?.content && (
                  <div className="seller-comment-box">
                    <strong>사장님 답글:</strong>
                    <p className="seller-comment-text">{review.comment.content}</p>
                    <p className="seller-comment-date-aa">
                      {new Date(review.comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* 답글 입력창 (이미 등록된 답글이 없을 경우에만 표시) */}
                {!review.comment && (
                  <div className="comment-section">
                    <textarea
                      placeholder="답글을 입력하세요"
                      className="comment-input"
                      value={commentInputs[review.reviewId] || ""}
                      onChange={(e) =>
                        handleCommentChange(review.reviewId, e.target.value)
                      }
                    />
                    <button
                      className="comment-submit-btn"
                      onClick={() => handleSubmitComment(review.reviewId)}
                    >
                      등록
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Seller_reviewPage;
