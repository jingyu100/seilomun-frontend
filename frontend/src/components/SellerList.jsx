import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import api, { API_BASE_URL } from "../api/config.js";
import "../css/customer/SellerList.css";

const SellerList = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const categoryEnum = searchParams.get("category") || "";
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSellers = async () => {
      if (!keyword && !categoryEnum) {
        setSellers([]);
        return;
      }

      setLoading(true);
      try {
        const res = await api.get("/api/sellers/search", {
          params: {
            keyword: keyword,
            category: categoryEnum,
            page: 0,
            size: 50,
          },
        });

        const sellerList = res?.data?.data?.results || [];
        setSellers(sellerList);
        console.log("받은 판매자 목록:", sellerList);
      } catch (error) {
        console.error("판매자 검색 실패", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, [keyword, categoryEnum]);

  const getSellerImageUrl = (seller) => {
    console.log("seller : ", seller);
    const url =
      seller.profileImageUrl ||
      seller.thumbnailUrl ||
      seller.photoUrl ||
      seller.sellerPhotos ||
      seller.sellerPhotos?.photoUrl;
    if (!url) return "/image/default-store.jpg";
    return url.startsWith("http")
      ? url
      : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${url}`;
  };

  // 영업 상태 처리 함수
  const getOpenStatus = (isOpen) => {
    if (isOpen === "1" || isOpen === 1 || isOpen === true) return true;
    return false;
  };

  const SellerCard = ({ seller }) => {
    const isOpen = getOpenStatus(seller.isOpen);

    return (
      <Link
        to={`/sellers/${seller.id}`}
        className="seller_card"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div className="seller-card">
          <img
            src={getSellerImageUrl(seller)}
            alt={seller.storeName}
            className="seller_image"
          />
          <div className="seller_text">
            <h3 className="seller_name">{seller.storeName}</h3>

            <div className="seller_info">
              <span className="seller_rating">
                {"★".repeat(Math.floor(seller.rating || 0))}
                {"☆".repeat(5 - Math.floor(seller.rating || 0))}(
                {seller.rating?.toFixed(1) || "0.0"})
              </span>
            </div>

            <p className="seller_address">
              📍 {seller.addressDetail || "주소 정보 없음"}
            </p>

            <p className="seller_status">{isOpen ? "영업중" : "영업종료"}</p>
          </div>
        </div>
      </Link>
    );
  };

  // 키워드가 없으면 판매자 섹션을 렌더링하지 않음
  if (!keyword && !categoryEnum) {
    return null;
  }

  if (loading) {
    return (
      <div className="seller-list-section">
        <div className="section-header">
          <h2 className="section-title">
            {keyword && `'${keyword}' `}
            {categoryEnum && `카테고리: ${categoryEnum} `}
            매장 검색 결과 ({sellers.length}개)
          </h2>
        </div>
        <div className="loading-container-mini">
          <div className="loading-spinner-mini"></div>
          <p>매장을 검색중입니다...</p>
        </div>
      </div>
    );
  }

  // 검색 결과가 없으면 빈 상태 표시
  if (sellers.length === 0) {
    return (
      <div className="seller-list-section">
        <div className="section-header">
          <h2 className="section-title">'{keyword}' 매장 검색 결과</h2>
        </div>
        <div className="empty-state-mini">
          <p>검색 결과가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-list-section">
      <div className="section-header">
        <h2 className="section-title">
          '{keyword}' 매장 검색 결과 ({sellers.length}개)
        </h2>
        {sellers.length > 4 && (
          <Link to={`/sellers/search?keyword=${keyword}`} className="view-all-link">
            전체보기 →
          </Link>
        )}
      </div>

      {/* 판매자 리스트 - 고정 4개만 표시 */}
      <div className="seller-list-container">
        {sellers.slice(0, 4).map((seller) => (
          <SellerCard key={seller.id} seller={seller} />
        ))}
      </div>
    </div>
  );
};

export default SellerList;
