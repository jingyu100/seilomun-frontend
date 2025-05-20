import React from "react";
import "./PaymentInfoSection.css";

const PaymentInfoSection = () => {
  return (
    <div className="payment-box">
      <div className="payment-title">결제정보</div>

      <div className="payment-row">
        <span className="label">주문상품</span>
        <span className="value">40,000원</span>
      </div>

      <div className="payment-row">
        <span className="label">배송비</span>
        <span className="value">3,000원</span>
      </div>

      <div class="payment-row point-row">
        <div class="point-label-box">
          <div>포인트사용</div>
          <button class="use-all-btn">전액사용</button>
        </div>

        <div class="payment-point-box">
          <span class="minus">-</span>
          <input type="number" value="0" />
          <span class="unit">원</span>
        </div>
      </div>

      <div className="final-row">
        <span>최종결제금액</span>
        <span>37,000원</span>
      </div>
    </div>
  );
};

export default PaymentInfoSection;
