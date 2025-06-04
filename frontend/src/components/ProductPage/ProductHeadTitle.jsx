import React, { useState, useRef, useEffect } from "react";
import "../../css/customer/Product.css";
import LikeButtonBox from "./LikeButtonBox";

export default function ProductHeadTitle({
  productId,
  thumbnailUrl,
  name,
  expiryDate,
  description,
  originalPrice,
  discountPrice,
  maxDiscountRate,
  minDiscountRate,
  currentDiscountRate,
}) {
  const parsedOriginalPrice = parseInt(originalPrice) || 0;
  const parsedDisPrice = parseInt(discountPrice) || 0;
  const discountRate = parseInt(currentDiscountRate) || 0;

  // 수량 상태 추가
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity((q) => q + 1);
  const decreaseQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // 총 가격 계산
  const totalPrice = parsedDisPrice * quantity;

  // 구매 버튼 클릭 예시
  const handleBuyNow = () => {
    alert(`구매하기: ${name} ${quantity}개, 총 ${totalPrice}원`);
  };

  const handleAddCart = () => {
    alert(`장바구니에 추가: ${name} ${quantity}개`);
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

        <div className="productQuantity productFlex" style={{ alignItems: "center" }}>
          <div className="productName">
            <p>{name}</p>
          </div>
          <div
            className="plust-minus productFlex"
            style={{ gap: "10px", alignItems: "center" }}
          >
            <button onClick={decreaseQuantity} style={{ padding: "5px 10px" }}>
              -
            </button>
            <span>{quantity}</span>
            <button onClick={increaseQuantity} style={{ padding: "5px 10px" }}>
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
            <a href="" className="buyBtn" onClick={handleBuyNow}>
              <div className="btnStyle1">바로구매하기</div>
              <div className="btnStyle2">BUY IT NOW</div>
            </a>
            <a href="" className="cartBtn" onClick={handleAddCart}>
              <div className="btnStyle1">장바구니</div>
              <div className="btnStyle2">ADD CART</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
