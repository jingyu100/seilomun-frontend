import { useNavigate } from "react-router-dom";
import "../css/Selogin.css";
import logo from "../image/logo/spLogo.png";

function SeloginPage() {
  const navigate = useNavigate();

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
              <div className="main-login main-selogin">사업자 로그인</div>
              <form className="login-form selogin-form">
                <input type="text" placeholder="아이디" />
                <input type="password" placeholder="비밀번호" />
                <div className="options">
                  <label>
                    <input type="checkbox" /> 아이디 저장
                  </label>
                  <div className="links selinks">
                    <a href="#">아이디 찾기</a> |<a href="#">비밀번호 재설정</a>
                  </div>
                </div>
                <button type="submit" className="login-btn selogin-btn">
                  로그인
                </button>
                <button
                  type="submit"
                  className="register-btn seregister-btn"
                  onClick={() => navigate("/Business_numberPage")}>
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
