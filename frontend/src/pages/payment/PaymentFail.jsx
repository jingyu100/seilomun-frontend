import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/config.js';
import './PaymentFail.css';

const PaymentFail = () => {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const processFailure = async () => {
            try {
                const code = searchParams.get('code');
                const message = searchParams.get('message');
                const orderId = searchParams.get('orderId');

                console.log('❌ 결제 실패! 백엔드 실패 처리 시작...');

                // 백엔드 결제 실패 API 호출
                if (code && message && orderId) {
                    await api.get('/api/orders/toss/fail', {
                        params: { code, message, orderId }
                    });
                }

                // 부모 창으로 실패 메시지 전송
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'PAYMENT_FAIL',
                        data: {
                            success: false,
                            code: code || 'UNKNOWN',
                            message: message || '알 수 없는 오류가 발생했습니다.',
                            orderId: orderId
                        }
                    }, '*');

                    window.close();
                } else {
                    alert(`결제에 실패했습니다: ${message}`);
                }

            } catch (error) {
                console.error('결제 실패 처리 중 오류:', error);

                if (window.opener) {
                    window.opener.postMessage({
                        type: 'PAYMENT_ERROR',
                        data: {
                            success: false,
                            message: '시스템 오류가 발생했습니다.',
                            error: error.message
                        }
                    }, '*');

                    window.close();
                } else {
                    alert('시스템 오류가 발생했습니다.');
                }
            }
        };

        processFailure();
    }, [searchParams]);

    return (
        <div className="payment-failed">
            <div className="failed-content">
                <div className="error-icon">❌</div>
                <h2>결제 실패 처리 중...</h2>
                <p>잠시만 기다려주세요.</p>
                <div className="processing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    );
};

export default PaymentFail;