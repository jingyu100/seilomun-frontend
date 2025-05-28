import "../../css/customer_mypage/MyPage.css";
import Footer from "../../components/Footer.jsx";
import Header from "../../components/Header.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";
import logo from "../../image/logo/spLogo.png";

const MyPage = () => {
  return ( 
    <div>
      
      <div className="header">
        <Header />
      </div>

    <div className="body"> 
    <SideMenuBtn />
      <div className="mypage-container">

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

        <div className="mypage-main">
          {/* 유저 정보 */}
          <div className="user-info-box">

            {/* 프로필 및 회원정보변경 */}
            <div className="user-left">
              <img src={logo} alt="프로필" className="user-profile" />
              <p><h3>홍길동 고객님 반갑습니다.</h3></p>
            </div>
            <div className="user-right">
              <a href="/Change_dataPage" className="info-link">회원정보변경 &gt;</a>
            </div>
          </div>

          {/*포인트 박스 */}
          <div className="point-box">
            세일로문 포인트 <span href="#" className="highlight">12000</span> P &gt;
          </div>

          {/* 리스트 */}
          <div className="mypage-list-box">

            <div className="list-section">
              <div className="section-header">
                <div>주문 내역</div>
                <a href="#">더보기 &gt;</a>
              </div>
              <ul className="record-list">
                <li><span className="status blue">[ 문의 대기 ]</span> 상품이름 1 <span className="date-number">2025-12-31</span></li>
                <li><span className="status red">[ 문의 완료 ]</span> 상품이름 2 <span className="date-number">2025-12-31</span></li>
                <li><span className="status red">[ 문의 완료 ]</span> 상품이름 3 <span className="date-number">2025-12-31</span></li>
                <li><span className="status red">[ 문의 완료 ]</span> 상품이름 4 <span className="date-number">2025-12-31</span></li>
                <li><span className="status red">[ 문의 완료 ]</span> 상품이름 5 <span className="date-number">2025-12-31</span></li>
              </ul>
            </div>

            <div className="list-section">
              <div className="section-header">
                <div>상품 리뷰 내역</div>
                <a href="#">더보기 &gt;</a>
              </div>
              <ul className="record-list">
                <li><span className="status gray">[ 물품 ]</span> 리뷰제목 1 <span className="date-number">2025-12-31</span></li>
                <li><span className="status gray">[ 물품 ]</span> 리뷰제목 2 <span className="date-number">2025-12-31</span></li>
                <li><span className="status gray">[ 물품 ]</span> 리뷰제목 3 <span className="date-number">2025-12-31</span></li>
                <li><span className="status gray">[ 물품 ]</span> 리뷰제목 4 <span className="date-number">2025-12-31</span></li>
                <li><span className="status gray">[ 물품 ]</span> 리뷰제목 5 <span className="date-number">2025-12-31</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
    </div>
  );
};

export default MyPage;