import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../App.css";
import "../../css/customer/frame.css";
import Footer from "../../components/Footer.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";
import Header from "../../components/Header.jsx";
import EmptyWishList from "../../components/wishList/EmptyWishList.jsx";
import WishListItem from "../../components/wishList/WishListItem.jsx";
import EmptyFavoriteList from "../../components/wishList/EmptyFavoriteList.jsx";
import FavoriteItem from "../../components/wishList/FavoriteItem.jsx";

const WishListPage = () => {
  const [wishes, setWishes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("wishes"); // "wishes" 또는 "favorites"

  console.log(wishes);
  console.log(favorites);
  console.log(activeTab);
  console.log(loading);

  // 1) 좋아요 조회
  const fetchWishes = async () => {
    try {
      const response = await axios.get(
        "http://localhost/api/customers/wishes?page=0&size=10",
        {
          withCredentials: true,
        }
      );
      const data = response.data.data;
      setWishes(data.wishes || []);
    } catch (error) {
      console.error("위시리스트 조회 실패:", error);
    }
  };

  // 2) 즐겨찾기 조회
  const fetchFavorites = async () => {
    try {
      const response = await axios.get(
        "http://localhost/api/customers/favorites?page=0&size=10",
        {
          withCredentials: true,
        }
      );
      const data = response.data.data;
      setFavorites(data.favorites || []);
    } catch (error) {
      console.error("즐겨찾기 조회 실패:", error);
    }
  };

  // ✨ 데이터 로딩 로직을 useEffect 내에서 Promise.all로 통합 관리
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (activeTab === "wishes") {
          // '좋아요' 탭에서는 두 API를 모두 기다림
          await Promise.all([fetchWishes(), fetchFavorites()]);
        } else {
          // '즐겨찾기' 탭에서는 해당 API만 호출
          await fetchFavorites();
        }
      } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab]);

  // 3) 관심상품 제거 (삭제) 핸들러
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

  // 4) 즐겨찾기 제거 핸들러
  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await axios.delete(`http://localhost/api/customers/favorites/${favoriteId}`, {
        withCredentials: true,
      });
      // 로컬 상태에서 해당 항목만 제거
      setFavorites((prev) => prev.filter((item) => item.id !== favoriteId));
    } catch (error) {
      console.error("즐겨찾기 삭제 실패:", error);
    }
  };

  // 5) 장바구니 담기
  const handleAddToCart = async (productId) => {
    try {
      const response = await axios.post(
        "http://localhost/api/carts",
        {
          productId: productId,
          quantity: 1, // 기본 수량 1개
        },
        {
          withCredentials: true,
        }
      );

      console.log("장바구니 추가 성공:", response.data);

      // 성공 알림 (선택사항)
      alert(
        `상품이 장바구니에 추가되었습니다! (총 수량: ${response.data.data.newQuantity}개)`
      );
    } catch (error) {
      console.error("장바구니 추가 실패:", error);

      // 에러 메시지 표시
      if (error.response && error.response.data && error.response.data.message) {
        alert(`장바구니 추가 실패: ${error.response.data.message}`);
      } else {
        alert("장바구니 추가 중 오류가 발생했습니다.");
      }
    }
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

          {/* 탭 메뉴 */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid #ddd",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <button
              onClick={() => setActiveTab("wishes")}
              style={{
                flex: 1,
                padding: "12px 24px",
                border: "none",
                background: activeTab === "wishes" ? "#77ca80" : "transparent",
                color: activeTab === "wishes" ? "white" : "#666",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: activeTab === "wishes" ? "bold" : "normal",
                borderRadius: "4px 4px 0 0",
                marginRight: "2px",
              }}
            >
              좋아요 누른 상품
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              style={{
                flex: 1,
                padding: "12px 24px",
                border: "none",
                background: activeTab === "favorites" ? "#77ca80" : "transparent",
                color: activeTab === "favorites" ? "white" : "#666",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: activeTab === "favorites" ? "bold" : "normal",
                borderRadius: "4px 4px 0 0",
                marginLeft: "2px",
              }}
            >
              즐겨찾기 한 매장
            </button>
          </div>

          {loading ? (
            <p style={{ marginTop: "20px" }}>로딩 중...</p>
          ) : activeTab === "wishes" ? (
            // 좋아요 탭 - 상품 위시리스트
            wishes.length === 0 ? (
              <EmptyWishList />
            ) : (
              <div className="wishlist-container">
                {wishes.map((item) => (
                  <WishListItem
                    key={item.wishId}
                    item={item}
                    favorites={favorites}
                    onRemove={handleRemove}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )
          ) : // 즐겨찾기 탭 - 매장 목록
          favorites.length === 0 ? (
            <EmptyFavoriteList />
          ) : (
            <div className="favorites-container">
              {favorites.map((store) => (
                <FavoriteItem
                  key={store.id}
                  store={store}
                  onRemove={handleRemoveFavorite}
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
