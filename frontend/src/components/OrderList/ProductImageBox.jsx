import React, { useState, useEffect } from "react";
import { S3_BASE_URL } from "../../api/config.js";

export default function ProductImageBox({
  imageUrl,
  altText = "상품 이미지",
  className = "item-image",
}) {
  // 이미지 URL 처리 함수
  const getImageUrl = (url) => {
    if (!url) return null;

    // 이미 완전한 URL인 경우 (http:// 또는 https://로 시작)
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // S3 키만 있는 경우 S3_BASE_URL을 앞에 붙임
    return `${S3_BASE_URL}${url}`;
  };

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showImage, setShowImage] = useState(false);

  // 실제 사용할 이미지 URL
  const finalImageUrl = getImageUrl(imageUrl);

  // 이미지 URL이 변경될 때마다 상태 초기화
  useEffect(() => {
    if (finalImageUrl) {
      setImageLoaded(false);
      setImageError(false);
      setShowImage(false);

      // 이미지 프리로드
      const img = new Image();
      img.onload = () => {
        setImageLoaded(true);
        setShowImage(true);
      };
      img.onerror = () => {
        setImageError(true);
        setShowImage(true);
      };
      img.src = finalImageUrl;
    } else {
      // 이미지 URL이 없으면 즉시 플레이스홀더 표시
      setShowImage(true);
    }
  }, [finalImageUrl]);

  return (
    <div className={className}>
      {!showImage ? (
        // 로딩 중일 때
        <div className="image-loading">
          <div className="loading-spinner"></div>
        </div>
      ) : imageError || !finalImageUrl ? (
        // 에러 또는 URL이 없을 때
        <div className="image-placeholder">
          <span>🖼️</span>
        </div>
      ) : (
        // 정상 이미지
        <img
          src={finalImageUrl}
          alt={altText}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          onError={() => {
            setImageError(true);
          }}
        />
      )}
    </div>
  );
}
