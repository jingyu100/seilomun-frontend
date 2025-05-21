import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import useStoreInfo from "../../Hooks/useStoreInfo.js";
import "../../css/customer/Store.css";
import Rating from "../StarRating.jsx";
import StoreMiniInfo from "./StoreMiniInfo.jsx";
import Inquiry from "./Inquiry.jsx";
import StoreInfo from "./StoreInfo.jsx";

export default function StoreHead() {
   const { store } = useStoreInfo();
   
    if (!store) return;
  
    const { sellerRegisterDto, sellerInformationDto, sellerPhotoDto } = store;
   
  return (
    <div className="storeHead">
      <div className="storeName">
        <img
          src={sellerInformationDto?.storeImageUrl || "../../image/상호샘플.png"}
          alt="가게 상호"
          className="storeName"
        />
      </div>
      <div className="storeHead-inner">
        <div className="storeHead-half storeHead-left">
          <Rating />
          <StoreMiniInfo
            address={sellerInformationDto?.address || "주소 정보 없음"}
            phone={sellerInformationDto?.phone || "전화번호 없음"}
            minOrderAmount={sellerInformationDto?.minOrderAmount || "정보 없음"}
            deliveryFee={sellerInformationDto?.deliveryFeeDtos?.[0]?.deliveryTip || 0}
          />
        </div>
        <div className="storeHead-half storeHead-right">
          <Inquiry />
          <StoreInfo
            description={sellerInformationDto?.storeDescription || ""}
            operatingHours={sellerInformationDto?.operatingHours || ""}
            pickupTime={sellerInformationDto?.pickupTime || ""}
            notification={sellerInformationDto?.notification || ""}
          />
        </div>
      </div>
    </div>
  );
}
