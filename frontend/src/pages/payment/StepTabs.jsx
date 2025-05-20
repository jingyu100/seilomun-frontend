import "./StepTabs.css"; // CSS 분리

const StepTabs = () => {
  return (
    <div className="step-tabs-wrapper">
      <div className="tabs">
        <div className="tab delivery">배송</div>
        <div className="tab packing">포장</div>
      </div>
      <div className="payment-bar">주문/결제</div>
    </div>
  );
};

export default StepTabs;
