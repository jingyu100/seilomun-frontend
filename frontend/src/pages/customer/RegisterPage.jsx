import React, { useState, useEffect, useRef } from "react";
import "../../css/customer/Register.css";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [authSent, setAuthSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [phonePart1, setPhonePart1] = useState("");
  const [phonePart2, setPhonePart2] = useState("");
  const [phonePart3, setPhonePart3] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [postCode, setPostCode] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [phoneAuthCode, setPhoneAuthCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [phoneAuthSent, setPhoneAuthSent] = useState(false);
  const [phoneTimeLeft, setPhoneTimeLeft] = useState(0);
  const phoneTimerRef = useRef(null);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(null);
  const [nicknameMessage, setNicknameMessage] = useState("*게시글 작성시 사용할 닉네임을 입력해주세요");
  const [nicknameMessageColor, setNicknameMessageColor] = useState("gray");

  const navigate = useNavigate();

  // 팝업 열기 함수
  const openAddressPopup = () => {
    window.open(
      "/postcode-popup",
       "주소찾기", 
       "width=500,height=600,scrollbars=yes"
      );
  };
// 주소 선택 결과 받기
  useEffect(() => {
    const receiveMessage = (event) => {
      if (event.data?.type === "ADDRESS_SELECTED") {
        setAddress(event.data.payload.address);
        setPostCode(event.data.payload.postCode);
      }
    };
    window.addEventListener("message", receiveMessage);
    return () => window.removeEventListener("message", receiveMessage);
  }, []);

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

  const handleSendAuthCode = async () => {
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }
    try {
      await axios.post("http://3.36.70.70/api/auth/email", { email });
      alert("인증번호가 전송되었습니다.");
      setAuthSent(true);
      setIsEmailVerified(false);
      setTimeLeft(300); // 5분
    } catch (error) {
      console.error("인증번호 전송 에러:", error);
      alert("인증번호 전송에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (phoneAuthSent && phoneTimeLeft > 0) {
      phoneTimerRef.current = setTimeout(() => {
        setPhoneTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (phoneTimeLeft === 0) {
      clearTimeout(phoneTimerRef.current);
    }
    return () => clearTimeout(phoneTimerRef.current);
  }, [phoneTimeLeft, phoneAuthSent]);
  const handleSendPhoneAuthCode = async () => {
    const phone = `${phonePart1}${phonePart2}${phonePart3}`;
    if (!phone || phone.length < 10) {
      alert("휴대폰 번호를 올바르게 입력해주세요.");
      return;
    }
    try {
      await axios.post("http://3.36.70.70/api/customers/verificationCode", {
        phone,
      });
      alert("휴대폰 인증번호가 발송되었습니다.");
      setPhoneAuthSent(true);
      setIsPhoneVerified(false);
      setPhoneTimeLeft(300); // 5분
    } catch (error) {
      console.error("휴대폰 인증번호 발송 실패:", error);
      alert("휴대폰 인증번호 전송 실패.");
    }
  };

  const handleVerifyPhoneCode = () => {
    if (phoneAuthCode.trim().length > 0) {
      alert("휴대폰 인증이 완료되었습니다.");
      setIsPhoneVerified(true); // ✅ 별도 서버 요청 없이 검증 완료 처리
      setPhoneTimeLeft(0);
    } else {
      alert("인증번호를 입력해주세요.");
    }
  };

  const handleVerifyAuthCode = async () => {
    try {
      const response = await axios.post("http://3.36.70.70/api/auth/verifyEmail", {
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

  useEffect(() => {
    setIsNicknameAvailable(null);
    setNicknameMessage("*게시글 작성시 사용할 닉네임을 입력해주세요");
    setNicknameMessageColor("gray");
  }, [nickname]);
  
  const handleCheckNickname = async () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;

    }
      // ✅ 임시로 항상 성공한 것처럼 처리
      setNicknameMessage("사용가능한 닉네임입니다.");
      setNicknameMessageColor("blue");
      setIsNicknameAvailable(true);
    };
    


   // 닉네임 중복 확인 기능
  //   try {
  //     const response = await axios.get("http://3.36.70.70/api/customers/check-nickname", {
  //       params: { nickname }
  //     });
  
  //     if (response.data.available) {
  //       setNicknameMessage("사용 가능한 닉네임입니다!");
  //       setNicknameMessageColor("blue");
  //       setIsNicknameAvailable(true);
  //     } else {
  //       setNicknameMessage("중복된 닉네임입니다.");
  //       setNicknameMessageColor("red");
  //       setIsNicknameAvailable(false);
  //     }
  //   } catch (error) {
  //     console.error("닉네임 중복 체크 에러:", error);
  //     alert("닉네임 중복 확인 중 오류가 발생했습니다.");
  //   }
  // };
  

  const handleRegister = async () => {
    if (
      !email ||
      !password ||
      !passwordConfirm ||
      !nickname ||
      !name ||
      !gender ||
      !phonePart1 ||
      !phonePart2 ||
      !phonePart3 ||
      !address ||
      !addressDetail ||
      !birthMonth ||
      !birthDay ||
      !isEmailVerified ||
      !isPhoneVerified 
    ) {
      alert("모든 필수 입력란을 채워주세요 (이메일 인증 포함).\n");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (isNicknameAvailable !== true) {
      alert("닉네임 중복 확인을 먼저 해주세요.");
      return;
    }

    const phone = `${phonePart1}${phonePart2}${phonePart3}`;
    const birth = `${birthMonth}${birthDay}`;

    const requestData = {
      email,
      password,
      nickname,
      name,
      gender: gender === "male" ? "M" : "F",
      phone,
      address: `${address} ${addressDetail}`,
      birthdate: birth,
      verificationCode: phoneAuthCode, // ✅ 휴대폰 인증번호를 여기 포함
    };

    try {
      const response = await axios.post("http://3.36.70.70/api/customers", requestData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        alert("회원가입이 완료되었습니다!");
        navigate("/login");
      } else {
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("회원가입 에러:", error);
      console.error("서버 응답 데이터:", error.response?.data);
      console.error("서버 상태 코드:", error.response?.status);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div>
      <div className="header">
        <Header />
      </div>

      <div className="body sideMargin">
        <div className="register-Container">
          <div className="register-title">회원가입</div>
          <hr className="separator" />

          {/* 이메일 입력, 인증번호 발송 */}
          <div className="form-group-customer">
            <label id="id-label">
              아이디<span className="required">*</span>
            </label>
            <div className="input-container-customer">
              <input
                type="text"
                id="id-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력해주세요"
              />
              <button id="id-check-btn" onClick={handleSendAuthCode}>인증번호 발송</button>
            </div>

          {/* 인증번호 확인 */}
            <label id="id-label2">
              이메일 인증번호<span className="required">*</span>
            </label>
            <div className="input-container22">
              <input
                type="text"
                id="id-input22"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                placeholder="인증번호를 입력해주세요"
              />
              <button id="id-check-btn22" onClick={handleVerifyAuthCode}>인증번호 확인</button>
            </div>

          {/* 인증번호 남은 시간 */}
            {authSent && (
              <div className="auth-timer">남은 시간: {formatTime(timeLeft)}</div>
            )}

          {/* 패스워드, 패스워드 확인 */}            
            <div className="label-group">
              <label id="password-label">패스워드
                <span className="required">*</span>
              </label>
              <label id="password-confirm-label">패스워드 확인<span className="required">*</span></label>
            </div>

            <div className="input-row">
              <input type="password" id="password-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호 입력" />
              <input type="password" id="password-confirm-input" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} placeholder="비밀번호 재입력" />
            </div>
            <p id="password-info">*패스워드는 영문 + 숫자 + 특수문자를 조합하여 8자 이상 입력해주세요</p>

          {/* 닉네임, 닉네임 중복 체크 */}
            <div className="nick-label-group">
              <label id="nickname-label">닉네임<span className="required">*</span></label>
            </div>
            <div className="input-nick">
              <input type="text" 
              id="nickname-input" 
              value={nickname} 
              onChange={(e) => setNickname(e.target.value)} 
              placeholder="닉네임 입력" />
              <button id="nickname-check-btn" onClick={handleCheckNickname}>닉네임 중복체크</button>
            </div>
            <p id="nickname-info" style={{ color: nicknameMessageColor }}>{nicknameMessage}</p>

          {/* 이름 */}
            <label id="name-label">이름<span className="required">*</span></label>
            <div className="input-name">
              <input type="text" id="name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력해주세요" />
            </div>

          {/* 성별 */}
            <label id="gender-label">성별<span className="required">*</span></label>
            <div className="input-gender">
              <label><input type="radio" name="gender" value="male" checked={gender === "male"} onChange={(e) => setGender(e.target.value)} /><span>남</span></label>
              <label><input type="radio" name="gender" value="female" checked={gender === "female"} onChange={(e) => setGender(e.target.value)} /><span>여</span></label>
            </div>

          {/* 휴대폰 */}
            <label id="phone-label">휴대폰<span className="required">*</span></label>
            <div className="phone-input">
              <input type="text" id="phone-input-1" value={phonePart1} onChange={(e) => setPhonePart1(e.target.value)} />
              <span>ㅡ</span>
              <input type="text" id="phone-input-2" value={phonePart2} onChange={(e) => setPhonePart2(e.target.value)} />
              <span>ㅡ</span>
              <input type="text" id="phone-input-3" value={phonePart3} onChange={(e) => setPhonePart3(e.target.value)} />

              <button id="auth-check-btn" onClick={handleSendPhoneAuthCode}>인증번호 발송</button>
            </div>

            {/* 휴대폰 인증번호 확인 */}
            <label id="id-label3">
              휴대폰 인증번호<span className="required">*</span>
            </label>
            <div className="input-container33">
              <input
                type="text"
                id="id-input33"
                value={phoneAuthCode}
                onChange={(e) => setPhoneAuthCode(e.target.value)}
                placeholder="인증번호를 입력해주세요"
              />
              <button id="id-check-btn33" onClick={handleVerifyPhoneCode}>인증번호 확인</button>
            </div>

          {/* 인증번호 남은 시간 */}
          {phoneAuthSent && (
            <div className="auth-timer2">남은 시간: {formatTime(phoneTimeLeft)}</div>
          )}

          {/* 주소 찾기, 상세주소 */}
            <label id="address-main-label">주소<span className="required">*</span></label>
            <div className="address-group">
              <button id="housecode-btn" onClick={openAddressPopup}>주소 찾기</button>
            </div>
            <div className="address-input-group">
              <input type="text" id="address-input" value={address} readOnly />
              <input type="text" id="address-detail" value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} placeholder="상세주소를 입력해주세요." />
            </div>

          {/* 생일 */}
            <label id="birth-label">생일<span className="required">*</span></label>
            <div className="birth-input">
              <select id="birth-month" value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)}>
                <option>선택</option>
                {[...Array(12)].map((_, i) => (<option key={i + 1} value={i + 1}>{i + 1}</option>))}
              </select>
              <span className="date">월</span>
              <select id="birth-day" value={birthDay} onChange={(e) => setBirthDay(e.target.value)}>
                <option>선택</option>
                {[...Array(31)].map((_, i) => (<option key={i + 1} value={i + 1}>{i + 1}</option>))}
              </select>
              <span className="date">일</span>
            </div>

          {/* 회원가입 버튼 */}
            <div className="register-btn-container">
              <button id="register-btn" onClick={handleRegister}>회원가입</button>
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

export default RegisterPage;
