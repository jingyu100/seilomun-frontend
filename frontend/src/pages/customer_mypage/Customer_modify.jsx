import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import "../../css/customer_mypage/Customer_modify.css";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";
import defaultProfile from "../../image/logo/spLogo.png";
import api, { API_BASE_URL } from "../../api/config.js";

function Customer_modify() {
  const [previewImage, setPreviewImage] = useState(defaultProfile);
  const [profileFile, setProfileFile] = useState(null);
  const fileInputRef = useRef(null);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");
  const [gender, setGender] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");

  const [initialInfo, setInitialInfo] = useState({});

  useEffect(() => {
    api
      .get("/api/customers")
      .then((res) => {
        const data = res.data?.data?.customer;
        if (!data) return;

        setEmail((data.email || "").toLowerCase());
        setName(data.name || "");
        setNickname(data.nickname || "");

        if (data.phone) {
          setPhone1(data.phone.slice(0, 3));
          setPhone2(data.phone.slice(3, 7));
          setPhone3(data.phone.slice(7));
        }

        setGender(data.gender || "");

        if (data.birthDate) {
          setBirthMonth(data.birthDate.slice(0, 2));
          setBirthDay(data.birthDate.slice(2));
        }

        const profileImageFileName = data.profileImageUrl;
        if (profileImageFileName) {
          const fullUrl = profileImageFileName.startsWith("http")
            ? profileImageFileName
            : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${profileImageFileName}`;
          setPreviewImage(fullUrl);
        }

        setInitialInfo({
          name: data.name || "",
          nickname: data.nickname || "",
          phone: data.phone || "",
          gender: data.gender || "",
          birthDate: data.birthDate || "",
        });
      })
      .catch((err) => {
        console.error("회원 정보 불러오기 실패:", err);
      });
  }, []);

  const handleImageClick = () => fileInputRef.current.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setProfileFile(file);
    }
  };

  const handleImageUpload = async () => {
    if (!profileFile) {
      alert("변경할 프로필 이미지를 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", profileFile);

    try {
      const res = await api.put("/api/customers/mypage/local/profile", formData);

      const newImageUrl = res.data?.data?.profileImageUrl;
      if (newImageUrl) {
        const fullUrl = newImageUrl.startsWith("http")
          ? newImageUrl
          : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${newImageUrl}`;
        setPreviewImage(fullUrl);
      }

      alert("프로필 이미지가 성공적으로 변경되었습니다!");
    } catch (error) {
      console.error("프로필 이미지 변경 실패:", error);
      alert("이미지 변경 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentPhone = `${phone1}${phone2}${phone3}`;
    const currentBirth = `${birthMonth}${birthDay}`;

    const isModified =
      name !== initialInfo.name ||
      nickname !== initialInfo.nickname ||
      currentPhone !== initialInfo.phone ||
      gender !== initialInfo.gender ||
      currentBirth !== initialInfo.birthDate ||
      newPassword !== "" ||
      confirmPassword !== "";

    if (!isModified) {
      alert("변경된 정보가 없습니다.");
      return;
    }

    const requestData = {
      updateDto: {
        email: (email || "").toLowerCase(),
        name: name || "",
        nickname: nickname || "",
        phone: currentPhone,
        gender: gender || "",
        birthDate: currentBirth,
        profileImageUrl: "",
      },
      passwordChangeDto: {
        currentPassword: currentPassword || "",
        newPassword: newPassword || "",
        confirmPassword: confirmPassword || "",
      },
    };

    try {
      await api.put("/api/customers/mypage/local", requestData, {
        headers: { "Content-Type": "application/json" },
      });
      alert("회원정보가 성공적으로 수정되었습니다!");
    } catch (err) {
      alert("회원정보 수정 중 문제가 발생했습니다.");
      console.error(err);
    }
  };

  return (
    <div>
      <Header />
      <div className="body-container">
        <SideMenuBtn />
        <div className="mypage-container">
          <aside className="mypage-sidebar">
            <div onClick={() => (window.location.href = "/mypage")} className="title-xl">
              마이페이지
            </div>

            <div className="sidebar-section">
              <div className="title-lg">쇼핑정보</div>
              <ul>
                <li onClick={() => (window.location.href = "/OrderList")}>주문목록</li>
                <li onClick={() => (window.location.href = "/Customer_refund")}>
                  환불/입금 내역
                </li>
              </ul>
            </div>

            <div className="sidebar-section">
              <div className="title-lg">회원정보</div>
              <ul>
                <li onClick={() => (window.location.href = "/change_datapage")}>
                  회원정보 변경
                </li>

                <li onClick={() => (window.location.href = "/Delivery_destination")}>
                  배송지 관리
                </li>
              </ul>
            </div>

            <div className="sidebar-section">
              <div className="title-lg">혜택관리</div>
              <ul>
                <li onClick={() => (window.location.href = "/Customer_point")}>
                  적립내역
                </li>
              </ul>
            </div>

            <div className="sidebar-section">
              <div className="title-lg">리뷰관리</div>
              <ul>
                <li onClick={() => (window.location.href = "/Customer_review")}>
                  리뷰관리
                </li>
              </ul>
            </div>
          </aside>

          <div className="modify-area">
            <h2>회원정보 변경</h2>

            <div className="profile-block">
              <img
                src={previewImage}
                alt="프로필"
                className="profile-preview"
                onClick={handleImageClick}
              />
              <div className="profile-buttons">
                <button className="black-btn" type="button" onClick={handleImageUpload}>
                  변경
                </button>
                <button className="white-btn" type="button">
                  삭제
                </button>
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>

            <form className="info-form" onSubmit={handleSubmit}>
              <table>
                <tbody>
                  <tr>
                    <td>아이디(이메일)</td>
                    <td colSpan="2" className="value">
                      {email}
                    </td>
                  </tr>
                  <tr>
                    <td>이름</td>
                    <td>
                      <input value={name} onChange={(e) => setName(e.target.value)} />
                    </td>
                    <td>
                      <button type="button" className="gray-btn">
                        이름변경
                      </button>
                    </td>
                  </tr>

                  <tr>
                    <td>닉네임</td>
                    <td>
                      <input
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                      />
                    </td>
                    <td>
                      <button type="button" className="gray-btn">
                        닉네임 변경
                      </button>
                    </td>
                  </tr>

                  <tr>
                    <td>비밀번호 변경</td>

                    <td>
                      현재 비밀번호⠀
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <br></br>
                      <br></br>
                      새 비밀번호⠀
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <br></br>
                      <br></br>
                      비밀번호 확인⠀
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </td>
                    <td>
                      <button type="button" className="gray-btn">
                        비밀번호 변경
                      </button>
                    </td>
                  </tr>

                  <tr>
                    <td>휴대폰 번호</td>
                    <td>
                      <div className="phone-input-group">
                        <input
                          value={phone1}
                          onChange={(e) => setPhone1(e.target.value)}
                          maxLength={3}
                        />
                        <span>-</span>
                        <input
                          value={phone2}
                          onChange={(e) => setPhone2(e.target.value)}
                          maxLength={4}
                        />
                        <span>-</span>
                        <input
                          value={phone3}
                          onChange={(e) => setPhone3(e.target.value)}
                          maxLength={4}
                        />
                      </div>
                    </td>
                    <td>
                      <button type="button" className="gray-btn">
                        휴대폰 번호 변경
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>성별</td>
                    <td colSpan="2">
                      <div className="gender-options-inline">
                        <label>
                          <input
                            type="radio"
                            name="gender"
                            value="M"
                            checked={gender === "M"}
                            onChange={() => setGender("M")}
                          />{" "}
                          남성
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="gender"
                            value="G"
                            checked={gender === "G"}
                            onChange={() => setGender("G")}
                          />{" "}
                          여성
                        </label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>생년월일</td>
                    <td colSpan="2">
                      <div className="birthdate-select">
                        <select
                          value={birthMonth}
                          onChange={(e) => setBirthMonth(e.target.value)}
                        >
                          <option value="">월</option>
                          {[...Array(12)].map((_, i) => (
                            <option key={i} value={(i + 1).toString().padStart(2, "0")}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                        <select
                          value={birthDay}
                          onChange={(e) => setBirthDay(e.target.value)}
                        >
                          <option value="">일</option>
                          {[...Array(31)].map((_, i) => (
                            <option key={i} value={(i + 1).toString().padStart(2, "0")}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="form-buttons">
                <button type="button" className="white-btn">
                  회원탈퇴
                </button>
                <button type="submit" className="black-btn">
                  정보변경
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default Customer_modify;
