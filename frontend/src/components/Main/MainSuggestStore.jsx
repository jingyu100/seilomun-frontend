import React, { useState } from "react";
import { Link } from "react-router-dom";
import useStoreListByIds from "../../Hooks/useStoreListByIds";
import "../../css/customer/Main.css";

export default function MainSuggestStore() {
  const sellerIds = [1, 2, 3];
  const { stores, loading, error } = useStoreListByIds(sellerIds, 12);

  const [visibleCount] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getImageUrl = (imageName) => {
    if (!imageName) return "/image/default-store.jpg";
    return imageName.startsWith("http")
      ? imageName
      : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${imageName}`;
  };

  const StoreCard = ({ store }) => (
    <Link
      to={`/sellers/${store.sellerId}`}
      className="product_card"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <img
        src={getImageUrl(store.storeImage || store.thumbnailUrl)}
        alt={store.storeName}
        className="product_image"
      />
      <div className="product_text">
        <h3 className="product_name">{store.storeName}</h3>
        <p className="product_address">{store.storeDescription || "소개 없음"}</p>
      </div>
    </Link>
  );

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - visibleCount, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + visibleCount, Math.max(stores.length - visibleCount, 0))
    );
  };

  if (loading) return <div className="homepageUI">로딩 중...</div>;
  if (error) return <div className="homepageUI">가게 정보를 불러올 수 없습니다.</div>;

  return (
    <div className="homepageUI">
      <div className="homepageTitle">
        <span className="homepageTitleUI">
          <h1>추천 가게</h1>
        </span>
      </div>

      <div className="LSP_ProductList">
        <div className="LSP_Scroll_Area">
          <button
            className="LSP_nav_button prev"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            ◀
          </button>

          <div className="LSP_ProductList_Container">
            {stores
              .slice(currentIndex, currentIndex + visibleCount)
              .map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
          </div>

          <button
            className="LSP_nav_button next"
            onClick={handleNext}
            disabled={currentIndex + visibleCount >= stores.length}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}
