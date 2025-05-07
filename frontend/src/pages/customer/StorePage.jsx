import React, { useState, useRef, useEffect } from "react";
import "../../css/customer/Store.css";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import Rating from "../../components/StarRating.jsx";
import StoreMiniInfo from "../../components/Store/StoreMiniInfo.jsx";
import Inquiry from "../../components/Store/Inquiry.jsx";
import StoreInfo from "../../components/Store/StoreInfo.jsx";
import StoreBody from "../../components/Store/StoreBody.jsx";


export default function StorePage() {


    return (
        <div className="storeMain">
            <div className="header">
                <Header />
            </div>

            <div className="storeBanner">
                <img src="../../image/ㅋㅍㅁㄱ.jpg"
                    alt="가게 메인 이미지"
                    className="storeImage"
                />
            </div>

            <div className="storeUI">
                <div className="storeInner">
                    <div className="storeMargin">
                        <div className="storeHead">
                            <div className="storeName">
                                <img src="../../image/상호샘플.png" alt="가게 상호" className="storeName" />
                            </div>
                            <div className="storeHead-inner">
                                <div className="storeHead-half storeHead-left">
                                    <Rating />
                                    <StoreMiniInfo />
                                </div>
                                <div className="storeHead-half storeHead-right">
                                    <Inquiry />
                                    <StoreInfo />
                                </div>
                            </div>
                        </div>
                        
                        <div className="storeBody">
                            <StoreBody />
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer">
                <Footer />
            </div>
        </div>
    )
}