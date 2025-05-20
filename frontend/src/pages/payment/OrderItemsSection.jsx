import React from "react";
import "./OrderItemsSection.css";

const OrderItemsSection = () => {
  // 더미 상품 데이터
  const products = [
    {
      id: 1,
      name: "커피명가 하이엔지 레몬생강청(500ml)",
      expireDate: "2024년 11월 13일까지",
      quantity: 1,
      price: 20000,
      imgSrc: "/images/lemon.png",
    },
    {
      id: 2,
      name: "커피명가 하이엔지 레몬생강청(500ml)",
      expireDate: "2024년 11월 13일까지",
      quantity: 1,
      price: 20000,
      imgSrc: "/images/lemon.png",
    },
  ];

  return (
    <div className="order-box">
      <div className="order-title">주문상품</div>
      {products.map((item) => (
        <div className="order-item" key={item.id}>
          <img src={item.imgSrc} alt={item.name} className="product-img" />
          <div className="product-info">
            <div className="product-name">{item.name}</div>
            <div className="product-detail">
              {item.expireDate} <br />
              수량: {item.quantity}개
            </div>
            <div className="product-price">
              <strong>{item.price.toLocaleString()}원</strong>
            </div>
          </div>
          <button className="delete-btn">✕</button>
        </div>
      ))}

      <div className="order-footer">
        <span>배송비</span>
        <span className="price">3,000원</span>
      </div>
    </div>
  );
};

export default OrderItemsSection;
