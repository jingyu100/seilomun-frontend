import React, { useRef, useEffect } from "react";
import "../../css/customer/Product.css";
import LikeButtonBox from "./LikeButtonBox";

export default function ProductHeadTitle({
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

  return (
    <div className="productTitle">
      <div className="productTitle-inner">
        <div className="productTitle-head">
          <div className="productName">
            <h2>{name}</h2>
            <LikeButtonBox />
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
                {parsedOriginalPrice}원
              </p>
            </div>
            <div className="productDiscount productFlex">
              <img
                src="../../../image/icon/icon_dicountArrow.png"
                alt=""
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
                {parsedDisPrice}원
              </p>
            </div>
          </div>
        </div>

        <div className="productQuantity productFlex">
          <div className="productName">
            <p>{name}</p>
          </div>
          <div className="plust-minus productFlex"></div>
        </div>

        <div className="productBuy">
          <div className="totalPrice-inner productFlex">
            <span className="total">TOTAL</span>
            <div className="totalPrice productFlex">
              <p>토탈 가격 원</p>
              <span></span>
            </div>
          </div>
          <div className="productBuy-btns productFlex">
            <a href="" className="buyBtn" onClick={{}}>
              <div className="btnStyle1">바로구매하기</div>
              <div className="btnStyle2">BUY IT NOW</div>
            </a>
            <a href="" className="cartBtn">
              <div className="btnStyle1">장바구니</div>
              <div className="btnStyle2">ADD CART</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
