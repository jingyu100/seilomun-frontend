import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "../css/customer/ProductList.css";

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const filterType = searchParams.get("filterType") || "ALL"; // filterType도 추가
  const sortType = searchParams.get("sortType") || "LATEST"; // sortType도 추가

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가

  // 화면에 표시할 상품 개수 (기본: 12개)
  const [visibleCount, setVisibleCount] = useState(12);

  // "더보기" 버튼 클릭 시 8개씩 추가 표시
  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 8);
  };

  // 새로운 검색 시 visibleCount 초기화
  const resetVisibleCount = () => {
    setVisibleCount(12);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        resetVisibleCount(); // 새로운 검색 시 표시 개수 초기화

        console.log("검색 파라미터:", { keyword, categoryId, filterType, sortType });

        const res = await axios.get("http://localhost/api/products/search", {
          params: {
            keyword: keyword || undefined, // 빈 문자열이면 undefined로 전송
            categoryId: categoryId || undefined, // 빈 문자열이면 undefined로 전송
            filterType: filterType,
            sortType: sortType,
            page: 0,
            size: 99,
          },
        });

        const productList = res?.data?.content || [];
        setProducts(productList);
        console.log("받은 상품 목록:", productList);

      } catch (error) {
        console.error("상품 조회 실패", error);
        setError("상품을 불러오는데 실패했습니다.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, categoryId, filterType, sortType]); // 모든 검색 파라미터를 의존성에 추가

  const getThumbnailUrl = (product) => {
    const url = product.thumbnailUrl;

    if (!url) return "/image/product1.jpg";

    return url.startsWith("http")
        ? url
        : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${url}`;
  };

  const ProductCard = ({ product }) => {
    return (
        <Link
            to={`/sellers/${product.sellerId}/products/${product.id}`}
            className="product_card"
            style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="product-card">
            <img
                src={getThumbnailUrl(product)}
                alt={product.name}
                className="product_image"
            />
            <div className="product_text">
              <h3 className="product_name">{product.name}</h3>
              <div className="product_info">
                <span className="product_price">{product.discountedPrice?.toLocaleString()}원</span>
                <div className="product_price_container">
                  <span className="product_regularprice">{product.originalPrice?.toLocaleString()}원</span>
                  {product.discountRate && (
                      <span className="product_discount">{product.discountRate}%</span>
                  )}
                </div>
              </div>
              <p className="product_address">{product.address}</p>
              <p className="product_date">{product.expiryDate}</p>
            </div>
          </div>
        </Link>
    );
  };

  // 로딩 상태 표시
  if (loading) {
    return (
        <div className="product-list">
          <div className="loading-container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            fontSize: '16px',
            color: '#666'
          }}>
            상품을 불러오는 중...
          </div>
        </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
        <div className="product-list">
          <div className="error-container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            fontSize: '16px',
            color: '#ef4444'
          }}>
            {error}
          </div>
        </div>
    );
  }

  return (
      <div className="product-list">
        <div className="product-header">
          <div className="product-number-container">
            <h1 className="product-number">총 {products.length}개 상품</h1>
          </div>
          <div className="product-filter-container">
            <select
                className="product-filter"
                value={sortType}
                onChange={(e) => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('sortType', e.target.value);
                  window.location.search = newParams.toString(); // 페이지 새로고침으로 정렬 변경
                }}
            >
              <option value="LATEST">최신 순</option>
              <option value="HIGHEST_RATING">별점높은 순</option>
              <option value="LOWEST_RATING">별점낮은 순</option>
              <option value="HIGHEST_PRICE">가격높은 순</option>
              <option value="LOWEST_PRICE">가격낮은 순</option>
              <option value="EXPIRING">유통기한 임박순</option>
            </select>
          </div>
        </div>

        {/* 상품이 없는 경우 */}
        {products.length === 0 && !loading && (
            <div className="no-products" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '300px',
              fontSize: '16px',
              color: '#666'
            }}>
              <div style={{ marginBottom: '8px' }}>😔</div>
              <div>해당 조건에 맞는 상품이 없습니다.</div>
            </div>
        )}

        {/* 상품 리스트 */}
        {products.length > 0 && (
            <div className="product-list-container">
              {products.slice(0, visibleCount).map((product) => (
                  <ProductCard key={product.id} product={product} />
              ))}
            </div>
        )}

        {/* 상품이 12개 이상일 때만 "더보기" 버튼 표시 */}
        {products.length > 12 && visibleCount < products.length && (
            <button className="product-list-moreBtn" onClick={handleLoadMore}>
              더보기 ({products.length - visibleCount}개 더 있음)
            </button>
        )}
      </div>
  );
};

export default ProductList;