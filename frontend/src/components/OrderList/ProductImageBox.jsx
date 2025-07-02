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

  // 단순화된 상태 관리 - 하나의 상태로 모든 것을 제어
  const [imageStatus, setImageStatus] = useState("loading"); // 'loading', 'loaded', 'error'

  const finalImageUrl = getImageUrl(imageUrl);

  useEffect(() => {
    console.log("🔄 ProductImageBox useEffect 실행:", {
      imageUrl,
      finalImageUrl,
      hasUrl: !!finalImageUrl,
    });

    if (!finalImageUrl) {
      console.log("❌ URL 없음 - 에러 상태로 설정");
      setImageStatus("error");
      return;
    }

    setImageStatus("loading");
    console.log("⏳ 이미지 로딩 시작:", finalImageUrl);

    // 이미지 프리로드
    const img = new Image();

    img.onload = () => {
      console.log("✅ 이미지 로드 성공:", finalImageUrl);
      setImageStatus("loaded");
    };

    img.onerror = () => {
      console.log("❌ 이미지 로드 실패:", finalImageUrl);
      setImageStatus("error");
    };

    img.src = finalImageUrl;

    // cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [finalImageUrl]);

  console.log("📊 현재 렌더링 상태:", {
    imageStatus,
    finalImageUrl: !!finalImageUrl,
  });

  // 조건부 렌더링 - 명확한 분기
  if (imageStatus === "loading") {
    console.log("🔄 로딩 상태 렌더링");
    return (
      <div className={className}>
        <div className="image-loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (imageStatus === "error" || !finalImageUrl) {
    console.log("❌ 에러 상태 렌더링");
    return (
      <div className={className}>
        <div className="image-placeholder">
          <span>🖼️</span>
        </div>
      </div>
    );
  }

  // imageStatus === 'loaded'
  console.log("✅ 이미지 렌더링:", finalImageUrl);
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
        onError={() => {
          console.log("❌ img 태그에서 에러 발생:", finalImageUrl);
          setImageStatus("error");
        }}
      />
    </div>
  );
}
