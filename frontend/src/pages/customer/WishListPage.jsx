import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import "../../css/customer/frame.css";
import Footer from "../../components/Footer.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";
import Header from "../../components/Header.jsx";
import EmptyWishList from "../../components/wishList/EmptyWishList.jsx";
import WishListItem from "../../components/wishList/WishListItem.jsx";

const WishListPage = () => {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1) 위시리스트 조회
  useEffect(() => {
    const fetchWishes = async () => {
      setLoading(true);
      try {
        // API 호출: 페이징 (page=0, size=10) → 필요한 경우 파라미터 조정
        const response = await axios.get(
          "http://localhost/api/customers/wishes?page=0&size=10",
          {
            withCredentials: true, // 세션/쿠키 기반 인증 시 필요
            // 만약 JWT 토큰을 Authorization 헤더에 넣는 방식이라면,
            // headers: { Authorization: `Bearer ${token}` } 형태로 바꿔주세요.
          }
        );

        console.log("axios 응답 전체:", response.data);

        // 응답 구조: { status:200, data: { wishes: [WishProductDto], hasNext, totalElements, message }}
        const data = response.data.data;
        console.log("response.data.data:", data);
        setWishes(data.wishes || []);
      } catch (error) {
        console.error("위시리스트 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishes();
  }, []);

  // 2) 관심상품 제거 (삭제) 핸들러
  const handleRemove = async (wishId) => {
    try {
      await axios.delete(`http://localhost/api/customers/wishes/${wishId}`, {
        withCredentials: true,
      });
      // 로컬 상태에서 해당 항목만 제거
      setWishes((prev) => prev.filter((item) => item.wishId !== wishId));
    } catch (error) {
      console.error("위시 삭제 실패:", error);
    }
  };

  // 3) 장바구니 담기 (현재는 콘솔 로그만)
  const handleAddToCart = (productId) => {
    // TODO: 실제 장바구니 API 호출 로직 추가 예정
    console.log("장바구니 담기 API 호출 필요 → productId:", productId);
    navigate(`/cart/add/${productId}`); // 예시: 장바구니 추가 후 페이지 이동
  };
  return (
    <div>
      <div className="header">
        <Header />
      </div>

      <div className="body sideMargin">
        <SideMenuBtn />

        <section style={{ margin: "40px 0" }}>
          <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>위시리스트</h1>
          <hr style={{ border: "none", borderBottom: "1px solid #ddd" }} />

          {loading ? (
            <p style={{ marginTop: "20px" }}>로딩 중...</p>
          ) : wishes.length === 0 ? (
            <EmptyWishList />
          ) : (
            <div className="wishlist-container">
              {wishes.map((item) => (
                <WishListItem
                  key={item.wishId}
                  item={item}
                  onRemove={handleRemove}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default WishListPage;
