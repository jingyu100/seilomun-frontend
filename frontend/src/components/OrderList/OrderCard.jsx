// OrderCard.jsx - 주문 상태 정보를 버튼 그룹에 전달
import React, { useState } from "react";
import "./OrderCard.css";
import ProductImageBox from "./ProductImageBox";
import OrderDetailBox from "./OrderDetailBox";
import OrderButtonGroup from "./OrderButtonGroup";
import ReviewForm from "./ReviewForm";
import RefundForm from "./RefundForm";

export default function OrderCard({ order }) {
  const [mode, setMode] = useState("default");
  // ✅ 로컬 상태 추가 - 리뷰 작성 상태 관리
  const [localIsReview, setLocalIsReview] = useState(order.isReview); // ✅ order.isReview로 수정

  // ✅ 리뷰 작성 완료 후 호출될 콜백 함수
  const handleReviewComplete = () => {
    setLocalIsReview(true); // 리뷰 완료 상태로 변경
    setMode("default"); // 기본 화면으로 돌아가기
  };

  if (mode === "review") {
    return (
      <ReviewForm
        order={order}
        onCancel={() => setMode("default")}
        onReviewComplete={handleReviewComplete} // ✅ 콜백 전달
      />
    );
  }

  if (mode === "refund") {
    return <RefundForm order={order} onCancel={() => setMode("default")} />;
  }

  // 주문 상태에 따른 표시 텍스트와 CSS 클래스
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

      <div className="order-main-content">
        {/* 좌측 정보 영역 */}
        <div className="order-info">
          <div className={`order-status ${statusInfo.className}`}>{statusInfo.text}</div>
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
            orderStatus={order.orderStatus}
            isReview={localIsReview} // ✅ 로컬 상태 사용
            // isRefundRequested는 나중에 백엔드에서 추가되면 order.isRefundRequested로 변경
            isRefundRequested={false}
          />
        </div>
      </div>
    </div>
  );
}
