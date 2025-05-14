import React, { useRef, useEffect } from "react";
import "../../css/customer/Product.css";

export default function ProductHeadTitle({}) {


    const discountRate  = parseInt(currentDiscountRate) || 0;
    
    return (
        <div className="productTitle">
            <div className="productTitle-inner">
                <div className="productTitle-head">
                    <div className="productName">
                        <h3></h3>
                    </div>
                    <div className="product-expiryDate">
                        <h5></h5>
                    </div>
                    <div className="productDesc">
                        <h5></h5>
                    </div>
                    <div className="productPrice">
                        <span className="price"></span>
                        <div className="productDiscount">
                            <img src="../../../image/icon/icon_dicountArrow.png" 
                                alt="" 
                                style={{

                                }}
                            />
                        </div>
                        <span className="discountedPrice">{currentDiscountRate.toLocaleString()}%</span>
                    </div>
                    <div className="productQuantity">
                        <div className="productName">
                            <h5></h5>                            
                        </div>
                        <div className="plust-minus">

                        </div>
                    </div>
                    <div className="productBuy">
                        <div className="totalPrice-inner">
                            <span className="total">TOTAL</span>
                            <div className="totalPrice">
                                <span></span>
                                <span></span>
                            </div>
                            <div className="productBuy-btns">
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
            </div>
        </div>
    )
}