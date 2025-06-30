// ReviewForm.jsx - 리뷰 작성 기능 포함 (수정됨)
import { useState } from "react";
import "./ReviewForm.css";
import api, { API_BASE_URL } from "../api/config.js";

// ✅ onReviewComplete props 추가
export default function ReviewForm({ order, onCancel, onReviewComplete }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);

  const handleRating = (score) => setRating(score);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      alert("사진은 최대 5장까지 업로드할 수 있습니다.");
      return;
    }

    // 파일을 객체로 저장하여 미리보기와 실제 파일을 모두 관리
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isNew: true,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleImageRemove = (index) => {
    setImages((prev) => {
      const newImages = [...prev];
      // 미리보기 URL 해제
      if (newImages[index].url && newImages[index].isNew) {
        URL.revokeObjectURL(newImages[index].url);
      }
      newImages.splice(index, 1);
      return newImages;
    });
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
      // FormData 생성
      const formData = new FormData();

      // 리뷰 데이터를 JSON으로 추가
      const reviewData = {
        rating,
        reviewContent: text.trim(),
      };

      // JSON 데이터를 Blob으로 변환하여 추가
      formData.append(
        "review",
        new Blob([JSON.stringify(reviewData)], {
          type: "application/json",
        })
      );

      // 사진 파일들 추가
      images.forEach((image) => {
        if (image.file) {
          formData.append("photos", image.file);
        }
      });

      await api.post(`/api/review/${order.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("리뷰가 등록되었습니다.");

      // 미리보기 URL 정리
      images.forEach((image) => {
        if (image.url && image.isNew) {
          URL.revokeObjectURL(image.url);
        }
      });

      // ✅ 리뷰 완료 콜백 호출 (즉시 상태 업데이트)
      if (onReviewComplete) {
        onReviewComplete(); // 부모 컴포넌트에서 isReview 상태를 true로 변경
      } else {
        onCancel(); // 혹시 콜백이 없으면 기본 동작
      }
    } catch (err) {
      console.error("리뷰 등록 실패:", err);
      alert("리뷰 등록에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    // 미리보기 URL 정리
    images.forEach((image) => {
      if (image.url && image.isNew) {
        URL.revokeObjectURL(image.url);
      }
    });
    onCancel();
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
            src={order.photoUrl || "/images/placeholder.png"}
            className="review-thumbnail"
            alt="상품 이미지"
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

          {/* 업로드된 이미지 미리보기 */}
          {images.length > 0 && (
            <div
              className="image-preview-container"
              style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "8px" }}
            >
              {images.map((image, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img
                    src={image.url}
                    alt={`리뷰 이미지 ${index + 1}`}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      background: "rgba(0,0,0,0.7)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      fontSize: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="내용 : 1000자 이내로 작성해주세요"
          maxLength={1000}
        />
      </div>

      <div className="review-footer">
        <button onClick={handleCancel}>취소하기</button>
        <button onClick={handleSubmit}>등록하기</button>
      </div>

      <div className="review-tip">리뷰 작성 시 즉시 포인트 적립!</div>
    </div>
  );
}
