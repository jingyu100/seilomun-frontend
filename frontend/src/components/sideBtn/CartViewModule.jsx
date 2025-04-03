import React, { useState } from 'react';
import '../../css/SideBtnModules.css';
import CartItem from "../CartItem.jsx";

const ProductsAlarm = [    
    {
        id: 'qdsf115eg',
        name: "커피 원두",
        price: "3,000원",
        regularPrice: "5,000원",
        address: "대구광역시 북구 복현동",
        discount: "40%",
        image: '/image/product1.jpg',
        date: "2025년 11월 13일까지",
        url: 'https://myungga.com/product/%EB%B8%8C%EB%9D%BC%EC%A7%88-%EB%AA%AC%ED%85%8C-%EC%95%8C%EB%A0%88%EA%B7%B8%EB%A0%88-%EB%AC%B8%EB%8F%84-%EB%85%B8%EB%B3%B4/161/category/49/display/1/',
        state: '해당 상품의 주문이 취소되었습니다.',
        sellerId: "",
        BRNumber: "123456"
    },
    {
        id: "f115eg",
        name: "발효훈연소시지 1팩 (50g*4개) 2종",
        price: "3,000원",
        regularPrice: "5,000원",
        address: "대구광역시 북구 복현동",
        discount: "40%",
        image: "/image/product1.jpg",
        date: "2024년 11월 13일까지",
        url: "",
        state: "해당 상품이 배송을 시작했습니다.",
        sellerId: "",
        BRNumber: "9876432"
    },
    {
        id: "f115eg",
        name: "발효훈연소시지 1팩 (50g*4개) 2종",
        price: "3,000원",
        regularPrice: "5,000원",
        address: "대구광역시 북구 복현동",
        discount: "40%",
        image: "/image/product1.jpg",
        date: "2024년 11월 13일까지",
        url: "",
        state: "해당 상품이 배송을 시작했습니다.",
        sellerId: "",
        BRNumber: "9876432"
    }
];

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
        setCart(ProductsAlarm.filter(product => product.id !== productId));
    };

    // 총 상품 본 금액 계산
    const totalProductPrice = ProductsAlarm.reduce((total, product) => {
        return total + parseInt(product.regularPrice.replace(/[^0-9]/g, ""), 10);
    }, 0);

    // 총 할인 금액 계산
    const totalDiscount = ProductsAlarm.reduce((total, product) => {
        const originalPrice = parseInt(product.regularPrice.replace(/[^0-9]/g, ""), 10);
        const salePrice = parseInt(product.price.replace(/[^0-9]/g, ""), 10);
        return total + (originalPrice - salePrice);
    }, 0);

    // 배송비 (5만원 이상 무료 배송, 이하 3000원)
    const deliveryFee = totalProductPrice >= 50000 ? 0 : (ProductsAlarm.length > 0 ? 3000 : 0);

    // 최종 결제 금액
    const totalPay = totalProductPrice + deliveryFee - totalDiscount;

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
                                {ProductsAlarm.length}건
                            </span>
                        </div>
                    </div>
                    
                    <div className="cartModuleMain">
                        {ProductsAlarm.map((product) => (
                            <div className="productItem displayFlex">
                                <a key={product.id} href={product.url} target="_blank" rel="noopener noreferrer"
                                    className='productUrl displayFlex'
                                > {/* target="_blank"와 rel="noopener noreferrer"으로 새 창으로 열리게 */}
                                    <img src={product.image} alt={product.name} className="productImage" />
                                    <div className="productInfo">
                                        <h3 style={{ fontSize: "15.5px" }}>{product.name}</h3>
                                        <p className='' style={{
                                            fontSize: "13px"
                                        }}>{product.date}</p>
                                        <span className='displayFlex'>
                                            <p style={{ fontWeight: "600" }}>{product.price}</p>
                                            <p style={{ textDecoration: "line-through", color: "#959595" }}>
                                                {product.regularPrice}
                                            </p>
                                            <p style={{ fontSize: "13px", color: "#ff0000" }}>{product.discount}</p>
                                        </span>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>

                    <div className='order-totalsummary moduleFrame1 moduleFrame2 displayFlex'>
                        <div className='order-subsummary displayFlex'>
                            <div>
                                선택 상품 금액
                                <span>{totalProductPrice.toLocaleString()}원</span>
                            </div>
                            +
                            <div>
                                총 배송비
                                <span>{deliveryFee > 0 ? `${deliveryFee.toLocaleString()}원` : "무료"}</span>
                            </div>
                            -
                            <div>
                                할인 금액
                                <span style={{
                                                color: "#ff0000",
                                            }}>{totalDiscount.toLocaleString()}원</span>
                            </div>
                        </div>
                        <div className='order-totalpay'>
                            주문 금액
                            <span>{totalPay.toLocaleString()}원</span>
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
    );
}

export default CartViewModule;
