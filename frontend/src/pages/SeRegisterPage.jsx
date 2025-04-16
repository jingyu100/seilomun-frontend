import React, { useState } from "react";
import "../css/SeRegister.css";
import logo from "../image/logo/spLogo.png"

function SeRegisterPage() {

    return (
    
     <div className="seRegisterPage-container">

      <div className="logo-section2">
        <img src={logo} alt="로고" className="selogo4" />
        <h1 className="join-title2">회원가입</h1>
      </div>

      <div className="form-group2">
            <label id="id-label2">
              아이디<span class="required2">*</span>
            </label>
            <div class="input-container">
              <input type="text" id="id-input2" placeholder="이메일을 입력해주세요" />
              <button id="id-check-btn2">아이디 중복체크</button>
            </div>

            <div class="label-group2">
              <label id="password-label2">
                패스워드<span className="required2">*</span>
              </label>
              <label id="password-confirm-label2">
                패스워드 확인<span className="required2">*</span>
              </label>
            </div>

            <div class="input-row2">
              <input type="password" id="password-input2" placeholder="" />
              <input type="password" id="password-confirm-input2" placeholder="" />
            </div>
            <p id="password-info2">
              *패스워드는 영문 + 숫자 + 특수문자를 조합하여 8자 이상 입력해주세요
            </p>

            <label id="name-label2">
              이름<span class="required2">*</span>
            </label>

            <div class="input-name2">
              <input type="text" id="name-input2" placeholder="이름을 입력해주세요" />
            </div>

            <label id="shop-label2">
              매장 이름<span class="required2">*</span>
            </label>

            <div class="input-shop2">
              <input type="text" id="shop-input2" placeholder="매장 이름을 입력해주세요" />
            </div>
        
            <label id="phone-label2">
              전화번호<span className="required2">*</span>
            </label>
            <div className="phone-input2">
              <input type="text" id="phone-input-11" placeholder="" />
              <span>ㅡ</span>
              <input type="text" id="phone-input-22" placeholder="" />
              <span>ㅡ</span>
              <input type="text" id="phone-input-33" placeholder="" />
            </div>

            <label id="address-main-label2">
              주소<span className="required2">*</span>
            </label>
            <div className="address-group2">
              <button id="housecode-btn2">주소 찾기</button>
            </div>

            <div className="address-input-group2">
              <input type="text" id="address-input2" placeholder="" />
              <input type="text"id="address-detail2"placeholder="상세주소를 입력해주세요."
              />
            </div>

            <div class="register-btn-container2">
              <button id="register-btn">회원가입</button>
            </div>
          </div>

     </div>
);
}

export default SeRegisterPage;
