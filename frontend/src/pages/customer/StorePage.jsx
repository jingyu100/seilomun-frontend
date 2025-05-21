import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import useStoreInfo from "../../Hooks/useStoreInfo.js";
import "../../css/customer/Store.css";
import Header from "../../components/Header.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";
import Footer from "../../components/Footer.jsx";
import StoreHead from "../../components/Store/StoreHead.jsx";
import StoreBody from "../../components/Store/StoreBody.jsx";

export default function StorePage() {
    const { store } = useStoreInfo();

    const sellerRegisterDto = store?.sellerRegisterDto;
    const sellerPhotoDto = store?.sellerPhotoDto;
    const sellerInformationDto = store?.sellerInformationDto;

  return (
    <div className="storeMain">
      <div className="header">
        <Header />
      </div>

      <div className="storeBanner">
        <img
          src={sellerPhotoDto?.photoUrl || "/image/ㅋㅍㅁㄱ.jpg"}
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
  );
}
