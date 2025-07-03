import React, { useEffect, useState } from "react";
import "./PaymentInfoSection.css";
import api from "../../api/config.js";

const PaymentInfoSection = ({
  totalProductPrice,
  deliveryFee,
  seller,
  isPickup,
  pointsToUse,
  setPointsToUse,
  finalAmount,
}) => {
  const [currentPoints, setCurrentPoints] = useState(0);

  useEffect(() => {
    console.log("useEffect 실행됨!");
    const fetchCurrentPoints = async () => {
      try {
        const response = await api.get("/api/customers/points?page=0&size=1");
        console.log("전체응답:", response);
        console.log("response.data:", response.data);
        setCurrentPoints(response.data.data.currentPoints);
      } catch (error) {
        console.error("현재 포인트 조회 실패:", error);
      }
    };

    fetchCurrentPoints();
  }, []);

  // 배송비 상태 메시지 생성
  const getDeliveryStatus = () => {
    if (!seller) return "";

    // 배송 불가능한 경우
    if (seller.deliveryAvailable !== "Y") {
      return <span style={{ color: "orange", fontSize: "12px" }}> (픽업만 가능)</span>;
    }

    const minOrderAmount = parseInt(seller.minOrderAmount) || 0;

    // 최소 주문 금액 미달
    if (totalProductPrice < minOrderAmount) {
      return (
        <span style={{ color: "red", fontSize: "12px" }}>
          {" "}
          (최소 주문금액 {minOrderAmount.toLocaleString()}원 미달)
        </span>
      );
    }

    // 무료배송 확인
    if (deliveryFee === 0) {
      return <span style={{ color: "green", fontSize: "12px" }}> (무료배송)</span>;
    }

    // 다음 단계 배송비 안내
    const deliveryRules = seller.deliveryFeeDtos || [];
    const sortedRules = [...deliveryRules].sort((a, b) => a.ordersMoney - b.ordersMoney);

    for (const rule of sortedRules) {
      if (totalProductPrice < rule.ordersMoney && rule.deliveryTip < deliveryFee) {
        const remaining = rule.ordersMoney - totalProductPrice;
        return (
          <span style={{ color: "blue", fontSize: "12px" }}>
            {" "}
            ({remaining.toLocaleString()}원 더 주문 시 배송비{" "}
            {rule.deliveryTip.toLocaleString()}원)
          </span>
        );
      }
    }

    return "";
  };

  // 전액사용 버튼 클릭
  const handleUseAllPoints = () => {
    const maxUsablePoints = Math.min(currentPoints, totalProductPrice);
    setPointsToUse(maxUsablePoints);
  };

  return (
    <div className="payment-box">
      <div className="payment-title">결제정보</div>

      <div className="payment-row">
        <span className="label">주문상품</span>
        <span className="value">{totalProductPrice.toLocaleString()}원</span>
      </div>

      {!isPickup && (
        <div className="payment-row">
          <span className="label">
            배송비
            {getDeliveryStatus()}
          </span>
          <span className="value">{deliveryFee.toLocaleString()}원</span>
        </div>
      )}

      <div className="payment-row point-row">
        <div className="point-label-box">
          <div>포인트사용</div>
          <button className="use-all-btn" onClick={handleUseAllPoints}>
            전액사용
          </button>
        </div>

        <div className="payment-point-box">
          <span className="minus">-</span>
          <input
            type="number"
            value={pointsToUse}
            onChange={(e) => {
              const value = Math.max(0, parseInt(e.target.value) || 0);
              const maxValue = Math.min(currentPoints, totalProductPrice);
              setPointsToUse(Math.min(value, maxValue));
            }}
            max={Math.min(currentPoints, totalProductPrice)}
          />
          <span className="unit">원</span>
        </div>
      </div>

      <div className="final-row">
        <span>최종결제금액</span>
        <span>{Math.max(0, finalAmount).toLocaleString()}원</span>
      </div>
    </div>
  );
};

export default PaymentInfoSection;
