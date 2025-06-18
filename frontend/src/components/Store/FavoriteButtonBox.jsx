// FavoriteButtonBox.jsx - 올바른 속성명으로 수정
import React, { useState, useEffect } from "react";
import axios from "axios";
import FavoriteButton from "./FavoriteButton.jsx";
import useLogin from "../../Hooks/useLogin.js";

export default function FavoriteButtonBox({ sellerId }) {
  const [isFavorite, setIsFavorite] = useState(false);

  // ✅ 올바른 속성명 사용: isLoggedIn (대문자 I)
  const { isLoggedIn, user, isLoading } = useLogin();

  // 디버깅 로그 (필요시 제거 가능)
  useEffect(() => {
    console.log("🔍 useLogin 상태:");
    console.log("  - isLoggedIn:", isLoggedIn);
    console.log("  - user:", user);
    console.log("  - isLoading:", isLoading);
  }, [isLoggedIn, user, isLoading]);

  // 즐겨찾기 목록 조회
  useEffect(() => {
    const fetchFavorites = async () => {
      // 로딩 중이거나 로그인하지 않은 경우 건너뜀
      if (isLoading || !isLoggedIn || !user) {
        console.log("즐겨찾기 조회 건너뜀:", { isLoading, isLoggedIn, hasUser: !!user });
        return;
      }

      if (!sellerId) {
        console.log("sellerId가 없어서 즐겨찾기 조회 건너뜀");
        return;
      }

      try {
        console.log("📡 즐겨찾기 목록 조회 시작...");

        const response = await axios.get(
          "http://localhost/api/customers/favorites?page=0&size=100",
          {
            withCredentials: true,
          }
        );

        const favoritesData = response.data.data.favorites;
        const found = favoritesData.some(
          (item) => parseInt(item.id, 10) === parseInt(sellerId, 10)
        );

        console.log("✅ 즐겨찾기 조회 완료:", {
          found,
          favoritesCount: favoritesData.length,
        });
        setIsFavorite(found);
      } catch (error) {
        console.error("❌ 즐겨찾기 목록 조회 실패:", error);
      }
    };

    // isLoading이 완료되고, sellerId가 있고, 로그인된 상태일 때만 실행
    if (!isLoading && sellerId && isLoggedIn) {
      fetchFavorites();
    }
  }, [sellerId, isLoggedIn, user, isLoading]); // isLoading도 의존성에 추가

  // 즐겨찾기 버튼 클릭 처리
  const handleFavoriteClick = async () => {
    console.log("💖 즐겨찾기 버튼 클릭");

    // 로그인 체크 - 올바른 속성명 사용
    if (!isLoggedIn || !user) {
      console.log("❌ 로그인 필요");
      alert("로그인이 필요합니다.");
      return;
    }

    if (!sellerId) {
      console.error("❌ sellerId가 없음");
      return;
    }

    try {
      console.log("🚀 즐겨찾기 토글 API 호출...");

      const response = await axios.post(
        `http://localhost/api/customers/favorites/${sellerId}`,
        {},
        {
          withCredentials: true,
        }
      );

      const isAdd = response.data.data.isAdd;

      console.log("✅ 즐겨찾기 토글 성공:", {
        action: isAdd ? "추가" : "해제",
        newState: isAdd,
      });

      setIsFavorite(isAdd);
    } catch (error) {
      console.error("❌ 즐겨찾기 토글 실패:", error);

      if (error.response?.status === 401) {
        alert("로그인이 필요합니다.");
      } else if (error.response?.status === 404) {
        alert("존재하지 않는 가게입니다.");
      } else {
        alert("즐겨찾기 처리 중 오류가 발생했습니다.");
      }
    }
  };

  // 로딩 중일 때는 비활성화된 버튼 표시
  if (isLoading) {
    return (
      <div
        className="storeInfo storeRight-ui"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          opacity: 0.5,
        }}
      >
        <FavoriteButton isFavorite={false} onClick={() => {}} />
      </div>
    );
  }

  // 로그인하지 않은 경우
  if (!isLoggedIn || !user) {
    return (
      <div
        className="storeInfo storeRight-ui"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          opacity: 0.7,
        }}
      >
        <FavoriteButton
          isFavorite={false}
          onClick={() => alert("로그인이 필요합니다.")}
        />
      </div>
    );
  }

  // 정상 상태
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
