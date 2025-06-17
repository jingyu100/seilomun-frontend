import React, { useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import "../../css/customer/SideBtnModules.css"; 
import { useCart } from "../../Context/CartContext";
import axios from "axios";

function CartViewModule() {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

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

//   const handleBuyNow = async (e) => {
//     e.preventDefault();
  
//     try {
//         const params = new URLSearchParams();
//         cartItems.forEach((item) => {
//           params.append("productIdList", item.productId);
//           params.append("quantityList", item.quantity);
//         });
        
//         const response = await axios.get(`/api/orders/cart/buy?${params.toString()}`, {
//           withCredentials: true
//         });        
  
//         const data = response.data;
//         console.log("장바구니 구매 응답:", data);
    
//         navigate("/payment", {
//             state: {
//             paymentInfo: data,
//             }
//         });
//     } catch (error) {
//       console.error("장바구니 구매 API 실패:", error);
//     }
//   };


const handleBuyNow = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost/api/orders/cart/buy", cartItems, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      const data = response.data;
      console.log("장바구니 구매 응답:", data);
  
      navigate("/payment", {
        state: {
          paymentInfo: data,
        }
      });
    } catch (error) {
      console.error("장바구니 구매 API 실패:", error);
    }
  }; 

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
          <button className='cartBuyBtn' onClick={handleBuyNow}>
            바로 구매
          </button>
        </div>
      )}
    </div>
  );
}

export default CartViewModule;
