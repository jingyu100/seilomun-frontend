import React, { useState } from "react";
import "./OrderItemsSection.css";

const OrderItemsSection = ({ products = [], deliveryFee = 0 }) => {
  // 상품 목록 상태 관리
  const [orderProducts, setOrderProducts] = useState(products);

  // 상품 삭제 함수
  const handleRemoveProduct = (productId) => {
    setOrderProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  return (
    <div className="order-box">
      <div className="order-title">주문상품</div>
      {orderProducts.length === 0 ? (
        <div className="no-products">주문할 상품이 없습니다.</div>
      ) : (
        orderProducts.map((item) => (
          <div className="order-item" key={item.id}>
            <img
              src={item.photoUrl?.[0] || "/images/default.jpg"}
              alt={item.name}
              className="product-img"
            />
            <div className="product-info">
              <div className="product-name">{item.name}</div>
              <div className="product-detail">
                {new Date(item.expiryDate).toLocaleDateString("ko-KR")}까지 <br />
                수량: {item.quantity || 1}개
              </div>
              <div className="product-price">
                <strong>
                  {(
                    item.totalPrice ||
                    (item.discountPrice || item.originalPrice) * (item.quantity || 1)
                  ).toLocaleString()}
                  원
                </strong>
              </div>
            </div>
            <button
              className="delete-btn"
              onClick={() => handleRemoveProduct(item.id)}
              title="상품 삭제"
            >
              ✕
            </button>
          </div>
        ))
      )}

      <div className="order-footer">
        <span>배송비</span>
        <span className="price">{deliveryFee.toLocaleString()}원</span>
      </div>
    </div>
  );
};

export default OrderItemsSection;
