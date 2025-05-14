import { useEffect, useState } from 'react';
import { useParams, Navigate } from "react-router-dom";
import "../../css/customer/Store.css";
import "../../css/customer/Product.css";
import Header from "../../components/Header.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";
import Footer from "../../components/Footer.jsx";
import StoreHead from "../../components/Store/StoreHead.jsx";
import StoreBody from "../../components/Store/StoreBody.jsx";
import { storeData } from "../../components/ProductDummies.js"; // 더미 데이터 불러오기
import ProductHead from '../../components/ProductPage/ProductHead.jsx';


export default function ProductPage() {
    

    return (
        <div className="storeMain">
            <div className="header">
                <Header />
            </div>

            <div className="storeBanner">
                <img
                    src={sellerPhotoDto?.photoUrl || "../../image/ㅋㅍㅁㄱ.jpg"}
                    alt="가게 메인 이미지"
                    className="storeImage"
                />
            </div>

            <div className="storeUI">
                <SideMenuBtn />
                <div className="storeInner">
                    <div className="storeMargin">
                        <div className="storeHead">
                            <StoreHead />
                        </div>

                        <div className='productDetail'>
                            <div className='productUI'>
                                <div className='productHead'>
                                    <ProductHead />
                                </div>

                                {/* 제품 추천 부분 */}
                                <div className='productRec'>
                                    
                                </div>

                                <div className='productBody'>

                                </div>
                            </div>
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