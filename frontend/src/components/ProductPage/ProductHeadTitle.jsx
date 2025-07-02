import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import "../../css/customer/Product.css";
import LikeButtonBox from "./LikeButtonBox";

export default function ProductHeadTitle({
  sellerId,
  productId,
  productPhotoUrl,
  name,
  expiryDate,
  description,
  originalPrice,
  discountPrice,
  currentDiscountRate,
  stockQuantity,
}) {
  
  const navigate = useNavigate();
  const parsedOriginalPrice = parseInt(originalPrice) || 0;
  const parsedDisPrice = parseInt(discountPrice) || 0;
  const discountRate = parseInt(currentDiscountRate) || 0;

  // 수량 상태 추가
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    if (quantity >= stockQuantity) {
      alert("최대 수량입니다.");
      return;
    }
    setQuantity((q) => q + 1);
  };  
  const decreaseQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // 총 가격 계산
  const totalPrice = parsedDisPrice * quantity;

  // 장바구니 담기
  const { addToCart } = useCart();

  // 구매 버튼 클릭 - 결제페이지로 이동
  const handleBuyNow = (e) => {
    e.preventDefault();
    
    // 결제페이지로 상품 데이터와 판매자 ID 전달
    navigate("/payment", {
      state: {
        product: {
          id: productId,
          sellerId: sellerId,
          name: name,
          productPhotoUrl: productPhotoUrl ? [productPhotoUrl] : [],
          expiryDate: expiryDate,
          originalPrice: parsedOriginalPrice,
          discountPrice: parsedDisPrice,
          currentDiscountRate: discountRate,
          quantity: quantity,
          totalPrice: totalPrice,
          stockQuantity: stockQuantity,
        },
      },
    });
  };

  const handleAddCart = async (e) => {
    e.preventDefault();
    try {
      await addToCart(
        productId,
        quantity,
        name,
        productPhotoUrl,
        expiryDate,
        originalPrice,
        discountPrice,
        currentDiscountRate,
        totalPrice,
        stockQuantity,
      );
  
      console.log("🛒 장바구니 추가 요청:", {
        productId,
        quantity,
        name,
        productPhotoUrl,
        expiryDate,
        originalPrice,
        discountPrice,
        currentDiscountRate,
        totalPrice,
        stockQuantity,
      });
  
      alert(`장바구니에 ${name} ${quantity}개 추가되었습니다.`);
    } catch (error) {
      console.error("❌ 장바구니 추가 실패:", error);
      alert("장바구니 추가에 실패했습니다.");
    }
  };  

  return (
    <div className="productTitle">
      <div className="productTitle-inner">
        <div className="productTitle-head">
          <div className="productName">
            <h2>{name}</h2>
            <LikeButtonBox productId={productId} />
          </div>
          <div className="product-expiryDate">
            <p>{expiryDate}까지</p>
          </div>
          <div className="productDesc">
            <p>{description}</p>
          </div>
          <div className="productStockQuantity">
            <p>
              {stockQuantity > 0
                ? `남은 수량 : ${stockQuantity}`
                : "품절"}
            </p>
          </div>
          <div className="productPrice">
            <div className="price productFlex">
              <p>판매가</p>
              <p
                style={{
                  textDecoration: "line-through",
                  fontSize: "18px",
                }}
              >
                {parsedOriginalPrice.toLocaleString()}원
              </p>
            </div>
            <div className="productDiscount productFlex">
              <img
                src="../../../image/icon/icon_dicountArrow.png"
                alt="할인 아이콘"
                style={{
                  position: "relative",
                  display: "block",
                  width: "33px",
                }}
              />
              <p className="discountPercent">{discountRate}%</p>
            </div>
            <div className="discountedPrice productFlex">
              <p>할인가</p>
              <p
                style={{
                  fontSize: "25px",
                  fontWeight: "1000",
                }}
              >
                {parsedDisPrice.toLocaleString()}원
              </p>
            </div>
          </div>
        </div>

        <div
          className="productQuantity productFlex"
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 0",
          }}
        >
          <div
            className="productName"
            style={{
              fontWeight: "600",
            }}
          >
            <p>{name}</p>
          </div>
          <div
            className="plust-minus productFlex"
            style={{
              gap: "10px",
              alignItems: "center",
              fontWeight: "600",
              margin: "0 10px",
            }}
          >
            <button
              onClick={decreaseQuantity}
              style={{
                padding: "0 5px",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={increaseQuantity}
              style={{
                padding: "0 2px",
                fontSize: "20px",
              }}
            >
              +
            </button>
          </div>
        </div>

        <div className="productBuy">
          <div
            className="totalPrice-inner productFlex"
            style={{ justifyContent: "space-between", marginTop: "10px" }}
          >
            <span className="total">TOTAL</span>
            <div className="totalPrice productFlex">
              <p>{totalPrice.toLocaleString()} 원</p>
            </div>
          </div>
          <div className="productBuy-btns productFlex">
          <a
              href="#"
              className="buyBtn"
              onClick={handleBuyNow}
              style={{ pointerEvents: stockQuantity === 0 ? "none" : "auto", opacity: stockQuantity === 0 ? 0.5 : 1 }}
            >
              <div className="btnStyle1">바로구매하기</div>
              <div className="btnStyle2">BUY IT NOW</div>
            </a>

            <a
              href="#"
              className="cartBtn"
              onClick={handleAddCart}
              style={{ pointerEvents: stockQuantity === 0 ? "none" : "auto", opacity: stockQuantity === 0 ? 0.5 : 1 }}
            >
              <div className="btnStyle1">장바구니</div>
              <div className="btnStyle2">ADD CART</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
