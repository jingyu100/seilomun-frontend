import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "../css/Login.css";
import logo from "../image/logo/spLogo.png";
import phoneIcon from "../image/icon/mobile-phone.png";

function LoginPage() {
  const [showPhoneAuth, setShowPhoneAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetch("http://localhost:80/login/oauth2/code/naver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("백엔드 응답:", data);
          if (data.accessToken) {
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            navigate("/"); // 로그인 성공 후 홈으로 이동
          } else {
            console.error("로그인 실패:", data);
            navigate("/login?error=true");
          }
        })
        .catch((error) => {
          console.error("네트워크 오류:", error);
          navigate("/login?error=true");
        });
    }
  }, [navigate]);

  const handleNaverLogin = () => {
    window.location.href = "http://localhost:80/oauth2/authorization/naver";
  };

  return (
    <div>
      <div className="header">
        <Header />
      </div>

      <div className="login-area">
        <div className="login-container">
          {/* 좌측 영역 */}
          <div className="login-left">
            <img src={logo} alt="로고" className="selogo1" />
            <div className="login-text">  
              <h2>"환경을 살리는 알뜰 쇼핑 플랫폼"</h2>
              <br />
              <h2>세일로문에 가입하실 방법을</h2>
              <h2>선택해주세요</h2>
              <br />
              <h4>유통기한 임박 상품 구매가</h4>
              <h4>환경 보호와 연결된다는 점</h4>
            </div>  
          </div>

          {/* 우측 영역 */}
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
                      <a href="#">아이디 찾기</a> |<a href="#">비밀번호 재설정</a> |
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPhoneAuth(true);
                        }}
                      >
                        회원가입
                      </a>
                    </div>
                  </div>
                  <button type="submit" className="login-btn">
                    로그인
                  </button>
                  <hr className="divider" />
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
                          onClick={() => window.open("http://localhost:80/oauth2/authorization/naver", "_blank")}
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
