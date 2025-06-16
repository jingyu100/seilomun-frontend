// OrderButtonGroup.jsx - 주문 상태별 버튼 제어 로직
export default function OrderButtonGroup({
  onReviewClick,
  onRefundClick,
  orderStatus,
  isReview = false,
  isRefundRequested = false, // 나중에 백엔드에서 추가될 예정
}) {
  // 주문 상태별 버튼 표시 로직
  const getButtonStates = () => {
    // 기본적으로 모든 버튼 비활성화
    let showReviewBtn = false;
    let showRefundBtn = false;
    let reviewBtnText = "리뷰 작성";
    let reviewBtnDisabled = false;
    let refundBtnDisabled = false;

    switch (orderStatus) {
      case "S": // 결제 성공해서 주문 접수중
      case "F": // 결제 실패상태
      case "C": // 결제 취소
      case "R": // 판매자가 주문 거절 상태
      case "N": // 기타 상태
        // 이 상태들에서는 리뷰, 환불 모두 불가능
        showReviewBtn = false;
        showRefundBtn = false;
        break;

      case "A": // 판매자가 주문 수락 상태 - 리뷰와 환불이 가능한 상태
        if (isReview) {
          // 리뷰 작성 완료된 경우
          showReviewBtn = true;
          reviewBtnText = "작성완료";
          reviewBtnDisabled = true;
          showRefundBtn = false; // 리뷰 작성 완료시 환불 불가
        } else if (isRefundRequested) {
          // 환불 신청 중인 경우
          showReviewBtn = false; // 환불 신청 중에는 리뷰 불가
          showRefundBtn = true;
          refundBtnDisabled = true;
        } else {
          // 정상적으로 리뷰와 환불 모두 가능한 상태
          showReviewBtn = true;
          showRefundBtn = true;
          reviewBtnText = "리뷰 작성";
        }
        break;

      case "B": // 환불된 상태
        // 환불 완료된 경우 모든 버튼 비활성화
        showReviewBtn = false;
        showRefundBtn = false;
        break;

      default:
        // 알 수 없는 상태는 모든 버튼 비활성화
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
      <button className="order-btn">주문 상세</button>

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
