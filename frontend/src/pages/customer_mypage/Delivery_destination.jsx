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
  const [addressCode, setAddressCode] = useState("");
  const [deliveryList, setDeliveryList] = useState([]);
  const [defaultId, setDefaultId] = useState(null);
  const [editId, setEditId] = useState(null);

  const handleAddAddress = () => {
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setAddress("");
    setDetailAddress("");
    setEditId(null);
  };

  const handleSelectDefault = async (id) => {
    try {
      const selected = deliveryList.find((item) => item.id === id);

      const payload = {
        address: selected.address,
        addressDetail: selected.detailAddress,
        label: selected.title,
        addressMain: '1',
      };
      
      console.log("기본배송지 설정요청 payload:", payload);
      
      await axios.put(`http://3.36.70.70/api/address/${id}`, payload, {
        withCredentials: true,
      });

      alert("✅ 기본 배송지로 설정되었습니다.");
      setDefaultId(id);
    } catch (error) {
      console.error("❌ 기본 배송지 설정 실패:", error);
    }
  };

  const handleEditAddress = (item) => {
    setEditId(item.id);
    setAddress(item.address);
    setDetailAddress(item.detailAddress);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      // 1. 서버에 삭제 요청
      await axios.delete(`http://3.36.70.70/api/address/${id}`, {
        withCredentials: true,
      });
  
      // 2. 성공 후 프론트엔드 상태에서도 삭제
      const updated = deliveryList.filter((item) => item.id !== id);
      setDeliveryList(updated);
  
      // 3. 기본 배송지였던 경우 초기화
      if (defaultId === id) {
        setDefaultId(null);
      }
  
      alert("✅ 배송지가 삭제되었습니다.");
    } catch (error) {
      console.error("❌ 배송지 삭제 실패:", error);
      alert("배송지 삭제 중 문제가 발생했습니다.");
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!address || !detailAddress) {
      alert("주소와 상세주소를 모두 입력해주세요.");
      return;
    }
  
    // 최대 3개 제한
    if (!editId && deliveryList.length >= 3) {
      alert("배송지는 최대 3개까지 등록할 수 있습니다.");
      return;
    }
  
    try {
      const requestBody = {
        addressCode,
        address: address, // ✅ 도로명 주소 추가
        addressDetail: detailAddress,
        addressMain: '0',
        label: `배송지 ${deliveryList.length + 1}`,
      };
  
      await axios.post("http://3.36.70.70/api/address", requestBody, {
        withCredentials: true,
      });
  
      alert("✅ 주소가 등록되었습니다.");
      setShowForm(false);
      setAddress("");
      setDetailAddress("");
      // setPostCode("");
      setEditId(null);
  
      // 다시 주소 목록 조회
      const res = await axios.get("http://3.36.70.70/api/address", {
        withCredentials: true,
      });
      const addresses = res?.data?.data?.address || [];
      setDeliveryList(addresses.map((addr) => ({
        id: addr.id,
        title: addr.label || "배송지",
        address: addr.address,
        detailAddress: addr.addressDetail,
        addressCode: addr.addressCode,
      })));
      const defaultAddress = addresses.find((a) => a.addressMain === "1" || a.addressMain === 1);
      if (defaultAddress) {
        setDefaultId(defaultAddress.id);
      }
  
    } catch (error) {
      console.error("❌ 주소 등록 실패:", error);
      alert("주소 등록 중 문제가 발생했습니다.");
    }
  };
  
  const openPostcodePopup = () => {
    window.open(
      "/postcode-popup",
      "주소 찾기",
      "width=500,height=600,scrollbars=yes"
    );
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === "ADDRESS_SELECTED") {
        setAddress(event.data.payload.address);
        setAddressCode(event.data.payload.addressCode);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  

  useEffect(() => {
    axios.get("http://3.36.70.70/api/address", {
      withCredentials: true,
    })
      .then((res) => {
        const addresses = res?.data?.data?.address || [];
              console.log("✅ 주소 리스트 응답 확인:", addresses); 
        setDeliveryList(addresses.map((addr) => ({
          id: addr.id,
          title: addr.label || "배송지",
          address: addr.address,
          detailAddress: addr.addressDetail,
          addressCode: addr.addressCode
        })));
  
        const defaultAddress = addresses.find((a) => a.addressMain === "1" || a.addressMain === 1);
        if (defaultAddress) {
          setDefaultId(defaultAddress.id);
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
          <aside className="mypage-sidebar44">
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
                <li onClick={() => window.location.href = '/change_datapage'}>회원정보 변경</li>
                <li onClick={() => window.location.href = '/Delivery_destination'}>배송지 관리</li>
              </ul>
            </div>
            <div className="sidebar-section">
              <div className="title-lg">혜택관리</div>
              <ul>
                <li onClick={() => window.location.href = '/Customer_point'}>적립내역</li>
              </ul>
            </div>
            <div className="sidebar-section">
              <div className="title-lg">리뷰관리</div>
              <ul>
                <li onClick={() => window.location.href = '/Customer_review'}>리뷰관리</li>
              </ul>
            </div>
          </aside>

          <div className="address-container">
            <div className="address-header">기본 배송지</div>

            <div className="address-scroll-area">
              {deliveryList.map((item) => (
                <div className="address-box" key={item.id}>
                  <div className="address-title">
                    {item.title}
                    {item.id === defaultId && <span className="default-badge"> (기본 배송지)</span>}
                  </div>
                  <div className="address-text">
                    {item.address}<br />
                    {item.detailAddress}
                  </div>
                  <div className="address-buttons">
                    <button className="update-btn" onClick={() => handleEditAddress(item)}>수정</button>
                    <button className="select-btn" onClick={() => handleSelectDefault(item.id)}>선택</button>
                    <button className="address-delete-btn" onClick={() => handleDelete(item.id)}>×</button>
                  </div>
                </div>
              ))}
            </div>

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

        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">배송지 추가</h2>
              <h3 className="modal-subtitle">기본 배송지 {deliveryList.length + 1}</h3>

              <button className="address-search" onClick={openPostcodePopup}>주소 찾기</button>
              <input type="text" placeholder="도로명 주소 입력" value={address} readOnly />
              <input type="text" placeholder="상세주소를 입력해주세요." value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)} />
              <button className="confirm-btn" onClick={handleSubmit}>확인</button>
              <button className="close-btn" onClick={handleClose}>닫기</button>
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