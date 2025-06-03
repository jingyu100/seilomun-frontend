// src/components/ProductPage/LikeButtonBox.jsx
import React, { useState, useEffect } from "react";
import LikeButton from "./LikeButton.jsx";

export default function LikeButtonBox({ productId }) {
  const [isLiked, setIsLiked] = useState(false);

  // 마운트 시: TODO – 실제 백엔드가 준비되면,
  // 로그인된 사용자가 이미 해당 상품을 좋아요 했는지 API 호출하여 초기 상태를 세팅하세요.
  useEffect(() => {
    // 예시:
    // axios.get(`/api/products/${productId}/likes/check`, { headers: { Authorization: ... } })
    //   .then(res => setIsLiked(res.data.data.isLiked))
    //   .catch(err => console.error("좋아요 상태 조회 실패", err));
  }, [productId]);

  const handleLikeClick = () => {
    // 1) 로컬 토글
    setIsLiked((prev) => !prev);

    // 2) TODO: 실제 백엔드 연동 시 아래처럼 호출
    // if (!isLiked) {
    //   axios.post(`/api/products/${productId}/likes`, {}, { headers: { Authorization: ... } })
    //     .then(res => console.log("좋아요 등록 완료"))
    //     .catch(err => console.error("좋아요 등록 실패", err));
    // } else {
    //   axios.delete(`/api/products/${productId}/likes`, { headers: { Authorization: ... } })
    //     .then(res => console.log("좋아요 취소 완료"))
    //     .catch(err => console.error("좋아요 취소 실패", err));
    // }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <LikeButton isLiked={isLiked} onClick={handleLikeClick} />
    </div>
  );
}
