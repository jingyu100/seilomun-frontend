import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import useStoreListByIds from "../../Hooks/useStoreListByIds";
import "../../css/customer/Main.css";

export default function MainSuggestStore() {
  const sellerIds = [1, 2, 3, 4];
  const { stores, loading, error } = useStoreListByIds(sellerIds, 4);

  const [visibleCount] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ useCallback으로 최적화하여 불필요한 재실행 방지
  const getImageUrl = useCallback((imageName) => {
    if (!imageName) return "/image/default-store.jpg";
    return imageName.startsWith("http")
        ? imageName
        : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${imageName}`;
  }, []);

  const StoreCard = ({ store }) => {
    // ✅ 썸네일 URL 결정 로직 개선
    const thumbnailUrl = store.sellerPhotos && store.sellerPhotos.length > 0
        ? store.sellerPhotos[0].photoUrl
        : store.thumbnailUrl;

    return (
        <Link
            to={`/sellers/${store.sellerId}`}
            className="product_card"
            style={{ textDecoration: "none", color: "inherit" }}
        >
          <img
              src={getImageUrl(thumbnailUrl)}
              alt={store.storeName}
              className="product_image"
          />
          <div className="product_text">
            <h3 className="product_name">{store.storeName}</h3>
            <p className="product_address">{store.storeDescription || "소개 없음"}</p>
          </div>
        </Link>
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - visibleCount, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
        Math.min(prev + visibleCount, Math.max(stores.length - visibleCount, 0))
    );
  };

  if (loading) return <div className="homepageUI">로딩 중...</div>;
  if (error) return <div className="homepageUI">오류가 발생했습니다.</div>;

  console.log("Final stores data:", stores); // ✅ 최종 데이터 확인용

  return (
      <div className="homepageUI">
        <div className="homepageTitle">
        <span className="homepageTitleUI">
          <h1>추천 가게</h1>
        </span>
        </div>

        <div className="LSP_ProductList">
          <div className="LSP_Scroll_Area">
            <div className="LSP_ProductList_Container">
              {stores
                  .slice(currentIndex, currentIndex + visibleCount)
                  .map((store) => (
                      <StoreCard key={store.sellerId} store={store} />
                  ))}
            </div>
          </div>
        </div>
      </div>
  );
}