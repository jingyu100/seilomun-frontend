/* 수정된 FavoriteButtonBox.jsx */
import React, { useState, useEffect } from "react";
import axios from "axios";
import FavoriteButton from "./FavoriteButton.jsx";

export default function FavoriteButtonBox({ sellerId }) {
  const [isFavorite, setIsFavorite] = useState(false);

  // 마운트 시에 현재 사용자의 즐겨찾기 목록을 가져와서 이 sellerId가 포함되어 있는지 확인
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // withCredentials: true를 넣어서, 로그인 시 발급된 쿠키(JWT)를 함께 보내도록 함
        const response = await axios.get(
          "http://localhost/api/customers/favorites?page=0&size=100",
          {
            withCredentials: true,
          }
        );
        const favoritesData = response.data.data.favorites;
        // favoritesData는 item.id가 sellerId와 같은 항목들의 배열
        const found = favoritesData.some((item) => item.id === parseInt(sellerId));
        setIsFavorite(found);
      } catch (error) {
        console.error("즐겨찾기 목록 조회 실패:", error);
      }
    };

    if (sellerId) {
      fetchFavorites();
    }
  }, [sellerId]);

  const handleFavoriteClick = async () => {
    if (isFavorite) {
      // 현재는 삭제 기능 사용 불가
      return;
    }
    try {
      await axios.post(
        `http://localhost/api/customers/favorites/${sellerId}`,
        {},
        {
          withCredentials: true, // 쿠키를 함께 보냄
        }
      );
      setIsFavorite(true);
      // 필요 시 성공 메시지나 토스트 표시
    } catch (error) {
      console.error("즐겨찾기 등록 실패:", error);
      // 필요 시 에러 메시지 표시
    }
  };

  return (
    <div
      className="storeInfo storeRight-ui"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <FavoriteButton isFavorite={isFavorite} onClick={handleFavoriteClick} />
    </div>
  );
}
