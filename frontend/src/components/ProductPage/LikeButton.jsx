// src/components/ProductPage/LikeButton.jsx
import React from "react";

export default function LikeButton({ isLiked, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label={isLiked ? "좋아요 취소" : "좋아요"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        style={{ display: "block" }}
      >
        {/* 
          원 테두리 (r=11, strokeWidth=1.5) 
          → 11 + (1.5/2)=11.75 까지 그려져 뷰박스(0~24) 안에 완전히 들어옴 
        */}
        <circle cx="12" cy="12" r="11" fill="none" stroke="black" strokeWidth="1.5" />

        {/*
          하트(path)를 원 중심(12,12) 기준으로 0.6배 축소
          → 화면상에서 원과 하트의 테두리 굵기가 같게 보이도록 strokeWidth=2.5
             (사실상 2.5 × 0.6 ≈ 1.5가 됨)
          → 하트 자체는 r=11 원 내부에 충분히 들어오도록 되어 있습니다.
        */}
        <path
          transform="translate(12 12) scale(0.6) translate(-12 -12)"
          d="
            M12 21.35
            L10.55 19.99
            C5.4 15.36 2 12.28 2 8.5
            C2 5.42 4.42 3 7.5 3
            C9.24 3 11.07 4.09 12 5.5
            C12.93 4.09 14.76 3 16.5 3
            C19.58 3 22 5.42 22 8.5
            C22 12.28 18.6 15.36 13.45 19.99
            L12 21.35
            Z
          "
          fill={isLiked ? "red" : "none"}
          stroke={isLiked ? "red" : "black"}
          strokeWidth="2.5"
          style={{
            transition: "fill 0.3s ease, stroke 0.3s ease",
          }}
        />
      </svg>
    </button>
  );
}
