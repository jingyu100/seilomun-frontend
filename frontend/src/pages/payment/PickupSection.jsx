import React from "react";
import "./PickupSection.css";
import KakaoMapApi from "../../components/KakaoMapApi";

const PickupSection = ({ seller }) => {
  // 매장 정보 가져오기
  const storeAddress = seller?.address;
  const storePhone = seller?.phone;

  return (
    <div className="pickup-section">
      <div className="pickup-header">
        <h2>포장/매장</h2>
      </div>

      {/* 지도 영역 */}
      <div className="map-container">
        {storeAddress ? (
          <KakaoMapApi address={storeAddress} width="100%" height="200px" margin="0" />
        ) : (
          <div
            style={{
              width: "100%",
              height: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              color: "#666",
            }}
          >
            매장 위치 정보를 불러오는 중...
          </div>
        )}
      </div>

      {/* 매장 정보 */}
      <div className="store-info">
        <div className="store-details">
          <div className="store-address">
            <span className="address-label">매장 주소:</span>
            <span className="address-text">
              {storeAddress || "매장 주소 정보를 불러오는 중..."}
            </span>
          </div>
          <div className="store-contact">
            <span className="contact-label">매장 전화번호:</span>
            <span className="contact-text">
              {storePhone || "매장 전화번호 정보를 불러오는 중..."}
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
