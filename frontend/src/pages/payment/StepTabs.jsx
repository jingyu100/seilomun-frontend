import React from "react";
import "./StepTabs.css"; // CSS 분리

const StepTabs = ({ activeTab, onTabChange, isDeliveryAvailable }) => {
  const handleTabClick = (tab) => {
    // 배달이 불가능한 경우 'delivery' 탭으로의 변경을 막습니다.
    if (!isDeliveryAvailable && tab === "delivery") {
      return;
    }
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // 배달 불가 시 'delivery' 탭에 'disabled' 클래스를 추가합니다.
  const deliveryTabClassName = `tab delivery ${
    activeTab === "delivery" ? "active" : ""
  } ${!isDeliveryAvailable ? "disabled" : ""}`;

  return (
    <div className="step-tabs-wrapper">
      <div className="tabs">
        <div className={deliveryTabClassName} onClick={() => handleTabClick("delivery")}>
          배송
        </div>
        <div
          className={`tab packing ${activeTab === "pickup" ? "active" : ""}`}
          onClick={() => handleTabClick("pickup")}
        >
          포장
        </div>
      </div>
      <div className="payment-bar">주문/결제</div>
    </div>
  );
};

export default StepTabs;
