import React, { useState, useEffect } from "react";
import { S3_BASE_URL } from "../../api/config.js";

export default function ProductImageBox({
  imageUrl,
  altText = "상품 이미지",
  className = "item-image",
}) {
  // 🔍 디버깅: 받은 props 확인
  console.log("🖼️ ProductImageBox props:", {
    imageUrl,
    altText,
    imageUrlType: typeof imageUrl,
    hasImageUrl: !!imageUrl,
  });

  // 이미지 URL 처리 함수
  const getImageUrl = (url) => {
    if (!url) {
      console.log("❌ imageUrl이 없음:", url);
      return null;
    }

    // 이미 완전한 URL인 경우 (http:// 또는 https://로 시작)
    if (url.startsWith("http://") || url.startsWith("https://")) {
      console.log("✅ 완전한 URL:", url);
      return url;
    }

    // S3 키만 있는 경우 S3_BASE_URL을 앞에 붙임
    const fullUrl = `${S3_BASE_URL}${url}`;
    console.log("🔗 S3 URL 생성:", fullUrl);
    return fullUrl;
  };

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showImage, setShowImage] = useState(false);

  // 실제 사용할 이미지 URL
  const finalImageUrl = getImageUrl(imageUrl);

  console.log("🎯 최종 이미지 URL:", finalImageUrl);

  // 이미지 URL이 변경될 때마다 상태 초기화
  useEffect(() => {
    console.log("🔄 useEffect 실행 - finalImageUrl:", finalImageUrl);

    if (finalImageUrl) {
      setImageLoaded(false);
      setImageError(false);
      setShowImage(false);

      console.log("⏳ 이미지 프리로딩 시작:", finalImageUrl);

      // 이미지 프리로드
      const img = new Image();
      img.onload = () => {
        console.log("✅ 이미지 로드 성공:", finalImageUrl);
        setImageLoaded(true);
        setShowImage(true);
      };
      img.onerror = () => {
        console.log("❌ 이미지 로드 실패:", finalImageUrl);
        setImageError(true);
        setShowImage(true);
      };
      img.src = finalImageUrl;
    } else {
      // 이미지 URL이 없으면 즉시 플레이스홀더 표시
      console.log("📋 URL 없음 - 플레이스홀더 표시");
      setShowImage(true);
    }
  }, [finalImageUrl]);

  // 현재 상태 로깅
  console.log("📊 현재 상태:", {
    showImage,
    imageError,
    imageLoaded,
    finalImageUrl: !!finalImageUrl,
  });

  return (
    <div className={className}>
      {!showImage ? (
        // 로딩 중일 때
        <div className="image-loading">
          <div className="loading-spinner"></div>
          <div style={{ fontSize: "10px", marginTop: "4px" }}>로딩중...</div>
        </div>
      ) : imageError || !finalImageUrl ? (
        // 에러 또는 URL이 없을 때
        <div className="image-placeholder">
          <span>🖼️</span>
          <div style={{ fontSize: "8px", marginTop: "2px" }}>
            {!finalImageUrl ? "URL없음" : "로드실패"}
          </div>
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
            console.log("❌ 실제 img 태그에서 에러:", finalImageUrl);
            setImageError(true);
          }}
        />
      )}
    </div>
  );
}
