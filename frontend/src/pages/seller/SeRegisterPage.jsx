import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../css/seller/SeRegister.css";
import logo from "../../image/logo/spLogo.png";

function SeRegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const businessNumber = location.state?.businessNumber;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [storeName, setStoreName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");

  const phone = `${phone1}${phone2}${phone3}`;

  const handleRegister = async () => {
    if (!businessNumber) {
      alert("사업자 인증 정보가 없습니다. 처음부터 다시 진행해주세요.");
      navigate("/Business_numberPage");
      return;
    }

    if (password !== passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const payload = {
      email,
      businessNumber,
      password,
      storeName,
      categoryId, 
      phone,
      addressDetail,
    };

    console.log("회원가입 요청 데이터:", payload);

    try {
      const res = await axios.post("http://localhost/api/sellers", payload);

      const emailFromServer = res?.data?.data?.email;

      if (res.status === 200 && emailFromServer) {
        alert("회원가입이 완료되었습니다.");
        navigate("/selogin");
      } else {
        alert(res.data.message || "회원가입 실패");
      }
    } catch (err) {
      console.error(" 서버 응답 오류:", err.response?.data || err.message);
      alert(
        "회원가입 중 오류가 발생했습니다: " +
          (err.response?.data?.message || "회원가입 실패")
      );
    }
  };

  return (
    <div className="seRegisterPage-container">
      <div className="logo-section2">
        <img src={logo} alt="로고" className="selogo4" />
        <h1 className="join-title2">회원가입</h1>
      </div>

      {/* 아이디 */}
      <div className="form-group2">
        <label id="id-label2">
          아이디<span className="required2">*</span>
        </label>
        <div className="input-container2">
          <input
            type="text"
            id="id-input2"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button id="id-check-btn2">아이디 중복체크</button>
        </div>

      {/* 비밀번호 */}
        <div className="label-group2">
          <label id="password-label2">
            비밀번호<span className="required2">*</span>
          </label>
          <label id="password-confirm-label2">
            비밀번호 확인<span className="required2">*</span>
          </label>
        </div>

        <div className="input-row2">
          <input
            type="password"
            id="password-input2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="영문 + 숫자 + 특수문자를 조합하여 8자 이상 입력"
          />

          {/* 비밀번호 확인 */}
          <input
            type="password"
            id="password-confirm-input2"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            placeholder="비밀번호 재입력"
          />
        </div>
        <p id="password-info2">
          *비밀번호는 영문 + 숫자 + 특수문자를 조합하여 8자 이상 입력해주세요
        </p>

      {/* 이름 */}
        <label id="name-label2">
          이름<span className="required2">*</span>
        </label>
        <div className="input-name2">
          <input
            type="text"
            id="name-input2"
            placeholder="이름을 입력해주세요"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
        </div>

      {/* 전화번호 */}
        <label id="phone-label2">
          전화번호<span className="required2">*</span>
        </label>
        <div className="phone-input2">
          <input
            type="text"
            id="phone-input-11"
            value={phone1}
            onChange={(e) => setPhone1(e.target.value)}
          />
          <span>ㅡ</span>
          <input
            type="text"
            id="phone-input-22"
            value={phone2}
            onChange={(e) => setPhone2(e.target.value)}
          />
          <span>ㅡ</span>
          <input
            type="text"
            id="phone-input-33"
            value={phone3}
            onChange={(e) => setPhone3(e.target.value)}
          />
        </div>

      {/* 카테고리 */}
        <label id="category1">
          카테고리<span className="required2">*</span>
        </label>
        <select
          name="category2"
          id="category-select"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">선택</option>
          <option value="1">편의점</option>
          <option value="2">마트</option>
          <option value="3">빵집</option>
          <option value="4">식당</option>
        </select>

      {/* 주소 */}
        <label id="address-main-label2">
          주소<span className="required2">*</span>
        </label>
        <div className="address-group2">
          <button id="housecode-btn2">주소 찾기</button>
        </div>
        <div className="address-input-group2">
          <input
            type="text"
            id="address-input2"
            placeholder="도로명 주소"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          {/* 상세주소 */}
          <input
            type="text"
            id="address-detail2"
            placeholder="상세주소를 입력해주세요."
            value={addressDetail}
            onChange={(e) => setAddressDetail(e.target.value)}
          />
        </div>
        
        {/* 회원가입 버튼 */}
        <div className="register-btn-container2">
          <button id="register-btn2" onClick={handleRegister}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}

export default SeRegisterPage;