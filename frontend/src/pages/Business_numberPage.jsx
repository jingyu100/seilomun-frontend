import "../css/Business_number.css";
import logo from "../image/logo/spLogo.png";

function Business_numberPage() {
  return (
    <div className="body sideMargin">
      <div className="business-container">
        <div className="logo-section">
          <img src={logo} alt="로고" className="selogo" />
          <h1 className="join-title">회원가입</h1>
        </div>

        <div className="form-section">
          <div className="input-group">
            <label>사업자 등록번호<span className="required">*</span></label>
            <input type="text" placeholder="번호 입력" />
          </div>

          <div className="input-group">
            <label>대표자 성명<span className="required">*</span></label>
            <input type="text" placeholder="성명 입력" />
          </div>

          <div className="date-select">
          <label>개업일자<span className="required">*</span></label>
            <select>
              <option>선택</option>
              {[...Array(50)].map((_, i) => (
                <option key={i}>{1975 + i}</option>
              ))}
            </select>
            <span>년</span>

            <select>
              <option>선택</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1}>{i + 1}</option>
              ))}
            </select>
            <span>월</span>

            <select>
              <option>선택</option>
              {[...Array(31)].map((_, i) => (
                <option key={i + 1}>{i + 1}</option>
              ))}
            </select>
            <span>일</span>
          </div>

          <button className="verify-btn">사업자번호 인증</button>
        </div>
      </div>
    </div>
  );
}

export default Business_numberPage;
