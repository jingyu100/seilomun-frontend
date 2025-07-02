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

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    return `${S3_BASE_URL}${url}`;
  };

  // 단순화된 상태 관리
  const [imageStatus, setImageStatus] = useState("loading"); // 'loading', 'loaded', 'error'

  const finalImageUrl = getImageUrl(imageUrl);

  useEffect(() => {
    if (!finalImageUrl) {
      setImageStatus("error");
      return;
    }

    setImageStatus("loading");

    // 이미지 프리로드
    const img = new Image();

    img.onload = () => {
      setImageStatus("loaded");
    };

    img.onerror = () => {
      setImageStatus("error");
    };

    img.src = finalImageUrl;

    // cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [finalImageUrl]);

  // 조건부 렌더링 최적화
  if (imageStatus === "loading") {
    return (
      <div className={className}>
        <div className="image-loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (imageStatus === "error" || !finalImageUrl) {
    return (
      <div className={className}>
        <div className="image-placeholder">
          <span>🖼️</span>
        </div>
      </div>
    );
  }

  // imageStatus === 'loaded'
  return (
    <div className={className}>
      <img
        src={finalImageUrl}
        alt={altText}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
        onError={() => setImageStatus("error")}
      />
    </div>
  );
}
