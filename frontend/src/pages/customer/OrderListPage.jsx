import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../App.css";
import "../../css/customer/frame.css";
import Footer from "../../components/Footer.jsx";
import Header from "../../components/Header.jsx";
import FilterBar from "../../components/OrderList/FilterBar.jsx";
import OrderCard from "../../components/OrderList/OrderCard.jsx";

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await axios.get("http://localhost/api/customers/orders", {
        withCredentials: true, // ✅ 쿠키 기반 인증을 위해 필수
        params: {
          page: 0,
          size: 10,
        },
      });

      const data = response.data.data;
      setOrders(data.orders);
      setHasNext(data.hasNext);
      setTotalElements(data.totalElements);
    } catch (err) {
      console.error("주문 목록 조회 실패:", err);
      setError("주문 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="OrderListPage">
      <div className="header">
        <Header />
      </div>

      <div className="body sideMargin">
        <FilterBar />
        <OrderCard />
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default OrderListPage;
