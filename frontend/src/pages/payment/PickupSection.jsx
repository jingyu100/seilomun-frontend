import React from "react";
import "./PickupSection.css";
import KakaoMapApi from "../../components/KakaoMapApi";

const PickupSection = ({ sellerProducts }) => {
  return (
    <div className="pickup-section">
      <div className="pickup-header">
        <h2>포장/매장</h2>
      </div>

      {/* 지도 영역 */}
      <div className="map-container">
        <KakaoMapApi
          address="대구 중구 달성로 15-7 달성빌딩 16-3번지 2층"
          width="100%"
          height="200px"
          margin="0"
        />
      </div>

      {/* 매장 정보 */}
      <div className="store-info">
        <div className="store-details">
          <div className="store-address">
            <span className="address-label">매장 주소:</span>
            <span className="address-text">
              대구 중구 달성로 15-7 달성빌딩 16-3번지 2층
            </span>
          </div>
          <div className="store-contact">
            <span className="contact-label">매장 전화번호:</span>
            <span className="contact-text">
              {sellerProducts?.phone || "053-367-1234"}
            </span>
          </div>
        </div>
      </div>

      {/* 요청사항 입력 */}
      <div className="request-section">
        <textarea
          className="request-input"
          placeholder="요청사항을 입력해주세요."
          rows={3}
        />
      </div>
    </div>
  );
};

export default PickupSection;
