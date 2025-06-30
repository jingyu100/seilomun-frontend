import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Seller_Header from "../../components/seller/Seller_Header.jsx";
import "../../css/seller/Seller_RefundDetail.css";
import api, { API_BASE_URL } from "../../api/config.js";

const Seller_RefundDetail = () => {
  const { refundId } = useParams();
  const navigate = useNavigate();
  const [refundDetail, setRefundDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRefundDetail();
  }, [refundId]);

  const fetchRefundDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/sellers/refunds/${refundId}`);

      console.log("환불 상세 조회 성공:", response.data);
      setRefundDetail(response.data.data.refundDetail);
    } catch (error) {
      console.error("환불 상세 조회 실패:", error);
      if (error.response?.status === 401) {
        alert("로그인이 필요합니다.");
        navigate("/selogin");
      } else if (error.response?.status === 403) {
        alert("접근 권한이 없습니다.");
        navigate("/Seller_Main");
      } else {
        alert("환불 정보를 불러오는데 실패했습니다.");
        navigate("/Seller_Main");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRefund = async () => {
    if (!window.confirm("환불을 승인하시겠습니까?")) return;

    try {
      setActionLoading(true);
      const response = await api.post(`/api/orders/refund/acceptance/${refundId}`, {});

      alert("환불이 승인되었습니다.");
      fetchRefundDetail();
    } catch (error) {
      console.error("환불 승인 실패:", error);
      alert("환불 승인에 실패했습니다.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeclineRefund = async () => {
    if (!window.confirm("환불을 거절하시겠습니까?")) return;

    try {
      setActionLoading(true);
      const response = await api.post(`/api/orders/refund/decline/${refundId}`, {});

      alert("환불이 거절되었습니다.");
      fetchRefundDetail();
    } catch (error) {
      console.error("환불 거절 실패:", error);
      alert("환불 거절에 실패했습니다.");
    } finally {
      setActionLoading(false);
    }
  };

  const getRefundStatusText = (status) => {
    switch (status) {
      case "N":
        return "환불 대기";
      case "A":
        return "환불 승인";
      case "R":
        return "환불 거절";
      default:
        return "알 수 없음";
    }
  };

  const getRefundStatusClass = (status) => {
    switch (status) {
      case "N":
        return "refund-status-waiting";
      case "A":
        return "refund-status-approved";
      case "R":
        return "refund-status-rejected";
      default:
        return "refund-status-unknown";
    }
  };

  const getOrderStatusText = (status) => {
    switch (status) {
      case "N":
        return "주문 대기";
      case "S":
        return "결제 완료";
      case "A":
        return "주문 수락";
      case "R":
        return "주문 거절";
      case "C":
        return "주문 취소";
      case "F":
        return "주문 실패";
      case "B":
        return "환불 완료";
      default:
        return "알 수 없음";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("ko-KR");
  };

  if (loading) {
    return (
      <div>
        <Seller_Header />
        <div className="seller-refund-detail-loading">
          <div className="loading-spinner">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!refundDetail) {
    return (
      <div>
        <Seller_Header />
        <div className="seller-refund-detail-error">
          <h3>환불 정보를 찾을 수 없습니다.</h3>
          <button onClick={() => navigate("/Seller_Main")}>메인으로 돌아가기</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Seller_Header />
      <div className="seller-refund-detail">
        <div className="refund-detail-container">
          {/* 헤더 */}
          <div className="refund-detail-header">
            <div className="header-left">
              <button className="back-btn" onClick={() => navigate("/Seller_Main")}>
                ← 돌아가기
              </button>
              <h2>환불 신청 상세</h2>
            </div>
            <div className="refund-status">
              <span
                className={`status-badge ${getRefundStatusClass(
                  refundDetail.refundStatus
                )}`}
              >
                {getRefundStatusText(refundDetail.refundStatus)}
              </span>
            </div>
          </div>

          {/* 환불 신청 정보 */}
          <div className="refund-info-card">
            <h3>환불 신청 정보</h3>
            <div className="refund-info-grid">
              <div className="info-item">
                <span className="label">환불번호:</span>
                <span className="value">{refundDetail.refundId}</span>
              </div>
              <div className="info-item">
                <span className="label">환불 신청일:</span>
                <span className="value">
                  {formatDate(refundDetail.refundRequestDate)}
                </span>
              </div>
              <div className="info-item">
                <span className="label">환불 처리일:</span>
                <span className="value">
                  {refundDetail.refundProcessedDate
                    ? formatDate(refundDetail.refundProcessedDate)
                    : "미처리"}
                </span>
              </div>
              <div className="info-item">
                <span className="label">환불 유형:</span>
                <span className="value">{refundDetail.refundType}</span>
              </div>
            </div>

            <div className="refund-reason">
              <div className="reason-title">
                <span className="label">환불 사유:</span>
                <span className="title">{refundDetail.refundTitle}</span>
              </div>
              <div className="reason-content">{refundDetail.refundContent}</div>
            </div>

            {/* 환불 첨부 사진 */}
            {refundDetail.refundPhotos && refundDetail.refundPhotos.length > 0 && (
              <div className="refund-photos">
                <span className="label">첨부 사진:</span>
                <div className="photos-grid">
                  {refundDetail.refundPhotos.map((photo, index) => (
                    <div key={index} className="photo-item">
                      <img
                        src={`https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${photo}`}
                        alt={`환불 첨부 ${index + 1}`}
                        onClick={() =>
                          window.open(
                            `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${photo}`,
                            "_blank"
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 주문 정보 */}
          <div className="order-info-card">
            <h3>관련 주문 정보</h3>
            <div className="order-info-grid">
              <div className="info-item">
                <span className="label">주문번호:</span>
                <span className="value">{refundDetail.orderNumber}</span>
              </div>
              <div className="info-item">
                <span className="label">주문일시:</span>
                <span className="value">{formatDate(refundDetail.orderDate)}</span>
              </div>
              <div className="info-item">
                <span className="label">고객명:</span>
                <span className="value">{refundDetail.customerName}</span>
              </div>
              <div className="info-item">
                <span className="label">연락처:</span>
                <span className="value">{refundDetail.customerPhone}</span>
              </div>
              <div className="info-item">
                <span className="label">주문상태:</span>
                <span className="value">
                  {getOrderStatusText(refundDetail.orderStatus)}
                </span>
              </div>
              <div className="info-item">
                <span className="label">결제상태:</span>
                <span className="value">{refundDetail.paymentStatus}</span>
              </div>
            </div>

            {refundDetail.isDelivery === "Y" && refundDetail.deliveryAddress && (
              <div className="delivery-info">
                <span className="label">배달주소:</span>
                <span className="value">{refundDetail.deliveryAddress}</span>
              </div>
            )}

            {refundDetail.orderMemo && (
              <div className="memo-info">
                <span className="label">주문 메모:</span>
                <span className="value">{refundDetail.orderMemo}</span>
              </div>
            )}
          </div>

          {/* 주문 상품 목록 */}
          <div className="order-items-card">
            <h3>주문 상품</h3>
            <div className="order-items-list">
              {refundDetail.orderItems?.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-image">
                    <img
                      src={
                        item.photoUrl
                          ? `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${item.photoUrl}`
                          : "https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/default.png"
                      }
                      alt={item.productName}
                      onError={(e) => {
                        e.target.src =
                          "https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/default.png";
                      }}
                    />
                  </div>
                  <div className="item-info">
                    <div className="item-name">{item.productName}</div>
                    <div className="item-details">
                      <span>수량: {item.quantity}개</span>
                      <span>단가: {item.unitPrice?.toLocaleString()}원</span>
                      <span>할인율: {item.discountRate}%</span>
                    </div>
                    {item.expiryDate && (
                      <div className="item-expiry">
                        유통기한: {formatDate(item.expiryDate)}
                      </div>
                    )}
                  </div>
                  <div className="item-total">
                    {(item.unitPrice * item.quantity)?.toLocaleString()}원
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 결제 정보 */}
          <div className="payment-info-card">
            <h3>결제 정보</h3>
            <div className="payment-breakdown">
              <div className="payment-row">
                <span>상품 금액:</span>
                <span>
                  {(
                    refundDetail.totalAmount -
                    (refundDetail.deliveryFee || 0) +
                    refundDetail.usedPoints
                  )?.toLocaleString()}
                  원
                </span>
              </div>
              {refundDetail.deliveryFee > 0 && (
                <div className="payment-row">
                  <span>배달비:</span>
                  <span>{refundDetail.deliveryFee?.toLocaleString()}원</span>
                </div>
              )}
              {refundDetail.usedPoints > 0 && (
                <div className="payment-row discount">
                  <span>포인트 사용:</span>
                  <span>-{refundDetail.usedPoints?.toLocaleString()}원</span>
                </div>
              )}
              <div className="payment-row total">
                <span>환불 예정 금액:</span>
                <span>{refundDetail.totalAmount?.toLocaleString()}원</span>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          {refundDetail.refundStatus === "N" && (
            <div className="action-buttons">
              <button
                className="accept-btn"
                onClick={handleAcceptRefund}
                disabled={actionLoading}
              >
                {actionLoading ? "처리 중..." : "환불 승인"}
              </button>
              <button
                className="decline-btn"
                onClick={handleDeclineRefund}
                disabled={actionLoading}
              >
                {actionLoading ? "처리 중..." : "환불 거절"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Seller_RefundDetail;
