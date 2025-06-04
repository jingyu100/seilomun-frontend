// src/components/WishListItem.jsx

import React from "react";

export default function WishListItem({ item, onRemove, onAddToCart }) {
  return (
    <div
      className="wishlist-item"
      style={{
        display: "flex",
        alignItems: "flex-start",
        padding: "16px 0",
        borderBottom: "1px solid #eee",
      }}
    >
      {/* 썸네일 이미지 */}
      <div style={{ flexShrink: 0 }}>
        <img
          src={item.photoUrl}
          alt={item.name}
          style={{
            width: "100px",
            height: "100px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      </div>

      {/* 상품 정보 */}
      <div className="wishlist-item-info" style={{ marginLeft: "16px", flexGrow: 1 }}>
        <h3 style={{ margin: "0 0 8px", fontSize: "16px", color: "#333" }}>
          {item.name}
        </h3>
        <div style={{ marginBottom: "8px", fontSize: "14px", color: "#666" }}>
          <span
            className="discount-price"
            style={{ fontWeight: "bold", color: "#e60023", marginRight: "8px" }}
          >
            {item.discountPrice.toLocaleString()}원
          </span>
          <span
            className="original-price"
            style={{
              textDecoration: "line-through",
              color: "#999",
              marginRight: "8px",
            }}
          >
            {item.originalPrice.toLocaleString()}원
          </span>
          <span className="discount-rate" style={{ color: "#e60023", fontSize: "13px" }}>
            {item.currentDiscountRate}%
          </span>
        </div>
        <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#777" }}>
          {item.storeAddress}
        </p>
        <p style={{ margin: 0, fontSize: "13px", color: "#777" }}>
          {new Date(item.expiryDate).toLocaleDateString()}까지
        </p>
      </div>

      {/* 액션 버튼 */}
      <div
        className="wishlist-item-actions"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <button
          className="add-to-cart-btn"
          onClick={() => onAddToCart(item.productId)}
          style={{
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            padding: "8px 12px",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "8px",
            fontSize: "14px",
          }}
        >
          장바구니 담기
        </button>
        <button
          className="remove-wish-btn"
          onClick={() => onRemove(item.wishId)}
          style={{
            backgroundColor: "transparent",
            color: "#333",
            border: "1px solid #333",
            padding: "8px 12px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          관심상품 제거
        </button>
      </div>
    </div>
  );
}
