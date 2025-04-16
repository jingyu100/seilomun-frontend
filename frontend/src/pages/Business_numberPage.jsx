import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Business_number.css";
import logo from "../image/logo/spLogo.png";

function Business_numberPage() {
  const navigate = useNavigate();

  return (
      <div className="business-container">
        <div className="logo-section">
          <img src={logo} alt="로고" className="selogo3" />
          <h1 className="join-title">회원가입</h1>
        </div>

        <div className="form-section">
          <div className="input-group">
            <label>사업자 등록번호<span className="required">*</span></label>
            <input type="text" placeholder="번호 입력" />
          </div>

          <div className="input-group">
            <label>대표자 성명<span className="required">*</span></label>
            <input type="text" placeholder="성명 입력" />
          </div>

          <div className="input-group">
          <label>개업일자<span className="required">*</span></label>

          <div className="data-group">
            <select className="date-select"> 
              <option>선택</option>
              {[...Array(50)].map((_, i) => (
                <option key={i}>{1975 + i}</option>
              ))}
            </select>
            <span>년</span>

            <select className="date-select">
              <option>선택</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1}>{i + 1}</option>
              ))}
            </select>
            <span>월</span>

            <select className="date-select">
              <option>선택</option>
              {[...Array(31)].map((_, i) => (
                <option key={i + 1}>{i + 1}</option>
              ))}
            </select>
            <span>일</span>
            </div>
            </div>
          </div>

          <button className="verify-btn" 
          onClick={() => navigate("/SeRegister")}
          >사업자번호 인증</button>
        </div>
  );
}

export default Business_numberPage;
