import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "../css/Login.css";
import logo from "../image/logo/spLogo.png";
import phoneIcon from "../image/icon/mobile-phone.png";

function LoginPage() {
  const [showPhoneAuth, setShowPhoneAuth] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <div className="header">
        <Header />
      </div>

      <div className="body sideMargin">
        <div className="login-container">
          {/* 좌측 영역 */}
          <div className="login-left">
            <img src={logo} alt="로고" className="selogo" />
            <h2>"환경을 살리는 알뜰 쇼핑 플랫폼"</h2>
            <br />
            <h2>세일로문에 가입하실 방법을</h2>
            <h2>선택해주세요</h2>
            <br />
            <h4>유통기한 임박 상품 구매가</h4>
            <h4>환경 보호와 연결된다는 점</h4>
          </div>

          {/* 우측영역 */}
          <div className="login-right">
            {showPhoneAuth ? (
              <div className="phone-auth-container">
                <button
                  className="phone-auth-button"
                  onClick={() => navigate("/register")}
                >
                  <img
                    src={phoneIcon}
                    alt="휴대폰 인증 아이콘"
                    className="phone-auth-icon"
                  />
                  <span>휴대폰 인증</span>
                </button>
              </div>
            ) : (
              <div>
                <div className="main-login">로그인</div>
                <form className="login-form">
                  <input type="text" placeholder="아이디" />
                  <input type="password" placeholder="비밀번호" />
                  <div className="options">
                    <label>
                      <input type="checkbox" /> 아이디 저장
                    </label>
                    <div className="links">
                      <p href="#">아이디 찾기</p> |<p href="#">비밀번호 재설정</p> |
                      <p
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPhoneAuth(true);
                        }}
                      >
                        회원가입
                      </p>
                    </div>
                  </div>
                  <button type="submit" className="login-btn">
                    로그인
                  </button>
                  <hr className="divider"></hr>
                </form>
                <div className="social-login">
                  <p>간편하게 로그인</p>
                  <div className="social-icons">
                    <button
                      className="google"
                      onClick={() => window.open("https://www.google.com", "_blank")}
                    >
                      G
                    </button>
                    <button
                      className="naver"
                      onClick={() => window.open("https://www.naver.com", "_blank")}
                    >
                      N
                    </button>
                    <button
                      className="kakao"
                      onClick={() => window.open("https://www.kakao.com", "_blank")}
                    >
                      K
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default LoginPage;
