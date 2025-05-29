// ReviewForm.jsx - 리뷰 작성 기능 포함 (JSON 방식)
import { useState } from "react";
import axios from "axios";
import "./ReviewForm.css";

export default function ReviewForm({ order, onCancel }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [images, setImages] = useState([]); // 백엔드에서 이미지 안 받으면 제거해도 됨

  const handleRating = (score) => setRating(score);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) return;
    setImages([...images, ...files]);
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    if (rating < 1 || rating > 5) {
      alert("별점을 선택해주세요.");
      return;
    }
    try {
      await axios.post(
        `http://localhost/api/review/${order.id}`,
        {
          rating,
          reviewContent: text.trim(),
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("리뷰가 등록되었습니다.");
      onCancel();
    } catch (err) {
      console.error("리뷰 등록 실패:", err);
      alert("리뷰 등록에 실패했습니다.");
    }
  };

  return (
    <div className="review-form">
      <div className="review-top-info">
        <div className="review-date">{order.date}</div>
        <div className="review-status">주문 완료</div>
      </div>
      <div className="review-header">
        <div className="review-store-wrapper">
          <img
            src={order.photoUrl || "/images/placeholder.png"} // 없으면 기본 이미지
            className="review-thumbnail"
          />

          <div className="review-store">
            <strong>{order.store}</strong>
            <div className="review-product">{order.name}</div>
            <div className="review-price">{order.price}원</div>
          </div>
        </div>
        <div className="review-stars">
          <label>별점:</label>
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              onClick={() => handleRating(n)}
              className={rating >= n ? "star active" : "star"}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <div className="review-body">
        <div className="image-upload">
          <label htmlFor="image-upload">
            <div className="image-box">📷</div>
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => document.getElementById("image-upload").click()}
            className="image-upload-button"
          >
            사진 첨부하기
          </button>
          <div className="image-count">{images.length}/5</div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="내용 : 1000자 이내로 작성해주세요"
          maxLength={1000}
        />
      </div>

      <div className="review-footer">
        <button onClick={onCancel}>취소하기</button>
        <button onClick={handleSubmit}>등록하기</button>
      </div>

      <div className="review-tip">리뷰 작성 시 즉시 포인트 적립!</div>
    </div>
  );
}
