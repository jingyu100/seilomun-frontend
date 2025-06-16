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

      // 🔍 데이터 구조 확인을 위한 console.log 추가
      console.log("=== API 전체 응답 ===");
      console.log(response.data);

      console.log("=== 주문 데이터 배열 ===");
      console.log(data.orders);

      console.log("=== 첫 번째 주문 상세 데이터 ===");
      if (data.orders && data.orders.length > 0) {
        console.log(data.orders[0]);
        console.log("주문 상태 (orderStatus):", data.orders[0].orderStatus);
        console.log("리뷰 작성 여부 (isReview):", data.orders[0].isReview);
        console.log("주문 ID:", data.orders[0].orderId);
        console.log("판매자명:", data.orders[0].sellerName);
        console.log("총 금액:", data.orders[0].totalAmount);
        console.log("주문 날짜:", data.orders[0].orderDate);
        console.log("주문 아이템들:", data.orders[0].orderItems);
        console.log("사진 URL:", data.orders[0].photoUrl);
      }

      console.log("=== 모든 주문들의 상태 요약 ===");
      data.orders.forEach((order, index) => {
        console.log(`주문 ${index + 1}:`, {
          orderId: order.orderId,
          orderStatus: order.orderStatus,
          isReview: order.isReview,
          sellerName: order.sellerName,
        });
      });

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
              id: order.orderId,
              date: new Date(order.orderDate).toISOString().slice(0, 10),
              store: order.sellerName,
              name: order.orderItems[0],
              price: order.totalAmount,
              // 🔍 주문 상태 관련 데이터 추가로 전달
              orderStatus: order.orderStatus,
              isReview: order.isReview,
              photoUrl: order.photoUrl,
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
