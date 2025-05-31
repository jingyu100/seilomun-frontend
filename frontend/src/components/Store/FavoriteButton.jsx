import React from "react";

export default function FavoriteButton({ isFavorite, onClick }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}
    >
      <span
        style={{
          fontSize: "15px",
          color: "black",
          userSelect: "none",
        }}
      >
        즐겨찾기
      </span>
      <button
        className="storeInfo-btn"
        onClick={onClick}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          width: "20px",
          height: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          outline: "none",
        }}
        aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      >
        {/* 하트 SVG: 모양은 그대로, 색상만 토글 */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={isFavorite ? "#e64545" : "none"}
          stroke={isFavorite ? "#e64545" : "#bdbdbd"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: "fill 0.15s, stroke 0.15s",
            display: "block",
          }}
        >
          <path d="M12 21s-5.7-4.59-8.42-7.31A5.28 5.28 0 0 1 3.31 6.2a5.13 5.13 0 0 1 7.24.14L12 7.1l1.45-1.03a5.13 5.13 0 0 1 7.24-.14a5.28 5.28 0 0 1-.27 7.49C17.7 16.41 12 21 12 21z" />
        </svg>
      </button>
    </div>
  );
}
