import React, { useState } from "react";
import "../css/Register.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

function Register() {
  const [emailDomain, setEmailDomain] = useState("");

  return (
    <div>
      <div className="header">
        <Header />
      </div>

      <div className="body sideMargin">
        <div className="register-Container">
          <div className ="register-title">회원가입</div>

          <hr className="separator"></hr>
          
          <div className="form-group">
            <label id="id-label">아이디<span class="required">*</span></label>
            <div class="input-container">
                <input type="text" id="id-input" placeholder="이메일을 입력해주세요" />
                <button id="id-check-btn">아이디 중복체크</button>
            </div>

            <div class="label-group">
                <label id="password-label">패스워드<span className="required">*</span></label>
                <label id="password-confirm-label">패스워드 확인</label>
            </div>

          <div class="input-row">
              <input type="password" id="password-input" placeholder="" />
              <input type="password" id="password-confirm-input" placeholder="" />
          </div>
          <p id="password-info">*패스워드는 영문 + 숫자 + 특수문자를 조합하여 8자 이상 입력해주세요</p>
          
          <div class="nick-label-group">
          <label id="nickname-label">닉네임<span className="required">*</span></label>
          </div>
            <div class="input-nick">
            <input type="text" id="nickname-input" placeholder="" />
            <button id="nickname-check-btn">닉네임 중복체크</button>
            </div>
          <p id="nickname-info">*게시글 작성시 사용할 닉네임을 입력해주세요</p>
      </div>


      </div>
    </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default Register;