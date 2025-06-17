// OrderButtonGroup.jsx - 주문 상세 버튼에 클릭 이벤트 추가
export default function OrderButtonGroup({
  onReviewClick,
  onRefundClick,
  onOrderDetailClick,
  orderStatus,
  isReview = false,
  isRefundRequested = false,
}) {
  const getButtonStates = () => {
    let showReviewBtn = false;
    let showRefundBtn = false;
    let reviewBtnText = "리뷰 작성";
    let reviewBtnDisabled = false;
    let refundBtnDisabled = false;

    switch (orderStatus) {
      case "S":
      case "F":
      case "C":
      case "R":
      case "N":
        showReviewBtn = false;
        showRefundBtn = false;
        break;

      case "A":
        if (isReview) {
          showReviewBtn = true;
          reviewBtnText = "작성완료";
          reviewBtnDisabled = true;
          showRefundBtn = false;
        } else if (isRefundRequested) {
          showReviewBtn = false;
          showRefundBtn = true;
          refundBtnDisabled = true;
        } else {
          showReviewBtn = true;
          showRefundBtn = true;
          reviewBtnText = "리뷰 작성";
        }
        break;

      case "B":
        showReviewBtn = false;
        showRefundBtn = false;
        break;

      default:
        showReviewBtn = false;
        showRefundBtn = false;
        break;
    }

    return {
      showReviewBtn,
      showRefundBtn,
      reviewBtnText,
      reviewBtnDisabled,
      refundBtnDisabled,
    };
  };

  const buttonStates = getButtonStates();

  return (
    <div className="order-buttons">
      {/* 주문 상세 버튼에 클릭 이벤트 추가 */}
      <button className="order-btn" onClick={onOrderDetailClick}>
        주문 상세
      </button>

      {buttonStates.showReviewBtn && (
        <button
          className={`order-btn ${buttonStates.reviewBtnDisabled ? "disabled" : ""}`}
          onClick={buttonStates.reviewBtnDisabled ? undefined : onReviewClick}
          disabled={buttonStates.reviewBtnDisabled}
        >
          {buttonStates.reviewBtnText}
        </button>
      )}

      {buttonStates.showRefundBtn && (
        <button
          className={`order-btn ${buttonStates.refundBtnDisabled ? "disabled" : ""}`}
          onClick={buttonStates.refundBtnDisabled ? undefined : onRefundClick}
          disabled={buttonStates.refundBtnDisabled}
        >
          {buttonStates.refundBtnDisabled ? "환불 신청중" : "환불 신청"}
        </button>
      )}
    </div>
  );
}
