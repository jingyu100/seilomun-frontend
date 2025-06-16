// OrderCard.jsx - 리뷰 작성 후 상태 업데이트 추가
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
  const [localIsReview, setLocalIsReview] = useState(order.isReview);

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

  // 주문 상태에 따른 표시 텍스트
  const getOrderStatusText = (status) => {
    switch (status) {
      case "S":
        return "주문 접수중";
      case "F":
        return "결제 실패";
      case "C":
        return "주문 취소";
      case "A":
        return "주문 완료";
      case "R":
        return "주문 거절";
      case "B":
        return "환불 완료";
      case "P":
        return "환불 신청중";
      case "N":
        return "주문 대기";
      default:
        return "주문 상태 확인";
    }
  };

  return (
    <div className="order-card">
      <div className="order-date">{order.date}</div>

      <div className="order-main-content">
        {/* 좌측 정보 영역 */}
        <div className="order-info">
          <div className="order-status">{getOrderStatusText(order.orderStatus)}</div>
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
