import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentResultModal.css';

const PaymentResultModal = ({ isOpen, result, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen || !result) return null;

    const handleGoToOrders = () => {
        onClose();
        navigate('/orders'); // 주문 내역으로 이동
    };

    const handleGoHome = () => {
        onClose();
        navigate('/'); // 홈으로 이동
    };

    const handleRetry = () => {
        onClose();
        // 현재 페이지에 그대로 있어서 다시 결제 시도 가능
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>

                {result.success ? (
                    // 결제 성공 모달
                    <div className="payment-success">
                        <div className="success-icon">🎉</div>
                        <h2>결제가 완료되었습니다!</h2>

                        <div className="order-details">
                            <div className="detail-row">
                                <span className="label">주문번호:</span>
                                <span className="value">{result.orderId}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">결제금액:</span>
                                <span className="value">{parseInt(result.amount).toLocaleString()}원</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">결제수단:</span>
                                <span className="value">신용카드</span>
                            </div>
                        </div>

                        <div className="modal-buttons">
                            <button onClick={handleGoToOrders} className="primary-button">
                                주문 내역 보기
                            </button>
                            <button onClick={handleGoHome} className="secondary-button">
                                홈으로 가기
                            </button>
                        </div>
                    </div>
                ) : (
                    // 결제 실패 모달
                    <div className="payment-failure">
                        <div className="failure-icon">❌</div>
                        <h2>결제에 실패했습니다</h2>

                        <div className="error-details">
                            <div className="detail-row">
                                <span className="label">오류 코드:</span>
                                <span className="value">{result.code || 'UNKNOWN'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">오류 메시지:</span>
                                <span className="value">{result.message}</span>
                            </div>
                        </div>

                        <div className="modal-buttons">
                            <button onClick={handleRetry} className="primary-button">
                                다시 시도하기
                            </button>
                            <button onClick={handleGoHome} className="secondary-button">
                                홈으로 가기
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentResultModal;