import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/config.js';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const processPayment = async () => {
            try {
                const paymentKey = searchParams.get('paymentKey');
                const orderId = searchParams.get('orderId');
                const amount = searchParams.get('amount');

                console.log('🎉 결제 성공! 백엔드 승인 처리 시작...');

                // 백엔드 결제 승인 API 호출
                const response = await api.get('/api/orders/toss/success', {
                    params: {
                        paymentKey,
                        orderId,
                        amount: parseInt(amount)
                    }
                });

                // 부모 창(메인 페이지)으로 성공 메시지 전송
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'PAYMENT_SUCCESS',
                        data: {
                            success: true,
                            orderId: orderId,
                            amount: amount,
                            message: '결제가 성공적으로 완료되었습니다!',
                            details: response.data
                        }
                    }, '*');

                    // 현재 창 닫기
                    window.close();
                } else {
                    // opener가 없는 경우 (새 탭으로 열린 경우)
                    alert('결제가 완료되었습니다! 이 창을 닫고 메인 페이지로 돌아가세요.');
                }

            } catch (error) {
                console.error('❌ 결제 승인 실패:', error);

                // 부모 창으로 실패 메시지 전송
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'PAYMENT_ERROR',
                        data: {
                            success: false,
                            message: error.response?.data?.message || '결제 승인에 실패했습니다.',
                            error: error.message
                        }
                    }, '*');

                    window.close();
                } else {
                    alert('결제 승인에 실패했습니다: ' + error.message);
                }
            }
        };

        processPayment();
    }, [searchParams]);

    return (
        <div className="payment-processing">
            <div className="processing-content">
                <div className="spinner"></div>
                <h2>결제 승인 처리 중...</h2>
                <p>잠시만 기다려주세요.</p>
                <div className="progress-bar">
                    <div className="progress-fill"></div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;