import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/config.js";
import "./PaymentResultModal.css";

const PaymentResultModal = ({ result, onClose }) => {
    const navigate = useNavigate();
    const [paymentData, setPaymentData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPaymentResult = async () => {
            try {
                let response;

                if (result.type === "success") {
                    // 백엔드 성공 API 호출
                    response = await api.get("/api/orders/toss/success", {
                        params: {
                            paymentKey: result.paymentKey,
                            orderId: result.orderId,
                            amount: result.amount
                        }
                    });

                    console.log("성공 API 응답 전체:", response.data);

                    // PaymentSuccessDto 구조에 맞게 데이터 처리
                    const successData = response.data.data?.성공;
                    if (!successData) {
                        throw new Error("결제 성공 데이터를 받지 못했습니다.");
                    }

                    setPaymentData({
                        type: "success",
                        data: successData, // PaymentSuccessDto 객체
                        message: response.data.data?.message || "결제가 성공적으로 완료되었습니다."
                    });
                } else if (result.type === "fail") {
                    // 백엔드 실패 API 호출
                    response = await api.get("/api/orders/toss/fail", {
                        params: {
                            code: result.code,
                            message: result.message,
                            orderId: result.orderId
                        }
                    });

                    console.log("실패 API 응답 전체:", response.data);

                    // PaymentFailDto 구조에 맞게 데이터 처리
                    const failData = response.data.data?.실패;
                    if (!failData) {
                        throw new Error("결제 실패 데이터를 받지 못했습니다.");
                    }

                    setPaymentData({
                        type: "fail",
                        data: failData, // PaymentFailDto 객체
                        message: response.data.data?.message || "결제가 실패되었습니다."
                    });
                }

                console.log("결제 결과 API 응답:", response.data);
            } catch (error) {
                console.error("결제 결과 조회 실패:", error);
                setError(error.response?.data?.data?.error || error.message || "결과 조회에 실패했습니다.");
            }
        };

        fetchPaymentResult();
    }, [result]);

    const handleGoHome = () => {
        navigate("/");
    };

    const handleViewOrders = () => {
        navigate("/orders"); // 주문 내역 페이지
    };

    const handleClose = () => {
        onClose();
        // URL 파라미터 제거
        navigate("/payment", { replace: true });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {error ? (
                    <div className="error-section">
                        <div className="error-icon">❌</div>
                        <h2>오류가 발생했습니다</h2>
                        <p>{error}</p>
                        <div className="button-group">
                            <button onClick={handleClose} className="btn-secondary">
                                닫기
                            </button>
                            <button onClick={handleGoHome} className="btn-primary">
                                홈으로 가기
                            </button>
                        </div>
                    </div>
                ) : paymentData?.type === "success" ? (
                    <div className="success-section">
                        <div className="success-icon">✅</div>
                        <h2>결제가 완료되었습니다!</h2>
                        <p className="success-message">{paymentData.message}</p>

                        {paymentData.data && (
                            <div className="payment-details">
                                <div className="detail-row">
                                    <span className="label">주문명:</span>
                                    <span className="value">{paymentData.data.orderName || "주문"}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">결제 금액:</span>
                                    <span className="value">
                                        {paymentData.data.totalAmount ?
                                            `${parseInt(paymentData.data.totalAmount).toLocaleString()}원` :
                                            "금액 정보 없음"}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">결제 방법:</span>
                                    <span className="value">{paymentData.data.method || "결제 방법 정보 없음"}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">결제 일시:</span>
                                    <span className="value">
                                        {paymentData.data.approvedAt ?
                                            new Date(paymentData.data.approvedAt).toLocaleString() :
                                            "결제 일시 정보 없음"}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">주문 번호:</span>
                                    <span className="value">{paymentData.data.orderId || "주문 번호 정보 없음"}</span>
                                </div>
                                {paymentData.data.card && (
                                    <>
                                        <div className="detail-row">
                                            <span className="label">카드사:</span>
                                            <span className="value">{paymentData.data.card.company || "카드사 정보 없음"}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">카드 번호:</span>
                                            <span className="value">{paymentData.data.card.number || "카드 번호 정보 없음"}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        <div className="button-group">
                            <button onClick={handleViewOrders} className="btn-secondary">
                                주문 내역 보기
                            </button>
                            <button onClick={handleGoHome} className="btn-primary">
                                쇼핑 계속하기
                            </button>
                        </div>
                    </div>
                ) : paymentData?.type === "fail" ? (
                    <div className="fail-section">
                        <div className="fail-icon">❌</div>
                        <h2>결제에 실패했습니다</h2>
                        <p className="fail-message">{paymentData?.message || "결제가 실패되었습니다."}</p>

                        {paymentData?.data && (
                            <div className="error-details">
                                <div className="detail-row">
                                    <span className="label">주문 번호:</span>
                                    <span className="value">{paymentData.data.orderId || "주문 번호 정보 없음"}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">오류 코드:</span>
                                    <span className="value">{paymentData.data.errorCode || "오류 코드 정보 없음"}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">오류 메시지:</span>
                                    <span className="value">{paymentData.data.errorMessage || "오류 메시지 정보 없음"}</span>
                                </div>
                            </div>
                        )}

                        <div className="button-group">
                            <button onClick={handleClose} className="btn-secondary">
                                다시 시도
                            </button>
                            <button onClick={handleGoHome} className="btn-primary">
                                홈으로 가기
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default PaymentResultModal;