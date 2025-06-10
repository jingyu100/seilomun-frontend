import React, { useState, useRef, useEffect } from "react";
import "../../css/customer/Store.css";
import StoreMenu from "./StoreMenu";
import StoreMainInfo from "./StoreMainInfo";
// 추후 만들 컴포넌트
// import StoreReview from "./StoreReview";

export default function StoreBody({ store, sellerId }) {

    if (!store) return null;
    
    const { sellerInformationDto } = store;
    const [activeTab, setActiveTab] = useState("menu");

    const tabRefs = {
        menu: useRef(null),
        info: useRef(null),
        review: useRef(null),
    };

    const underlineRef = useRef(null);

    useEffect(() => {
        const updateUnderline = () => {
            const current = tabRefs[activeTab]?.current;
            const underline = underlineRef.current;
            
            if (current && underline) {
                underline.style.left = `${current.offsetLeft}px`;
                underline.style.width = `${current.offsetWidth}px`;
            }
        };

        updateUnderline();
        window.addEventListener("resize", updateUnderline);
    
        return () => {
            window.removeEventListener("resize", updateUnderline);
        };
    }, [activeTab]);
    
    const tabs = [
        { key: "menu", label: "메뉴", content: <StoreMenu /> },
        { key: "info", label: "정보", content: <StoreMainInfo 
                address= {sellerInformationDto?.address || "가게 정보 없음"}
                phone= {sellerInformationDto?.phone || "연락처 없음"}
                operatingHours= {sellerInformationDto?.operatingHours || "운영 시간 정보 없음"}
                storeDescription= {sellerInformationDto?.storeDescription || "설명 없음"}
            /> 
        },
        { key: "review", label: "리뷰", content: <div>리뷰 내용 (StoreReview 자리)</div> },
    ];

    return (
        <div className="storeBody">
            <div className="storeTabWrapper">
                <div className="tabUnderline" ref={underlineRef} />

                {tabs.map(({ key, label }) => (
                    <div
                        key={key}
                        ref={tabRefs[key]}
                        className={`storeTabItem ${activeTab === key ? "active" : ""}`}
                        onClick={() => setActiveTab(key)}
                    >
                        <p>{label}</p>
                    </div>
                ))}
            </div>

            <div>{tabs.find(tab => tab.key === activeTab)?.content}</div>
        </div>
    );
}
