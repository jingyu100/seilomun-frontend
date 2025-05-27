import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div>
      <h2>주문 목록</h2>
      <p>총 주문 수: {totalElements}</p>
      <p>다음 페이지 있음: {hasNext ? "예" : "아니오"}</p>
      <pre>{JSON.stringify(orders, null, 2)}</pre>
    </div>
  );
};

export default OrderListPage;
