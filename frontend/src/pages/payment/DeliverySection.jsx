import React from "react";
import "./DeliverySection.css";

const DeliverySection = () => {
  return (
    <div className="delivery-section">
      <h3 className="section-title">배송지</h3>

      {/* 주소 선택 영역 */}
      <div className="address-selector">
        <label className="address-label">
          주소<span className="required">*</span>
        </label>
        <div className="address-buttons">
          <button className="address-select-btn">주소 선택</button>
          <button className="address-search-btn">주소 검색</button>
        </div>
      </div>

      {/* 주소 입력 필드들 */}
      <div className="address-inputs">
        <input
          type="text"
          className="address-main-input"
          placeholder="기본주소를 입력하세요"
        />
        <input
          type="text"
          className="address-detail-input"
          placeholder="상세주소를 입력하세요 (동, 호수 등)"
        />
      </div>

      {/* 휴대전화 입력 영역 */}
      <div className="phone-section">
        <label className="phone-label">
          휴대전화<span className="required">*</span>
        </label>
        <div className="phone-inputs-container">
          <input
            type="text"
            className="phone-input-first"
            maxLength="3"
            placeholder="010"
          />
          <span className="phone-separator">-</span>
          <input
            type="text"
            className="phone-input-middle"
            maxLength="4"
            placeholder="1234"
          />
          <span className="phone-separator">-</span>
          <input
            type="text"
            className="phone-input-last"
            maxLength="4"
            placeholder="5678"
          />
        </div>
      </div>

      {/* 요청사항 입력 영역 */}
      <div className="request-section">
        <textarea
          className="request-textarea"
          placeholder="배송 시 요청사항을 입력해주세요 (예: 문 앞에 놓아주세요, 부재 시 경비실에 맡겨주세요)"
          rows={3}
        ></textarea>
      </div>

      {/* 체크박스 영역 */}
      <div className="checkbox-section">
        <input type="checkbox" id="save-default" className="save-default-checkbox" />
        <label htmlFor="save-default" className="save-default-label">
          기본 배송지로 저장
        </label>
      </div>
    </div>
  );
};

export default DeliverySection;
