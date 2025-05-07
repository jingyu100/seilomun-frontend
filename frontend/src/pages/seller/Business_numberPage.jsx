import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/seller/Business_number.css"; 
import logo from "../../image/logo/spLogo.png";

function Business_numberPage() {
  const navigate = useNavigate();

  const [bizNum, setBizNum] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  const handleVerify = () => {
    if (!bizNum || !ownerName || !year || !month || !day) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const openDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

    alert("사업자 인증이 임시로 통과되었습니다.");

    navigate("/SeRegister", {
      state: {
        businessNumber: bizNum,
        ownerName,
        openDate
      }
    });
  };

  return (
    <div className="business-container">
      <div className="logo-section">
        <img src={logo} alt="로고" className="selogo3" />
        <h1 className="join-title">회원가입</h1>
      </div>

      <div className="form-section">
        <div className="input-group">
          <label>
            사업자 등록번호<span className="required">*</span>
          </label>
          <input
            type="text"
            placeholder="번호만 입력"
            value={bizNum}
            onChange={(e) => setBizNum(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>
            대표자 성명<span className="required">*</span>
          </label>
          <input
            type="text"
            placeholder="성명 입력"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>
            개업일자<span className="required">*</span>
          </label>
          <div className="data-group">
            <select value={year} onChange={(e) => setYear(e.target.value)} className="date-select">
              <option value="">선택</option>
              {[...Array(50)].map((_, i) => {
                const y = 1975 + i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
            <span>년</span>

            <select value={month} onChange={(e) => setMonth(e.target.value)} className="date-select">
              <option value="">선택</option>
              {[...Array(12)].map((_, i) => {
                const m = i + 1;
                return <option key={m} value={m}>{m}</option>;
              })}
            </select>
            <span>월</span>

            <select value={day} onChange={(e) => setDay(e.target.value)} className="date-select">
              <option value="">선택</option>
              {[...Array(31)].map((_, i) => {
                const d = i + 1;
                return <option key={d} value={d}>{d}</option>;
              })}
            </select>
            <span>일</span>
          </div>
        </div>

        <button className="verify-btn" onClick={handleVerify}>
          사업자번호 인증
        </button>
      </div>
    </div>
  );
}

export default Business_numberPage;
