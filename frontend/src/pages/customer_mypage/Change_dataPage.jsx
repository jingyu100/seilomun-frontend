import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../css/customer_mypage/Change_dataPage.css";
import Footer from "../../components/Footer.jsx";
import Header from "../../components/Header.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";

const Change_dataPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handlePasswordCheck = async () => {
    // try {
    //   const res = await axios.post(
    //     "http://localhost:80/api/customers/verifyPassword", 
    //     { password },
    //     { withCredentials: true }
    //   );

    //   if (res.data?.success) {
    //     navigate('/Customer_modify');
    //   } else {
    //     setError("비밀번호가 일치하지 않습니다.");
    //   }
    // } catch (err) {
    //   setError("비밀번호 확인 중 오류가 발생했습니다.");
    //   console.error(err);

      // 임시 테스트용: 어떤 비밀번호든 확인 버튼 누르면 바로 이동
      navigate("/Customer_modify");
  };

  // useEffect(() => {
  //   const storedUser = JSON.parse(localStorage.getItem("user"));
  //   if (storedUser?.email) {
  //     setEmail(storedUser.email);
  //   }
  // }, []);

  return (
    <div>
      <div className="header">
        <Header />
      </div>

      <div className="area-container2">
        <SideMenuBtn />

        <div className="mypage-container22">
        <aside className="mypage-sidebar">
        <div className="title-xl">마이페이지</div>

        <div className="sidebar-section">
          <div className="title-lg">쇼핑정보</div>
          <ul>
          <li onClick={() => window.location.href = '/OrderList'}>주문목록/배송조회</li>
          <li onClick={() => window.location.href = '/Customer_refund'}>환불/입금 내역</li>
          </ul>
        </div>

        <div className="sidebar-section">
          <div className="title-lg">회원정보</div>
          <ul>
          <li onClick={() => window.location.href = '/change_datapage'}>
            회원정보 변경
          </li>

          <li onClick={() => window.location.href = '/Delivery_destination'}>
            배송지 관리
          </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <div className="title-lg">혜택관리</div>
          <ul>
          <li onClick={() => window.location.href = '/Customer_point'}>
              적립내역
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <div className="title-lg">리뷰관리</div>
          <ul>
          <li onClick={() => window.location.href = '/Customer_review'}>
              리뷰관리
              </li>
          </ul>
        </div>
          </aside>

          <div className="mypage-main">
            <h2 className="main-title">회원정보 변경</h2>
            <p className="info-text">
            <strong className="email">starcarry0203@naver.com</strong>
            님의 정보를 보호하기 위해 <br />
            {/* <strong className="email">{email}</strong> 님의 정보를 보호하기 위해 <br /> */}
              비밀번호를 다시 한번 확인합니다.
            </p>

            <table className="info-table">
              <tbody>
                <tr>
                  <td className="label-cell">아이디(이메일)</td>
                  <td className="value-cell">starcarry0203@naver.com</td>                
                  {/* <td className="value-cell">{email}</td> */}
                </tr>
                <tr>
                  <td className="label-cell">비밀번호</td>
                  <td className="value-cell">
                    <input
                      type="password"
                      className="password-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <div className="error-text">{error}</div>}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="btn-group">
              <button className="confirm-btn" onClick={handlePasswordCheck}>확인</button>
              <button className="cancel-btn" onClick={() => navigate('/mypage')}>취소</button>
            </div>

          </div>
        </div>
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Change_dataPage;
