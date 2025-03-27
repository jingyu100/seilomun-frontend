import React, { useState } from 'react';
import '../../css/SideBtnModules.css';
import CartItem from "../CartItem.jsx";
import ProductsAlarm from '../ProductsAlarm.jsx';

function CartViewModule () {
    const [cart, setCart] = useState([]); // 장바구니 상태

    // 상품 추가 함수
    const addToCart = (productId) => {
        const selectedProduct = ProductsAlarm.find(product => product.id === productId);
        if (selectedProduct) {
            setCart([...cart, selectedProduct]); // 기존 장바구니에 추가
        }
    };

    // 상품 삭제 함수
    const removeFromCart = (productId) => {
        setCart(cart.filter(product => product.id !== productId));
    };

    // 총 상품 금액 계산
    const totalProductPrice = cart.reduce((total, product) => {
        return total + parseInt(product.price.replace(/[^0-9]/g, ""), 10);
    }, 0);

    // 총 할인 금액 계산
    const totalDiscount = cart.reduce((total, product) => {
        const originalPrice = parseInt(product.regularPrice.replace(/[^0-9]/g, ""), 10);
        const salePrice = parseInt(product.price.replace(/[^0-9]/g, ""), 10);
        return total + (originalPrice - salePrice);
    }, 0);

    // 배송비 (예제: 5만원 이상 무료 배송, 이하 3000원)
    const deliveryFee = totalProductPrice >= 50000 ? 0 : (cart.length > 0 ? 3000 : 0);

    // 최종 결제 금액
    const totalPay = totalProductPrice + deliveryFee;

    return (
        <div className="sideCartModule viewModule moduleFrame1">
            <div className='moduleFrame2'>
                <h2 className='sideModuleTitle'>장바구니</h2>
            </div>

            {cart.length === 0 ? (
                <div className="cartModuleMain">
                    <p>장바구니에 담긴 상품이 없습니다.</p>
                </div>
            ) : (
                <div>
                    <div className='order-area'>
                        <div className='order-inner moduleFrame2'>
                            <div className='sideCartTable moduleFrame2'>
                                <div className="sideCartTop">
                                    총 
                                    <span className='cartTopCnt' style={{ fontWeight: '800' }}>
                                        {cart.length}건
                                    </span>
                                </div>
                                
                                <div className="cartModuleMain">
                                    {cart.map((product) => (
                                        <CartItem 
                                            key={product.id} 
                                            product={product} 
                                            removeFromCart={removeFromCart} 
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className='order-totalsummary moduleFrame1 moduleFrame2'>
                                <div className='order-subsummary'>
                                    <div>
                                        선택 상품 금액
                                        <span>{totalProductPrice.toLocaleString()} 원</span>
                                    </div>
                                    <div>
                                        총 배송비
                                        <span>{deliveryFee > 0 ? `${deliveryFee.toLocaleString()} 원` : "무료"}</span>
                                    </div>
                                    <div>
                                        할인 금액
                                        <span>{totalDiscount.toLocaleString()} 원</span>
                                    </div>
                                </div>
                                <div className='order-totalpay'>
                                    주문 금액
                                    <span>{totalPay.toLocaleString()} 원</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='cartBuy moduleFrame1 moduleFrame2'>
                        <button className='cartBuyBtn' disabled={cart.length === 0}>
                            바로 구매
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartViewModule;
