import { useRef, useEffect, useState } from 'react';
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
    
    const { sellerId } = useParams();
    const [store, setStore] = useState(storeData[0]); // 기본 첫 번째 더미 사용
    // 나중에 백엔드 데이터를 받을 때 주석 풀기
    // const [store, setStore] = useState(null);

    // 백엔드 연동 시 sellerId 기준으로 선택
    useEffect(() => {
        if (!sellerId) return;

        const fetchStore = async () => {
            try {
                // API에서 받은 sellerId로 매칭
                const selectedStore = storeData.find(store => store.sellerRegisterDto.storeName === sellerId);
                if (selectedStore) {
                    setStore(selectedStore);
                } else {
                    console.error("가게 데이터를 찾을 수 없습니다.");
                }
            } catch (error) {
                console.error("가게 데이터 가져오기 실패:", error);
            }
        };

        fetchStore();
    }, [sellerId]);

    const { sellerRegisterDto, sellerInformationDto, sellerPhotoDto } = store;

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
                        <div className="storeHead"
                            style={{
                                borderBottom: "1px solid #ededed"
                            }}
                        >
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