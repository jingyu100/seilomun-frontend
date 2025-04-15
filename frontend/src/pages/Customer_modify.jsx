import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "../css/Customer_modify.css";

function Customer_modify() {
  const [profileImage, setProfileImage] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.email;

    if (!userId) {
      alert("로그인 정보가 유효하지 않습니다.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("profileImage", profileImage);
    formData.append("email", email);
    formData.append("name", name);
    formData.append("nickname", nickname);
    formData.append("phone", phone);
    formData.append("gender", gender);
    formData.append("birthdate", birthdate);

    try {
      const response = await axios.put(
        "http://localhost:8080/api/users/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, 
        }
      );

      alert("회원정보가 성공적으로 수정되었습니다!");
    } catch (err) {
      console.error("회원정보 수정 오류:", err);
      alert("회원정보 수정 중 문제가 발생했습니다.");
    }
  };

  return (
    <div>
      <div className="header">
        <Header />
      </div>

      <div className="modify-area">
        <form className="modify-form" onSubmit={handleSubmit}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>회원정보 수정</h2>

          {/* 프로필 사진 */}
          <div className="form-group">
            <label htmlFor="profileImage">프로필 사진</label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files[0])}
            />
          </div>

          {/* 이메일 */}
          <div className="form-group">
            <label htmlFor="email">이메일 (ID)</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* 이름 */}
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* 닉네임 */}
          <div className="form-group">
            <label htmlFor="nickname">닉네임</label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

          {/* 휴대폰 번호 */}
          <div className="form-group">
            <label htmlFor="phone">휴대폰 번호</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* 성별 */}
          <div className="form-group">
            <label>성별</label>
            <div>
              <label htmlFor="male">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={() => setGender("male")}
                />
                남성
              </label>
              &nbsp;&nbsp;
              <label htmlFor="female">
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={() => setGender("female")}
                />
                여성
              </label>
            </div>
          </div>

          {/* 생년월일 */}
          <div className="form-group">
            <label htmlFor="birthdate">생년월일</label>
            <input
              type="date"
              id="birthdate"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </div>

          {/* 제출 버튼 */}
          <div className="form-group">
            <button type="submit">정보 수정</button>
          </div>
        </form>
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default Customer_modify;
