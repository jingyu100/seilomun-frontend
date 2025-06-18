import React from "react";
import { Link } from "react-router-dom";
import StoreMiniInfo from "./StoreMiniInfo.jsx";
import Rating from "../StarRating.jsx";
import Inquiry from "./Inquiry.jsx";
import StoreInfo from "./StoreInfo.jsx";
import FavoriteButtonBox from "./FavoriteButtonBox.jsx";

export default function StoreHead({ store, sellerId, onOpenChat }) {

    if (!store) return null;

    const { sellerInformationDto } = store;

    return (
        <div className="storeHead">
            <div className="storeName">
                <Link to={`/sellers/${sellerId}`}>
                    <h1 className="storeName">{sellerInformationDto?.storeName || "상호 없음"}</h1>
                </Link>
            </div>
            <div className="storeHead-inner">
                <div className="storeHead-half storeHead-left">
                    <Rating />
                    <StoreMiniInfo
                      address={sellerInformationDto?.address || "가게 정보 없음"}
                      phone={sellerInformationDto?.phone || "전화번호 없음"}
                      minOrderAmount={sellerInformationDto?.minOrderAmount || "배달 주문 X"}
                      deliveryFees={
                        (sellerInformationDto?.deliveryFeeDtos || [])
                          .filter(fee => fee.deleted === false)
                          .sort((a, b) => a.ordersMoney - b.ordersMoney)
                      }
                    />
                </div>
                <div className="storeHead-half storeHead-right">
                    <Inquiry sellerId={sellerId} onOpenChat={onOpenChat} />
                    <StoreInfo
                        description={sellerInformationDto?.storeDescription || ""}
                        operatingHours={sellerInformationDto?.operatingHours || ""}
                        pickupTime={sellerInformationDto?.pickupTime || ""}
                        notification={sellerInformationDto?.notification || ""}
                        notificationPhotos={
                            (sellerInformationDto?.notificationPhotos || []).map(url =>
                                url.photoUrl.startsWith("http")
                                    ? url
                                    : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${url.photoUrl}`
                            )
                        }
                    />
                    <FavoriteButtonBox sellerId={sellerId} />
                </div>
            </div>
        </div>
    );
}