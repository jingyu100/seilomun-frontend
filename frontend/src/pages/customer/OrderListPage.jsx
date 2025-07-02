import React, { useEffect, useState } from "react";
import "../../App.css";
import "../../css/customer/frame.css";
import Footer from "../../components/Footer.jsx";
import Header from "../../components/Header.jsx";
import FilterBar from "../../components/OrderList/FilterBar.jsx";
import OrderCard from "../../components/OrderList/OrderCard.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";
import api, { API_BASE_URL } from "../../api/config.js";

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  // 검색 관련 state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");

  const fetchOrders = async (isNewSearch = false, searchQuery = "") => {
    try {
      setIsFetching(true);

      const currentPage = isNewSearch ? 0 : page;

      const params = {
        page: currentPage,
        size: 10,
      };

      if (searchQuery.trim()) {
        params.storeName = searchQuery.trim();
      }

      const response = await api.get("/api/customers/orders", {
        params,
      });

      const data = response.data.data;

      console.log("=== API 전체 응답 ===");
      console.log(response.data);

      // 🔍 디버깅: 각 주문의 photoUrl 확인
      console.log("=== 주문별 photoUrl 확인 ===");
      data.orders.forEach((order, index) => {
        console.log(`주문 ${index + 1}:`, {
          orderId: order.orderId,
          photoUrl: order.photoUrl,
          photoUrlType: typeof order.photoUrl,
          hasPhotoUrl: !!order.photoUrl,
        });
      });

      if (isNewSearch) {
        setOrders(data.orders);
        setPage(1);
      } else {
        setOrders((prev) => [...prev, ...data.orders]);
        setPage((prev) => prev + 1);
      }

      setHasNext(data.hasNext);
    } catch (err) {
      console.error("주문 목록 조회 실패:", err);
      setError("주문 목록을 불러오지 못했습니다.");
    } finally {
      setIsFetching(false);
    }
  };

  // 검색 함수
  const handleSearch = () => {
    setCurrentSearchTerm(searchTerm);
    setPage(0);
    fetchOrders(true, searchTerm);
  };

  // 검색 초기화 함수
  const handleSearchReset = () => {
    setSearchTerm("");
    setCurrentSearchTerm("");
    setPage(0);
    fetchOrders(true, "");
  };

  useEffect(() => {
    fetchOrders(true, "");
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight + 100 >= fullHeight && hasNext && !isFetching) {
        fetchOrders(false, currentSearchTerm);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNext, isFetching, currentSearchTerm]);

  if (error) return <div>{error}</div>;

  return (
    <div className="OrderListPage">
      <div className="header">
        <Header />
      </div>

      <div className="body sideMargin">
        <SideMenuBtn />
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={handleSearch}
          onReset={handleSearchReset}
          isFetching={isFetching}
          currentSearchTerm={currentSearchTerm}
          orderCount={orders.length}
        />

        {/* 검색 결과가 없을 때 메시지 */}
        {orders.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            {currentSearchTerm
              ? `"${currentSearchTerm}"에 대한 주문을 찾을 수 없습니다.`
              : "주문 내역이 없습니다."}
          </div>
        )}

        {orders.map((order, idx) => {
          // 🔍 디버깅: OrderCard에 전달되는 데이터 확인
          const orderData = {
            id: order.orderId,
            date: new Date(order.orderDate).toISOString().slice(0, 10),
            store: order.sellerName,
            name: order.orderItems[0],
            price: order.totalAmount,
            orderStatus: order.orderStatus,
            isReview: order.review,
            photoUrl: order.photoUrl,
          };

          console.log(`🔍 OrderCard ${idx + 1}에 전달되는 데이터:`, orderData);

          return <OrderCard key={`${order.orderId}-${idx}`} order={orderData} />;
        })}

        {isFetching && (
          <div style={{ textAlign: "center", padding: "20px" }}>불러오는 중...</div>
        )}
        {!hasNext && orders.length > 0 && (
          <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
            더 이상 데이터가 없습니다.
          </div>
        )}
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default OrderListPage;
