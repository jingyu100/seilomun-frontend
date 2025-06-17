import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import "../../css/customer/SideBtnModules.css";
import { useCart } from "../../Context/CartContext";
import axios from "axios";

function CartViewModule() {
    const { cartItems, setCartItems, removeFromCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 장바구니 데이터 로딩 함수
    const loadCartData = async () => {
        setLoading(true);
        setError(null);

        try {
            // 1단계: 장바구니 목록 조회
            const cartResponse = await axios.get('http://localhost/api/carts', {
                withCredentials: true
            });

            console.log("장바구니 응답:", cartResponse.data);

            const cartData = cartResponse.data?.data;

            if (!cartData || !cartData.products || Object.keys(cartData.products).length === 0) {
                console.log("장바구니가 비어있습니다.");
                setCartItems([]);
                return;
            }

            // 2단계: 각 상품의 상세 정보 조회
            const productPromises = Object.entries(cartData.products).map(async ([productId, quantity]) => {
                try {
                    console.log(`상품 ${productId} 조회 중... (수량: ${quantity})`);
                    const productResponse = await axios.get(`http://localhost/api/products/${productId}`, {
                        withCredentials: true
                    });

                    const product = productResponse.data?.data?.Products;

                    if (!product) {
                        console.error(`상품 ${productId}의 데이터가 없습니다.`);
                        return null;
                    }

                    // 장바구니 아이템 형태로 변환
                    return {
                        productId: parseInt(productId),
                        name: product.name || '상품명 없음',
                        description: product.description || '',
                        originalPrice: product.originalPrice || 0,
                        discountPrice: product.discountPrice || product.originalPrice || 0,
                        currentDiscountRate: product.currentDiscountRate || 0,
                        quantity: quantity,
                        stockQuantity: product.stockQuantity || 0,
                        expiryDate: product.expiryDate || '',
                        thumbnailUrl: product.photoUrl && product.photoUrl.length > 0 ? product.photoUrl[0] : null,
                        photoUrls: product.photoUrl || [],
                        seller: product.seller || {},
                        categoryId: product.categoryId || 0,
                        status: product.status || '1'
                    };
                } catch (error) {
                    console.error(`상품 ${productId} 조회 실패:`, error);
                    return null;
                }
            });

            const productDetails = await Promise.all(productPromises);

            // null 값 제거 (조회 실패한 상품들)
            const validProducts = productDetails.filter(item => item !== null);
            console.log("로드된 상품들:", validProducts);
            setCartItems(validProducts);

        } catch (error) {
            console.error("장바구니 데이터 로딩 실패:", error);
            setError("장바구니 데이터를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 장바구니 데이터 로딩
    useEffect(() => {
        loadCartData();
    }, []);

    // 가격 계산 함수들
    const calculations = useMemo(() => {
        const totalOriginalPrice = cartItems.reduce((total, item) =>
            total + (item.originalPrice * item.quantity), 0
        );

        const totalDiscountPrice = cartItems.reduce((total, item) =>
            total + (item.discountPrice * item.quantity), 0
        );

        const totalDiscountAmount = totalOriginalPrice - totalDiscountPrice;

        // 배송비 계산 (5만원 이상 무료배송)
        const deliveryFee = totalDiscountPrice >= 50000 || cartItems.length === 0 ? 0 : 3000;

        const finalAmount = totalDiscountPrice + deliveryFee;

        return {
            totalOriginalPrice,
            totalDiscountPrice,
            totalDiscountAmount,
            deliveryFee,
            finalAmount
        };
    }, [cartItems]);

    // 장바구니에서 상품 삭제
    const handleRemoveFromCart = async (productId) => {
        try {
            // 필요시 서버에서 장바구니 아이템 삭제 API 호출
            // await axios.delete(`/api/carts/${productId}`, { withCredentials: true });

            console.log("상품 삭제:", productId);
            removeFromCart(productId);
        } catch (error) {
            console.error("장바구니 삭제 실패:", error);
        }
    };

    // 구매하기 버튼 클릭
    const handleBuyNow = () => {
        const orderProducts = cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            name: item.name,
            originalPrice: item.originalPrice,
            discountPrice: item.discountPrice,
            currentDiscountRate: item.currentDiscountRate,
            thumbnailUrl: item.thumbnailUrl,
            expiryDate: item.expiryDate,
        }));

        console.log("주문할 상품들:", orderProducts);

        navigate("/payment", {
            state: { orderProducts },
        });
    };

    // 유효기간 포맷팅 함수
    const formatExpiryDate = (expiryDate) => {
        if (!expiryDate) return '';
        try {
            return new Date(expiryDate).toLocaleDateString('ko-KR');
        } catch (error) {
            return '';
        }
    };

    // 로딩 상태
    if (loading) {
        return (
            <div className="sideCartModule viewModule moduleFrame1">
                <div className='moduleFrame2'>
                    <h2 className='sideModuleTitle'>장바구니</h2>
                </div>
                <div className='order-area'>
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <p>장바구니 데이터를 불러오는 중...</p>
                    </div>
                </div>
            </div>
        );
    }

    // 에러 상태
    if (error) {
        return (
            <div className="sideCartModule viewModule moduleFrame1">
                <div className='moduleFrame2'>
                    <h2 className='sideModuleTitle'>장바구니</h2>
                </div>
                <div className='order-area'>
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>
                        <button onClick={loadCartData} style={{ padding: '8px 16px' }}>
                            다시 시도
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="sideCartModule viewModule moduleFrame1">
            <div className='moduleFrame2'>
                <h2 className='sideModuleTitle'>장바구니</h2>
            </div>

            <div className='order-area'>
                <div className='order-inner moduleFrame2'>
                    <div className='sideCartTable moduleFrame2'>
                        <div className="sideCartTop">
                            총
                            <span className='cartTopCnt' style={{ fontWeight: '800' }}>
                                {cartItems.length}건
                            </span>
                        </div>
                    </div>

                    <div className="cartModuleMain">
                        {cartItems.length === 0 ? (
                            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#666' }}>
                                <p>장바구니가 비어있습니다.</p>
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <div className="productItem displayFlex" key={item.productId}>
                                    <div className="productUrl displayFlex">
                                        {item.thumbnailUrl && (
                                            <img
                                                src={item.thumbnailUrl}
                                                alt={item.name}
                                                style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    objectFit: 'cover',
                                                    marginRight: '10px',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                        )}
                                        <div className="productInfo" style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: "15.5px", margin: '0 0 4px 0' }}>
                                                {item.name}
                                            </h3>
                                            {item.expiryDate && (
                                                <p style={{ fontSize: "13px", color: '#666', margin: '0 0 4px 0' }}>
                                                    유효기간: {formatExpiryDate(item.expiryDate)}
                                                </p>
                                            )}
                                            <div className='displayFlex' style={{ alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                                                <p style={{ fontWeight: "600", margin: 0, color: '#e74c3c' }}>
                                                    {item.discountPrice?.toLocaleString()}원
                                                </p>
                                                {item.originalPrice !== item.discountPrice && (
                                                    <>
                                                        <p style={{
                                                            textDecoration: "line-through",
                                                            color: "#999",
                                                            fontSize: "14px",
                                                            margin: 0
                                                        }}>
                                                            {item.originalPrice?.toLocaleString()}원
                                                        </p>
                                                        <p style={{
                                                            fontSize: "13px",
                                                            color: "#e74c3c",
                                                            fontWeight: '600',
                                                            margin: 0
                                                        }}>
                                                            {item.currentDiscountRate}% 할인
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                            <p style={{ fontSize: "13px", color: '#666', margin: 0 }}>
                                                수량: {item.quantity}개
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveFromCart(item.productId)}
                                            style={{
                                                marginLeft: "auto",
                                                border: "none",
                                                background: "transparent",
                                                cursor: 'pointer',
                                                padding: '4px',
                                                alignSelf: 'flex-start',
                                                marginRight: '8px'
                                            }}
                                            title="상품 삭제"
                                        >
                                            <img src="../../../image/icon/close_X.svg" alt="삭제" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {cartItems.length > 0 && (
                        <div className='order-totalsummary moduleFrame1 moduleFrame2 displayFlex'>
                            <div className='order-subsummary displayFlex'>
                                <div>
                                    상품 금액
                                    <span>{calculations.totalOriginalPrice.toLocaleString()}원</span>
                                </div>
                                -
                                <div>
                                    할인 금액
                                    <span style={{ color: "#e74c3c" }}>
                                        {calculations.totalDiscountAmount.toLocaleString()}원
                                    </span>
                                </div>
                                +
                                <div>
                                    배송비
                                    <span>
                                        {calculations.deliveryFee > 0 ? `${calculations.deliveryFee.toLocaleString()}원` : "무료"}
                                    </span>
                                </div>
                            </div>
                            <div className='order-totalpay'>
                                결제 예정 금액
                                <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                                    {calculations.finalAmount.toLocaleString()}원
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {cartItems.length > 0 && (
                <div className='cartBuy moduleFrame1 moduleFrame2'>
                    <button className='cartBuyBtn' onClick={handleBuyNow}>
                        {cartItems.length}개 상품 구매하기
                    </button>
                </div>
            )}
        </div>
    );
}

export default CartViewModule;