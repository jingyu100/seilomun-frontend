import "../../App.css";
import "../../css/customer/frame.css";
import Footer from "../../components/Footer.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";
import Header from "../../components/Header.jsx";
import { useEffect, useState } from "react";
import axios from "axios";

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("/api/customers/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: 0,
            size: 10,
          },
        });

        console.log("전체 응답:", res.data);

        const response = res.data.data; // 정확한 구조 반영
        setOrders(response.orders);
        setHasNext(response.hasNext);
        setTotal(response.totalElements);
        console.log("✅ 주문 목록:", response.orders);
      } catch (err) {
        console.error("❌ 주문 목록 조회 실패", err);
      }
    };

    fetchOrders();
  }, []);
  return (
    <div className="OrderList">
      <div className="header">
        <Header />
      </div>

      <div className="body">
        <div>
          <h2>주문 목록 (총 {total}건)</h2>
          <pre>{JSON.stringify(orders, null, 2)}</pre>
          {hasNext && <div>다음 페이지가 있습니다</div>}
        </div>
        <div className="sideMargin">
          <SideMenuBtn />
        </div>
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default OrderListPage;
