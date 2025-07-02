import React, { useState } from "react";
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

  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // 이미지 로드 에러 처리
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  // 이미지 로드 완료 처리
  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // 기본 이미지나 플레이스홀더 이미지 경로
  const defaultImage = "/images/default-product.png"; // public/images/ 폴더에 기본 이미지 추가

  // 실제 사용할 이미지 URL
  const finalImageUrl = getImageUrl(imageUrl);

  return (
    <div className={className}>
      {imageLoading && (
        <div className="image-loading">
          <div className="loading-spinner"></div>
        </div>
      )}

      {imageError || !finalImageUrl ? (
        <div className="image-placeholder">
          <img
            src={defaultImage}
            alt="기본 상품 이미지"
            onError={() => {
              // 기본 이미지도 로드 실패시 텍스트 표시
            }}
          />
        </div>
      ) : (
        <img
          src={finalImageUrl}
          alt={altText}
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: imageLoading ? "none" : "block",
          }}
        />
      )}
    </div>
  );
}
