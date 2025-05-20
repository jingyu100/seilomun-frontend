import React from "react";
import StepTabs from "./StepTabs";
import "./Payment.css"; // 클래식 CSS 연결
import DeliverySection from "./DeliverySection";
import OrderItemsSection from "./OrderItemsSection";
import PaymentInfoSection from "./PaymentInfoSection";
import OrderSubmitBar from "./OrderSubmitBar";

const Payment = () => {
  return (
    <div className="payment-wrapper">
      <div className="payment-container">
        <StepTabs />
        <DeliverySection />
        <OrderItemsSection />
        <PaymentInfoSection />
        <OrderSubmitBar />
      </div>
    </div>
  );
};

export default Payment;
