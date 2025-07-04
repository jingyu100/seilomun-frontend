import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FavoriteItem = ({ store, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    // 매장 상세 페이지로 이동 (매장 ID 사용)
    navigate(`/sellers/${store.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        boxShadow: isHovered ? "0 4px 8px rgba(0,0,0,0.15)" : "0 2px 4px rgba(0,0,0,0.1)",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        <img src="" alt="" />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
          <div
            style={{
              fontSize: "20px",
              marginRight: "8px",
            }}
          >
            🏪
          </div>
          <h3
            style={{
              margin: "0",
              fontSize: "20px",
              fontWeight: "600",
              color: "#333",
            }}
          >
            {store.storeName}
          </h3>
        </div>

        <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
          <span
            style={{
              fontSize: "14px",
              color: "#666",
              marginRight: "4px",
            }}
          >
            📍
          </span>
          <p
            style={{
              margin: "0",
              color: "#666",
              fontSize: "14px",
            }}
          >
            {store.addressDetail}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              fontSize: "16px",
              marginRight: "4px",
            }}
          >
            ⭐
          </span>
          <span
            style={{
              color: "#ff6b6b",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            {store.rating ? store.rating.toFixed(1) : "0.0"}
          </span>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(store.id);
        }}
        style={{
          padding: "10px 20px",
          backgroundColor: isButtonHovered ? "#ff3742" : "#62d76a",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
      >
        삭제
      </button>
    </div>
  );
};

export default FavoriteItem;
