// src/components/EmptyWishList.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

export default function EmptyWishList() {
  const navigate = useNavigate();

  return (
    <div
      className="empty-wishlist"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "100px",
        color: "#333",
      }}
    >
      <h2 style={{ marginBottom: "8px" }}>찜한 상품이 없습니다.</h2>
      <p style={{ marginBottom: "16px", fontSize: "14px", color: "#666" }}>
        위시리스트에 물건을 담아보세요
      </p>
      <button
        onClick={() => navigate("/products")}
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        오늘의 임박상품 보기 &gt;
      </button>
    </div>
  );
}
