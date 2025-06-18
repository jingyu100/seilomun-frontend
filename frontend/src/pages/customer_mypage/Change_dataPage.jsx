import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../css/customer_mypage/Change_dataPage.css";
import Footer from "../../components/Footer.jsx";
import Header from "../../components/Header.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";

const Change_dataPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  // 이메일 정보 불러오기
  useEffect(() => {
    axios.get("http://localhost/api/customers", {
      withCredentials: true,
    })
      .then((res) => {
        const customer = res.data?.data?.customer;
        if (customer?.email) {
          setEmail(customer.email);
        } else {
          console.warn("⚠ 이메일 없음:", customer);
        }
      })
      .catch((err) => {
        console.error("❌ 사용자 정보 조회 실패:", err);
      });
  }, []);
  
//비밀번호 변경
const handlePasswordCheck = async () => {
  if (!password) {
    alert("비밀번호를 입력하세요.");
    return;
  }

  try {
    const res = await axios.post(
      "http://3.36.70.70/api/customers/mypage/password",
      { currentPassword: password },
      { withCredentials: true }
    );
    console.log("응답:", res.data);
    
    // ✅ 비밀번호 일치 → 페이지 이동
    navigate("/customer_modify");

  } catch (e) {
    console.error("요청 실패", e);
    alert("비밀번호가 일치하지 않습니다.");
  }
};

    
  return (
    <div>
      <div className="header">
        <Header />
      </div>

      <div className="area-container2">
        <SideMenuBtn />

        <div className="mypage-container22">
        <aside className="mypage-sidebar">
        <div onClick={() => (window.location.href = "/mypage")} className="title-xl">마이페이지</div>

        <div className="sidebar-section">
          <div className="title-lg">쇼핑정보</div>
          <ul>
          <li onClick={() => window.location.href = '/OrderList'}>주문목록</li>
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

          {/* 메인 콘텐츠 */}
          <div className="mypage-main">
            <h2 className="main-title">회원정보 변경</h2>
            <p className="info-text">
              <strong className="email">{email}</strong> 님의 정보를 보호하기 위해<br />
              비밀번호를 다시 한번 확인합니다.
            </p>

            <table className="info-table">
              <tbody>
                <tr>
                  <td className="label-cell">아이디(이메일)</td>                
                  <td className="value-cell">{email}</td>
                </tr>
                <tr>
                  <td className="label-cell">비밀번호</td>
                  <td className="value-cell">
                    <input
                      type="password"
                      className="password-input"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(""); //입력 시 에러 초기화
                      }}
                    />
                    {error && <div className="error-text">{error}</div>}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="btn-group22">
              <button 
              className="confirm-btn22" 
              onClick={handlePasswordCheck}>
                확인</button>
              <button 
              className="cancel-btn22" 
              onClick={() => navigate('/mypage')}>
                취소</button>
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
