import { useRef, useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import useStoreInfo from "../../Hooks/useStoreInfo.js";
import useProductInfo from "../../Hooks/useProductInfo.js";
import "../../css/customer/Store.css";
import "../../css/customer/Product.css";
import Header from "../../components/Header.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";
import Footer from "../../components/Footer.jsx";
import StoreHead from "../../components/Store/StoreHead.jsx";
import StoreBody from "../../components/Store/StoreBody.jsx";
import ProductHead from "../../components/ProductPage/ProductHead.jsx";

export default function ProductPage() {
  const { store } = useStoreInfo();
  const { product } = useProductInfo();

  const sellerPhotoDto = store?.sellerPhotoDto;
  const sellerInformationDto = store?.sellerInformationDto;
  const productDto = product?.productDto;
  const productPhoto = product?.productPhoto;
  const productDocument = product?.productDocument;

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
            <div
              className="storeHead"
              style={{
                borderBottom: "1px solid #ededed",
              }}
            >
              <StoreHead />
            </div>

            <div className="productDetail">
              <div className="productUI">
                <div className="productHead">
                  <ProductHead />
                </div>

                <div className="productRec">{/* 제품 추천 */}</div>

                <div className="productBody">{/* 제품 설명 */}</div>
              </div>
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
