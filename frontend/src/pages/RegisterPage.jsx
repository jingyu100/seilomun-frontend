import React, { useState } from "react";
import "../css/Register.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

function RegisterPage() {
  const [emailDomain, setEmailDomain] = useState("");

  return (
    <div>
      <div className="header">
        <Header />
      </div>

      <div className="body sideMargin">
        <div className="register-Container">
          <div className="register-title">회원가입</div>

          <hr className="separator"></hr>

          <div className="form-group">
            <label id="id-label">
              아이디<span class="required">*</span>
            </label>
            <div class="input-container">
              <input type="text" id="id-input" placeholder="이메일을 입력해주세요" />
              <button id="id-check-btn">아이디 중복체크</button>
            </div>

            <div class="label-group">
              <label id="password-label">
                패스워드<span className="required">*</span>
              </label>
              <label id="password-confirm-label">
                패스워드 확인<span className="required">*</span>
              </label>
            </div>

            <div class="input-row">
              <input type="password" id="password-input" placeholder="" />
              <input type="password" id="password-confirm-input" placeholder="" />
            </div>
            <p id="password-info">
              *패스워드는 영문 + 숫자 + 특수문자를 조합하여 8자 이상 입력해주세요
            </p>

            <div class="nick-label-group">
              <label id="nickname-label">
                닉네임<span className="required">*</span>
              </label>
            </div>
            <div class="input-nick">
              <input type="text" id="nickname-input" placeholder="" />
              <button id="nickname-check-btn">닉네임 중복체크</button>
            </div>
            <p id="nickname-info">*게시글 작성시 사용할 닉네임을 입력해주세요</p>

            <label id="name-label">
              이름<span class="required">*</span>
            </label>
            <div class="input-name">
              <input type="text" id="name-input" placeholder="이름을 입력해주세요" />
            </div>

            <label id="phone-label">
              전화번호<span className="required">*</span>
            </label>
            <div className="phone-input">
              <input type="text" id="phone-input-1" placeholder="" />
              <span>ㅡ</span>
              <input type="text" id="phone-input-2" placeholder="" />
              <span>ㅡ</span>
              <input type="text" id="phone-input-3" placeholder="" />
            </div>

            <label id="address-main-label">
              주소<span className="required">*</span>
            </label>
            <div className="address-group">
              <button id="housecode-btn">주소 찾기</button>
            </div>

            <div className="address-input-group">
              <input type="text" id="address-input" placeholder="" />
              <input
                type="text"
                id="address-detail"
                placeholder="상세주소를 입력해주세요."
              />
            </div>

            <label id="birth-label">
              생년월일<span className="required">*</span>
            </label>
            <div className="birth-input">
              <select id="birth-year">
                <option>선택</option>
                {[...Array(100)].map((_, i) => (
                  <option key={i}>{2025 - i}</option>
                ))}
              </select>
              <span className="date">년</span>
              <select id="birth-month">
                <option>선택</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1}>{i + 1}</option>
                ))}
              </select>
              <span className="date">월</span>
              <select id="birth-day">
                <option>선택</option>
                {[...Array(31)].map((_, i) => (
                  <option key={i + 1}>{i + 1}</option>
                ))}
              </select>
              <span className="date">일</span>
            </div>

            <div class="register-btn-container">
              <button id="register-btn">회원가입</button>
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

export default RegisterPage;
