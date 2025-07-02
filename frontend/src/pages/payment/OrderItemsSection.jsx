import React from "react";
import "./OrderItemsSection.css";
import api, { S3_BASE_URL } from "../../api/config.js";

const OrderItemsSection = ({ products = [], deliveryFee = 0 }) => {
  return (
    <div className="order-box">
      <div className="order-title">주문상품</div>
      {products.length === 0 ? (
        <div className="no-products">주문할 상품이 없습니다.</div>
      ) : (
        products.map((item) => (
          <div className="order-item" key={item.id}>
            <img
              src={item.productPhotoUrl?.[0]
                ? `${S3_BASE_URL}${item.productPhotoUrl[0]}`
                : item.photoUrl?.[0]
                ? `${S3_BASE_URL}${item.photoUrl[0]}` 
                : "/images/default.jpg"}
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
