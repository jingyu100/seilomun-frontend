// src/components/WishListItem.jsx

import React, { useState } from "react";

export default function WishListItem({ item, onRemove, onAddToCart }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);
  const [isRemoveHovered, setIsRemoveHovered] = useState(false);

  return (
    <div
      className="wishlist-item"
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "16px",
        display: "flex",
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
      {/* 썸네일 이미지 */}
      <div style={{ flexShrink: 0 }}>
        <img
          src={item.photoUrl}
          alt={item.name}
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            borderRadius: "8px",
            border: "1px solid #eee",
          }}
        />
      </div>

      {/* 상품 정보 */}
      <div className="wishlist-item-info" style={{ marginLeft: "20px", flexGrow: 1 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ fontSize: "16px", marginRight: "8px" }}>🛒</span>
          <h3
            style={{
              margin: "0",
              fontSize: "18px",
              fontWeight: "600",
              color: "#333",
            }}
          >
            {item.name}
          </h3>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <span
            className="discount-price"
            style={{
              fontWeight: "bold",
              color: "#ff6b6b",
              marginRight: "12px",
              fontSize: "18px",
            }}
          >
            {item.discountPrice.toLocaleString()}원
          </span>
          <span
            className="original-price"
            style={{
              textDecoration: "line-through",
              color: "#999",
              marginRight: "8px",
              fontSize: "14px",
            }}
          >
            {item.originalPrice.toLocaleString()}원
          </span>
          <span
            className="discount-rate"
            style={{
              backgroundColor: "#ff6b6b",
              color: "white",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            {item.currentDiscountRate}% 할인
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
          <span style={{ fontSize: "14px", color: "#666", marginRight: "4px" }}>📍</span>
          <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>
            {item.storeAddress}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: "14px", color: "#666", marginRight: "4px" }}>⏰</span>
          <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>
            {new Date(item.expiryDate).toLocaleDateString()}까지
          </p>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div
        className="wishlist-item-actions"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <button
          className="add-to-cart-btn"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(item.productId);
          }}
          style={{
            backgroundColor: isCartHovered ? "#333" : "#000",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s ease",
            minWidth: "120px",
          }}
          onMouseEnter={() => setIsCartHovered(true)}
          onMouseLeave={() => setIsCartHovered(false)}
        >
          장바구니 담기
        </button>
        <button
          className="remove-wish-btn"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.wishId);
          }}
          style={{
            backgroundColor: "transparent",
            color: isRemoveHovered ? "#ff4757" : "#666",
            border: `1px solid ${isRemoveHovered ? "#ff4757" : "#ddd"}`,
            padding: "10px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s ease",
            minWidth: "120px",
          }}
          onMouseEnter={() => setIsRemoveHovered(true)}
          onMouseLeave={() => setIsRemoveHovered(false)}
        >
          관심상품 제거
        </button>
      </div>
    </div>
  );
}
