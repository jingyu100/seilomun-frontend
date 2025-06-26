import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/seller/Business_number.css";
import logo from "../../image/logo/spLogo.png";

function Business_numberPage() {
  const navigate = useNavigate();

  const [bizNum, setBizNum] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  const handleVerify = async () => {
    if (!bizNum || !ownerName || !year || !month || !day) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const openDate = `${year}${month.padStart(2, "0")}${day.padStart(2, "0")}`;

    try {
      const response = await axios.post("http://3.39.239.179/api/auth/businessVerification", {
        bNo: bizNum,
        startDt: openDate,
        pNm: ownerName,
        pNm2: "",
        bNm: "",
        corpNo: "",
        bSector: "",
        bType: "",
        bAdr: ""
      });

      const isValid = response.data?.data?.isValid;

      if (isValid) {
        alert("사업자 인증 성공");
        navigate("/SeRegister", {
          state: {
            businessNumber: bizNum,
            ownerName,
            openDate
          }
        });
      } else {
        alert("사업자 인증 실패: 정보가 일치하지 않습니다.");
        console.log("요청 값:", {
          bNo: bizNum,
          startDt: openDate,
          pNm: ownerName
        });
        console.log("응답 데이터:", response.data);
      }
    } catch (error) {
      console.error("사업자 인증 오류:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="business-container">
      <div className="logo-section">
        <img src={logo} alt="로고" className="selogo3" />
        <h1 className="join-title">회원가입</h1>
      </div>

      <div className="form-section">
        {/* 사업자 등록번호 */}
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

        {/* 대표자 성명 */}
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

        {/* 개업일자 */}
        <div className="input-group">
          <label>
            개업일자<span className="required">*</span>
          </label>
          <div className="data-group">
            <select value={year} onChange={(e) => setYear(e.target.value)} className="date-select">
              <option value="">선택</option>
              {[...Array(76)].map((_, i) => {
                const y = 1950 + i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
            <span>년</span>

            <select value={month} onChange={(e) => setMonth(e.target.value)} className="date-select">
              <option value="">선택</option>
              {[...Array(12)].map((_, i) => {
                const m = (i + 1).toString().padStart(2, '0');
                return <option key={m} value={m}>{m}</option>;
              })}
            </select>
            <span>월</span>

            <select value={day} onChange={(e) => setDay(e.target.value)} className="date-select">
              <option value="">선택</option>
              {[...Array(31)].map((_, i) => {
                const d = (i + 1).toString().padStart(2, '0');
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
