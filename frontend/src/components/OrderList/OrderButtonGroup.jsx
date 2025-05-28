export default function OrderButtonGroup({ onReviewClick }) {
  return (
    <div className="order-buttons">
      <button className="order-btn">주문 상세</button>
      <button className="order-btn" onClick={onReviewClick}>
        리뷰 작성
      </button>
      <button className="order-btn">환불 신청</button>
    </div>
  );
}
