import React, { useRef, useEffect } from "react";
import "../../css/customer/Product.css";

export default function ProductHeadTitle({}) {


    // const discountRate  = parseInt(currentDiscountRate) || 0;
    
    return (
        <div className="productTitle">
            <div className="productTitle-inner">
                <div className="productTitle-head">
                    <div className="productName">
                        <h2>하이진저 레몬 하이진저 레몬 하이진저 레몬 하이진저 레몬 하이진저 레몬</h2>
                    </div>
                    <div className="product-expiryDate">
                        <p>2025년 11월 13일까지</p>
                    </div>
                    <div className="productDesc">
                        <p>한 스푼만 넣으면 커피명가 진저 레몬에이드 완성!</p>
                    </div>
                    <div className="productPrice">
                        <div className="price productFlex">
                            <p>판매가</p>
                            <p style={{
                                textDecoration: "line-through",
                                fontSize: "18px",
                            }}>30,000원</p>
                        </div>             
                        <div className="productDiscount productFlex">
                            <img src="../../../image/icon/icon_dicountArrow.png" 
                                alt="" 
                                style={{
                                    position: "relative",
                                    display: "block",
                                    width: "33px"
                                }}
                            />
                            <p className="discountPercent">{/* {currentDiscountRate.toLocaleString()} */}20%</p>
                        </div>
                        <div className="discountedPrice productFlex">
                            <p>할인가</p>
                            <p style={{
                                fontSize: "25px",
                                fontWeight: "1000",                                
                            }}>20,000원</p>
                        </div>                        
                    </div>
                </div>

                <div className="productQuantity productFlex">
                    <div className="productName">
                        <p>하이진저 레몬</p>                            
                    </div>
                    <div className="plust-minus productFlex">

                    </div>
                </div>
                
                <div className="productBuy">
                    <div className="totalPrice-inner productFlex">
                        <span className="total">TOTAL</span>
                        <div className="totalPrice productFlex">
                            <p>20,000원</p>
                            <span></span>
                        </div>
                    </div>
                    <div className="productBuy-btns productFlex">
                        <a href=""
                            className="buyBtn"
                        >
                            <div className="btnStyle1">바로구매하기</div>
                            <div className="btnStyle2">BUY IT NOW</div>
                        </a>
                        <a href=""
                            className="cartBtn"    
                        >
                            <div className="btnStyle1">장바구니</div>
                            <div className="btnStyle2">ADD CART</div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}