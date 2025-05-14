import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import "../../css/customer/Store.css";
import Rating from "../StarRating.jsx";
import StoreMiniInfo from "./StoreMiniInfo.jsx";
import Inquiry from "./Inquiry.jsx";
import StoreInfo from "./StoreInfo.jsx"
import { storeData } from "../ProductDummies.js"; // 더미 데이터 불러오기

export default function StoreHead() {

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

    return (
        <div className="storeHead">
            <div className="storeName">
            <img
                src={store?.sellerRegisterDto?.storeImageUrl || "../../image/상호샘플.png"}
                alt="가게 상호"
                className="storeName"
            />
            </div>
            <div className="storeHead-inner">
                <div className="storeHead-half storeHead-left">
                    <Rating />
                    <StoreMiniInfo
                        address={store?.sellerRegisterDto?.addressDetail || "주소 정보 없음"}
                        phone={store?.sellerRegisterDto?.phone || "전화번호 없음"}
                        minOrderAmount={store?.sellerInformationDto?.minOrderAmount || "정보 없음"}
                        deliveryFee={
                            store?.sellerInformationDto?.deliveryFeeDtos?.[0]?.deliveryTip || 0
                        }
                    />
                </div>
                <div className="storeHead-half storeHead-right">
                    <Inquiry />
                    <StoreInfo
                        description={store?.sellerInformationDto?.storeDescription || ""}
                        operatingHours={store?.sellerInformationDto?.operatingHours || ""}
                        pickupTime={store?.sellerInformationDto?.pickupTime || ""}
                        notification={store?.sellerInformationDto?.notification || ""}
                    />
                </div>
            </div>
        </div>
    )
}