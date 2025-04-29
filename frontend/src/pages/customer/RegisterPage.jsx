import React, { useState } from "react";
import "../../css/customer/Register.css";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [email, setEmail] = useState("");
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
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    // 1. 기본 검증
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
      !birthDay
    ) {
      alert("모든 필수 입력란을 채워주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    // 2. 서버에 보낼 데이터 준비
    const phone = `${phonePart1}-${phonePart2}-${phonePart3}`;
    const birth = `${birthMonth}-${birthDay}`;

    const requestData = {
      email,
      password,
      username: nickname,
      name,
      gender,
      phone,
      address: `${address} ${addressDetail}`,
      birth,
    };

    try {
      // 3. 서버로 회원가입 요청 보내기
      const response = await axios.post("http://localhost/api/customers", requestData, {
        withCredentials: true,
      });

      // 4. 요청 성공 처리
      if (response.status === 200) {
        alert("회원가입이 완료되었습니다!");
        navigate("/login");
      } else {
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("회원가입 에러:", error);
      alert("회원가입 도중 에러가 발생했습니다.");
    }
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

          <div className="form-group">
            {/* 이메일 */}
            <label id="id-label">
              아이디<span className="required">*</span>
            </label>
            <div className="input-container">
              <input
                type="text"
                id="id-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력해주세요"
              />
              <button id="id-check-btn">아이디 중복체크</button>
            </div>

            {/* 비밀번호 + 비밀번호 확인 */}
            <div className="label-group">
              <label id="password-label">
                패스워드<span className="required">*</span>
              </label>
              <label id="password-confirm-label">
                패스워드 확인<span className="required">*</span>
              </label>
            </div>

            <div className="input-row">
              <input
                type="password"
                id="password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
              />
              <input
                type="password"
                id="password-confirm-input"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호 재입력"
              />
            </div>

            <p id="password-info">
              *패스워드는 영문 + 숫자 + 특수문자를 조합하여 8자 이상 입력해주세요
            </p>

            {/* 닉네임 */}
            <div className="nick-label-group">
              <label id="nickname-label">
                닉네임<span className="required">*</span>
              </label>
            </div>
            <div className="input-nick">
              <input
                type="text"
                id="nickname-input"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임 입력"
              />
              <button id="nickname-check-btn">닉네임 중복체크</button>
            </div>

            <p id="nickname-info">*게시글 작성시 사용할 닉네임을 입력해주세요</p>

            {/* 이름 */}
            <label id="name-label">
              이름<span className="required">*</span>
            </label>
            <div className="input-name">
              <input
                type="text"
                id="name-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력해주세요"
              />
            </div>

            {/* 성별 */}
            <label id="gender-label">
              성별<span className="required">*</span>
            </label>
            <div className="input-gender">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={(e) => setGender(e.target.value)}
                />
                <span>남</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={(e) => setGender(e.target.value)}
                />
                <span>여</span>
              </label>
            </div>

            {/* 전화번호 */}
            <label id="phone-label">
              전화번호<span className="required">*</span>
            </label>
            <div className="phone-input">
              <input
                type="text"
                id="phone-input-1"
                value={phonePart1}
                onChange={(e) => setPhonePart1(e.target.value)}
              />
              <span>ㅡ</span>
              <input
                type="text"
                id="phone-input-2"
                value={phonePart2}
                onChange={(e) => setPhonePart2(e.target.value)}
              />
              <span>ㅡ</span>
              <input
                type="text"
                id="phone-input-3"
                value={phonePart3}
                onChange={(e) => setPhonePart3(e.target.value)}
              />
            </div>

            {/* 주소 */}
            <label id="address-main-label">
              주소<span className="required">*</span>
            </label>
            <div className="address-group">
              <button id="housecode-btn">주소 찾기</button>
            </div>

            <div className="address-input-group">
              <input
                type="text"
                id="address-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <input
                type="text"
                id="address-detail"
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                placeholder="상세주소를 입력해주세요."
              />
            </div>

            {/* 생일 */}
            <label id="birth-label">
              생일<span className="required">*</span>
            </label>
            <div className="birth-input">
              <select
                id="birth-month"
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
              >
                <option>선택</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <span className="date">월</span>

              <select
                id="birth-day"
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
              >
                <option>선택</option>
                {[...Array(31)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <span className="date">일</span>
            </div>

            {/* 회원가입 버튼 */}
            <button id="register-btn" onClick={handleRegister}>
              회원가입
            </button>
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
