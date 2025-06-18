import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/customer_mypage/Customer_point.css";
import Footer from "../../components/Footer.jsx";
import Header from "../../components/Header.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";

const Customer_point = () => {
  const [point, setPoint] = useState(0); 
  const [histories, setHistories] = useState([]);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const res = await axios.get("http://3.36.70.70/api/customers/points", {
          withCredentials: true,
        });
  
        const data = res.data?.data;
  
        console.log("불러온 currentPoints:", data?.currentPoints);
        console.log("불러온 포인트 내역:", data?.pointHistory);
  
        setPoint(data?.currentPoints ?? 0);
        setHistories(data?.pointHistory ?? []);
      } catch (err) {
        console.error("포인트 조회 실패:", err);
      }
    };
  
    fetchPoints();
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
                <li onClick={() => (window.location.href = "/OrderList")}>주문목록</li>
                <li onClick={() => (window.location.href = "/Customer_refund")}>환불/입금 내역</li>
              </ul>
            </div>

            <div className="sidebar-section">
              <div className="title-lg">회원정보</div>
              <ul>
                <li onClick={() => (window.location.href = "/change_datapage")}>회원정보 변경</li>
                <li onClick={() => (window.location.href = "/Delivery_destination")}>배송지 관리</li>
              </ul>
            </div>

            <div className="sidebar-section">
              <div className="title-lg">혜택관리</div>
              <ul>
                <li onClick={() => (window.location.href = "/Customer_point")}>적립내역</li>
              </ul>
            </div>

            <div className="sidebar-section">
              <div className="title-lg">리뷰관리</div>
              <ul>
                <li onClick={() => (window.location.href = "/Customer_review")}>리뷰관리</li>
              </ul>
            </div>
          </aside>

          <div className="customer-point-container">
            <div className="point-display">
              <div className="label">세일로문 포인트</div>
              <div className="total">
                총 <span className="highlight">{point.toLocaleString()}</span> P
              </div>
              <hr className="underline" />
            </div>

            <div className="point-history-list">
    <table className="point-table">
      <thead>
        <tr>
          <th>일시</th>
          <th>내용</th>
          <th>금액</th>
          <th>구분</th>
        </tr>
      </thead>
      <tbody>
        {histories.length > 0 ? (
          histories.map((item) => (
            <tr key={item.pointId}>
              <td>{new Date(item.createTime).toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" })}</td>
              <td>{item.description}</td>
              <td className={item.pointType === 'C' || item.pointType === 'U' ? "minus" : "plus"}>
                {item.pointAmount.toLocaleString()} P
              </td>
              <td>
                {item.pointType === 'A'
                  ? "적립"
                  : item.pointType === 'U'
                  ? "사용"
                  : item.pointType === 'C'
                  ? "취소 환수"
                  : "기타"}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="no-data">포인트 내역이 없습니다.</td>
          </tr>
        )}
      </tbody>
    </table>
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

export default Customer_point;
