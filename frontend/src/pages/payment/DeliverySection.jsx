import React from "react";
import "./DeliverySection.css";

const DeliverySection = () => {
  return (
    <div className="delivery-section">
      <h3 className="section-title">배송지</h3>

      <div className="form-row">
        <label className="label">
          주소<span className="required">*</span>
        </label>
        <button className="btn">주소 선택</button>
        <button className="btn">주소 검색</button>
      </div>

      <input type="text" className="input" placeholder="기본주소" />
      <input type="text" className="input" placeholder="상세주소(선택 입력 가능)" />

      <div className="form-row">
        <label className="label">
          휴대전화<span className="required">*</span>
        </label>
        <input type="text" className="input small" />
        <span className="dash">-</span>
        <input type="text" className="input small" />
        <span className="dash">-</span>
        <input type="text" className="input small" />
      </div>

      <textarea className="textarea" placeholder="요청사항을 입력해주세요."></textarea>

      <div className="checkbox-row">
        <input type="checkbox" id="save-default" />
        <label htmlFor="save-default">기본 배송지에 저장</label>
      </div>
    </div>
  );
};

export default DeliverySection;
