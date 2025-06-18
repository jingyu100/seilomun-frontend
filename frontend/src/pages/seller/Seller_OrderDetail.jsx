import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Seller_Header from "../../components/seller/Seller_Header.jsx";
import "../../css/seller/Seller_OrderDetail.css";

const Seller_OrderDetail = () => {
    const { orderNumber } = useParams();
    const navigate = useNavigate();
    const [orderDetail, setOrderDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchOrderDetail();
    }, [orderNumber]);

    const fetchOrderDetail = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://3.36.70.70/api/sellers/orders/number/${orderNumber}`, {
                withCredentials: true,
            });

            console.log("주문 상세 조회 성공:", response.data);
            setOrderDetail(response.data.data.orderDetail);
        } catch (error) {
            console.error("주문 상세 조회 실패:", error);
            if (error.response?.status === 401) {
                alert("로그인이 필요합니다.");
                navigate("/selogin");
            } else if (error.response?.status === 403) {
                alert("접근 권한이 없습니다.");
                navigate("/Seller_Main");
            } else {
                alert("주문 정보를 불러오는데 실패했습니다.");
                navigate("/Seller_Main");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptOrder = async () => {
        if (!window.confirm("주문을 수락하시겠습니까?")) return;

        try {
            setActionLoading(true);
            const response = await axios.post(
                `http://3.36.70.70/api/orders/acceptance/${orderDetail.orderId}`,
                {},
                { withCredentials: true }
            );

            alert("주문이 수락되었습니다.");
            fetchOrderDetail();
        } catch (error) {
            console.error("주문 수락 실패:", error);
            alert("주문 수락에 실패했습니다.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleRefuseOrder = async () => {
        if (!window.confirm("주문을 거절하시겠습니까?")) return;

        try {
            setActionLoading(true);
            const response = await axios.post(
                `http://3.36.70.70/api/orders/refuse/${orderDetail.orderId}`,
                {},
                { withCredentials: true }
            );

            alert("주문이 거절되었습니다.");
            fetchOrderDetail();
        } catch (error) {
            console.error("주문 거절 실패:", error);
            alert("주문 거절에 실패했습니다.");
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'N': return '주문 대기';
            case 'S': return '결제 완료';
            case 'A': return '주문 수락';
            case 'R': return '주문 거절';
            case 'C': return '주문 취소';
            case 'F': return '주문 실패';
            case 'B': return '환불 완료';
            default: return '알 수 없음';
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'N': return 'status-waiting';
            case 'S': return 'status-paid';
            case 'A': return 'status-accepted';
            case 'R': return 'status-refused';
            case 'C': return 'status-cancelled';
            case 'F': return 'status-failed';
            case 'B': return 'status-refunded';
            default: return 'status-unknown';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("ko-KR");
    };

    if (loading) {
        return (
            <div>
                <Seller_Header />
                <div className="seller-order-detail-loading">
                    <div className="loading-spinner">로딩 중...</div>
                </div>
            </div>
        );
    }

    if (!orderDetail) {
        return (
            <div>
                <Seller_Header />
                <div className="seller-order-detail-error">
                    <h3>주문 정보를 찾을 수 없습니다.</h3>
                    <button onClick={() => navigate("/Seller_Main")}>
                        메인으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Seller_Header />
            <div className="seller-order-detail">
                <div className="order-detail-container">
                    {/* 헤더 */}
                    <div className="order-detail-header">
                        <div className="header-left">
                            <button
                                className="back-btn"
                                onClick={() => navigate("/Seller_Main")}
                            >
                                ← 돌아가기
                            </button>
                            <h2>주문 상세</h2>
                        </div>
                        <div className="order-status">
                            <span className={`status-badge ${getStatusClass(orderDetail.orderStatus)}`}>
                                {getStatusText(orderDetail.orderStatus)}
                            </span>
                        </div>
                    </div>

                    {/* 주문 기본 정보 */}
                    <div className="order-info-card">
                        <h3>주문 정보</h3>
                        <div className="order-info-grid">
                            <div className="info-item">
                                <span className="label">주문번호:</span>
                                <span className="value">{orderDetail.orderNumber}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">주문일시:</span>
                                <span className="value">{formatDate(orderDetail.orderDate)}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">고객명:</span>
                                <span className="value">{orderDetail.customerName}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">연락처:</span>
                                <span className="value">{orderDetail.customerPhone}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">결제상태:</span>
                                <span className="value">{orderDetail.paymentStatus}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">배달여부:</span>
                                <span className="value">
                                    {orderDetail.isDelivery === 'Y' ? '배달 주문' : '픽업 주문'}
                                </span>
                            </div>
                        </div>

                        {orderDetail.isDelivery === 'Y' && orderDetail.deliveryAddress && (
                            <div className="delivery-info">
                                <span className="label">배달주소:</span>
                                <span className="value">{orderDetail.deliveryAddress}</span>
                            </div>
                        )}

                        {orderDetail.memo && (
                            <div className="memo-info">
                                <span className="label">주문 메모:</span>
                                <span className="value">{orderDetail.memo}</span>
                            </div>
                        )}
                    </div>

                    {/* 주문 상품 목록 */}
                    <div className="order-items-card">
                        <h3>주문 상품</h3>
                        <div className="order-items-list">
                            {orderDetail.orderItems?.map((item, index) => (
                                <div key={index} className="order-item">
                                    <div className="item-image">
                                        <img
                                            src={item.photoUrl
                                                ? `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${item.photoUrl}`
                                                : "https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/default.png"
                                            }
                                            alt={item.productName}
                                            onError={(e) => {
                                                e.target.src = "https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/default.png";
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
                                <span>{(orderDetail.totalAmount - (orderDetail.deliveryFee || 0) + orderDetail.usedPoints)?.toLocaleString()}원</span>
                            </div>
                            {orderDetail.deliveryFee > 0 && (
                                <div className="payment-row">
                                    <span>배달비:</span>
                                    <span>{orderDetail.deliveryFee?.toLocaleString()}원</span>
                                </div>
                            )}
                            {orderDetail.usedPoints > 0 && (
                                <div className="payment-row discount">
                                    <span>포인트 사용:</span>
                                    <span>-{orderDetail.usedPoints?.toLocaleString()}원</span>
                                </div>
                            )}
                            <div className="payment-row total">
                                <span>총 결제 금액:</span>
                                <span>{orderDetail.totalAmount?.toLocaleString()}원</span>
                            </div>
                        </div>
                    </div>

                    {/* 액션 버튼 */}
                    {orderDetail.orderStatus === 'S' && (
                        <div className="action-buttons">
                            <button
                                className="accept-btn"
                                onClick={handleAcceptOrder}
                                disabled={actionLoading}
                            >
                                {actionLoading ? "처리 중..." : "주문 수락"}
                            </button>
                            <button
                                className="refuse-btn"
                                onClick={handleRefuseOrder}
                                disabled={actionLoading}
                            >
                                {actionLoading ? "처리 중..." : "주문 거절"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Seller_OrderDetail;