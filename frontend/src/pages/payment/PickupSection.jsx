import React from "react";
import "./PickupSection.css";
import KakaoMapApi from "../../components/KakaoMapApi";

const PickupSection = ({ seller, pickupInfo, setPickupInfo }) => {
  // 매장 정보 가져오기
  const storeAddress = seller?.postCode;
  const storePhone = seller?.phone;

  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (phone) => {
    if (!phone) return "매장 전화번호 정보를 불러오는 중...";

    // 숫자만 추출
    const numbers = phone.replace(/[^0-9]/g, "");

    // 길이에 따른 포맷팅
    if (numbers.length === 11) {
      // 010-1234-5678
      return numbers.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    } else if (numbers.length === 10) {
      // 02-1234-5678 또는 031-123-4567
      if (numbers.startsWith("02")) {
        return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
      } else {
        return numbers.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
      }
    } else if (numbers.length === 9) {
      // 031-123-456
      return numbers.replace(/(\d{3})(\d{3})(\d{3})/, "$1-$2-$3");
    } else {
      // 그대로 반환
      return phone;
    }
  };

  // 요청사항 변경 핸들러
  const handleRequestChange = (value) => {
    setPickupInfo((prev) => ({
      ...prev,
      pickupRequest: value,
    }));
  };

  return (
    <div className="pickup-section">
      <div className="pickup-header">
        <h2>포장/매장</h2>
      </div>

      {/* 지도 영역 - 반응형 컨테이너 */}
      <div className="map-container">
        <div className="map-wrapper">
          {storeAddress ? (
            <KakaoMapApi
              address={storeAddress}
              width="100%"
              height="300px;"
              containerId="pickup-map"
            />
          ) : (
            <div className="map-loading">매장 위치 정보를 불러오는 중...</div>
          )}
        </div>
      </div>

      {/* 매장 정보 */}
      <div className="store-info">
        <div className="store-details">
          <div className="store-item">
            <span className="store-label">매장 주소</span>
            <span className="store-value">
              {storeAddress || "매장 주소 정보를 불러오는 중..."}
            </span>
          </div>
          <div className="store-item">
            <span className="store-label">전화번호</span>
            <span className="store-value">{formatPhoneNumber(storePhone)}</span>
          </div>
        </div>
      </div>

      {/* 요청사항 입력 */}
      <div className="request-section">
        <label className="request-label">요청사항</label>
        <textarea
          className="request-input"
          placeholder="포장 시 요청사항을 입력해주세요. (예: 포장 완료 시 문자 알림 부탁드립니다)"
          rows={3}
          value={pickupInfo.pickupRequest}
          onChange={(e) => handleRequestChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default PickupSection;
