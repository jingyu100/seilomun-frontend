import { useNavigate } from 'react-router-dom';
import "../../css/customer_mypage/Change_dataPage.css";
import Footer from "../../components/Footer.jsx";
import Header from "../../components/Header.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";

const Change_dataPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="header">
        <Header />
      </div>

      <div className="body-container2">
        <SideMenuBtn />

        <div className="mypage-container">
          {/* 왼쪽 사이드 */}
          <aside className="mypage-sidebar">
            <div className="title-xl">마이페이지</div>

            <div className="sidebar-section">

              <div className="title-lg">쇼핑정보</div>
              <ul>
                <li>주문목록/배송조회</li>
                <li>환불/입금 내역</li>
              </ul>
            </div>

            <div className="sidebar-section">

              <div className="title-lg">회원정보</div>
              <ul>
                <li>회원정보 변경</li>
                <li>배송지 관리</li>
              </ul>
            </div>
            
            <div className="sidebar-section">

              <div className="title-lg">혜택관리</div>
              <ul>
                <li>적립내역</li>
              </ul>
            </div>

            <div className="sidebar-section">

              <div className="title-lg">리뷰관리</div>
              <ul>
                <li>리뷰관리</li>
              </ul>
            </div>

          </aside>

          {/* 회원정보 변경 */}
          <div className="mypage-main">
            <h2 className="main-title">회원정보 변경</h2>
            <p className="info-text">
              <strong className="email">starcarry0203@naver.com</strong>
              님의 정보를 보호하기 위해 <br />
              비밀번호를 다시 한번 확인 합니다.
            </p>

            <table className="info-table">
              <tbody>
                <tr>
                  <td className="label-cell">아이디(이메일)</td>
                  <td className="value-cell">starcarry0203@naver.com</td>
                </tr>
                <tr>
                  <td className="label-cell">비밀번호</td>
                  <td className="value-cell">
                    <input type="password" className="password-input" />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* 확인/취소 버튼 */}
            <div className="btn-group">
              <button className="confirm-btn" onClick={() => navigate('/Customer_modify')}>확인</button>
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
