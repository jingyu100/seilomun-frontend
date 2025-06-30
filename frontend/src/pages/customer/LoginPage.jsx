import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import "../../css/customer/Login.css";
import logo from "../../image/logo/spLogo.png";
import googleLogo from "../../image/logo/google.png";
import naverLogo from "../../image/logo/naver.png";
import kakaoLogo from "../../image/logo/kakao.png";
import useLogin from "../../Hooks/useLogin.js";
import api, { API_BASE_URL } from "../../api/config.js"; // 👈 변경된 부분

function LoginPage() {
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const { setIsLoggedIn, setUser, isLoading } = useLogin();
  const navigate = useNavigate();

  if (isLoading) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      // 👇 변경된 부분: api 인스턴스 사용
      await api.post("/api/auth/login", {
        email: loginId,
        password: loginPassword,
        userType: "CUSTOMER",
      });

      try {
        // 👇 변경된 부분: api 인스턴스 사용
        const response = await api.get("/api/customers");

        console.log("API 응답 데이터:", response.data);
        const { id, nickname, email } = response.data.data.customer;
        const userType = "CUSTOMER";
        console.log("추출한 값들:", { id, nickname, userType });

        const userData = {
          id,
          email,
          nickname,
          userType,
        };

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
                    onClick={
                      () => window.open(`${API_BASE_URL}/oauth2/authorization/google`) // 👈 변경된 부분
                    }
                  ></button>

                  <button
                    className="naver"
                    style={{
                      backgroundImage: `url(${naverLogo})`,
                    }}
                    onClick={
                      () => window.open(`${API_BASE_URL}/oauth2/authorization/naver`) // 👈 변경된 부분
                    }
                  ></button>

                  <button
                    className="kakao"
                    style={{
                      backgroundImage: `url(${kakaoLogo})`,
                    }}
                    onClick={
                      () => window.open(`${API_BASE_URL}/oauth2/authorization/kakao`) // 👈 변경된 부분
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
