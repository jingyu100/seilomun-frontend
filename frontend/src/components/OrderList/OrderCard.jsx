// OrderCard.jsx - 환불 신청 기능 추가
import React, { useState } from "react";
import "./OrderCard.css";
import ProductImageBox from "./ProductImageBox";
import OrderDetailBox from "./OrderDetailBox";
import OrderButtonGroup from "./OrderButtonGroup";
import ReviewForm from "./ReviewForm";
import RefundForm from "./RefundForm";

export default function OrderCard({ order }) {
  const [mode, setMode] = useState("default");

  if (mode === "review") {
    return <ReviewForm order={order} onCancel={() => setMode("default")} />;
  }

  if (mode === "refund") {
    return <RefundForm order={order} onCancel={() => setMode("default")} />;
  }

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
          <OrderButtonGroup
            onReviewClick={() => setMode("review")}
            onRefundClick={() => setMode("refund")}
          />
        </div>
      </div>
    </div>
  );
}
