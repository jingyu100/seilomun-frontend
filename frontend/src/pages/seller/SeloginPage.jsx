import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../../css/seller/Selogin.css";
import logo from "../../image/logo/spLogo.png";

function SeloginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost/api/auth/login",
        {
          email,
          password,
          userType: "SELLER",
        },
        {
          withCredentials: true,
        }
      );

      alert("판매자 로그인 성공!");
      
      // TODO: 로그인 후 이동할 페이지 설정
      navigate("/selogin");
    } catch (err) {
      console.error("로그인 실패:", err.response?.data || err.message);
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="selogin-area">
      <div className="Selogin-inarea">
        <div className="Selogin-container">
          
          {/* 좌측 영역 */}
          <div className="login-left selogin-left">
            <img src={logo} alt="로고" className="selogo2" />
            <div className="selogin-text">
              <h2>"환경을 살리는 알뜰 쇼핑 플랫폼"</h2>
              <br />
              <h2>세일로문에 가입해주세요.</h2>
              <br />
              <h4>유통기한 임박 상품 구매가</h4>
              <h4>환경 보호와 연결된다는 점</h4>
            </div>
          </div>

          {/* 우측영역 */}
          <div className="login-right selogin-right">
            <div>
              <div className="main-login main-selogin">판매자 로그인</div>
              <form className="login-form selogin-form" onSubmit={handleLogin}>
                <input
                  type="text"
                  placeholder="아이디"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="options">
                  <label>
                    <input type="checkbox" /> 아이디 저장
                  </label>
                  <div className="links selinks">
                    <a href="#">아이디 찾기</a> | <a href="#">비밀번호 재설정</a>
                  </div>
                </div>
                <button type="submit" className="login-btn selogin-btn">
                  로그인
                </button>
                <button
                  type="button"
                  className="register-btn seregister-btn"
                  onClick={() => navigate("/Business_numberPage")}
                >
                  회원가입
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeloginPage;
