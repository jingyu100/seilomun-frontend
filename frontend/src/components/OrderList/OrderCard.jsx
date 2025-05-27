import React from "react";
import "./OrderCard.css";
import ProductImageBox from "./ProductImageBox";
import OrderDetailBox from "./OrderDetailBox";
import OrderButtonGroup from "./OrderButtonGroup";

export default function OrderCard({ order }) {
  return (
    <div className="order-card">
      <div className="order-date">{order.date}</div>

      <div className="order-main-content">
        {/* 좌측 정보 영역 */}
        <div className="order-info">
          <div className="order-status">주문 완료</div>
          <div className="order-body">
            <ProductImageBox />
            <OrderDetailBox store={order.store} name={order.name} price={order.price} />
          </div>
        </div>

        {/* 우측 버튼 영역 */}
        <div className="order-actions">
          <OrderButtonGroup />
        </div>
      </div>
    </div>
  );
}
