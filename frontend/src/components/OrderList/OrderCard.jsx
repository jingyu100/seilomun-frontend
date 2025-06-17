// OrderCard.jsx - 디버깅을 위한 코드 추가
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderCard.css";
import ProductImageBox from "./ProductImageBox";
import OrderDetailBox from "./OrderDetailBox";
import OrderButtonGroup from "./OrderButtonGroup";
import ReviewForm from "./ReviewForm";
import RefundForm from "./RefundForm";

export default function OrderCard({ order }) {
  const [mode, setMode] = useState("default");
  const [localIsReview, setLocalIsReview] = useState(order.isReview);
  const navigate = useNavigate();

  // 주문 상세 페이지로 이동하는 함수
  const handleOrderDetailClick = () => {
    console.log("🔍 주문 상세 클릭 - orderId:", order.id); // ✅ 디버깅용 로그
    console.log("🔍 전체 order 객체:", order); // ✅ 전체 데이터 확인

    // orderId 검증
    if (!order.id) {
      console.error("❌ orderId가 없습니다!");
      alert("주문 ID를 찾을 수 없습니다.");
      return;
    }

    navigate(`/OrderDetail/${order.id}`);
  };

  const handleReviewComplete = () => {
    setLocalIsReview(true);
    setMode("default");
  };

  if (mode === "review") {
    return (
      <ReviewForm
        order={order}
        onCancel={() => setMode("default")}
        onReviewComplete={handleReviewComplete}
      />
    );
  }

  if (mode === "refund") {
    return <RefundForm order={order} onCancel={() => setMode("default")} />;
  }

  const getOrderStatusInfo = (status) => {
    switch (status) {
      case "S":
        return { text: "주문 접수중", className: "status-processing" };
      case "F":
        return { text: "결제 실패", className: "status-failed" };
      case "C":
        return { text: "주문 취소", className: "status-cancelled" };
      case "A":
        return { text: "주문 완료", className: "status-completed" };
      case "R":
        return { text: "주문 거절", className: "status-rejected" };
      case "B":
        return { text: "환불 완료", className: "status-refunded" };
      case "P":
        return { text: "환불 신청중", className: "status-refund-pending" };
      case "N":
        return { text: "주문 대기", className: "status-waiting" };
      default:
        return { text: "주문 상태 확인", className: "status-unknown" };
    }
  };

  const statusInfo = getOrderStatusInfo(order.orderStatus);

  return (
    <div className="order-card">
      <div className="order-date">{order.date}</div>

      {/* ✅ 디버깅을 위한 orderId 표시 */}
      <div style={{ fontSize: "12px", color: "#999", marginBottom: "8px" }}>
        Order ID: {order.id}
      </div>

      <div className="order-main-content">
        <div className="order-info">
          <div className={`order-status ${statusInfo.className}`}>{statusInfo.text}</div>
          <div className="order-body">
            <ProductImageBox />
            <OrderDetailBox store={order.store} name={order.name} price={order.price} />
          </div>
        </div>

        <div className="order-actions">
          <OrderButtonGroup
            onReviewClick={() => setMode("review")}
            onRefundClick={() => setMode("refund")}
            onOrderDetailClick={handleOrderDetailClick}
            orderStatus={order.orderStatus}
            isReview={localIsReview}
            isRefundRequested={false}
          />
        </div>
      </div>
    </div>
  );
}
