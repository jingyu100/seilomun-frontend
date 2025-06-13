import React, { useMemo } from 'react';
import "../../css/customer/SideBtnModules.css"; 
import { useCart } from "../../Context/CartContext";

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

function CartViewModule() {

  const { cartItems, removeFromCart } = useCart();

  const totalProductPrice = useMemo(() => 
    cartItems.reduce((total, item) => total + item.originalPrice * item.quantity, 0),
    [cartItems]
  );
  
  const totalDiscount = useMemo(() => 
    cartItems.reduce((total, item) =>
      total + (item.originalPrice - item.discountPrice) * item.quantity,
    0),
    [cartItems]
  );

  const deliveryFee = totalProductPrice >= 50000 || cartItems.length === 0 ? 0 : 3000;
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
                {cartItems.length}건
              </span>
            </div>
          </div>
          
          <div className="cartModuleMain">
            {cartItems.length === 0 ? (
              <p>장바구니가 비어있습니다.</p>
            ) : (
              cartItems.map((item) => (
                <div className="productItem displayFlex" key={item.productId}>
                  <div className="productUrl displayFlex">
                    <div className="productInfo">
                        <h3 style={{ fontSize: "15.5px" }}>{item.name}</h3>
                        <p style={{ fontSize: "13px" }}>{item.date}</p>
                        <span className='displayFlex'>
                            <p style={{ fontWeight: "600" }}>{item.price}</p>
                            <p style={{ textDecoration: "line-through", color: "#959595" }}>
                                {item.regularPrice}
                            </p>
                            <p style={{ fontSize: "13px", color: "#ff0000" }}>{item.discount}</p>
                        </span>
                        <p style={{ fontSize: "13px" }}>{item.quantity}개</p>
                    </div>
                    <button 
                      onClick={() => {
                        console.log("삭제 시도:", item.productId);
                        removeFromCart(item.productId);
                      }} 
                      style={{ marginLeft: "auto", border: "none", background: "transparent" }}
                    >
                      <img src="../../../image/icon/close_X.svg" />
                    </button>
                  </div>
                </div>
              ))
            )}
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
                <span style={{ color: "#ff0000" }}>
                  {totalDiscount.toLocaleString()}원
                </span>
              </div>
            </div>
            <div className='order-totalpay'>
              주문 금액
              <span>{totalPay.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </div>

      {cartItems.length > 0 && (
        <div className='cartBuy moduleFrame1 moduleFrame2'>
          <button className='cartBuyBtn'>
            바로 구매
          </button>
        </div>
      )}
    </div>
  );
}

export default CartViewModule;