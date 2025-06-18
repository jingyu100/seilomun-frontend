import React, { useState, useEffect } from "react";
import "../../css/customer_mypage/Delivery_destination.css";
import Footer from "../../components/Footer.jsx";
import Header from "../../components/Header.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";
import plusIcon from "../../image/icon/plus.png";
import axios from "axios";

const Delivery_destination = () => {
  const [showForm, setShowForm] = useState(false);
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [postCode, setPostCode] = useState("");
  const [deliveryList, setDeliveryList] = useState([]);
  const [defaultId, setDefaultId] = useState(null);
  const [editId, setEditId] = useState(null); 

  const accessToken = localStorage.getItem("accessToken"); 


  const handleAddAddress = () => {
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setAddress("");
    setDetailAddress("");
    setEditId(null); 
  };

  const handleSelectDefault = (id) => {
    setDefaultId(id);
  };

  const handleEditAddress = (item) => {
    setEditId(item.id);
    setAddress(item.address);
    setDetailAddress(item.detailAddress);
    setPostCode(item.postCode);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const updated = deliveryList.filter((item) => item.id !== id);
    setDeliveryList(updated);
    if (defaultId === id) {
      setDefaultId(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!address || !detailAddress) {
      alert("주소와 상세주소를 모두 입력해주세요.");
      return;
    }

    const delivery = {
      id: Date.now(),
      title: `기본 배송지 ${deliveryList.length + (editId ? 0 : 1)}`,
      address,
      detailAddress,
      postCode,
    };

    if (editId) {
      const updated = deliveryList.map((item) =>
        item.id === editId ? delivery : item
      );
      setDeliveryList(updated);
    } else {
      if (deliveryList.length >= 3) {
        alert("배송지는 최대 3개까지 등록할 수 있습니다.");
        return;
      }
      setDeliveryList([...deliveryList, delivery]);
    }

    setShowForm(false);
    setAddress("");
    setDetailAddress("");
    setEditId(null);
  };

  const openPostcodePopup = () => {
    window.open(
      "/postcode-popup",
      "주소 찾기",
      "width=500,height=600,scrollbars=yes"
    );
  };

  //  주소 검색 팝업에서 받아오기
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === "ADDRESS_SELECTED") {
        setAddress(event.data.payload.address);
        setPostCode(event.data.payload.postCode);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // 회원가입 기본 배송지 불러오기
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    console.log("accessToken:", accessToken);

    axios.get("http://localhost/api/address", {
      withCredentials: true,         
      })
      .then((res) => {
        console.log(" 주소 응답:", res.data);
        const addresses = res?.data?.data?.address || [];
  
        const defaultAddress = addresses.find(
          (item) => item.addressMain === "1"
        );
  
        if (defaultAddress) {
          const delivery = {
            id: Date.now(),
            title: defaultAddress.label || "기본 배송지",
            address: defaultAddress.address,
            detailAddress: defaultAddress.addressDetail,
            postCode: defaultAddress.postCode,
          };
          setDeliveryList([delivery]);
        }
      })
      .catch((err) => {
        console.error("❌ 주소 불러오기 실패:", err);
      });
  }, []);
  

  

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
            
            <div onClick={() => (window.location.href = "/mypage")} className="title-xl">마이페이지</div>
  
            <div className="sidebar-section">
              <div className="title-lg">쇼핑정보</div>
              <ul>
              <li onClick={() => window.location.href = '/OrderList'}>
                주문목록
                </li>
              <li onClick={() => window.location.href = '/Customer_refund'}>
                  환불/입금 내역
                  </li>
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

            <div className="address-container">
              <div className="address-header">기본 배송지</div>

              <div className="address-scroll-area">
                {deliveryList.map((item) => (
              <div className="address-box" key={item.id}>
                <div className="address-title">{item.title}</div>
                <div className="address-text">
                  ({item.postCode})<br />
                  {item.address}<br />
                  {item.detailAddress}
                </div>
                <div className="address-buttons">
                  <button className="update-btn"onClick={() => handleEditAddress(item)}>수정</button>
                  <button className="select-btn" onClick={() => handleSelectDefault(item.id)}>
                    선택
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(item.id)}>×</button>
                </div>
              </div>
                ))}
              </div>

              {/* 배송지 추가 버튼 (최대 3개까지만 표시) */}
              {deliveryList.length < 3 && (
                <div className="add-container">
                  <div className="add-address-box" onClick={handleAddAddress}>
                    <img src={plusIcon} alt="배송지 추가" />
                    <h3>배송지 추가</h3>
                  </div>
                </div>
              )}
            </div>

        </div>

        {/* 모달 창 */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">배송지 추가</h2>
              <h3 className="modal-subtitle">기본 배송지 {deliveryList.length + 1}</h3>

              <button className="address-search" onClick={openPostcodePopup}>
                주소 찾기
              </button>

              <input
                type="text"
                placeholder="도로명 주소 입력"
                value={address}
                readOnly
              />
              <input
                type="text"
                placeholder="상세주소를 입력해주세요."
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
              />
              <button className="confirm-btn" onClick={handleSubmit}>
                확인
              </button>
              <button className="close-btn" onClick={handleClose}>
                닫기
              </button>
            </div>
          </div>
        )}

        <div className="footer">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Delivery_destination;
