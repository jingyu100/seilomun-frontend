import React, { useState } from "react";
import "./ProductImageBox.css";

export default function ProductImageBox({
  imageUrl,
  altText = "상품 이미지",
  className = "item-image",
}) {
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

  return (
    <div className={className}>
      {imageLoading && (
        <div className="image-loading">
          <div className="loading-spinner"></div>
        </div>
      )}

      {imageError || !imageUrl ? (
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
          src={imageUrl}
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
