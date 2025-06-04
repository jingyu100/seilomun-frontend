import React, { useState } from "react";
import "../../css/customer_mypage/Delivery_destination.css";
import Footer from "../../components/Footer.jsx";
import Header from "../../components/Header.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";
import plusIcon from "../../image/icon/plus.png"; // + 아이콘 이미지

const Delivery_destination = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [deliveryList, setDeliveryList] = useState([]);

  const handleAddAddress = () => {
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAddress = {
      name,
      phone,
      address,
      detailAddress,
    };
    setDeliveryList([...deliveryList, newAddress]);
    setShowForm(false);
    setName("");
    setPhone("");
    setAddress("");
    setDetailAddress("");
  };

  return (
    <div>
      <div className="header">
        <Header />
      </div>

      <div className="body">
        <SideMenuBtn />

        <div className="mypage-container">
          {/* 사이드 바 */}
          <aside className="mypage-sidebar44">
            
          <div className="title-xl">마이페이지</div>

          <div className="sidebar-section">
            <div className="title-lg">쇼핑정보</div>
            <ul>
            <li onClick={() => window.location.href = '/OrderList'}>주문목록/배송조회</li>
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

          {/* 배송지 관리 본문 */}
          
          <div className="address-container">
            <div className="address-header">기본 배송지</div>
            <div className="add-container">
              <div className="add-address-box" onClick={handleAddAddress}>
                <img src={plusIcon} alt="배송지 추가" />
                <h3>배송지 추가</h3>
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

export default Delivery_destination;
