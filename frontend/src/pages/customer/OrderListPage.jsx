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
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setIsFetching(true);
      const response = await axios.get("http://localhost/api/customers/orders", {
        withCredentials: true,
        params: {
          page,
          size: 10,
        },
      });

      const data = response.data.data;
      setOrders((prev) => [...prev, ...data.orders]);
      setHasNext(data.hasNext);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("주문 목록 조회 실패:", err);
      setError("주문 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight + 100 >= fullHeight && hasNext && !isFetching) {
        fetchOrders();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNext, isFetching]);

  if (loading && page === 0) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="OrderListPage">
      <div className="header">
        <Header />
      </div>

      <div className="body sideMargin">
        <FilterBar />
        {orders.map((order, idx) => (
          <OrderCard
            key={idx}
            order={{
              date: new Date(order.orderDate).toISOString().slice(0, 10),
              count: order.orderItems.length,
              store: order.sellerName,
              name: order.orderItems[0],
              price: order.totalAmount,
            }}
          />
        ))}
        {isFetching && <div>불러오는 중...</div>}
        {!hasNext && <div>더 이상 데이터가 없습니다.</div>}
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default OrderListPage;
