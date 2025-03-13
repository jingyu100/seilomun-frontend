import React from "react";
import Header from "../components/Header.jsx";
import Footer from '../components/Footer.jsx'
import "../css/Login.css";
import logo from "../image/logo/spLogo.png";

function Login() {
  return (
    <div>
    <div className="header">
        <Header />
    </div>

        <div className="body sideMargin">
            <div className="login-container">
              {/* 좌측 영역 */}
              <div className="login-left">
                <img src={logo} alt="로고" className="logo" />
                <h2>"환경을 살리는 알뜰 쇼핑 플랫폼"</h2>
                <br></br>
                <h2>세일로문에 가입하실 방법을</h2>
                <h2>선택해주세요</h2>
                <br></br>
                <h4>유통기한 임박 상품 구매가</h4>
                <h4>환경 보호와 연결된다는 점</h4>
              </div>


              {/* 우측 로그인 영역 */}
              <div className="login-right">
                <div className="main-login">로그인
                </div>
                <form className="login-form">
                  <input type="text" placeholder="아이디" />
                  <input type="password" placeholder="비밀번호" />
                  <div className="options">
                    <label>
                      <input type="checkbox" /> 아이디 저장
                    </label>
                    <div className="links">
                      <a href="#">아이디 찾기</a> | <a href="#">비밀번호 재설정</a> |
                      <a href="#">회원가입</a>
                    </div>
                  </div>
                  <button type="submit" className="login-btn">
                    로그인
                  </button>
                  <hr class="divider"></hr>
                </form>
                <div className="social-login">
                  <p>간편하게 로그인</p>
                  <div className="social-icons">
                    <button className="google">G</button>
                    <button className="naver">N</button>
                    <button className="kakao">K</button>
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

export default Login;
