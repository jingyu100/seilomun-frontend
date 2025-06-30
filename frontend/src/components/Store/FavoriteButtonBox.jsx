// FavoriteButtonBox.jsx - 단순하고 깔끔한 버전
import React, { useState, useEffect } from "react";
import FavoriteButton from "./FavoriteButton.jsx";
import useLogin from "../../Hooks/useLogin.js";
import api, { API_BASE_URL } from "../../api/config.js";

export default function FavoriteButtonBox({ sellerId }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { isLoggedIn, user } = useLogin();

  // 로그인된 사용자의 즐겨찾기 목록 조회
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isLoggedIn || !user || !sellerId) {
        return;
      }

      try {
        const response = await api.get("/api/customers/favorites?page=0&size=100");

        const favoritesData = response.data.data.favorites;
        const found = favoritesData.some(
          (item) => parseInt(item.id, 10) === parseInt(sellerId, 10)
        );

        setIsFavorite(found);
      } catch (error) {
        console.error("즐겨찾기 목록 조회 실패:", error);
      }
    };

    fetchFavorites();
  }, [sellerId, isLoggedIn, user]);

  // 즐겨찾기 토글 처리
  const handleFavoriteClick = async () => {
    if (!sellerId) {
      console.error("sellerId가 없습니다.");
      return;
    }

    try {
      const response = await api.post(`/api/customers/favorites/${sellerId}`, {});

      const isAdd = response.data.data.isAdd;
      setIsFavorite(isAdd);
    } catch (error) {
      console.error("즐겨찾기 토글 실패:", error);

      // 간단한 에러 처리
      if (error.response?.status === 401) {
        alert("로그인이 필요합니다.");
      } else if (error.response?.status === 404) {
        alert("존재하지 않는 가게입니다.");
      } else {
        alert("즐겨찾기 처리 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div
      className="storeInfo storeRight-ui"
      onClick={handleFavoriteClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
        userSelect: "none",
        transition: "background-color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <FavoriteButton
        isFavorite={isFavorite}
        onClick={(e) => {
          e.stopPropagation(); // 이벤트 버블링 방지
          handleFavoriteClick();
        }}
      />
    </div>
  );
}
