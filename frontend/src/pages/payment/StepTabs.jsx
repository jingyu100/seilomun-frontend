import React, { useState } from "react";
import "./StepTabs.css"; // CSS 분리

const StepTabs = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState("delivery");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="step-tabs-wrapper">
      <div className="tabs">
        <div
          className={`tab delivery ${activeTab === "delivery" ? "active" : ""}`}
          onClick={() => handleTabClick("delivery")}
        >
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
