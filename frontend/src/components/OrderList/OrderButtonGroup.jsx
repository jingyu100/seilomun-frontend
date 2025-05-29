// OrderButtonGroup.jsx - 환불 신청 버튼 추가
export default function OrderButtonGroup({ onReviewClick, onRefundClick }) {
  return (
    <div className="order-buttons">
      <button className="order-btn">주문 상세</button>
      <button className="order-btn" onClick={onReviewClick}>
        리뷰 작성
      </button>
      <button className="order-btn" onClick={onRefundClick}>
        환불 신청
      </button>
    </div>
  );
}
