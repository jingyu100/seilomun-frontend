import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import "../../css/customer/Login.css";
import logo from "../../image/logo/spLogo.png";
import googleLogo from "../../image/logo/google.png";
import naverLogo from "../../image/logo/naver.png";
import kakaoLogo from "../../image/logo/kakao.png";
import phoneIcon from "../../image/icon/mobile-phone.png";
import useLogin from "../../Hooks/useLogin.js";
import axios from "axios";

function LoginPage() {
  const [showPhoneAuth, setShowPhoneAuth] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const { setIsLoggedIn, setUser, isLoading } = useLogin();
  const navigate = useNavigate();

  if (isLoading) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost/api/auth/login",
        {
          email: loginId,
          password: loginPassword,
          userType: "CUSTOMER",
        },
        {
          withCredentials: true,
        }
      );

      try {
        const response = await axios.get("http://localhost/api/customers/me", {
          withCredentials: true,
        });

        const { username, userType } = response.data.data;

        const userData = { nickname: username, userType };

        setUser(userData);
        setIsLoggedIn(true);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");

        console.log("로그인 성공! 사용자 정보:", userData, userType);
        navigate("/");
      } catch (infoError) {
        console.warn("사용자 정보 조회 실패. 하지만 로그인은 성공:", infoError);
        alert("로그인은 되었지만 사용자 정보를 불러오지 못했습니다.");
      }
    } catch (loginError) {
      console.error("로그인 실패:", loginError);
      alert("아이디 또는 비밀번호가 잘못되었습니다.");
    }
  };

  return (
    <div>
      <div className="header">
        <Header />
      </div>

      <div className="login-area">
        <div className="login-container">
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

          <div className="login-right">
            <div>
              <div className="main-login">로그인</div>
              <form className="login-form" onSubmit={handleLoginSubmit}>
                <input
                  type="text"
                  placeholder="아이디"
                  onChange={(e) => setLoginId(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="비밀번호"
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <div className="options">
                  <label>
                    <input type="checkbox" /> 아이디 저장
                  </label>
                  <div className="links">
                    <a href="#">아이디 찾기</a> | <a href="#">비밀번호 재설정</a> |{" "}
                    <a href="/register">회원가입</a>
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
                    style={{
                      backgroundImage: `url(${googleLogo})`,
                    }}
                    onClick={() =>
                      window.open("http://localhost:80/oauth2/authorization/google")
                    }
                  ></button>

                  <button
                    className="naver"
                    style={{
                      backgroundImage: `url(${naverLogo})`,
                    }}
                    onClick={() =>
                      window.open("http://localhost:80/oauth2/authorization/naver")
                    }
                  ></button>

                  <button
                    className="kakao"
                    style={{
                      backgroundImage: `url(${kakaoLogo})`,
                    }}
                    onClick={() =>
                      window.open("http://localhost:80/oauth2/authorization/kakao")
                    }
                  ></button>
                </div>
              </div>
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

export default LoginPage;
