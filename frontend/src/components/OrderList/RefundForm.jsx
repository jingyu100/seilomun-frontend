// RefundForm.jsx - 환불 신청 폼 컴포넌트 (수정됨)
import { useState } from "react";
import "./RefundForm.css";
import api, { API_BASE_URL } from "../api/config.js";

export default function RefundForm({ order, onCancel }) {
  const [refundType, setRefundType] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refundTypes = [
    { value: "DEFECTIVE", label: "상품 불량" },
    { value: "DIFFERENT", label: "상품 상이" },
    { value: "DAMAGED", label: "배송 중 파손" },
    { value: "LATE_DELIVERY", label: "배송 지연" },
    { value: "CHANGE_MIND", label: "단순 변심" },
    { value: "OTHER", label: "기타" },
  ];

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 5) {
      alert("사진은 최대 5장까지 업로드할 수 있습니다.");
      return;
    }

    // 파일을 URL로 변환하여 미리보기 생성
    const newPhotos = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isNew: true,
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handlePhotoRemove = (index) => {
    setPhotos((prev) => {
      const newPhotos = [...prev];
      // 미리보기 URL 해제
      if (newPhotos[index].url && newPhotos[index].isNew) {
        URL.revokeObjectURL(newPhotos[index].url);
      }
      newPhotos.splice(index, 1);
      return newPhotos;
    });
  };

  const handleSubmit = async () => {
    // 유효성 검사
    if (!refundType) {
      alert("환불 사유를 선택해주세요.");
      return;
    }

    if (!title.trim()) {
      alert("환불 제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("환불 상세 내용을 입력해주세요.");
      return;
    }

    if (content.length > 1000) {
      alert("환불 내용은 1000자 이내로 작성해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // FormData 생성
      const formData = new FormData();

      // 환불 데이터를 JSON으로 추가
      const refundData = {
        refundType,
        title: title.trim(),
        content: content.trim(),
      };

      // JSON 데이터를 Blob으로 변환하여 추가
      formData.append(
        "refund",
        new Blob([JSON.stringify(refundData)], {
          type: "application/json",
        })
      );

      // 사진 파일들 추가
      photos.forEach((photo) => {
        if (photo.file) {
          formData.append("photos", photo.file);
        }
      });

      // 환불 신청 API 호출
      await api.post(`/api/orders/refund/${order.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("환불 신청이 완료되었습니다.");

      // 미리보기 URL 정리
      photos.forEach((photo) => {
        if (photo.url && photo.isNew) {
          URL.revokeObjectURL(photo.url);
        }
      });

      onCancel(); // 환불 신청 완료 후 원래 화면으로 돌아가기
    } catch (error) {
      console.error("환불 신청 실패:", error);

      let errorMessage = "환불 신청에 실패했습니다.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = "잘못된 요청입니다. 입력 정보를 확인해주세요.";
      } else if (error.response?.status === 404) {
        errorMessage = "주문 정보를 찾을 수 없습니다.";
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // 미리보기 URL 정리
    photos.forEach((photo) => {
      if (photo.url && photo.isNew) {
        URL.revokeObjectURL(photo.url);
      }
    });
    onCancel();
  };

  return (
    <div className="refund-form">
      {/* 상단 정보 */}
      <div className="refund-top-info">
        <div className="refund-date">{order.date}</div>
        <div className="refund-status">환불 신청</div>
      </div>

      {/* 상품 정보 */}
      <div className="refund-header">
        <div className="refund-product-wrapper">
          <img
            src={order.photoUrl || "/images/placeholder.png"}
            className="refund-thumbnail"
            alt="상품 이미지"
          />
          <div className="refund-product-info">
            <strong>{order.store}</strong>
            <div className="refund-product-name">{order.name}</div>
            <div className="refund-product-price">{order.price?.toLocaleString()}원</div>
          </div>
        </div>
      </div>

      {/* 환불 사유 선택 */}
      <div className="refund-form-section">
        <div className="refund-form-title">환불 사유 *</div>
        <div className="refund-type-selection">
          {refundTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              className={`refund-type-btn ${refundType === type.value ? "active" : ""}`}
              onClick={() => setRefundType(type.value)}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* 환불 제목 */}
      <div className="refund-form-section">
        <div className="refund-input-group">
          <label className="refund-input-label">환불 제목 *</label>
          <input
            type="text"
            className="refund-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="환불 제목을 입력해주세요"
            maxLength={30}
          />
          <div className="char-count">{title.length}/30</div>
        </div>
      </div>

      {/* 환불 상세 내용 */}
      <div className="refund-form-section">
        <div className="refund-input-group">
          <label className="refund-input-label">환불 상세 내용 *</label>
          <textarea
            className="refund-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="환불 사유를 상세히 작성해주세요&#10;&#10;예시:&#10;- 상품이 설명과 달라요&#10;- 배송 중 파손되었어요&#10;- 다른 상품이 왔어요"
            maxLength={1000}
          />
          <div className="char-count">{content.length}/1000</div>
        </div>
      </div>

      {/* 사진 첨부 */}
      <div className="refund-form-section">
        <div className="refund-photo-section">
          <div className="refund-form-title">사진 첨부 (선택사항)</div>
          <div className="refund-photo-upload">
            {photos.map((photo, index) => (
              <div key={index} className="refund-photo-box has-image">
                <img
                  src={photo.url}
                  alt={`환불 사진 ${index + 1}`}
                  className="refund-photo-preview"
                />
                <button
                  type="button"
                  className="refund-photo-remove"
                  onClick={() => handlePhotoRemove(index)}
                >
                  ×
                </button>
              </div>
            ))}

            {photos.length < 5 && (
              <label className="refund-photo-box">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handlePhotoUpload}
                />
                <div>📷</div>
              </label>
            )}
          </div>
          <div className="refund-photo-info">
            사진은 최대 5장까지 업로드할 수 있습니다. ({photos.length}/5)
          </div>
        </div>
      </div>

      {/* 주의사항 */}
      <div className="refund-warning">
        <strong>환불 신청 전 확인사항</strong>
        <br />
        • 환불은 판매자 승인 후 처리됩니다
        <br />
        • 단순 변심의 경우 환불이 거절될 수 있습니다
        <br />• 허위 신청 시 서비스 이용이 제한될 수 있습니다
      </div>

      {/* 버튼 */}
      <div className="refund-footer">
        <button
          type="button"
          className="refund-cancel-btn"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          취소하기
        </button>
        <button
          type="button"
          className="refund-submit-btn"
          onClick={handleSubmit}
          disabled={isSubmitting || !refundType || !title.trim() || !content.trim()}
        >
          {isSubmitting ? "신청 중..." : "환불 신청"}
        </button>
      </div>
    </div>
  );
}
