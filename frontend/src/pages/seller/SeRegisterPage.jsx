import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../css/seller/SeRegister.css";
import logo from "../../image/logo/spLogo.png";

function SeRegisterPage() {
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [authSent, setAuthSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);
  const location = useLocation();

  const businessNumber = location.state?.businessNumber;
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [storeName, setStoreName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");

  const navigate = useNavigate();

  const phone = `${phone1}${phone2}${phone3}`;

  // 팝업 열기 함수
  const openAddressPopup = () => {
    window.open(
      "/postcode-popup", 
      "주소 찾기",
      "width=600,height=600,scrollbars=yes"
    );
  };

  //  주소 선택 결과 받기
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "ADDRESS_SELECTED") {
        const { address: fullAddress } = event.data.payload;
        setAddress(fullAddress);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // 남은 시간
    useEffect(() => {
      if (authSent && timeLeft > 0) {
        timerRef.current = setTimeout(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
      } else if (timeLeft === 0) {
        clearTimeout(timerRef.current);
      }
      return () => clearTimeout(timerRef.current);
    }, [timeLeft, authSent]);

    const formatTime = (seconds) => {
      const m = Math.floor(seconds / 60).toString().padStart(2, "0");
      const s = (seconds % 60).toString().padStart(2, "0");
      return `${m}:${s}`;
    };

    //이메일 인증
    const handleSendAuthCode = async () => {
      if (!email) {
        alert("이메일을 입력해주세요.");
        return;
      }
      try {
        await axios.post("http://localhost/api/auth/email", { email });
        alert("인증번호가 전송되었습니다.");
        setAuthSent(true);
        setIsEmailVerified(false);
        setTimeLeft(300); // 5분
      } catch (error) {
        console.error("인증번호 전송 에러:", error);
        alert("인증번호 전송에 실패했습니다.");
      }
    };  

    const handleVerifyAuthCode = async () => {
      try {
        const response = await axios.post("http://localhost/api/auth/verifyEmail", {
          email,
          authNumber: authCode,
        });
        if (response.status === 200) {
          alert("이메일 인증이 완료되었습니다.");
          setIsEmailVerified(true);
          setTimeLeft(0);
        } else {
          alert("인증번호가 올바르지 않습니다.");
        }
      } catch (error) {
        console.error("이메일 인증 실패:", error);
        alert("이메일 인증 중 오류가 발생했습니다.");
      }
    };

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
      alert("회원가입 중 오류: " + (err.response?.data?.message || "회원가입 실패"));
    }
  };

  return (
    <div className="seRegisterPage-container">
      <div className="logo-section2">
        <img src={logo} alt="로고" className="selogo4" />
        <h1 className="join-title2">회원가입</h1>
      </div>

      {/* 이메일 입력, 인증번호 발송 */}
      <div className="form-group2">
        <label id="id-label">
          아이디<span className="required2">*</span>
        </label>
        <div className="input-container2">
          <input
            type="text"
            id="id-input2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요"
          />
          <button id="id-check-btn2" onClick={handleSendAuthCode}>인증번호 발송</button>
        </div>
      
      {/* 인증번호 확인 */}
      <label id="id-label">
        이메일 인증번호<span className="required">*</span>
      </label>
      <div className="input-secontainer">
        <input
        type="text"
        id="id-seinput"
        value={authCode}
        onChange={(e) => setAuthCode(e.target.value)}
        placeholder="인증번호를 입력해주세요"
        />
        <button id="id-check-sebtn" onClick={handleVerifyAuthCode}>인증번호 확인</button> 
      </div>

      {/* 인증번호 남은 시간 */}
        {authSent && (
          <div className="auth-timer2">남은 시간: {formatTime(timeLeft)}</div>
        )}

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
            placeholder="비밀번호 입력"
          />
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


        {/* 매장이름 */}
        <label id="storename-label">
          매장이름<span className="required2">*</span>
        </label>
        <div className="input-storename">
          <input
            type="text"
            id="storename-input"
            placeholder="매장이름을 입력해주세요"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
        </div>

        {/* 전화번호 */}
        <label id="phone-label2">
          전화번호<span className="required2">*</span>
        </label>
        <div className="phone-input2">
          <input type="text" id="phone-input-11" value={phone1} onChange={(e) => setPhone1(e.target.value)} />
          <span>ㅡ</span>
          <input type="text" id="phone-input-22" value={phone2} onChange={(e) => setPhone2(e.target.value)} />
          <span>ㅡ</span>
          <input type="text" id="phone-input-33" value={phone3} onChange={(e) => setPhone3(e.target.value)} />
        </div>

        {/* 카테고리*/}
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

        {/* 주소소*/}
        <label id="address-main-label2">
          주소<span className="required2">*</span>
        </label>
        <div className="address-group2">
          <button id="housecode-btn2" onClick={openAddressPopup}>
            주소 찾기
          </button>
        </div>
        <div className="address-input-group2">
          <input
            type="text"
            id="address-input2"
            placeholder="도로명 주소"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
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
